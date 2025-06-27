export const music = {
    playlist : [],
    resultsList : [],
    currPlay : null,
    pausedAt : null, //stores where the curr playing audio was paused , if

    //headers for all requests
    headers :{
        'Accept':'application/json'
     },

    //allow search from audius api
    async  searchSong(){
        //get the search box and results disp
        let searchElmnt = document.getElementById('song-search-input');
        let resultsElmnt = document.getElementById('search-results');
        let searchQuery = searchElmnt.value.trim();

        try{
            //fetch song from audius api
            let songResp = await fetch(
                `https://discoveryprovider.audius.co/v1/tracks/search?query=${searchQuery}&app_name=Pomodoro`,
                {
                    method: 'GET',
                    headers: this.headers
                }
            );
            try{
                const songObj = await songResp.json();
                music.resultsList = extract(songObj.data);   
                //display the search results DOM
                resultsElmnt.style.display = 'flex';
                renederSearchResults(music.resultsList , resultsElmnt);
            }
            catch{
                console.log('Parsing Error');
            }
              
        }catch{
            console.log('Request Error');
        }
    },

    debounce(intervall , func){
        let timer = null;
        return(...args)=>{
            if (timer) {
                clearTimeout(timer); 
            }
            timer = setTimeout(func,intervall,...args);
        } 
    },
    debounceInt : 300 ,

    //playlist methods
    addToPlaylist(addBtnElmnt){
        const resultElmnt = addBtnElmnt.closest('.result-item');
        if (resultElmnt) {
           let ind = resultElmnt.querySelector('.index').innerHTML ;
           //get the title from results list 
           console.log(`index : ${ind}`);
           console.log(`result list ${this.resultsList}`);
           let temp = this.resultsList[ind];
           temp.index = this.playlist.length;
           this.playlist.push(temp);
           console.log(this.playlist);
        }else{
            console.log('song is null');
        } 
    },

    removeFromPlaylist(rmvBtnElmnt){
        const songElmnt = rmvBtnElmnt.closest('.title');
        if (songElmnt) {
            let ind = songElmnt.querySelector('.index').innerHTML;
            this.playlist.splice(ind,1)
            console.log(this.playlist);
        }else{
            console.log('song is null');
        } 
    },

    render(){
        let  playlistElmnt = document.getElementById('Playlist');
        playlistElmnt.innerHTML = '';
        for (let i = 0; i < this.playlist.length; i++) {
            const element = this.playlist[i];
            playlistElmnt.innerHTML += `<div class="title">
                                            <button class="but" onclick="music.streamSong(this.parentElement)"><img src="icons/play.svg" class="play-song-icn"></button>
                                            <div class="result-text">
                                                <div class="song-name">${element.title}</div>
                                                <div class="artist-name">${element.artist}</div>
                                                <div class="index" hidden>${i}</div>
                                            </div>
                                            <button class="add-rm" onclick="music.removeFromPlaylist(this);music.render();">-</button>
                                        </div>
                                        <div class="sep"></div>`
                                    
        }
    },

    configSongPlayer(audioURL , index){
        console.log('config song player');
        // show currently playing track 
        document.getElementById('now-playing-player').style.display = 'flex';
        const audioElmnt = document.getElementById('audio');
        audioElmnt.src = audioURL ;
        audioElmnt.autoplay = true ;
        const track = music.playlist[index];
        document.getElementById('title-playing').innerHTML = `${track.title} - ${track.artist}` ; 
        const durElmnt = document.getElementById('dur');

        if (durElmnt) {
            durElmnt.innerHTML = `${Math.floor(track.duration / 60)}:${String(Math.floor(track.duration / 60)).padStart(2, '0')}`; ;
            document.querySelector('.bar-fill').style.width = '0%';
        }
        //remove old event listener
        audioElmnt.removeEventListener('timeupdate', music.updateProgressBar);
        //update the progress bar 
        audioElmnt.addEventListener('timeupdate', () => {music.updateProgressBar()});
    },


    //stream 
    async streamSong(titleElmnt, index){
        // request to /stream endpoint
        let ind ;
        let ID ;
        if (titleElmnt) {
            ind = Number(titleElmnt.querySelector('.index').innerHTML); 
        }else{
            ind = index;
        }
        ID = this.playlist[ind].id ;
        try{
            const response = await fetch(`https://discoveryprovider3.audius.co/v1/tracks/${ID}/stream?app_name=Pomodoro`);
            try {
                const blobObj = await response.blob();
                console.log(blobObj); 
                const audioUrl = URL.createObjectURL(blobObj);
                this.currPlay = ind ;
                this.configSongPlayer(audioUrl , ind);
            }
            catch (error) {
                console.log(error.message);
            }
        }    
        catch(error){
            console.log(error.message);
        }
    },

    pauseTrack(pauseBtn){
        const audioElmnt = document.getElementById('audio');
        const currentTime = audioElmnt.currentTime; 
        audioElmnt.pause();
        let temp = document.createElement('template');
        temp.innerHTML = `<button class="np-btn" id="pause-play" onclick="music.resumeTrack(this);"><img src="icons/play.svg" ></button>`
        pauseBtn.replaceWith(temp.content.firstElementChild);

        // Store the time 
        this.pausedAt = currentTime;
        console.log(`Paused at: ${currentTime} seconds`);
    },


    resumeTrack(playBtn) {
        //unpause a song
        const audioElmnt = document.getElementById('audio');
        if (this.pausedAt) {
            audioElmnt.currentTime = this.pausedAt;
        }
        audioElmnt.play();
        let temp = document.createElement('template');
        temp.innerHTML = ` <button class="np-btn" id="pause-play" onclick="music.pauseTrack(this);">
                                    <img src="icons/pause.svg" ></button>`;
        playBtn.replaceWith(temp.content.firstElementChild)
        this.pausedAt = null;
    },

    playNextTrack(){
        if (this.currPlay < this.playlist.length - 1) {
            this.currPlay++;
            this.streamSong(null,this.currPlay);
        }
    },
    playPrevTrack(){
        if (this.currPlay > 0) {
            this.currPlay--;
            this.streamSong(null,this.currPlay);
        }
    },

    //mute and unmute audio
    toggleVolume(muteBtn){
        const audioELmnt = document.getElementById('audio');
        if (audioELmnt.muted) {
            muteBtn.firstElementChild.src = 'icons/unmute.png';
        }else{
            muteBtn.firstElementChild.src = 'icons/mute.svg';;
        }
        audioELmnt.muted = !audioELmnt.muted ;
    },

    updateProgressBar() {
        const audioElmnt = document.getElementById('audio');
        const barFill = document.querySelector('.bar-fill');
        const startTimeElmnt = document.getElementById('start-time');
        
        if (audioElmnt.duration) {
            // calc progress percentage
            const progress = (audioElmnt.currentTime / audioElmnt.duration) * 100;
            barFill.style.width = `${progress}%`;
            
            //current time display
            startTimeElmnt.innerHTML = `${Math.floor(audioElmnt.currentTime / 60)}:${String(Math.floor(audioElmnt.currentTime % 60)).padStart(2, '0')}`;
        }
    }
}
//helper functions
export const searchSongDebounced = music.debounce(music.debounceInt , music.searchSong);
//extract only used feautres of the result search
export function extract(results){
        let extracted = [];
        let i = 0;
        while (i < results.length) {
            //initialize the extracted list
            if (results[i].id && results[i].title && results[i].is_streamable) {
                extracted.push({
                    id : results[i].id ,
                    title : results[i].title, 
                    artist: results[i].user?.name || "unknown Artist",
                    duration : results[i].duration ,
                    index : i    //index in the results list
                }) 
                i++; 
            }
        }
        return extracted;
    }
export function renederSearchResults(results , resultsListElmnt) {
    //initialize display
    resultsListElmnt.innerHTML = ''; 
    let elemnt ;   
    for (let i = 0; i < results.length; i++){
        elemnt = results[i];
        resultsListElmnt.innerHTML += `<div class="result-item">
                                            <div class="result-text">
                                                <div class="song-name">${elemnt.title}</div>
                                                <div class="artist-name">${elemnt.artist}</div>
                                                <div class="index" hidden>${i}</div>
                                            </div>
                                            <button class="add-rm" onclick="music.addToPlaylist(this);music.render();">+</button>
                                        </div>`;
    } 
}
 