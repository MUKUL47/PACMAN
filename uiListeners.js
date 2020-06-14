const creationBtns = ['food', 'energy', 'enemy', 'wall', 'pacman']
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
    $('.pause-btn').hide()
    $('.restart-btn').hide()
    removeAndAddAssetClass('wall')
    resetAssetUsage()
    $('.assets-btns').show()
    $('.start-screen').hide(); 
    setup()
    loop() 
    setTimeout(_ => {
        CREATION_ENABLED = true
        disableDragMode()
        creationBtns.forEach(b => $(`.${b}`).text($(`.${b}`).text().split(' ')[0].trim()+ " ("+assetLimit[b]+")"));
    }, 50)
}

function selectMapAsset(asset){
    if(asset == 'reset') {
        if(confirm('Are you sure ?')){
            disableDragMode()
            resetAssetUsage()
            removeAndAddAssetClass('wall')
            creationBtns.forEach(b => $(`.${b}`).text($(`.${b}`).text().split(' ')[0].trim()+ " ("+assetLimit[b]+")"));
            return
        }
        return
    }
    removeAndAddAssetClass(asset)
    tileInHand = asset
}

function removeAndAddAssetClass(currentAsset){
    creationBtns.forEach(b => $("."+b).removeClass('asset-selected'));
    $('.'+currentAsset).addClass('asset-selected')
}

function updateAssetLimit(){
    $(`.${tileInHand}`).text($(`.${tileInHand}`).text().split(' ')[0].trim()+ " ("+assetLimit[tileInHand]+")")
}

function disableDragMode(){
    dragMode = false;
    const val = $('.dragMode')
    val.text('Enable Drag Mode')
    val.removeClass('brown-bg')
}

function toggleDragMode(){
    const val = $('.dragMode')
    if( val.text().split(' ')[0].trim().toLowerCase() == 'enable'){
        dragMode = true;
        val.text('Disable Drag Mode')
        $('.dragMode').addClass('brown-bg')
        return
    }
    disableDragMode()
}