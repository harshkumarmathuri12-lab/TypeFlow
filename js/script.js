// ==========================================
// TypeFlow v4.0
// script.js - PART 1
// ==========================================

// ---------- DOM ----------

const display = document.getElementById("textDisplay");
const input = document.getElementById("typingInput");
const caret = document.getElementById("caret");

const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const cpmEl = document.getElementById("cpm");
const accEl = document.getElementById("accuracy");
const rawEl = document.getElementById("raw");

const liveCorrect = document.getElementById("liveCorrect");
const liveWrong = document.getElementById("liveWrong");
const liveExtra = document.getElementById("liveExtra");
const liveMissed = document.getElementById("liveMissed");

const restartBtn = document.getElementById("restartBtn");

const canvas = document.getElementById("liveGraph");
const ctx = canvas.getContext("2d");

// ---------- MODE BUTTONS ----------

const timeModeBtn = document.getElementById("timeMode");
const wordModeBtn = document.getElementById("wordMode");
const quoteModeBtn = document.getElementById("quoteMode");

const timeButtons = document.querySelectorAll(".time");
const wordButtons = document.querySelectorAll(".word");

const timeBox = document.getElementById("timeButtons");
const wordBox = document.getElementById("wordButtons");

// ==========================================
// APP STATE
// ==========================================

document.body.classList.add("ready");

let mode = "time";
let textType = "words";

let duration = 60;
let wordLimit = 25;
let timeLeft = 60;

let timer = null;
let started = false;
let startTime = 0;

let currentWord = 0;
let currentChar = 0;

let wordsData = [];

let correctChars = 0;
let wrongChars = 0;
let extraChars = 0;
let missedChars = 0;

let wpmHistory = [];
let rawHistory = [];
let errorHistory = [];

// ==========================================
// CREATE WORDS
// ==========================================

function createWords(){

    wordsData = [];

    // Quote mode
    if(textType === "quotes"){

        const quote = getRandomQuote();

        quote.split(" ").forEach(word=>{

            wordsData.push({

                target:word,
                typed:"",
                locked:false,
                status:[]

            });

        });

        return;
    }

    // Random words
    const totalWords =
        mode === "time"
        ? 60
        : wordLimit;

    for(let i=0;i<totalWords;i++){

        wordsData.push({

            target:
                words[Math.floor(Math.random()*words.length)],

            typed:"",
            locked:false,
            status:[]

        });

    }

}

// ==========================================
// INFINITE WORDS
// ==========================================

function appendWords(count = 50){

    for(let i=0;i<count;i++){

        wordsData.push({

            target:
                words[Math.floor(Math.random()*words.length)],

            typed:"",
            locked:false,
            status:[]

        });

    }

}

// ==========================================
// VALIDATE WORD
// ==========================================

function validateWord(index){

    const word = wordsData[index];

    word.status = [];

    for(let i=0;i<word.typed.length;i++){

        if(i >= word.target.length){

            word.status.push("extra");

        }else if(word.typed[i] === word.target[i]){

            word.status.push("correct");

        }else{

            word.status.push("wrong");

        }

    }

}

// ==========================================
// CHARACTER COUNT
// ==========================================

function calculateCharacters(){

    correctChars = 0;
    wrongChars = 0;
    extraChars = 0;
    missedChars = 0;

    wordsData.forEach((word,index)=>{

        validateWord(index);

        word.status.forEach(state=>{

            if(state==="correct") correctChars++;
            if(state==="wrong") wrongChars++;
            if(state==="extra") extraChars++;

        });

        if(word.locked){

            missedChars += Math.max(
                0,
                word.target.length -
                Math.min(word.target.length, word.typed.length)
            );

        }

    });

}

// ==========================================
// CORRECT WORD COUNT
// ==========================================

function countCorrectWords(){

    let total = 0;

    wordsData.forEach(word=>{

        if(
            word.locked &&
            word.typed === word.target
        ){
            total++;
        }

    });

    return total;

}

// ==========================================
// RENDER WORDS
// ==========================================

function render(){

    display.innerHTML = "";

    wordsData.forEach((word,index)=>{

        const wrapper = document.createElement("span");
        wrapper.className = "word";

        const total = Math.max(
            word.target.length,
            word.typed.length
        );

        for(let i=0;i<total;i++){

            const span = document.createElement("span");

            span.textContent =
                i < word.target.length
                ? word.target[i]
                : word.typed[i];

            if(word.status[i]){
                span.className = word.status[i];
            }

            if(
                index === currentWord &&
                i === currentChar
            ){
                span.classList.add("current");
            }

            wrapper.appendChild(span);

        }

        display.appendChild(wrapper);
        display.append(" ");

    });

    moveCaret();
    updateStats();

}

// ==========================================
// MOVE CARET
// ==========================================

function moveCaret(){

    const current = document.querySelector(".current");

    if(!current) return;

    const parent =
        display.parentElement.getBoundingClientRect();

    const rect =
        current.getBoundingClientRect();

    // Cursor alphabet ke LEFT me
    caret.style.left =
        (rect.left - parent.left - 1) + "px";

    caret.style.top =
        (rect.top - parent.top + 6) + "px";

    const scroll =
        Math.max(0,current.offsetTop - 70);

    display.style.transform =
        `translateY(${-scroll}px)`;

}

// ==========================================
// LIVE STATS
// ==========================================

function updateStats(){

    calculateCharacters();

    const typedChars =
        correctChars +
        wrongChars +
        extraChars;

    const correctWords =
        countCorrectWords();

    const elapsed = started
        ? Math.max(
            1,
            Math.floor((Date.now()-startTime)/1000)
          )
        : 1;

    const minutes = elapsed / 60;

    // Monkeytype WPM
    const wpm =
        Math.round(correctWords / minutes);

    // Raw WPM
    const raw =
        Math.round((typedChars / 5) / minutes);

    // CPM
    const cpm =
        Math.round(typedChars / minutes);

    // Accuracy
    const accuracy =
        typedChars === 0
        ? 100
        : Math.round((correctChars/typedChars)*100);

    timerEl.textContent =
        mode === "time"
        ? timeLeft
        : Math.max(0,wordLimit-currentWord);

    wpmEl.textContent = wpm;
    cpmEl.textContent = cpm;
    accEl.textContent = accuracy + "%";
    rawEl.textContent = raw;

    liveCorrect.textContent = correctChars;
    liveWrong.textContent = wrongChars;
    liveExtra.textContent = extraChars;
    liveMissed.textContent = missedChars;

    return{
        wpm,
        raw,
        accuracy
    };

}

// ==========================================
// LIVE GRAPH
// ==========================================

function drawGraph(){

    if(!canvas) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Grid
    ctx.strokeStyle = "#3a3d42";
    ctx.lineWidth = 1;

    for(let i=0;i<5;i++){

        const y = 20 + i*35;

        ctx.beginPath();
        ctx.moveTo(35,y);
        ctx.lineTo(canvas.width-10,y);
        ctx.stroke();

    }

    drawLine(rawHistory,"#707070",2);
    drawLine(wpmHistory,"#e2b714",3);

}

function drawLine(data,color,width){

    if(data.length<2) return;

    const max =
        Math.max(...data,20);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    data.forEach((value,index)=>{

        const x =
            35 +
            index *
            ((canvas.width-50)/(data.length-1));

        const y =
            160 -
            (value/max)*130;

        if(index===0){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

    });

    ctx.stroke();

}

// ==========================================
// KEYBOARD INPUT
// ==========================================

input.addEventListener("keydown",(e)=>{

    if(mode==="time" && timeLeft<=0){
        e.preventDefault();
        return;
    }

    const word=wordsData[currentWord];
    if(!word) return;

    if(e.ctrlKey || e.metaKey) return;

    // Ignore arrows
    if(
        e.key==="ArrowLeft" ||
        e.key==="ArrowRight" ||
        e.key==="ArrowUp" ||
        e.key==="ArrowDown" ||
        e.key==="Tab"
    ){
        e.preventDefault();
        return;
    }

    // SPACE
    if(e.key===" "){

        e.preventDefault();

        if(word.typed.length===0) return;

        word.locked=true;

        validateWord(currentWord);

        currentWord++;
        currentChar=0;

        input.value="";

        // Infinite words
        if(mode==="time"){

            if(wordsData.length-currentWord<=15){
                appendWords(50);
            }

        }else{

            if(currentWord>=wordLimit){
                finishTest();
                return;
            }

        }

        render();
        return;
    }

    // BACKSPACE
    if(e.key==="Backspace"){

        e.preventDefault();

        if(word.locked) return;

        if(word.typed.length===0) return;

        word.typed=word.typed.slice(0,-1);

        currentChar=word.typed.length;

        input.value=word.typed;

        validateWord(currentWord);

        render();

        return;
    }

    // CHARACTER
    if(e.key.length===1){

        e.preventDefault();

        if(!started){

            started=true;

            document.body.classList.remove("ready");
            document.body.classList.add("typing");

            startTimer();
        }

        word.typed+=e.key;

        currentChar=word.typed.length;

        input.value=word.typed;

        validateWord(currentWord);

        render();
    }

});

// ==========================================
// TIMER
// ==========================================

function startTimer(){

    startTime=Date.now();

    if(mode==="words") return;

    timer=setInterval(()=>{

        timeLeft--;

        const stats=updateStats();

        wpmHistory.push(stats.wpm);
        rawHistory.push(stats.raw);
        errorHistory.push(wrongChars+extraChars);

        drawGraph();

        if(timeLeft<=0){

            timeLeft=0;

            clearInterval(timer);

            finishTest();
        }

    },1000);

}

// ==========================================
// FINISH TEST
// ==========================================

function finishTest(){

    clearInterval(timer);

    document.body.classList.remove("typing");
    document.body.classList.add("ready");

    const stats=updateStats();

    const result={

        wpm:stats.wpm,
        raw:stats.raw,
        accuracy:stats.accuracy,

        correct:correctChars,
        incorrect:wrongChars,
        extra:extraChars,
        missed:missedChars,

        graph:wpmHistory,
        rawGraph:rawHistory,
        errorGraph:errorHistory,

        mode:mode,
        textType:textType,

        time:
            mode==="time"
            ? duration
            : wordLimit,

        date:new Date().toLocaleString()

    };

    localStorage.setItem(
        "typeflow_result",
        JSON.stringify(result)
    );

    window.location.href="result.html";
}

// ==========================================
// RESET
// ==========================================

function reset(){

    clearInterval(timer);

    started=false;
    startTime=0;

    timeLeft=duration;

    currentWord=0;
    currentChar=0;

    input.value="";

    correctChars=0;
    wrongChars=0;
    extraChars=0;
    missedChars=0;

    wpmHistory=[];
    rawHistory=[];
    errorHistory=[];

    document.body.classList.remove("typing");
    document.body.classList.add("ready");

    createWords();

    render();
    drawGraph();

    input.focus();
}

// ==========================================
// MODE BUTTONS
// ==========================================

timeModeBtn.onclick=()=>{

    mode="time";
    textType="words";

    timeBox.classList.remove("hidden");
    wordBox.classList.add("hidden");

    timeModeBtn.classList.add("active");
    wordModeBtn.classList.remove("active");
    quoteModeBtn.classList.remove("active");

    reset();
};

wordModeBtn.onclick=()=>{

    mode="words";
    textType="words";

    wordBox.classList.remove("hidden");
    timeBox.classList.add("hidden");

    wordModeBtn.classList.add("active");
    timeModeBtn.classList.remove("active");
    quoteModeBtn.classList.remove("active");

    reset();
};

quoteModeBtn.onclick=()=>{

    mode="words";
    textType="quotes";

    wordBox.classList.add("hidden");
    timeBox.classList.add("hidden");

    quoteModeBtn.classList.add("active");
    wordModeBtn.classList.remove("active");
    timeModeBtn.classList.remove("active");

    reset();
};

// Time buttons

timeButtons.forEach(btn=>{

    btn.onclick=()=>{

        duration=Number(btn.dataset.time);

        timeButtons.forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        reset();
    };

});

// Word buttons

wordButtons.forEach(btn=>{

    btn.onclick=()=>{

        wordLimit=Number(btn.dataset.count);

        wordButtons.forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        reset();
    };

});

// ==========================================
// INIT
// ==========================================

restartBtn.onclick=reset;

document.body.addEventListener("click",()=>{

    input.focus();

});

createWords();
render();
drawGraph();
input.focus();