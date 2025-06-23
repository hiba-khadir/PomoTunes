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
        console.log(searchQuery);

        try{
            //fetch song from audius api
            let songResp = await fetch(
                `https://discoveryprovider.audius.co/v1/tracks/search?query=${searchQuery}&app_name=Pomodoro`,
                {
                    method: 'GET',
                    headers: this.headers
                }
            );
            console.log('try');
            console.log(songResp);
            try{
                const songObj = await songResp.json();
                console.log(songObj);  
            }catch{
                console.log('error parsing')
            }
              
        }catch{
            console.log('error');
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
    debounceInt : 1000 ,
    
}
export const searchSongDebounced = music.debounce(music.debounceInt , music.searchSong);
