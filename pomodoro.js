// App settings
const settings = {
  lbInterval: 4,
  cycleList: [1, 2, 3],
  autoCheckTsk: 0,
  autoSwitchTsk: false,
  autoStrtPomo: false,
  autoStrtBrk: false,

  //methodes
  setLbInt(inputElmnt){
    inputElmnt.addEventListener('keydown',
      (event)=>{
        if (event.key === 'Enter' && inputElmnt.value) {
          this.lbInterval = inputElmnt.value;
        }
      })
    
  },
  setBool(param){
    this[param] = !this[param];  
  },
  setCycleDur(inputElmnt,cycle){
    inputElmnt.addEventListener('keydown',
      (event)=>{
        if (event.key === 'Enter' && inputElmnt.value) {
          this.cycleList[cycle] = inputElmnt.value ;
        }
      })
    
  },
  toggle(toggleElmnt) {
    if (toggleElmnt.src.includes("toggle-off.svg")) {
      toggleElmnt.src = "icons/toggle-on.svg";
    } else {
      toggleElmnt.src = "icons/toggle-off.svg";
    }
  }

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
  tskSaved: 0,
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
        this.tskSaved = 1;
    }else{
      this.saved = 0 ;
    }    
  },
  
  cancel(){
    let controlElmnt = document.getElementById("add-control");
    controlElmnt.style.display = "none";
    taskInput.value = '';
    pomoNum.value = '' ; 
    this.tskSaved = 0;
  },

  render(){
    let listElmnt = document.getElementById('task-list');
    listElmnt.innerHTML = '';
    let element ;
    for (let i = 0; i< taskManager.taskList.length; i++) {   
      element = taskManager.taskList[i];  
      listElmnt.innerHTML += `<div class="task">
                                <button class="check-button" onclick="taskManager.checkTask(this);">
                                  <img class="check-box" src="icons/check-box-off.svg">
                                </button>
                                <div class="task-content">${element[0]}</div>
                                <button class="param-button"><img class="param-icon"></button>
                                <div class="pomos-count">${element[1]}</div>
                              </div>
                              <div class="separator"></div>`
    }
    listElmnt.innerHTML += `<div class="add-task" id="add-task-btn" onclick="taskManager.add()">Add a task</div>
                              <div id="add-control">
                                  <input id="task-input" type="text" placeholder="What are you working on ?">
                                  <div class="est">Estimated cycles</div>
                                  <div>
                                      <input type="number" id="num-put">
                                      <button class="up-down">up</button>
                                      <button class="up-down">down</button>
                                      <div class="cs-buttons">
                                          <button class="cancel" onclick="taskManager.cancel();">cancel</button>
                                          <button class="save" onclick="taskManager.save();taskManager.render();">save</button>
                                      </div>
                                  </div>
                              </div>
                          </div>`;
  
  },

  checkTask(button){
    const checkBox = button.querySelector('.check-box');
    if(
        checkBox.src.endsWith('icons/check-box-on.svg')){ //if on turn off
        checkBox.src = 'icons/check-box-off.svg';
    }

    else if(checkBox.src.endsWith('icons/check-box-off.svg')){
        checkBox.src = 'icons/check-box-on.svg'; //if off turn on 
    }

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