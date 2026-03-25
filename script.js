// ELITE MOVE LIBRARY
const moveLibrary = {
    warmup: { name: {en: "Warm Up", ar: "الاحماء"}, tips: {en: ["Joint rotations", "Light shadow boxing", "Core activation"], ar: ["تدوير المفاصل", "ملاكمة الظل الخفيفة", "تنشيط العضلات الأساسية"]} },
    white: { name: {en: "Jab-Cross Basics", ar: "أساسيات الجاب والكرووس"}, tips: {en: ["Tuck chin behind shoulder", "Pivot rear foot on Cross", "Full extension"], ar: ["ابقِ الذقن خلف الكتف", "قم بتدوير القدم الخلفية", "مد الذراع بالكامل"]} },
    brown: { name: {en: "Elite Combinations", ar: "تركيبات النخبة"}, tips: {en: ["Check hook on the exit", "Feint low, strike high", "Maintain guard during kicks"], ar: ["استخدم الهووك عند الخروج", "موّه للأسفل واضرب للأعلى", "حافظ على الحماية أثناء الركل"]} },
    dan1: { name: {en: "Black Belt Mastery", ar: "إتقان الحزام الأسود"}, tips: {en: ["Zero telegraph on Switch Kick", "Spinning back-fist flow", "Counter-timing drills"], ar: ["ركلة التبديل دون إشارة", "تدفق القبضة الخلفية الدوارة", "تدريبات توقيت الهجوم المضاد"]} },
    dan9: { name: {en: "Grandmaster Strategy", ar: "استراتيجية الخبير الكبير"}, tips: {en: ["Minimal movement defense", "Controlling the ring center", "Teaching philosophy"], ar: ["الدفاع بأقل حركة ممكنة", "السيطرة على مركز الحلبة", "فلسفة التدريب"]} }
};

let state = JSON.parse(localStorage.getItem('kbState')) || { xp: 0, nextXp: 500, belt: 'white', streak: 0, lang: 'en', busy: false };
let timerInterval;
let isPaused = false;
let isResting = false;
let currentSeconds = 0;

function showPage(id) {
    document.querySelectorAll('.glass-container').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if(id === 'dashboard') updateUI();
}

function updateUI() {
    document.getElementById('xp-val').innerText = state.xp;
    document.getElementById('xp-label').innerText = `${state.xp} / ${state.nextXp} XP to Next Rank`;
    document.getElementById('xp-fill').style.width = (state.xp / state.nextXp * 100) + "%";
    
    const belts = ['white', 'yellow', 'orange', 'green', 'blue', 'brown'];
    let bIdx = belts.indexOf(state.belt);
    document.getElementById('fill-student').style.width = bIdx !== -1 ? ((bIdx + 1) / 6 * 100) + "%" : "100%";

    if(state.belt.startsWith('dan')) {
        document.getElementById('label-master').classList.remove('grayed');
        let dIdx = parseInt(state.belt.replace('dan', '')) || 1;
        document.getElementById('fill-master').style.width = (dIdx / 9 * 100) + "%";
        if(state.belt === 'dan9') document.getElementById('fill-master').classList.add('gold-belt');
    }
    localStorage.setItem('kbState', JSON.stringify(state));
}

function toggleLanguage() {
    state.lang = state.lang === 'en' ? 'ar' : 'en';
    document.getElementById('main-html').setAttribute('dir', state.lang === 'ar' ? 'rtl' : 'ltr');
    updateUI();
}

function startTraining() {
    showPage('training');
    isResting = false;
    state.busy = document.getElementById('busy-mode').checked;
    loadMove('warmup');
    startTimer(state.busy ? 120 : 180);
}

function loadMove(moveKey) {
    const move = moveLibrary[moveKey] || moveLibrary['white'];
    document.getElementById('current-move-name').innerText = move.name[state.lang];
    const tipList = document.getElementById('move-tips');
    tipList.innerHTML = "";
    move.tips[state.lang].forEach(t => {
        let li = document.createElement('li');
        li.innerText = t;
        tipList.appendChild(li);
    });
}

function startTimer(sec) {
    clearInterval(timerInterval);
    currentSeconds = sec;
    isPaused = false;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        if(!isPaused) {
            currentSeconds--;
            updateTimerDisplay();
            if(currentSeconds <= 0) handleTimerEnd();
        }
    }, 1000);
}

function updateTimerDisplay() {
    let m = Math.floor(currentSeconds / 60);
    let s = currentSeconds % 60;
    document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}

function handleTimerEnd() {
    clearInterval(timerInterval);
    if(!isResting) {
        // Switch to Rest
        isResting = true;
        document.getElementById('status-label').innerText = "REST";
        document.getElementById('status-label').style.color = "#f1c40f";
        state.xp += 50;
        startTimer(60); // 1 Minute Rest
    } else {
        // Rest over, go to moves
        isResting = false;
        document.getElementById('status-label').innerText = "WORK";
        document.getElementById('status-label').style.color = "#2ecc71";
        nextMove();
    }
    updateUI();
}

function nextMove() {
    loadMove(state.belt);
    startTimer(state.busy ? 120 : 180);
}

function toggleTimer() {
    isPaused = !isPaused;
    document.getElementById('timer-ctrl').innerText = isPaused ? "Resume" : "Pause";
}

function exitTraining() {
    clearInterval(timerInterval);
    showPage('dashboard');
}

function updateBeltFromProfile() {
    state.belt = document.getElementById('belt-select').value;
    updateUI();
}

updateUI();