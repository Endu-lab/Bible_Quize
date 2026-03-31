<!DOCTYPE html>
<html lang="am">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ቃል (Qal) - Bible Quiz</title>
    
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#2c3e50">

    <meta property="og:title" content="ቃል - የመጽሐፍ ቅዱስ ፈተና">
    <meta property="og:description" content="የመጽሐፍ ቅዱስ እውቀትዎን ይፈትሹ!">
    <meta property="og:image" content="icon-512.png">
    <meta property="og:url" content="https://endu-lab.github.io/Bible_Quize/">

    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>

    <style>
        :root {
            --primary: #2c3e50;
            --accent: #3498db;
            --bg: #f4f7f6;
            --text: #34495e;
        }

        body { 
            font-family: 'Segoe UI', 'Nyala', sans-serif; 
            background-color: var(--bg);
            background-image: radial-gradient(#d1d9e6 0.5px, transparent 0.5px);
            background-size: 20px 20px;
            margin: 0; padding: 15px;
            display: flex; justify-content: center; align-items: center;
            min-height: 100vh;
        }

        .container { 
            background: white; width: 100%; max-width: 380px; 
            padding: 40px 30px; border-radius: 20px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.05); 
            border-top: 6px solid var(--primary); text-align: center;
            position: relative; overflow: hidden;
        }

        #timer-bar { 
            height: 4px; background: #e74c3c; width: 100%; 
            position: absolute; top: 0; left: 0; transition: width 1s linear; 
        }

        h1 { color: var(--primary); font-size: 2.2em; margin: 10px 0 5px; }
        p.subtitle { color: #7f8c8d; margin-bottom: 25px; }

        .hidden { display: none; }

        input { 
            width: 100%; padding: 14px; margin: 10px 0; 
            border-radius: 8px; border: 1px solid #ddd; 
            box-sizing: border-box; font-size: 16px; outline: none;
        }

        .btn-start { 
            width: 100%; padding: 16px; background: var(--primary);
            color: white; border: none; border-radius: 8px; 
            font-weight: 600; cursor: pointer; font-size: 17px; margin-top: 10px;
        }

        .choice-btn { 
            width: 100%; padding: 14px; margin: 10px 0; 
            border: 1px solid #eee; border-radius: 10px; 
            background: #fff; font-weight: 500; display: flex;
            align-items: center; cursor: pointer; text-align: left;
        }

        .choice-label {
            background: var(--primary); color: white;
            width: 28px; height: 28px; border-radius: 4px; 
            display: flex; align-items: center; justify-content: center;
            margin-right: 15px; font-size: 13px;
        }

        #progress-bg { height: 6px; background: #eee; border-radius: 3px; margin-bottom: 20px; overflow: hidden; }
        #progress-fill { height: 100%; background: var(--accent); width: 0%; transition: 0.4s; }
    </style>
</head>
<body>

<div class="container">
    <div id="timer-bar" class="hidden"></div>
    <h1>ቃል</h1>
    <p class="subtitle">የመጽሐፍ ቅዱስ ፈተና</p>

    <div id="step-reg">
        <input type="text" id="uName" placeholder="ሙሉ ስም (Full Name)">
        <input type="tel" id="uPhone" placeholder="ስልክ ቁጥር (Phone Number)">
        <button class="btn-start" onclick="startApp()">መፈተን ጀምር ➔</button>
    </div>

    <div id="step-quiz" class="hidden">
        <div id="progress-bg"><div id="progress-fill"></div></div>
        <div id="qText" style="font-weight:bold; font-size:1.2em; margin-bottom:20px;"></div>
        <div id="options-container">
            <button class="choice-btn" onclick="submitAns('A')"><div class="choice-label">ሀ</div> <span id="tA"></span></button>
            <button class="choice-btn" onclick="submitAns('B')"><div class="choice-label">ለ</div> <span id="tB"></span></button>
            <button class="choice-btn" onclick="submitAns('C')"><div class="choice-label">ሐ</div> <span id="tC"></span></button>
            <button class="choice-btn" onclick="submitAns('D')"><div class="choice-label">መ</div> <span id="tD"></span></button>
        </div>
    </div>

    <div id="step-res" class="hidden">
        <h2 style="color:#27ae60;">ተጠናቀቀ!</h2>
        <div style="font-size: 4em; font-weight:900; color: var(--primary);"><span id="finalScore">0</span>%</div>
        <button class="btn-start" onclick="location.reload()">እንደገና ተጫወት</button>
        <button class="btn-start" style="background:#1877F2;" onclick="shareFB()">ፌስቡክ ላይ አጋራ</button>
    </div>
</div>

<script>
    // --- FIREBASE CONFIG ---
    const firebaseConfig = {
        apiKey: "AIzaSyCLiqB5FqygKqPwLlctFsvQBP58fHontnc",
        authDomain: "biblicallanguagequizbot.firebaseapp.com",
        projectId: "biblicallanguagequizbot",
        storageBucket: "biblicallanguagequizbot.firebasestorage.app",
        messagingSenderId: "1040255793336",
        appId: "1:1040255793336:web:aea95b172a79204d57dc4d"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    let qPool = [], idx = 0, score = 0;
    let timerInterval, timeLeft = 15;

    async function startApp() {
        const n = document.getElementById('uName').value;
        const p = document.getElementById('uPhone').value;
        if(!n || !p) return alert("እባክዎ ስም እና ስልክ ያስገቡ!");

        try {
            const snap = await db.collection("questions").get();
            snap.forEach(doc => qPool.push(doc.data()));
            if(qPool.length === 0) return alert("ጥያቄዎች አልተገኙም!");
            qPool = qPool.sort(() => 0.5 - Math.random()).slice(0, 10);
            document.getElementById('step-reg').classList.add('hidden');
            showQ();
        } catch(e) { alert("የመረጃ ስህተት! ኢንተርኔትዎን ያረጋግጡ።"); }
    }

    function showQ() {
        document.getElementById('step-quiz').classList.remove('hidden');
        const q = qPool[idx];
        document.getElementById('qText').innerText = q.text;
        document.getElementById('tA').innerText = q.options[0];
        document.getElementById('tB').innerText = q.options[1];
        document.getElementById('tC').innerText = q.options[2];
        document.getElementById('tD').innerText = q.options[3];
        document.getElementById('progress-fill').style.width = ((idx/qPool.length)*100) + "%";
        startTimer();
    }

    function startTimer() {
        timeLeft = 15;
        const bar = document.getElementById('timer-bar');
        bar.classList.remove('hidden');
        bar.style.width = "100%";
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            bar.style.width = (timeLeft/15*100) + "%";
            if(timeLeft <= 0) submitAns('TIMEOUT');
        }, 1000);
    }

    function submitAns(letter) {
        clearInterval(timerInterval);
        if(letter === qPool[idx].correct) score++;
        idx++;
        if(idx < qPool.length) showQ(); else finish();
    }

    function finish() {
        document.getElementById('step-quiz').classList.add('hidden');
        document.getElementById('timer-bar').classList.add('hidden');
        const pct = Math.round((score/qPool.length)*100);
        document.getElementById('finalScore').innerText = pct;
        document.getElementById('step-res').classList.remove('hidden');
        
        db.collection("results").add({
            name: document.getElementById('uName').value,
            phone: document.getElementById('uPhone').value,
            score: pct,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    function shareFB() {
        const url = encodeURIComponent("https://endu-lab.github.io/Bible_Quize/");
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }
</script>

</body>
</html>
