
let canvasDimension = false;

(function(){
    if(!isElectron) return
    const { ipcRenderer } = require('electron');
    ipcRenderer.once('gotScreenSize', (e, screen) => {
        if(screen.height <= 800){
            $('#defaultCanvas0').ready(e => {
                setTimeout(_ => {
                    canvasDimension = screen.height - 175
                    resizeCurrentCanvas()
                },50)
            })
        }
    })
    ipcRenderer.send('getScreenSize');
}())

function resizeCurrentCanvas(){
    if(!canvasDimension) return
     $('#defaultCanvas0').css('height', canvasDimension)
     $('#defaultCanvas0').css('width', canvasDimension)
}
