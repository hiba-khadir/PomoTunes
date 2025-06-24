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
    debounceInt : 1000 ,
    
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
                    artist: results[i].user?.name || "Unknown Artist"
                })   
            }
        }
        return extracted;
    }