XHR = new XMLHttpRequest();
XHR.open('GET',"https://discoveryprovider3.audius.co");
XHR.addEventListener('onload',()=>{
    console.log(XHR.response);
})
XHR.send();