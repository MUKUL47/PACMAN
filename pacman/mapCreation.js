let selectedTile = {}
let tileInHand = 'wall'

function mouseClicked(){  
    const x = Math.floor(mouseX/40)
    const y = Math.floor(mouseY/40)
    if(selectedTile[x+","+y]){
        delete selectedTile[x+","+y]
        return
    }
    selectedTile[x+","+y] = tileInHand
}   

function initFloorTiling(){
    for(let i = 0; i < 20; i++){
        for(let j = 0; j < 20; j++){
            const isTile = selectedTile[j+","+i]
            if(isTile){
                image(getTile(isTile), j * 40, i * 40, 40, 40)
            }else{
                rect(j*40,i*40,40,40);
            }
        }
    }
}

function getTile(tile){
    switch(tile){
        case 'wall' : return wallImg;
        case 'food' : return food;
        case 'energy' : return energy;
    }
}