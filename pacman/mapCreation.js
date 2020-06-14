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
        delete selectedTile[x+","+y]
        return
    }
    if(assetLimit[tileInHand] == 0) return 
    assetLimit[tileInHand] -= 1
    if(tileInHand == 'enemy'){
        selectedTile[x+","+y] = { tile : tileInHand, id : assetLimit[tileInHand] }
    }else{
        selectedTile[x+","+y] = tileInHand
    }
    isDrag = false;
}   

function mouseDragged(){ 
    if(lastDraggedPos.x == mouseX && lastDraggedPos.y == mouseY) return
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
                rect(j*40,i*40,40,40);
            }
        }
    }
}

function resetAssetUsage(){
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