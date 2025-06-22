import { timer } from "./pomodoro.js";
// App settings
export const settings = {
  lbInterval: 4,
  cycleList: [25, 5, 15],
  autoCheckTsk: true,
  autoSwitchTsk: true,
  autoStrtPomo: true,
  autoStrtBrk: true,

  //methodes
  setLbInt(inputElmnt){
    inputElmnt.addEventListener('input',
      (event)=>{
        if (inputElmnt.value) {
          this.lbInterval = inputElmnt.value;
        }
      })
  },
  setBool(param){
    this[param] = !this[param];  
  },
  setCycleDur(inputElmnt,cycle){
    inputElmnt.addEventListener('input',
      (event)=>{
        if (inputElmnt.value) {
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