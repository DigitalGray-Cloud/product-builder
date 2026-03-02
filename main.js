// 1. 운동 DB 설정
const exerciseDB = {
    "리버스 펙덱 플라이": { image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format", category: "후면어깨", aliases: ["리버스 펙덱플라이", "펙덱플라이", "리버스펙덱"] },
    "바벨 프레스": { image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format", category: "가슴", aliases: ["바벨프레스", "벤치프레스", "벤치"] },
    "스쿼트": { image: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=500&auto=format", category: "하체", aliases: ["스쿼트", "하체운동", "백스쿼트"] },
    "데드리프트": { image: "https://images.unsplash.com/photo-1534367507873-d2d7e249a3ef?w=500&auto=format", category: "전신", aliases: ["데드", "데드리프트"] },
    "덤벨 숄더 프레스": { image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format", category: "어깨", aliases: ["덤숄프", "숄더프레스", "어깨운동"] },
    "렛풀다운": { image: "https://images.unsplash.com/photo-1603287611630-d6409d6c7921?w=500&auto=format", category: "등", aliases: ["렛풀", "랫풀다운"] }
};

// 2. 초기화 및 상태 관리
let recognition;
const exerciseInput = document.getElementById('exercise-input');
const addBtn = document.getElementById('add-btn');
const voiceBtn = document.getElementById('voice-btn');
const voiceStatus = document.getElementById('voice-status');
const workoutList = document.getElementById('workout-list');
const currentDateEl = document.getElementById('current-date');

const today = new Date().toISOString().split('T')[0];
currentDateEl.textContent = `${today} 운동 일지`;

// 3. 음성 인식 설정 (Web Speech API)
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        voiceBtn.classList.add('recording');
        voiceStatus.textContent = "듣고 있습니다...";
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('recording');
        voiceStatus.textContent = "버튼을 눌러 말하기";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        exerciseInput.value = transcript;
        processInput(transcript);
    };

    voiceBtn.addEventListener('click', () => {
        recognition.start();
    });
} else {
    voiceStatus.textContent = "브라우저가 음성 인식을 지원하지 않습니다.";
    voiceBtn.style.display = 'none';
}

// 4. 파싱 로직
function parseWorkout(text) {
    // 숫자 추출 (중량, 횟수, 세트)
    // 패턴: [숫자]kg, [숫자]회, [숫자]세트
    const weightMatch = text.match(/(\d+)\s*(kg|킬로)/);
    const repsMatch = text.match(/(\d+)\s*(회|번)/);
    const setsMatch = text.match(/(\d+)\s*(세트|셋)/);

    const weight = weightMatch ? parseInt(weightMatch[1]) : null;
    const reps = repsMatch ? parseInt(repsMatch[1]) : 0;
    const sets = setsMatch ? parseInt(setsMatch[1]) : 0;

    // 운동 이름 추출
    let exerciseName = "알 수 없는 운동";
    let matchedKey = null;

    for (const [key, data] of Object.entries(exerciseDB)) {
        if (text.includes(key) || data.aliases.some(alias => text.includes(alias))) {
            exerciseName = key;
            matchedKey = key;
            break;
        }
    }

    if (!matchedKey) {
        // DB에 없는 경우 입력 문자열에서 앞부분을 운동 명으로 추정
        exerciseName = text.split(/\d/)[0].trim() || "기타 운동";
    }

    return {
        exercise: exerciseName,
        weight: weight,
        reps: reps,
        sets: sets,
        date: today,
        image: matchedKey ? exerciseDB[matchedKey].image : "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format"
    };
}

// 5. 저장 및 렌더링
function processInput(text) {
    if (!text.trim()) return;
    
    const workoutData = parseWorkout(text);
    saveWorkout(workoutData);
    renderWorkouts();
    exerciseInput.value = '';
}

function saveWorkout(data) {
    let history = JSON.parse(localStorage.getItem('workout_master_db')) || {};
    if (!history[today]) history[today] = [];
    
    history[today].push(data);
    localStorage.setItem('workout_master_db', JSON.stringify(history));
}

function renderWorkouts() {
    const history = JSON.parse(localStorage.getItem('workout_master_db')) || {};
    const todaysWorkouts = history[today] || [];
    
    workoutList.innerHTML = todaysWorkouts.map((w, index) => `
        <div class="workout-card">
            <img src="${w.image}" alt="${w.exercise}">
            <div class="card-info">
                <h3>${w.exercise}</h3>
                <div class="card-stats">
                    <span>${w.weight ? w.weight + 'kg' : '맨몸'}</span>
                    <span>${w.reps}회 × ${w.sets}세트</span>
                </div>
            </div>
        </div>
    `).join('');
}

addBtn.addEventListener('click', () => processInput(exerciseInput.value));
exerciseInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processInput(exerciseInput.value);
});

// 6. 리포트 기능
const modal = document.getElementById('report-modal');
const reportBtn = document.getElementById('report-btn');
const closeBtn = document.querySelector('.close');
const reportView = document.getElementById('report-view');

reportBtn.onclick = () => {
    generateReport();
    modal.style.display = "block";
};

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
};

function generateReport() {
    const history = JSON.parse(localStorage.getItem('workout_master_db')) || {};
    const currentMonth = today.substring(0, 7); // YYYY-MM
    
    let totalDays = 0;
    let totalSets = 0;
    let categoryStats = {};
    let exerciseStats = {};

    for (const [date, workouts] of Object.entries(history)) {
        if (date.startsWith(currentMonth)) {
            totalDays++;
            workouts.forEach(w => {
                totalSets += w.sets;
                
                // 카테고리 통계
                const cat = exerciseDB[w.exercise]?.category || "기타";
                categoryStats[cat] = (categoryStats[cat] || 0) + w.sets;
                
                // 운동별 통계
                exerciseStats[w.exercise] = (exerciseStats[w.exercise] || 0) + w.sets;
            });
        }
    }

    const topExercise = Object.entries(exerciseStats).sort((a,b) => b[1] - a[1])[0] || ["없음", 0];

    reportView.innerHTML = `
        <h2>${currentMonth.split('-')[1]}월 운동 리포트</h2>
        <div class="report-summary">
            <div class="report-item">
                <span>총 운동일</span>
                <strong>${totalDays}일</strong>
            </div>
            <div class="report-item">
                <span>총 세트 수</span>
                <strong>${totalSets}세트</strong>
            </div>
        </div>
        <div class="report-categories">
            <h4>부위별 집중도 (세트 수)</h4>
            ${Object.entries(categoryStats).map(([cat, count]) => `
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                    <span>${cat}</span>
                    <span>${count}세트</span>
                </div>
            `).join('')}
        </div>
        <div class="report-top" style="margin-top:2rem; padding:1rem; border:1px solid var(--gold); border-radius:8px;">
            <h4 style="color:var(--gold); margin-bottom:0.5rem;">가장 많이 수행한 운동</h4>
            <div style="display:flex; justify-content:space-between;">
                <strong>${topExercise[0]}</strong>
                <span>${topExercise[1]}세트</span>
            </div>
        </div>
    `;
}

// 7. 이메일 전송 (시뮬레이션)
document.getElementById('send-email-btn').onclick = () => {
    const email = document.getElementById('email-input').value;
    if (!email) {
        alert("이메일 주소를 입력해주세요.");
        return;
    }
    alert(`${email}로 리포트를 전송했습니다! (EmailJS 연동 시 실제 발송 가능)`);
};

// 초기 로드
renderWorkouts();
