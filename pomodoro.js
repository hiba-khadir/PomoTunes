// App settings
const settings = {
  lbInterval: 2,
  cycleList: [1, 1, 1],
  autoCheckTsk: true,
  autoSwitchTsk: true,
  autoStrtPomo: true,
  autoStrtBrk: true,

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
    timer.reset(); 
    
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
  timerDisp: { min: 0, sec: 30 },
  totalSec: 30,
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

// task management functionality
const taskManager = {
  tskShown: 0,
  tskSaved: 0,
  taskList: [],
  currentTsk: 0,     //index in taskList 

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
    //first task with special style
    if (this.taskList.length >= 1) {
       element = this.taskList[0];
       listElmnt.innerHTML += `<div class="task" id="curr-task">
                                  <button class="check-button" onclick="taskManager.checkTask(this);">
                                    <img class="check-box" src="icons/check-box-off.svg">
                                  </button>
                                  <div class="task-content">${element[0]}</div>
                                  <div class = "cont">
                                    <div class="pomos-count">${element[2]}</div>
                                    <span class= "slash">/</span>
                                    <div class="pomos-count">${element[1]}</div>
                                    <button class="param-button" onclick = "taskManager.modify(this)"><img class="param-icon" src="icons/params.svg"></button>
                                  </div>
                                </div>
                              <div class="separator"></div>`
    }
    for (let i = 1; i< taskManager.taskList.length;i++) {   
      element = taskManager.taskList[i]; 
      listElmnt.innerHTML += `<div class="task";taskManager.render();">
                                <button class="check-button" onclick="taskManager.checkTask(this);">
                                  <img class="check-box" src="icons/check-box-off.svg">
                                </button>
                                <div class="task-content" onclick="taskManager.switchTsk(this);taskManager.render()">${element[0]}</div>
                                <div class = "cont">
                                  <div class="pomos-count">${element[2]}</div>
                                  <span class= "slash">/</span>
                                  <div class="pomos-count">${element[1]}</div>
                                  <button class="param-button" onclick = "taskManager.modify(this)"><img class="param-icon" src="icons/params.svg"></button>
                                </div>
                              </div>
                              <div class="separator"></div>`
      }
    listElmnt.innerHTML += `<div class="add-task" id="add-task-btn" onclick="taskManager.add()">Add a task</div>
                              <div id="add-control">
                                  <input class="task-input" id="task-input-add" type="text" placeholder="What are you working on ?">
                                  <div class="est">Estimated cycles</div>
                                  <div>
                                      <input type="number" id="num-put">
                                      <button class="up-down" onclick="document.getElementById('num-put').value++">+</button>
                                      <button class="up-down" onclick="document.getElementById('num-put').value--">-</button>
                                      <div class="cs-buttons">
                                          <button class="cancel" onclick="taskManager.cancel();">cancel</button>
                                          <button class="save" onclick=" if(taskManager.save()){taskManager.render();}">save</button>
                                      </div>
                                  </div>
                              </div>`;
    console.log(listElmnt.innerHTML);
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
                                <button class="save" onclick="taskManager.saveChange(${index});taskManager.render();">Save</button>
                            </div>
                          </div>`.trim();
    tskElmnt.replaceWith(temp.content.firstChild);
  },

  saveChange(index){
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
  },

  switchTsk(taskContentElmnt){
    let taskElmnt = taskContentElmnt.closest('.task');
    let index = this.order(taskElmnt);
    let data = this.taskList[index];
    this.taskList.splice(index,1);
    //add it to the start 
    this.taskList.unshift(data);
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

  //highlight the current cycle's button
  selectCycle(cycle){

    let speButtonElmnt ;
    let nonSpe1 ;
    let nonSpe2 ;
    switch (cycle) {
      case 0:
        speButtonElmnt = document.getElementById('fc');
        nonSpe1 = document.getElementById('sb'); 
        nonSpe2 = document.getElementById('lb');
        break;
      case 1:
        speButtonElmnt = document.getElementById('sb');
        nonSpe1 = document.getElementById('fc'); 
        nonSpe2 = document.getElementById('lb');
        break
      case 2:
        speButtonElmnt = document.getElementById('lb');
        nonSpe1 = document.getElementById('sb'); 
        nonSpe2 = document.getElementById('fc');
        break
      default:
        console.log('Error cycle doesn\'t exist') ;
        return
        break;
    }
    speButtonElmnt.style.backgroundColor = 'Var(--accent-color)';
    nonSpe1.style.backgroundColor = 'Var(--main-color-light)';
    nonSpe2.style.backgroundColor = 'Var(--main-color-light)';
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