export const music = {
    playlist : [],
    currPlay : null,

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
                let resultList = extract(songObj.data); 
                console.log(resultList);    
                //display the search results DOM
                resultsElmnt.style.display = 'flex';
                renederSearchResults(resultList , resultsElmnt);  
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
    debounceInt : 200 ,

    //playlist methods
    addToPlaylist(addBtnElmnt){
        const resultElmnt = addBtnElmnt.closest('.result-item');
        if (resultElmnt) {
           let temp = {
                id : resultElmnt.querySelector('.identifier').innerHTML ,
                title : resultElmnt.querySelector('.song-name').innerHTML ,
                artist : resultElmnt.querySelector('.artist-name').innerHTML 
            }
            this.playlist.push(temp);
            console.log(this.playlist);
        }else{
            console.log('song is null')
        } 
    },

    removeFromPlaylist(rmvBtnElmnt){
        const songElmnt = rmvBtnElmnt.closest('.title');
        if (songElmnt) {
           let temp = {
                id : songElmnt.querySelector('.identifier').innerHTML ,
                title : songElmnt.querySelector('.song-name').innerHTML ,
                artist : songElmnt.querySelector('.artist-name').innerHTML 
            }
            this.playlist.splice(this.playlist.indexOf(temp),1)
            console.log(this.playlist);
        }else{
            console.log('song is null')
        } 
    },

    render(){
        let  playlistElmnt = document.getElementById('Playlist');
        playlistElmnt.innerHTML = '';
        for (let i = 0; i < this.playlist.length; i++) {
            const element = this.playlist[i];
            playlistElmnt.innerHTML += `<div class="title">
                                            <button class="but"><img src="icons/play.svg" class="play-song-icn"></button>
                                            <div class="result-text">
                                                <div class="song-name">${element.title}</div>
                                                <div class="artist-name">${element.artist}</div>
                                                <div class="identifier" hidden>${element.id}</div>
                                            </div>
                                            <button class="add-rm" onclick="music.removeFromPlaylist(this);music.render();">-</button>
                                        </div>
                                        <div class="sep"></div>`
                                    
        }
    },
}


//helper functions
export const searchSongDebounced = music.debounce(music.debounceInt , music.searchSong);
//extract only used feautres of the result search
export function extract(results){
        let extracted = [];
        for (let i = 0; i < results.length; i++) {
            //initialize the extracted list
            if (results[i].id && results[i].title) {
                extracted.push({
                    id : results[i].id ,
                    title : results[i].title, 
                    artist: results[i].user?.name || "unknown Artist"
                })   
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
                                                <div class="identifier" hidden>${elemnt.id}</div>
                                            </div>
                                            <button class="add-rm" onclick="music.addToPlaylist(this);music.render();">+</button>
                                        </div>`;
    } 
}