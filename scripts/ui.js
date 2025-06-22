export const backgroundPicker ={
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


export const ui = {
  mode : 0,    //0 for light 1 for dark
  showSettings() {
    document.getElementById("settings-overlay").style.display = "flex";
  },

  showBgroundPicker() {
    document.getElementById("background-overlay").style.display = "flex";
  },
  showMusicPicker() {
    document.getElementById("music-overlay").style.display = "flex";
  },

  closePage(ovlay) {
    ovlay.style.display = "none";
  },
  showSignIn(){
    document.getElementById("auth-overlay").style.display = "flex";
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
