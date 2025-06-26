export const music = {
    playlist : [],
    resultsList : [],
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
                music.resultsList = extract(songObj.data); 
                console.log(music.resultsList);    
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

    //stream 
    async streamSong(titleElmnt){
        // request to /stream endpoint
        const ind = Number(titleElmnt.querySelector('.index').innerHTML);
        console.log(`index ${ind}`);
        const ID = this.playlist[ind].id ;
        console.log(`id: ${ID}`);
        try{
            const response = await fetch(`https://discoveryprovider3.audius.co/v1/tracks/${ID}/stream?app_name=Pomodoro`);
            console.log(response);

        }
        catch(error){
            console.log('error sending request');
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
 