//global variables 
//timer
let timer = { min : 0, sec : 10}
let totalSec = timer.min*60 + timer.sec;
let count = 0 ;
let cycle = [5 , 15 , 25];
let currCycle =  1 ;
let paused = 1 ;

//timer
let timerElmnt;

function renderTimer(){
    timerElmnt = document.getElementById('timer');
    timerElmnt.innerHTML = `${String(timer.min).padStart(2, '0')} : ${String(timer.sec).padStart(2, '0')}`;
    if (!timer.min && !timer.sec) {
       clearInterval(countDown); 
    } 
    totalSec--;
    timer.min = Math.floor(totalSec/60);
    timer.sec = totalSec%60;
}

function pauseTimer(){
    clearInterval(countDown);
    paused = 1 ;
    toggleIcon();
}
function unpauseTimer() {   
    countDown = setInterval(renderTimer,1000);
    paused = 0;
    toggleIcon();
}
function toggleIcon() {
    let icon2 = document.getElementById('play-icon');
    let icon1 = document.getElementById('pause-icon');
    if (paused) {
        icon1.style.display = "none";
        icon2.style.display = "inline";
    } else {
        icon2.style.display = "none";
        icon1.style.display = "inline";
    }
}
function reset(){
    timer.sec = 0 ;
    timer.min = cycle[currCycle];
    totalSec = timer.min*60 + timer.sec;
    pauseTimer();
    renderTimer();
}

function showTasks() {
    let panel = document.getElementById('task-panel');
    panel.style.display = "flex";
}