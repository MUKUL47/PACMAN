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
let pacmanData;
function mouseClicked(){  
    if(!CREATION_ENABLED || !FREE_HAND) return
    const x = Math.floor(mouseX/40)
    const y = Math.floor(mouseY/40)
    if(x < 0 || x > 19 || y < 0 || y > 19) return
    if(selectedTile[x+","+y]){
        if(isDrag){
            isDrag = false;
            return
        }
        if(selectedTile[x+","+y].tile != tileInHand){
            return //later replace asset
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
    selectedTile[x+","+y] = { tile : tileInHand, id : assetLimit[tileInHand], pos : x+","+y }
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
                image(getTile(isTile.tile, enemyTileId), j * 40, i * 40, 40, 40)
            }else{
                fill(color(0, 0, 255));
                rect(j*40,i*40,40,40);
            }
        }
    }
}

function startLoadingIntoArray(asset, isPush, x, y){
    if(asset == 'wall'){
        if(!isPush){ 
            const index = getObjectIndex(manualWalls, x, y)
            if(index < 0) return
            manualWalls.splice(index, 1)
            return
        }
        manualWalls.push(new Wall(x, y))
    }
    else if(asset == 'food'){
        if(!isPush){ delete manualFood[x+','+y]; return }
        manualFood[x+','+y] = new Food(x, y)
    }
    else if(asset == 'energy'){
        if(!isPush){ delete manualEnergy[x+','+y]; return }
        manualEnergy[x+','+y] = new Energy(x, y)
    }
    else if(asset == 'enemy'){
        if(!isPush){ 
            const index = getObjectIndex(manualEnemyDefaultLocations, x, y)
            if(index < 0) return
            manualEnemyDefaultLocations.splice(index, 1)
            return
        }
        manualEnemyDefaultLocations.push({ x : x, y : y })
    }else{
        if(!isPush) { manualPlayerStart = {}; return }
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
    resetCustomAsset()
    CREATION_ENABLED = true;
    IS_CREATION_DATA = false;
}

function resetCustomAsset(){
    manualWalls = new Array() 
    manualFood = {}
    manualEnergy = {}
    manualEnemyDefaultLocations = new Array() 
    manualPlayerStart = {}
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

function validateCustomMap(){
    if(!manualPlayerStart['x']) return { isValid : false, message : 'Pacman is missing' }
    const source = {}
    Object.assign(source, manualPlayerStart)
    const targets = [...Object.values(manualEnergy), ...Object.values(manualFood), ...manualEnemyDefaultLocations].filter(m => m.x != undefined)
    let targetDestinations = []
    targets.forEach(target => {
        const obj = {}
        Object.assign(obj, target)
        targetDestinations.push(`${obj.x},${obj.y}`)
    })
    const nodes = filterNodesWithWalls()
    PathFinder.mapToNodes()
    return PathFinder.validateMap(source, targetDestinations, nodes)
}

function overwriteDefaultConfig(encode){
    filterNodesWithWalls()
    walls = manualWalls
    energyBar = manualEnergy
    foodItems = manualFood
    DEFAULT_LOCATIONS = manualEnemyDefaultLocations
    PLAYER_START = manualPlayerStart
    if(encode){
        return encodePacmanConfig(
            {   walls : walls, 
                energyBar : energyBar, 
                foodItems : foodItems, 
                DEFAULT_LOCATIONS : DEFAULT_LOCATIONS, 
                PLAYER_START : PLAYER_START 
            })
    }
}

function encodePacmanConfig(pacmanData){
    return JSON.stringify(pacmanData).split('').map(c => c.charCodeAt(0))
}

function renderConfig(rawData){
    const config = decodePacmanConfig(rawData);
    if(!config) {
        alert('Invalid config file')
        return
    }
    loadCreationCenter()     
    config.walls.forEach(wall => uploadCustom('wall', wall.x, wall.y))
    Object.values(config.foodItems).forEach(food => uploadCustom('food', food.x, food.y))
    Object.values(config.energyBar).forEach(energy => uploadCustom('energy', energy.x, energy.y))
    Object.values(config.DEFAULT_LOCATIONS).forEach(enemy => uploadCustom('enemy', enemy.x, enemy.y))
    if(config.PLAYER_START.x) uploadCustom('pacman', config.PLAYER_START.x, config.PLAYER_START.y)
    function uploadCustom(tile, x, y){
        tileInHand = tile;
        assetLimit[tile] -= 1
        updateAssetLimit(assetLimit[tile])
        startLoadingIntoArray(tile, true, x, y)
        selectedTile[x+","+y] = { tile : tile, id : assetLimit[tile], pos : x+","+y }
    }
    tileInHand = 'wall'
}



function decodePacmanConfig(encodedConfig){
   try{
        return JSON.parse(encodedConfig.split(',').map(c => String.fromCharCode(c)).join(''))
   }catch(e){
        return false
   }
}

function filterNodesWithWalls(){
    nodes = {};
    // walls = [], energyBar = {}, foodItems = {}, DEFAULT_LOCATIONS = {}, PLAYER_START = {}
    for(let i = 0; i < NODES.x; i++){
        for(let j = 0; j < NODES.y; j++){
                if(getObjectIndex(manualWalls, i, j) < 0){
                    nodes[i+","+j] = new Node(i, j)
                }
        }   
    }
    return nodes
}