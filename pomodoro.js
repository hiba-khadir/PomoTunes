// App settings
const settings = {
  lbInterval: 4,
  cycleList: [25, 5, 15],
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
const backgroundPicker ={
  chosenBg : 0,
  BgList : ['backgrounds/1.png', 'backgrounds/2.png' ,'backgrounds/3.png', 'backgrounds/4.png' , 'backgrounds/5.png' ],

  //methods
  chooseBg(index,bg){
    let bodyElmnt = document.querySelector('body');
    bodyElmnt.style.backgroundImage = `url(${backgroundPicker.BgList[index]})`;
    bg.style.borderColor = '#98d486';
    bg.style.borderWidth = '10px';   
  },
  uploadBg(){
    let inputFile = document.getElementById('image-file');
    let bgContElmnt = document.getElementById('Background-container');
    if (inputFile.value) {
      console.log(inputFile.files[0].name);
      let url = window.URL.createObjectURL(inputFile.files[0])
      this.BgList.push(url);
      console.log(this.BgList);
      if (inputFile.files[0]) {
        bgContElmnt.innerHTML += `<img class="bground" src= ${url} onclick="backgroundPicker.chooseBg(${this.BgList.length -1},this)">`
      }
    }    
  }
};
// Timer functionality
const timer = {
  //params and status of the timer  
  pomoCount: 0,
  currCycle: 0,
  timerDisp: { min: 25, sec: 0 },
  totalSec: 25*60,
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

// task management functionality
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
    let scrolElmnt = document.querySelector('')
  },

  save(){
    let taskInput = document.getElementById("task-input-add");
    let pomoNum = document.getElementById('num-put');
    let controlElmnt = document.getElementById("add-control");

    //temp save of task and it's pomo number
    if (taskInput.value && pomoNum.value ) {
        this.taskList.push([taskInput.value , pomoNum.value , 0]);  
        controlElmnt.style.display = "none";
        taskInput.value = '';
        pomoNum.value = '' ;
        return 1
    }else{
      return 0
    }  
  },
  
  cancel(){
    let controlElmnt = document.getElementById("add-control");
    controlElmnt.style.display = "none";
    taskInput.value = '';
    pomoNum.value = '' ; 
  },

  render(){
    let listElmnt = document.getElementById('task-list');
    listElmnt.innerHTML = '';
    let element ;
    console.log(this.taskList);
    for (let i = 0; i< taskManager.taskList.length; i++) {   
      element = taskManager.taskList[i];  
      listElmnt.innerHTML += `<div class="task">
                                <button class="check-button" onclick="taskManager.checkTask(this);">
                                  <img class="check-box" src="icons/check-box-off.svg">
                                </button>
                                <div class="task-content">${element[0]}</div>
                                <div class = "cont">
                                  <div class="pomos-count">${element[2]}</div>
                                  <span class= "slash">/</span>
                                  <div class="pomos-count">${element[1]}</div
                                </div>
                                <button class="param-button" onclick = "taskManager.modify(this)"><img class="param-icon" src="icons/params.svg"></button>
                              </div>
                              <div class="separator"></div>`
    }
    listElmnt.innerHTML += `<div class="add-task" id="add-task-btn" onclick="taskManager.add()">Add a task</div>
                              <div id="add-control">
                                  <input class ="task-input" id = "task-input-add" type="text" placeholder="What are you working on ?">
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

  modify(paramBut){

    let tskElmnt = paramBut.closest('.task');
    let ogElmntHTML = tskElmnt.innerHTML;
    let index = this.order(tskElmnt);
    //display edit panel
    let temp = document.createElement('template');
    temp.innerHTML = `<div id="params-control">
                            <input class="task-input" type="text" value="${taskManager.taskList[index][0]}">
                            <div class="est">Pomodoros</div>
                            <div class="pomos-row">
                                <input type="number"  class="act" value="${taskManager.taskList[index][2]}">
                                <span class="slash">/</span>
                                <input type="number"  class="esti" value ="${taskManager.taskList[index][1]}">
                                <button class="up-down" onclick="this.previousElementSibling.value++">+</button>
                                <button class="up-down" onclick="this.previousElementSibling.previousElementSibling.value--">-</button>
                            </div>
                            <div class="cs-buttons">
                                <button class="delete" onclick="taskManager.delete(${index});taskManager.render();">Delete</button>
                                <button class="cancel" onclick="taskManager.render();">Cancel</button>
                                <button class="save" onclick="taskManager.resave(${index});taskManager.render();">Save</button>
                            </div>
                          </div>`.trim();
    tskElmnt.replaceWith(temp.content.firstChild);
  },

  resave(index){
    let contElmnt = document.getElementById('params-control');
    let taskInElmnt = contElmnt.querySelector('.task-input');
    let actElmnt = document.querySelector('.act');
    let estiElmnt = document.querySelector('.esti');
    
    this.taskList[index] = [taskInElmnt.value , estiElmnt.value, actElmnt.value];
  },
  //get tasks order
  order(taskElmnt) {
    const allTasks = Array.from(taskElmnt.parentElement.querySelectorAll('.task'));
    return allTasks.indexOf(taskElmnt);
  },

  delete(order){
    this.taskList.splice(order,1);
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
  mode : 0,    //0 for light 1 for dark
  showSettings() {
    document.getElementById("settings-overlay").style.display = "flex";
  },

  showBgroundPicker() {
    document.getElementById("background-overlay").style.display = "flex";
  },

  closePage(ovlay) {
    ovlay.style.display = "none";
  },
  
  darkLightMode(){
    let iconElmnt = document.getElementById('sun-mn-icon');
    if (!this.mode) {
      //switch to dark mode
      iconElmnt.src = 'icons/moon.svg';


    }else{
      iconElmnt.src = 'icons/moon.svg';
    }
    this.mode = !this.mode;
  }
};