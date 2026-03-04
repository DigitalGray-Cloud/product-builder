import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider,
    browserLocalPersistence,
    setPersistence,
    signInAnonymously,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    query,
    where,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&auto=format&fit=crop';
const LOCAL_LEGACY_KEYS = ['workout_master_db_v2', 'workout_master_db'];
const MASTER_EMAIL = 'digitalgray1@gmail.com';
const BUILD_ID = '20260304-3';

const exerciseDB = {
    '리버스 펙덱 플라이': {
        category: '후면어깨',
        aliases: ['리버스 펙덱플라이', '펙덱플라이', '리버스펙덱'],
        imageQuery: 'reverse pec deck fly machine',
        imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pec_deck_Fly.jpg'
    },
    '바벨 프레스': {
        category: '가슴',
        aliases: ['바벨프레스', '벤치프레스', '벤치'],
        imageQuery: 'barbell bench press',
        imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bench%20press.jpg'
    },
    '스쿼트': {
        category: '하체',
        aliases: ['스쿼트', '하체운동', '백스쿼트'],
        imageQuery: 'barbell back squat'
    },
    '데드리프트': {
        category: '전신',
        aliases: ['데드', '데드리프트'],
        imageQuery: 'barbell deadlift gym'
    },
    '덤벨 숄더 프레스': {
        category: '어깨',
        aliases: ['덤숄프', '숄더프레스', '어깨운동'],
        imageQuery: 'dumbbell shoulder press'
    },
    '렛풀다운': {
        category: '등',
        aliases: ['렛풀', '랫풀다운'],
        imageQuery: 'lat pulldown machine'
    },
    '케이블 푸쉬 다운': {
        category: '팔',
        aliases: ['푸쉬다운', '케이블푸쉬다운', '삼두'],
        imageQuery: 'cable tricep pushdown'
    }
};

const DEFAULT_FIREBASE_CONFIG = {
    apiKey: 'AIzaSyD_efcwk8qCnJn2tV7b1zNBtMnwb1Ow_P8',
    authDomain: 'ai-product-9194a.firebaseapp.com',
    projectId: 'ai-product-9194a',
    storageBucket: 'ai-product-9194a.firebasestorage.app',
    messagingSenderId: '53649337918'
};

function pickConfigValue(runtimeConfig, key) {
    const value = runtimeConfig?.[key];
    return typeof value === 'string' && value.trim() ? value : DEFAULT_FIREBASE_CONFIG[key];
}

const firebaseConfig = {
    apiKey: pickConfigValue(window.WORKOUT_MASTER_FIREBASE_CONFIG, 'apiKey'),
    authDomain: pickConfigValue(window.WORKOUT_MASTER_FIREBASE_CONFIG, 'authDomain'),
    projectId: pickConfigValue(window.WORKOUT_MASTER_FIREBASE_CONFIG, 'projectId'),
    storageBucket: pickConfigValue(window.WORKOUT_MASTER_FIREBASE_CONFIG, 'storageBucket'),
    messagingSenderId: pickConfigValue(window.WORKOUT_MASTER_FIREBASE_CONFIG, 'messagingSenderId')
};

const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app');
const authStatus = document.getElementById('auth-status');
const googleLoginBtn = document.getElementById('google-login-btn');
const kakaoLoginBtn = document.getElementById('kakao-login-btn');
const guestLoginBtn = document.getElementById('guest-login-btn');
const userEmail = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');

const exerciseInput = document.getElementById('exercise-input');
const addBtn = document.getElementById('add-btn');
const voiceBtn = document.getElementById('voice-btn');
const voiceStatus = document.getElementById('voice-status');
const workoutList = document.getElementById('workout-list');

const reportModal = document.getElementById('report-modal');
const reportView = document.getElementById('report-view');
const emailInput = document.getElementById('email-input');

const profileModal = document.getElementById('profile-modal');
const profileName = document.getElementById('profile-name');
const profileAge = document.getElementById('profile-age');
const profileHeight = document.getElementById('profile-height');
const profileWeight = document.getElementById('profile-weight');
const saveProfileBtn = document.getElementById('save-profile-btn');
const skipProfileBtn = document.getElementById('skip-profile-btn');
const masterPanel = document.getElementById('master-panel');
const masterRefreshBtn = document.getElementById('master-refresh-btn');
const masterTotalUsers = document.getElementById('master-total-users');
const masterActiveUsers = document.getElementById('master-active-users');
const masterUserList = document.getElementById('master-user-list');
const masterDetailTitle = document.getElementById('master-detail-title');
const masterDetailList = document.getElementById('master-detail-list');

let recognition;
let currentUser = null;
let db;
let auth;
let masterUsersCache = [];

function getLocalDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getMonthKey(date = new Date()) {
    return getLocalDateKey(date).slice(0, 7);
}

function updateCurrentDateLabel() {
    document.getElementById('current-date').textContent = `${getLocalDateKey()} 운동 기록`;
}

function hasFirebaseConfig(config) {
    return Boolean(
        config &&
        config.apiKey &&
        config.authDomain &&
        config.projectId
    );
}

function isMasterUser(user) {
    const email = String(user?.email || '').toLowerCase();
    const providerIds = (user?.providerData || []).map((p) => p.providerId);
    return email === MASTER_EMAIL && providerIds.includes('google.com');
}

function imageFromQuery(queryText) {
    return `https://source.unsplash.com/600x400/?${encodeURIComponent(`${queryText},gym exercise`)}`;
}

function resolveExerciseImage(exerciseName, knownExercise) {
    if (knownExercise?.imageUrl) return knownExercise.imageUrl;
    if (knownExercise?.imageQuery) return imageFromQuery(knownExercise.imageQuery);
    return imageFromQuery(exerciseName);
}

function parseWorkout(text) {
    const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*(kg|킬로)/i);
    const repsMatch = text.match(/(\d+)\s*(회|번)/);
    const setsMatch = text.match(/(\d+)\s*(세트|셋)/);

    const weight = weightMatch ? parseFloat(weightMatch[1]) : null;
    const reps = repsMatch ? parseInt(repsMatch[1], 10) : 0;
    const sets = setsMatch ? parseInt(setsMatch[1], 10) : 0;

    let exerciseName = '';
    let knownExercise = null;

    for (const [key, data] of Object.entries(exerciseDB)) {
        if (text.includes(key) || data.aliases.some((alias) => text.includes(alias))) {
            exerciseName = key;
            knownExercise = data;
            break;
        }
    }

    if (!exerciseName) {
        exerciseName = text.split(/\d/)[0].trim() || '기타 운동';
    }

    const now = new Date();
    return {
        exercise: exerciseName,
        weight,
        reps,
        sets,
        date: getLocalDateKey(now),
        month: getMonthKey(now),
        image: resolveExerciseImage(exerciseName, knownExercise),
        createdAtMs: Date.now()
    };
}

function renderWorkouts(items) {
    updateCurrentDateLabel();
    workoutList.replaceChildren();

    const fragment = document.createDocumentFragment();
    items.forEach((w) => {
        const card = document.createElement('div');
        card.className = 'workout-card';

        const img = document.createElement('img');
        img.src = w.image || IMAGE_FALLBACK;
        img.alt = `${w.exercise} 이미지`;
        img.loading = 'lazy';
        img.onerror = () => {
            img.src = IMAGE_FALLBACK;
        };

        const info = document.createElement('div');
        info.className = 'card-info';

        const title = document.createElement('h3');
        title.textContent = w.exercise;

        const stats = document.createElement('div');
        stats.className = 'card-stats';

        const weight = document.createElement('span');
        weight.textContent = w.weight ? `${w.weight}kg` : '맨몸';

        const performance = document.createElement('span');
        performance.textContent = `${w.reps}회 × ${w.sets}세트`;

        stats.append(weight, performance);
        info.append(title, stats);
        card.append(img, info);
        fragment.appendChild(card);
    });

    workoutList.appendChild(fragment);
}

function showLoggedOut() {
    authScreen.hidden = false;
    appScreen.hidden = true;
    userEmail.textContent = '';
    masterPanel.hidden = true;
    authStatus.textContent = '로그인이 필요합니다.';
}

function showLoggedIn(user) {
    authScreen.hidden = true;
    appScreen.hidden = false;
    userEmail.textContent = user.email || user.displayName || (user.isAnonymous ? '게스트 모드' : user.uid);
    if (isMasterUser(user)) {
        userEmail.textContent = `${userEmail.textContent} (MASTER)`;
    }
    updateCurrentDateLabel();
    if (!voiceBtn.disabled) {
        voiceStatus.textContent = '마이크 버튼을 눌러 음성 기록';
    }
    exerciseInput.focus();
}

async function loadTodayWorkouts() {
    if (!currentUser) return;

    const today = getLocalDateKey();
    const workoutsRef = collection(db, 'users', currentUser.uid, 'workouts');
    const q = query(workoutsRef, where('date', '==', today));
    const snap = await getDocs(q);
    const items = snap.docs
        .map((docSnap) => docSnap.data())
        .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

    renderWorkouts(items);
}

async function commitWorkout(workout) {
    if (!currentUser) return;

    const workoutsRef = collection(db, 'users', currentUser.uid, 'workouts');
    await addDoc(workoutsRef, {
        ...workout,
        userId: currentUser.uid,
        createdAt: serverTimestamp()
    });

    exerciseInput.value = '';
    await loadTodayWorkouts();
}

async function generateReport() {
    if (!currentUser) return;

    const currentMonth = getMonthKey();
    const workoutsRef = collection(db, 'users', currentUser.uid, 'workouts');
    const q = query(workoutsRef, where('month', '==', currentMonth));
    const snap = await getDocs(q);

    let totalSets = 0;
    const daySet = new Set();
    const catStats = {};
    const exStats = {};

    snap.docs.forEach((docSnap) => {
        const w = docSnap.data();
        daySet.add(w.date);
        totalSets += w.sets || 0;
        const category = exerciseDB[w.exercise]?.category || '기타';
        catStats[category] = (catStats[category] || 0) + (w.sets || 0);
        exStats[w.exercise] = (exStats[w.exercise] || 0) + (w.sets || 0);
    });

    const top = Object.entries(exStats).sort((a, b) => b[1] - a[1])[0] || ['없음', 0];
    reportView.replaceChildren();

    const title = document.createElement('h2');
    title.textContent = `${currentMonth.split('-')[1]}월 운동 리포트`;

    const summary = document.createElement('div');
    summary.className = 'report-summary';
    summary.style.display = 'flex';
    summary.style.justifyContent = 'space-around';
    summary.style.background = '#1a1a1a';
    summary.style.padding = '1.5rem';
    summary.style.borderRadius = '12px';

    const dayBox = document.createElement('div');
    dayBox.innerHTML = `<span>총 운동일</span><br><strong>${daySet.size}일</strong>`;
    const setBox = document.createElement('div');
    setBox.innerHTML = `<span>총 세트</span><br><strong>${totalSets}세트</strong>`;
    summary.append(dayBox, setBox);

    const topLine = document.createElement('p');
    topLine.style.margin = '1rem 0';
    topLine.textContent = `가장 많이 한 운동: ${top[0]} (${top[1]}세트)`;

    const section = document.createElement('div');
    section.style.marginTop = '2rem';
    const sectionTitle = document.createElement('h4');
    sectionTitle.textContent = '부위별 데이터';
    section.appendChild(sectionTitle);

    Object.entries(catStats).forEach(([category, sets]) => {
        const p = document.createElement('p');
        p.textContent = `${category}: ${sets}세트`;
        section.appendChild(p);
    });

    reportView.append(title, summary, topLine, section);
}

async function sendReportEmail() {
    if (!currentUser) return;

    const to = emailInput.value.trim();
    if (!to) {
        alert('이메일 주소를 입력해주세요.');
        return;
    }

    const currentMonth = getMonthKey();
    const workoutsRef = collection(db, 'users', currentUser.uid, 'workouts');
    const q = query(workoutsRef, where('month', '==', currentMonth));
    const snap = await getDocs(q);

    let totalSets = 0;
    const daySet = new Set();
    snap.docs.forEach((docSnap) => {
        const w = docSnap.data();
        daySet.add(w.date);
        totalSets += w.sets || 0;
    });

    const body = [
        `[운동 마스터] ${currentMonth} 리포트`,
        `총 운동일: ${daySet.size}일`,
        `총 세트: ${totalSets}세트`
    ].join('\n');

    const subject = encodeURIComponent(`[운동 마스터] ${currentMonth} 월별 리포트`);
    const content = encodeURIComponent(body);
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${content}`;
}

function renderMasterUserDetail(userId) {
    const selected = masterUsersCache.find((u) => u.uid === userId);
    if (!selected) return;

    masterDetailTitle.textContent = `${selected.label}님의 오늘 운동`;
    masterDetailList.replaceChildren();

    if (!selected.workouts.length) {
        const empty = document.createElement('p');
        empty.className = 'master-empty';
        empty.textContent = '오늘 등록된 운동이 없습니다.';
        masterDetailList.appendChild(empty);
        return;
    }

    selected.workouts.forEach((w) => {
        const row = document.createElement('div');
        row.className = 'master-user-item';
        row.innerHTML = `
            <div class="master-user-main">${w.exercise}</div>
            <div class="master-user-sub">${w.weight ? `${w.weight}kg` : '맨몸'} / ${w.reps}회 × ${w.sets}세트</div>
        `;
        masterDetailList.appendChild(row);
    });
}

function renderMasterUsers(users) {
    masterUserList.replaceChildren();
    masterUsersCache = users;

    if (!users.length) {
        const empty = document.createElement('p');
        empty.className = 'master-empty';
        empty.textContent = '등록된 사용자가 없습니다.';
        masterUserList.appendChild(empty);
        return;
    }

    users.forEach((user) => {
        const btn = document.createElement('button');
        btn.className = 'master-user-item';
        btn.innerHTML = `
            <div class="master-user-main">${user.label}</div>
            <div class="master-user-sub">오늘 운동 ${user.todayCount}개</div>
        `;
        btn.onclick = () => renderMasterUserDetail(user.uid);
        masterUserList.appendChild(btn);
    });
}

async function loadMasterDashboard() {
    if (!currentUser || !isMasterUser(currentUser)) return;

    const today = getLocalDateKey();
    const usersRef = collection(db, 'users');
    const usersSnap = await getDocs(usersRef);
    const users = usersSnap.docs.map((docSnap) => ({
        uid: docSnap.id,
        ...docSnap.data()
    }));

    const enriched = await Promise.all(
        users.map(async (user) => {
            const workoutsRef = collection(db, 'users', user.uid, 'workouts');
            const todayQuery = query(workoutsRef, where('date', '==', today));
            const todaySnap = await getDocs(todayQuery);
            const workouts = todaySnap.docs
                .map((d) => d.data())
                .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

            const label = user.email || user.displayName || user.uid;
            return {
                uid: user.uid,
                label,
                todayCount: workouts.length,
                workouts
            };
        })
    );

    enriched.sort((a, b) => b.todayCount - a.todayCount);
    const activeCount = enriched.filter((u) => u.todayCount > 0).length;

    masterTotalUsers.textContent = `${enriched.length}명`;
    masterActiveUsers.textContent = `${activeCount}명`;
    renderMasterUsers(enriched);
    masterDetailTitle.textContent = '사용자를 선택해주세요';
    masterDetailList.replaceChildren();
}

async function ensureUserProfile(user) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    const providerIds = (user.providerData || []).map((p) => p.providerId);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            isAnonymous: Boolean(user.isAnonymous),
            providerIds,
            lastLoginAt: serverTimestamp(),
            createdAt: serverTimestamp(),
            profileCompleted: false
        }, { merge: true });
        profileModal.style.display = 'block';
        return;
    }

    await setDoc(userRef, {
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        isAnonymous: Boolean(user.isAnonymous),
        providerIds,
        lastLoginAt: serverTimestamp()
    }, { merge: true });

    const profile = userSnap.data();
    if (!profile.profileCompleted && !profile.profileSkippedAt) {
        profileModal.style.display = 'block';
    }
}

async function saveProfile(skip = false) {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);
    if (skip) {
        await setDoc(userRef, {
            profileSkippedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });
    } else {
        await setDoc(userRef, {
            profile: {
                name: profileName.value.trim(),
                age: profileAge.value ? Number(profileAge.value) : null,
                heightCm: profileHeight.value ? Number(profileHeight.value) : null,
                weightKg: profileWeight.value ? Number(profileWeight.value) : null
            },
            profileCompleted: true,
            updatedAt: serverTimestamp()
        }, { merge: true });
    }

    profileModal.style.display = 'none';
}

function readLegacyLocalHistory() {
    for (const key of LOCAL_LEGACY_KEYS) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') return parsed;
        } catch (err) {
            console.error('로컬 데이터 파싱 실패:', err);
        }
    }
    return null;
}

async function migrateLocalHistoryIfNeeded(user) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data() || {};

    if (data.localMigratedAt) return;

    const localHistory = readLegacyLocalHistory();
    if (!localHistory) {
        await setDoc(userRef, { localMigratedAt: serverTimestamp() }, { merge: true });
        return;
    }

    const workoutsRef = collection(db, 'users', user.uid, 'workouts');
    const writes = [];

    Object.entries(localHistory).forEach(([date, workouts]) => {
        if (!Array.isArray(workouts)) return;
        workouts.forEach((w, idx) => {
            writes.push(addDoc(workoutsRef, {
                userId: user.uid,
                exercise: w.exercise || '기타 운동',
                weight: w.weight ?? null,
                reps: w.reps ?? 0,
                sets: w.sets ?? 0,
                date,
                month: String(date).slice(0, 7),
                image: w.image || IMAGE_FALLBACK,
                createdAtMs: w.createdAtMs || Date.now() + idx,
                createdAt: serverTimestamp(),
                migratedFromLocal: true
            }));
        });
    });

    await Promise.all(writes);
    await setDoc(userRef, { localMigratedAt: serverTimestamp() }, { merge: true });
}

function setupSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        voiceBtn.disabled = true;
        voiceStatus.textContent = '이 브라우저는 음성 인식을 지원하지 않습니다.';
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';

    recognition.onstart = () => {
        voiceBtn.classList.add('recording');
        voiceStatus.textContent = '듣는 중...';
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('recording');
        voiceStatus.textContent = '버튼을 눌러 말하기';
    };

    recognition.onerror = () => {
        voiceBtn.classList.remove('recording');
        voiceStatus.textContent = '음성 인식 실패. 다시 시도해주세요.';
    };

    recognition.onresult = async (e) => {
        const text = e.results[0][0].transcript;
        exerciseInput.value = text;
        const workout = parseWorkout(text.trim());
        if (workout.exercise) {
            await commitWorkout(workout);
        }
    };

    voiceBtn.onclick = () => {
        try {
            recognition.start();
        } catch (err) {
            console.error('음성 인식 시작 실패:', err);
            voiceStatus.textContent = '이미 실행 중입니다.';
        }
    };
}

function wireEvents() {
    addBtn.onclick = async () => {
        const input = exerciseInput.value.trim();
        if (!input) return;
        await commitWorkout(parseWorkout(input));
    };

    exerciseInput.onkeypress = async (e) => {
        if (e.key !== 'Enter') return;
        const input = exerciseInput.value.trim();
        if (!input) return;
        await commitWorkout(parseWorkout(input));
    };

    document.getElementById('report-btn').onclick = async () => {
        await generateReport();
        reportModal.style.display = 'block';
    };

    document.querySelector('.close').onclick = () => {
        reportModal.style.display = 'none';
    };

    document.getElementById('send-email-btn').onclick = sendReportEmail;

    logoutBtn.onclick = async () => {
        await signOut(auth);
    };

    saveProfileBtn.onclick = async () => {
        await saveProfile(false);
    };

    skipProfileBtn.onclick = async () => {
        await saveProfile(true);
    };

    if (masterRefreshBtn) {
        masterRefreshBtn.onclick = async () => {
            await loadMasterDashboard();
        };
    }

    window.onclick = (event) => {
        if (event.target === reportModal) reportModal.style.display = 'none';
        if (event.target === profileModal) profileModal.style.display = 'none';
    };
}

async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    authStatus.textContent = '구글 로그인 진행 중...';

    try {
        await signInWithPopup(auth, provider);
    } catch (err) {
        if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
            await signInWithRedirect(auth, provider);
            return;
        }
        const code = err?.code || 'unknown';
        authStatus.textContent = `구글 로그인 실패 코드: ${code} (build ${BUILD_ID})`;
        console.error('로그인 실패:', err);
    }
}

async function loginWithKakao() {
    const provider = new OAuthProvider('oidc.kakao');
    provider.setCustomParameters({ prompt: 'login' });
    authStatus.textContent = '카카오 로그인 진행 중...';

    try {
        await signInWithPopup(auth, provider);
    } catch (err) {
        if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
            await signInWithRedirect(auth, provider);
            return;
        }
        const code = err?.code || 'unknown';
        authStatus.textContent = `카카오 로그인 실패 코드: ${code} (build ${BUILD_ID})`;
        console.error('카카오 로그인 실패:', err);
    }
}

async function loginAsGuest() {
    authStatus.textContent = '게스트 모드로 진입 중...';
    try {
        await signInAnonymously(auth);
    } catch (err) {
        authStatus.textContent = '게스트 로그인 실패. 잠시 후 다시 시도해주세요.';
        console.error('게스트 로그인 실패:', err);
    }
}

async function bootstrap() {
    if (!hasFirebaseConfig(firebaseConfig)) {
        authStatus.textContent = 'Firebase 설정이 비어 있습니다. main.js 상단 firebaseConfig를 입력해주세요.';
        googleLoginBtn.disabled = true;
        kakaoLoginBtn.disabled = true;
        guestLoginBtn.disabled = true;
        return;
    }

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    await setPersistence(auth, browserLocalPersistence);
    await getRedirectResult(auth).catch(() => null);

    googleLoginBtn.onclick = loginWithGoogle;
    kakaoLoginBtn.onclick = loginWithKakao;
    guestLoginBtn.onclick = loginAsGuest;
    wireEvents();
    setupSpeechRecognition();

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            currentUser = null;
            showLoggedOut();
            return;
        }

        currentUser = user;
        showLoggedIn(user);
        masterPanel.hidden = !isMasterUser(user);
        const normalizedEmail = String(user.email || '').toLowerCase();
        if (normalizedEmail === MASTER_EMAIL && !isMasterUser(user)) {
            authStatus.textContent = '마스터 권한은 Google 로그인으로 접속했을 때만 활성화됩니다.';
        } else {
            authStatus.textContent = '';
        }

        try {
            await ensureUserProfile(user);
            await migrateLocalHistoryIfNeeded(user);
            await loadTodayWorkouts();
            if (isMasterUser(user)) {
                await loadMasterDashboard();
            }
        } catch (err) {
            console.error('초기화 실패:', err);
            authStatus.textContent = '데이터 초기화 중 오류가 발생했습니다.';
        }
    });
}

bootstrap();
