// App settings
const settings = {
  lbInterval: 4,
  cycleList: [1, 2, 3],
  autoCheckTsk: 0,
  autoSwitchTsk: false,
  autoStrtPomo: false,
  autoStrtBrk: false
};

// Timer functionality
const timer = {

  //params and status of the timer  
  pomoCount: 0,
  currCycle: 0,
  timerDisp: { min: 0, sec: 3 },
  totalSec: 3,
  paused: 1,
  countDown: null,

  //ops on timer
  getTimerElmnt() {
    return document.getElementById("timer");
  },
  
  //display and update
  render() {
    const el = this.getTimerElmnt();
    el.innerHTML = `${String(this.timerDisp.min).padStart(2, '0')} : ${String(this.timerDisp.sec).padStart(2, '0')}`;

    //update the timer
    if (this.totalSec > 0) {
      this.totalSec--;
      this.timerDisp.min = Math.floor(this.totalSec / 60);
      this.timerDisp.sec = this.totalSec % 60;
    } else {

      clearInterval(this.countDown);
      //if it's a focus time
      if (!this.currCycle) {
        this.pomoCount++; 
        this.displayCount();       
      }
      if (this.pomoCount % settings.lbInterval === 0) {
        this.currCycle = 2; // long break
      } else {
        this.currCycle = 1 - this.currCycle;  //toggle bet 1 & 0
      }
        this.reset();
        if ((!this.currCycle && settings.autoStrtPomo )|| (this.currCycle && settings.autoStrtBrk)) {
            this.unpause();
        }
      }
      console.log(this);
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

// Task management functionality
const taskManager = {
  tskShown: 0,
  taskList: [],

  toggle() {
    const panel = document.getElementById("task-panel");
    if (this.tskShown) {
      panel.style.display = "none";
      this.tskShown = 0;
    } else {
      panel.style.display = "flex";
      this.tskShown = 1;
    }
  },

  add() {
    let controlElmnt = document.getElementById("add-control");
    controlElmnt.style.display = "flex";
    let taskInput = document.getElementById("task-input");

    taskInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && taskInput.value !== "") {
        this.taskList.push(taskInput.value);
        console.log(this.taskList);
      }
    });
  },

  save(){
    let taskInput = document.getElementById("task-input");
    let pomoNum = document.getElementById('num-put');
    let controlElmnt = document.getElementById("add-control");

    //temp save of task and it's pomo number
    if (taskInput.value && pomoNum.value ) {
        this.taskList.push([taskInput.value , pomoNum.value]);  
        controlElmnt.style.display = "none";
        taskInput.value = '';
        pomoNum.value = '' ;
    }    
  },
  
  cancel(){
    alert('progress will be lost');
    let controlElmnt = document.getElementById("add-control");
    controlElmnt.style.display = "none";
    taskInput.value = '';
    pomoNum.value = '' ; 
  }

};


const ui = {
  showSettings() {
    document.getElementById("settings-overlay").style.display = "flex";
  },

  showBgroundPicker() {
    document.getElementById("background-overlay").style.display = "flex";
  },

  closePage(ovlay) {
    ovlay.style.display = "none";
  }
};
