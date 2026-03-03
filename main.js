const STORAGE_KEYS = ['workout_master_db_v2', 'workout_master_db'];
const ACTIVE_STORAGE_KEY = STORAGE_KEYS[0];
const IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&auto=format&fit=crop';

// 1. 운동 DB 설정
const exerciseDB = {
    "리버스 펙덱 플라이": {
        category: "후면어깨",
        aliases: ["리버스 펙덱플라이", "펙덱플라이", "리버스펙덱"],
        imageQuery: "reverse pec deck fly machine",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Pec_deck_Fly.jpg"
    },
    "바벨 프레스": {
        category: "가슴",
        aliases: ["바벨프레스", "벤치프레스", "벤치"],
        imageQuery: "barbell bench press",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Bench%20press.jpg"
    },
    "스쿼트": {
        category: "하체",
        aliases: ["스쿼트", "하체운동", "백스쿼트"],
        imageQuery: "barbell back squat"
    },
    "데드리프트": {
        category: "전신",
        aliases: ["데드", "데드리프트"],
        imageQuery: "barbell deadlift gym"
    },
    "덤벨 숄더 프레스": {
        category: "어깨",
        aliases: ["덤숄프", "숄더프레스", "어깨운동"],
        imageQuery: "dumbbell shoulder press"
    },
    "렛풀다운": {
        category: "등",
        aliases: ["렛풀", "랫풀다운"],
        imageQuery: "lat pulldown machine"
    },
    "케이블 푸쉬 다운": {
        category: "팔",
        aliases: ["푸쉬다운", "케이블푸쉬다운", "삼두"],
        imageQuery: "cable tricep pushdown"
    }
};

// 2. 초기화
let recognition;
let pendingWorkout = null;

const exerciseInput = document.getElementById('exercise-input');
const addBtn = document.getElementById('add-btn');
const voiceBtn = document.getElementById('voice-btn');
const voiceStatus = document.getElementById('voice-status');
const workoutList = document.getElementById('workout-list');
const confirmModal = document.getElementById('confirm-modal');
const confirmContent = document.getElementById('confirm-content');
const reportModal = document.getElementById('report-modal');
const reportView = document.getElementById('report-view');
const emailInput = document.getElementById('email-input');

function getLocalDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function updateCurrentDateLabel() {
    const today = getLocalDateKey();
    document.getElementById('current-date').textContent = `${today} 운동 기록`;
}

function loadHistory() {
    for (const key of STORAGE_KEYS) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                if (key !== ACTIVE_STORAGE_KEY) {
                    localStorage.setItem(ACTIVE_STORAGE_KEY, JSON.stringify(parsed));
                }
                return parsed;
            }
        } catch (err) {
            console.error('저장 데이터 파싱 실패:', err);
        }
    }
    return {};
}

function saveHistory(history) {
    localStorage.setItem(ACTIVE_STORAGE_KEY, JSON.stringify(history));
}

function imageFromQuery(query) {
    return `https://source.unsplash.com/600x400/?${encodeURIComponent(`${query},gym exercise`)}`;
}

function resolveExerciseImage(exerciseName, knownExercise) {
    if (knownExercise?.imageUrl) {
        return knownExercise.imageUrl;
    }
    if (knownExercise?.imageQuery) {
        return imageFromQuery(knownExercise.imageQuery);
    }
    return imageFromQuery(exerciseName);
}

function makeStatLine(label, value) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    p.appendChild(strong);
    p.appendChild(document.createTextNode(value));
    return p;
}

// 3. 음성 인식
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
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

    recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        exerciseInput.value = text;
        startProcessing(text);
    };

    voiceBtn.onclick = () => {
        try {
            recognition.start();
        } catch (err) {
            console.error('음성 인식 시작 실패:', err);
            voiceStatus.textContent = '이미 실행 중입니다.';
        }
    };
} else {
    voiceBtn.disabled = true;
    voiceStatus.textContent = '이 브라우저는 음성 인식을 지원하지 않습니다.';
}

// 4. 파싱 및 로직
function startProcessing(text) {
    const input = text.trim();
    if (!input) return;

    const workout = parseWorkout(input);
    commitWorkout(workout);
}

function parseWorkout(text) {
    const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*(kg|킬로)/i);
    const repsMatch = text.match(/(\d+)\s*(회|번)/);
    const setsMatch = text.match(/(\d+)\s*(세트|셋)/);

    const weight = weightMatch ? parseFloat(weightMatch[1]) : null;
    const reps = repsMatch ? parseInt(repsMatch[1], 10) : 0;
    const sets = setsMatch ? parseInt(setsMatch[1], 10) : 0;

    let exerciseName = "";
    let knownExercise = null;

    for (const [key, data] of Object.entries(exerciseDB)) {
        if (text.includes(key) || data.aliases.some((alias) => text.includes(alias))) {
            exerciseName = key;
            knownExercise = data;
            break;
        }
    }

    if (!exerciseName) {
        exerciseName = text.split(/\d/)[0].trim() || "기타 운동";
    }

    return {
        exercise: exerciseName,
        weight,
        reps,
        sets,
        date: getLocalDateKey(),
        isUncertain: !knownExercise || reps === 0 || sets === 0,
        image: resolveExerciseImage(exerciseName, knownExercise)
    };
}

// 5. 확인 UI 로직
function showConfirmation(workout) {
    pendingWorkout = workout;
    confirmContent.replaceChildren(
        makeStatLine('운동', workout.exercise),
        makeStatLine('중량', workout.weight ? `${workout.weight}kg` : '맨몸'),
        makeStatLine('수행', `${workout.reps}회 × ${workout.sets}세트`)
    );
    confirmModal.style.display = "block";
}

document.getElementById('confirm-yes').onclick = () => {
    if (pendingWorkout) {
        commitWorkout(pendingWorkout);
        pendingWorkout = null;
    }
    confirmModal.style.display = "none";
};

document.getElementById('confirm-no').onclick = () => {
    pendingWorkout = null;
    confirmModal.style.display = "none";
    exerciseInput.value = "";
};

// 6. 실제 기록 저장 및 렌더링
function commitWorkout(workout) {
    const history = loadHistory();
    const dateKey = workout.date || getLocalDateKey();
    if (!history[dateKey]) history[dateKey] = [];

    history[dateKey].push(workout);
    saveHistory(history);
    renderWorkouts();
    exerciseInput.value = "";
}

function renderWorkouts() {
    updateCurrentDateLabel();

    const history = loadHistory();
    const today = getLocalDateKey();
    const items = [...(history[today] || [])].reverse();
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

addBtn.onclick = () => startProcessing(exerciseInput.value);
exerciseInput.onkeypress = (e) => {
    if (e.key === 'Enter') startProcessing(exerciseInput.value);
};

// 7. 리포트 기능
document.getElementById('report-btn').onclick = () => {
    generateReport();
    reportModal.style.display = "block";
};

document.querySelector('.close').onclick = () => {
    reportModal.style.display = "none";
};

function buildSummaryBox(totalDays, totalSets) {
    const summary = document.createElement('div');
    summary.className = 'report-summary';
    summary.style.display = 'flex';
    summary.style.justifyContent = 'space-around';
    summary.style.background = '#1a1a1a';
    summary.style.padding = '1.5rem';
    summary.style.borderRadius = '12px';

    const days = document.createElement('div');
    days.innerHTML = `<span>총 운동일</span><br><strong>${totalDays}일</strong>`;

    const sets = document.createElement('div');
    sets.innerHTML = `<span>총 세트</span><br><strong>${totalSets}세트</strong>`;

    summary.append(days, sets);
    return summary;
}

function generateReport() {
    const history = loadHistory();
    const currentMonth = getLocalDateKey().substring(0, 7);
    let totalDays = 0;
    let totalSets = 0;
    const catStats = {};
    const exStats = {};

    for (const [date, workouts] of Object.entries(history)) {
        if (!date.startsWith(currentMonth)) continue;
        totalDays += 1;
        workouts.forEach((w) => {
            totalSets += w.sets || 0;
            const category = exerciseDB[w.exercise]?.category || "기타";
            catStats[category] = (catStats[category] || 0) + (w.sets || 0);
            exStats[w.exercise] = (exStats[w.exercise] || 0) + (w.sets || 0);
        });
    }

    const top = Object.entries(exStats).sort((a, b) => b[1] - a[1])[0] || ["없음", 0];
    reportView.replaceChildren();

    const h2 = document.createElement('h2');
    h2.textContent = `${currentMonth.split('-')[1]}월 운동 리포트`;

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

    reportView.append(h2, buildSummaryBox(totalDays, totalSets), topLine, section);
}

function sendReportEmail() {
    const to = emailInput.value.trim();
    if (!to) {
        alert('이메일 주소를 입력해주세요.');
        return;
    }

    const history = loadHistory();
    const currentMonth = getLocalDateKey().substring(0, 7);
    const monthItems = Object.entries(history).filter(([date]) => date.startsWith(currentMonth));
    const totalSets = monthItems.reduce((acc, [, workouts]) => (
        acc + workouts.reduce((sum, item) => sum + (item.sets || 0), 0)
    ), 0);
    const body = [
        `[운동 마스터] ${currentMonth} 리포트`,
        `총 운동일: ${monthItems.length}일`,
        `총 세트: ${totalSets}세트`
    ].join('\n');

    const subject = encodeURIComponent(`[운동 마스터] ${currentMonth} 월별 리포트`);
    const content = encodeURIComponent(body);
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${content}`;
}

document.getElementById('send-email-btn').onclick = sendReportEmail;

window.onclick = (event) => {
    if (event.target === confirmModal) confirmModal.style.display = "none";
    if (event.target === reportModal) reportModal.style.display = "none";
};

renderWorkouts();
