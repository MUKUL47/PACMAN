
const { ipcRenderer } = require('electron');
ipcRenderer.once('gotScreenSize', (e, screen) => {
    if(screen.height <= 800){
        $('#defaultCanvas0').ready(e => {
            setTimeout(_ => {
                $('#defaultCanvas0').css('height', screen.height - 150)
                $('#defaultCanvas0').css('width', screen.height - 150)
            },50)
        })
    }
})
ipcRenderer.send('getScreenSize');