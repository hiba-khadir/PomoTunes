// Timer functionality
const timer = {
  pomoCount: 0,
  currCycle: 0,
  timerDisp: { min: 25, sec: 0 },
  totalSec: 25 * 60,
  over: 0,
  paused: 1,
  countDown: null,

  getTimerElmnt() {
    return document.getElementById("timer");
  },

  render() {
    const el = this.getTimerElmnt();
    el.innerHTML = `${String(this.timerDisp.min).padStart(2, '0')} : ${String(this.timerDisp.sec).padStart(2, '0')}`;

    if (this.totalSec > 0) {
      this.totalSec--;
      this.timerDisp.min = Math.floor(this.totalSec / 60);
      this.timerDisp.sec = this.totalSec % 60;
    } else {
      clearInterval(this.countDown);
      this.over = 1;
      this.pomoCount++;

      if (this.pomoCount % settings.lbInterval !== 0) {
        this.currCycle = !this.currCycle; 
      } else {
        this.currCycle = 2; // long break
      }

      this.reset(); // optional auto-switch
    }
  },

  pause() {
    clearInterval(this.countDown);
    this.paused = 1;
    this.toggleIcon();
  },

  unpause() {
    this.countDown = setInterval(() => this.render(), 1000);
    this.paused = 0;
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

  switchToSB() {
    this.currCycle = 1;
    this.reset();
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
        taskInput.value = ""; // clear input
      }
    });
  }
};

// App settings
const settings = {
  lbInterval: 4,
  cycleList: [25, 5, 15],
  autoCheckTsk: 0,
  autoSwitchTsk: false,
  autoStrtPomo: false,
  autoStrtBrk: false
};

// UI/Page management
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
