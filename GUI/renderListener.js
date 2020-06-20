
let screenDimension = false;

(function(){
    if(!isElectron) return
    const { ipcRenderer } = require('electron');
    ipcRenderer.once('gotScreenSize', (e, screen) => {
        if(screen.height <= 800){
            $('#defaultCanvas0').ready(e => {
                setTimeout(_ => {
                    screenDimension = screen.height - 175
                    resizeCurrentCanvas()
                },50)
            })
        }
    })
    ipcRenderer.send('getScreenSize');
}())

function resizeCurrentCanvas(){
    if(!screenDimension) return
     $('#defaultCanvas0').css('height', screenDimension)
     $('#defaultCanvas0').css('width', screenDimension)
}
