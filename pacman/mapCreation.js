let selectedTile = {}
let lastDraggedPos = { x : -1, y : -1 }
let isDrag = false;
let assetLimit = {
    wall : 115,
    food : 15,
    energy : 3,
    pacman : 1,
    enemy : 4
}
let tileInHand = 'wall'
let dragMode = false;

function mouseClicked(){  
    if(!CREATION_ENABLED) return
    const x = Math.floor(mouseX/40)
    const y = Math.floor(mouseY/40)
    if(x < 0 || x > 19 || y < 0 || y > 19) return
    if(selectedTile[x+","+y]){
        if(isDrag){
            isDrag = false;
            return
        }
        assetLimit[tileInHand] += 1
        updateAssetLimit(assetLimit[tileInHand])
        startLoadingIntoArray(tileInHand, false, x, y)
        delete selectedTile[x+","+y]
        return
    }
    if(assetLimit[tileInHand] == 0) return 
    assetLimit[tileInHand] -= 1
    updateAssetLimit(assetLimit[tileInHand])
    startLoadingIntoArray(tileInHand, true, x, y)
    if(tileInHand == 'enemy'){
        selectedTile[x+","+y] = { tile : tileInHand, id : assetLimit[tileInHand] }
    }else{
        selectedTile[x+","+y] = tileInHand
    }
    isDrag = false;
}   

function mouseDragged(){ 
    if(lastDraggedPos.x == mouseX && lastDraggedPos.y == mouseY || !dragMode) return
    lastDraggedPos = { x : mouseX, y : mouseY }
    isDrag = true
    mouseClicked() 
}

function initFloorTiling(){
    for(let i = 0; i < 20; i++){
        for(let j = 0; j < 20; j++){
            const isTile = selectedTile[j+","+i]
            const enemyTileId = isTile && isTile.tile ? isTile.id : false
            if(isTile){
                image(getTile(isTile.tile ? isTile.tile : isTile, enemyTileId), j * 40, i * 40, 40, 40)
            }else{
                fill(color(0, 0, 255));
                rect(j*40,i*40,40,40);
            }
        }
    }
}

function startLoadingIntoArray(asset, isPush, x, y){
    console.log(asset, isPush, x, y)
    if(asset == 'wall'){
        manualWalls.push(new Wall(x, y))
    }
    else if(asset == 'food'){
        manualFood.push(new Food(x, y))
    }
    else if(asset == 'energy'){
        manualFood.push(new Energy(x, y))
    }
    else if(asser == 'enemy'){
        manualEnemyDefaultLocations.push({ x : x, y : y })
    }else{
        manualPlayerStart = { x : x, y : y }
    }
}

function resetAssetUsage(){
    dragMode = false;
    tileInHand = 'wall'
    selectedTile = {}
    assetLimit = {
        wall : 100,
        food : 15,
        energy : 3,
        pacman : 1,
        enemy : 4
    }
}

function getEnemyById(id){
    switch(id){
        case '0' : return enemy['red']
        case '1' : return enemy['yellow']
        case '2' : return enemy['blue']
        case '3' : return enemy['pink']
    }
}

function getTile(tile, enemyId){
    switch(tile){
        case 'wall' : return wallImg;
        case 'food' : return food;
        case 'energy' : return energy;
        case 'pacman' : return pacman['right']
        case 'enemy' : return getEnemyById(`${enemyId}`)
    }
}