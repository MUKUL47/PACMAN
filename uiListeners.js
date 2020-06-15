const creationBtns = ['food', 'energy', 'enemy', 'wall', 'pacman']
const onStart = () => { 
    IS_CREATION_DATA = false;
    CREATION_ENABLED = false
    $('.pause-btn').show()
    $('.restart-btn').show()
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
    $('.gameover-screen').hide()
    $('#paused-msg').hide()
    $('.start-screen').show()
    hideAssetBtns()
    resetGame()
}

function hideAssetBtns(){
    // [...creationBtns, 'dragMode', 'reset'].forEach(i => $(`.${i}`).show())
    $('.assets-btns').hide()
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
    $('#score').text('')
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
    }, 50);
    //
    ['dragMode', 'reset', ...creationBtns].forEach(i => $(`.${i}`).show())
    $('.testMode').text('Test Mode')    
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

function toggleTestMap(){
    const toggleMap = $('.testMode')
    const isEditMode = toggleMap.text().trim().toLowerCase() == 'map mode'
    toggleMap.text(isEditMode ? 'Test Mode' : 'Map Mode');
    ['dragMode', 'reset', ...creationBtns].forEach(i => $(`.${i}`)[isEditMode ? 'show' : 'hide']())
    CREATION_ENABLED = isEditMode ? true : false
    IS_CREATION_DATA = true;
    setup()
    loop()
    frameRate(60)
}

function downloadConfig(){
    overwriteDefaultConfig()
    console.log(pacmanData)
    var dataStr = "data:text;charset=utf-8," + encodeURIComponent(JSON.stringify(pacmanData));
    var dlAnchorElem = $('#downloadLink');
    dlAnchorElem.attr("href", dataStr);
    dlAnchorElem.attr("download", "pacmanconfig");
    dlAnchorElem.click();
}