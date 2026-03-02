// 1. 운동 DB 설정
const exerciseDB = {
    "리버스 펙덱 플라이": { category: "후면어깨", aliases: ["리버스 펙덱플라이", "펙덱플라이", "리버스펙덱"] },
    "바벨 프레스": { category: "가슴", aliases: ["바벨프레스", "벤치프레스", "벤치"] },
    "스쿼트": { category: "하체", aliases: ["스쿼트", "하체운동", "백스쿼트"] },
    "데드리프트": { category: "전신", aliases: ["데드", "데드리프트"] },
    "덤벨 숄더 프레스": { category: "어깨", aliases: ["덤숄프", "숄더프레스", "어깨운동"] },
    "렛풀다운": { category: "등", aliases: ["렛풀", "랫풀다운"] },
    "케이블 푸쉬 다운": { category: "팔", aliases: ["푸쉬다운", "케이블푸쉬다운", "삼두"] }
};

// 2. 초기화
let recognition;
let pendingWorkout = null; // 확인 대기 중인 데이터
const exerciseInput = document.getElementById('exercise-input');
const addBtn = document.getElementById('add-btn');
const voiceBtn = document.getElementById('voice-btn');
const workoutList = document.getElementById('workout-list');
const confirmModal = document.getElementById('confirm-modal');
const confirmContent = document.getElementById('confirm-content');

const today = new Date().toISOString().split('T')[0];
document.getElementById('current-date').textContent = `${today} 운동 기록`;

// 3. 음성 인식
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';

    recognition.onstart = () => voiceBtn.classList.add('recording');
    recognition.onend = () => voiceBtn.classList.remove('recording');
    recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        exerciseInput.value = text;
        startProcessing(text);
    };
    voiceBtn.onclick = () => recognition.start();
}

// 4. 파싱 및 로직
function startProcessing(text) {
    if (!text.trim()) return;
    
    const workout = parseWorkout(text);
    
    // 내용이 너무 부실하거나 DB에 없는 경우 확인 창 띄우기
    if (workout.isUncertain) {
        showConfirmation(workout);
    } else {
        commitWorkout(workout);
    }
}

function parseWorkout(text) {
    const weightMatch = text.match(/(\d+)\s*(kg|킬로)/);
    const repsMatch = text.match(/(\d+)\s*(회|번)/);
    const setsMatch = text.match(/(\d+)\s*(세트|셋)/);

    const weight = weightMatch ? parseInt(weightMatch[1]) : null;
    const reps = repsMatch ? parseInt(repsMatch[1]) : 0;
    const sets = setsMatch ? parseInt(setsMatch[1]) : 0;

    let exerciseName = "";
    let isKnown = false;

    for (const [key, data] of Object.entries(exerciseDB)) {
        if (text.includes(key) || data.aliases.some(alias => text.includes(alias))) {
            exerciseName = key;
            isKnown = true;
            break;
        }
    }

    if (!exerciseName) {
        exerciseName = text.split(/\d/)[0].trim() || "기타 운동";
    }

    // 불확실성 판별: 알려진 운동이 아니거나, 횟수/세트가 0인 경우
    const isUncertain = !isKnown || reps === 0 || sets === 0;

    return {
        exercise: exerciseName,
        weight, reps, sets,
        date: today,
        isUncertain,
        image: `https://loremflickr.com/600/400/gym,fitness,${encodeURIComponent(exerciseName)}?t=${Date.now()}`
    };
}

// 5. 확인 UI 로직
function showConfirmation(workout) {
    pendingWorkout = workout;
    confirmContent.innerHTML = `
        <p><strong>운동:</strong> ${workout.exercise}</p>
        <p><strong>중량:</strong> ${workout.weight ? workout.weight + 'kg' : '맨몸'}</p>
        <p><strong>수행:</strong> ${workout.reps}회 × ${workout.sets}세트</p>
    `;
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
    let history = JSON.parse(localStorage.getItem('workout_master_db')) || {};
    if (!history[today]) history[today] = [];
    
    history[today].push(workout);
    localStorage.setItem('workout_master_db', JSON.stringify(history));
    renderWorkouts();
    exerciseInput.value = "";
}

function renderWorkouts() {
    const history = JSON.parse(localStorage.getItem('workout_master_db')) || {};
    const items = history[today] || [];
    
    workoutList.innerHTML = items.map(w => `
        <div class="workout-card">
            <img src="${w.image}" alt="${w.exercise}" onerror="this.src='https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'">
            <div class="card-info">
                <h3>${w.exercise}</h3>
                <div class="card-stats">
                    <span>${w.weight ? w.weight + 'kg' : '맨몸'}</span>
                    <span>${w.reps}회 × ${w.sets}세트</span>
                </div>
            </div>
        </div>
    `).reverse().join('');
}

addBtn.onclick = () => startProcessing(exerciseInput.value);
exerciseInput.onkeypress = (e) => { if (e.key === 'Enter') startProcessing(exerciseInput.value); };

// 7. 리포트 기능 (기존 유지)
const reportModal = document.getElementById('report-modal');
document.getElementById('report-btn').onclick = () => {
    generateReport();
    reportModal.style.display = "block";
};
document.querySelector('.close').onclick = () => reportModal.style.display = "none";

function generateReport() {
    const history = JSON.parse(localStorage.getItem('workout_master_db')) || {};
    const currentMonth = today.substring(0, 7);
    let totalDays = 0, totalSets = 0, catStats = {}, exStats = {};

    for (const [date, workouts] of Object.entries(history)) {
        if (date.startsWith(currentMonth)) {
            totalDays++;
            workouts.forEach(w => {
                totalSets += w.sets;
                const cat = exerciseDB[w.exercise]?.category || "기타";
                catStats[cat] = (catStats[cat] || 0) + w.sets;
                exStats[w.exercise] = (exStats[w.exercise] || 0) + w.sets;
            });
        }
    }
    const top = Object.entries(exStats).sort((a,b) => b[1]-a[1])[0] || ["없음", 0];
    document.getElementById('report-view').innerHTML = `
        <h2>${currentMonth.split('-')[1]}월 운동 리포트</h2>
        <div class="report-summary" style="display:flex; justify-content:space-around; background:#1a1a1a; padding:1.5rem; border-radius:12px;">
            <div><span>총 운동일</span><br><strong>${totalDays}일</strong></div>
            <div><span>총 세트</span><br><strong>${totalSets}세트</strong></div>
        </div>
        <div style="margin-top:2rem;">
            <h4>부위별 데이터</h4>
            ${Object.entries(catStats).map(([c, s]) => `<p>${c}: ${s}세트</p>`).join('')}
        </div>
    `;
}

renderWorkouts();
