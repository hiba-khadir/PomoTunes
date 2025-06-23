//imports 
import { ui , backgroundPicker } from "./ui.js";
import { taskManager } from "./taskManager.js";
import { music } from "./music.js";
import { settings } from "./settings.js";
import { searchSongDebounced } from "./music.js";

//timer functionality
export const timer = {
  //params and status of the timer  
  pomoCount: 0,
  currCycle: 0,
  timerDisp: { min: 25, sec: 0 },
  totalSec: 25*60,
  paused: 1,
  countDown: null,

  //ops on timer

  //display and update
  render() {
    const el = document.getElementById("timer");
    el.innerHTML = `${String(this.timerDisp.min).padStart(2, '0')} : ${String(this.timerDisp.sec).padStart(2, '0')}`;

    // Update the timer
    if (this.totalSec > 0) {
      this.totalSec--;
      this.timerDisp.min = Math.floor(this.totalSec / 60);
      this.timerDisp.sec = this.totalSec % 60;
    } else {
      // Timer reached zero
      clearInterval(this.countDown);
      
      if (this.currCycle === 0) {
        //inc count
        this.pomoCount++;
        this.displayCount();

        // sync tasks
        if (taskManager.taskList.length > 0) {
          const currentTask = taskManager.taskList[0];
          
          // inc pomos of current task
          if (settings.autoSwitchTsk && currentTask[2] < currentTask[1]) {
            taskManager.taskList[0][2]++;
            taskManager.render();
          }

          //if current task is completed
          if (currentTask[2] >= currentTask[1]) {
            //auto-switch
            if (settings.autoSwitchTsk && taskManager.taskList.length > 1) {
              const tskListElmnt = document.querySelectorAll('.task');
              if (tskListElmnt.length > 1) {
                taskManager.switchTsk(tskListElmnt[1]);
                taskManager.render();
              }
            }
            // auto-check 
            if (settings.autoCheckTsk) {
              const tskListElmnt = document.querySelectorAll('.task');
              
              if (tskListElmnt.length > 0) {
                const checkBox = tskListElmnt[1].querySelector('.check-box');
                if (checkBox && checkBox.src.includes('check-box-off.svg')) {
                  taskManager.checkTask(tskListElmnt[0].querySelector('.check-button'));
                }
              }
            }
          }
        }
      }

      if (this.currCycle === 0) {
        if (this.pomoCount % settings.lbInterval === 0) {
          this.currCycle = 2; // Long break
          ui.selectCycle(2);
        } else {
          this.currCycle = 1; // Short break
        }
      } else {
        this.currCycle = 0; 
      }
      ui.selectCycle(this.currCycle);
      //reset for next
      this.reset();
      
      // Auto-start
      if ((this.currCycle === 0 && settings.autoStrtPomo) || 
          (this.currCycle !== 0 && settings.autoStrtBrk)) {
        this.unpause();
      }
    }
  },

  pause() {
    clearInterval(this.countDown);
    this.paused = 1;
    this.toggleIcon();
  },

  unpause() {
    this.paused = 0;
    this.countDown = setInterval(() => this.render(), 1000);
    this.toggleIcon();
  },

  toggleIcon() {
    const paused = this.paused;
    let icon2 = document.getElementById("play-icon");
    let icon1 = document.getElementById("pause-icon");

    if (paused) {
      icon1.style.display = "none";
      icon2.style.display = "inline";
    } else {
      icon2.style.display = "none";
      icon1.style.display = "inline";
    }
  },

  reset() {
    const cycleDur = settings.cycleList[this.currCycle];
    this.timerDisp.sec = 0;
    this.timerDisp.min = cycleDur;
    this.totalSec = cycleDur * 60;
    this.render();
    this.pause();
  },

  displayCount(){
    let countElmnt = document.getElementById('count');
    countElmnt.innerHTML  = `#${this.pomoCount + 1}`;
  }

};



//initialize the display 
let timerElmnt = document.getElementById('timer');
timerElmnt.innerHTML = `${String(timer.timerDisp.min).padStart(2, '0')} : ${String(timer.timerDisp.sec).padStart(2, '0')}`;
ui.selectCycle(timer.currCycle);

window.timer = timer;
window.ui = ui;
window.backgroundPicker = backgroundPicker ;
window.music = music;
window.settings = settings;
window.taskManager = taskManager; // if exists
window.searchSongDebounced = searchSongDebounced;
