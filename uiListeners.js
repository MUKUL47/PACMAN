const onStart = () => { 
    CREATION_ENABLED = false
    $('#paused-msg').hide()
    $('.start-screen').hide(); 
    $('.gameover-screen').hide()
    $('.pause-btn').text('Pause')
    resetGame()
    loadGame()
}

loadGame = () => {
    let start = 3;
    $('.load-screen').show();
    (function loadCounter(){
        $('#load-msg').text(`Starting in ${start}${Array(start).fill('.').map(i => i).join('')}`)
        if(start === 0) {
            $('.load-screen').hide();
            loop()
            return
        }
        setTimeout(_ => {
            noLoop()
            start -= 1
            loadCounter()
        }, 1000)
    }())
}

function mainMenu(){
    $('.assets-btns').hide()
    $('.gameover-screen').hide()
    $('#paused-msg').hide()
    $('.start-screen').show()
    resetGame()
}

function pause(){
    if( $('.pause-btn').text().trim().toLowerCase() == 'pause'){
        noLoop()
        $('#paused-msg').show()
        $('.pause-btn').text('Continue')
        return
    }
    $('#paused-msg').hide()
    $('.pause-btn').text('Pause')
    loop()
}

function updateFinalScore(score, lastedFor){
    $('#score').text(score)
    $('#lastedFor').text(lastedFor)
}


function loadCreationCenter(){
    resetAssetUsage()
    $('.assets-btns').show()
    $('.start-screen').hide(); 
    setup()
    loop(0) 
    setTimeout(_ => CREATION_ENABLED = true, 50)
}

function selectMapAsset(asset){
    tileInHand = asset
}