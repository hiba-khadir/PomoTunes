// task management functionality
export const taskManager = {
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
        //task element of tasklist attributes: task content, estimated pomos, actual pomos, task checked or not
        this.taskList.push([taskInput.value , pomoNum.value , 0 , 0]);  
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
    //initialize 
    listElmnt.innerHTML = '';
    let element ;
    let checkSrc ;
    //first task with special style
    if (this.taskList.length > 0) {
       element = this.taskList[0];
       if (element[3]) {
        checkSrc =  'icons/check-box-on.svg';
       }else{
        checkSrc =  'icons/check-box-off.svg';
       }
       listElmnt.innerHTML += `<div class="task" id="curr-task">
                                  <button class="check-button" onclick="taskManager.checkTask(this);">
                                    <img class="check-box" src=${checkSrc}>
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
       if (element[3]) {
        checkSrc =  'icons/check-box-on.svg';
       }else{
        checkSrc =  'icons/check-box-off.svg';
       }
      listElmnt.innerHTML += `<div class="task";taskManager.render();">
                                <button class="check-button" onclick="taskManager.checkTask(this);">
                                  <img class="check-box" src=${checkSrc}>
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
    
    this.taskList[index] = [taskInElmnt.value , estiElmnt.value, actElmnt.value , this.taskList[index][3]];
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
    const taskElmnt = button.closest('.task');
    const index = this.order(taskElmnt);
    const checkBox = button.querySelector('.check-box');
    if(
        checkBox.src.endsWith('icons/check-box-on.svg')){ //if on turn off
        checkBox.src = 'icons/check-box-off.svg';
        
    }
    else if(checkBox.src.endsWith('icons/check-box-off.svg')){
        checkBox.src = 'icons/check-box-on.svg'; //if off turn on 
    }
    this.taskList[index][3] = ! this.taskList[index][3] ;
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
