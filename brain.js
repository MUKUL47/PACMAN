var walkablePath
var playground
var player
var ghosts = []
var walls, food, nodes = {}
let wallImg, walkable, foodItems = {}; pacman = {};; enemy = {} 
let ghostPath, ghost

let ALL_PATH = {}

//_________GLOBAL CONST_________________
const GLOBAL_BOUNDS = 20
const CANVAS_SIZE = 800
const STRIPE_SIZE = 40
const FRAME_RATE = Infinity
//__________________________________

//_________PLAYER CONST_________________
let PLAYER_START = {}
PLAYER_START.x =  10
PLAYER_START.y =  10
//__________________________________


//___________ENEMY CONST_____________
let ENEMY_SPEED = 0.025
//__________________________________

function preload() {
    walkable = loadImage('assets/walkable.png')
    wallImg = loadImage('assets/wall1.png')
    pacman['right'] = loadImage('assets/pacman_right.jpg')
    pacman['left'] = loadImage('assets/pacman_left.jpg')
    pacman['down'] = loadImage('assets/pacman_down.jpg')
    pacman['up'] = loadImage('assets/pacman_up.jpg')
    food = loadImage('assets/food.png')
    enemy.red = loadImage('assets/enemy_red.jpg')
}

function setup(){
    frameRate(FRAME_RATE)
    createCanvas(CANVAS_SIZE, CANVAS_SIZE)
    initInstance()
    init()
    renderer()
}

function initInstance(){
    walls           = new Array()
    walkablePath    = new Array()
    foodItems       = new Array()
    nodes           = new Array()
    playground      = new Playground(20,20)
    player          = new Player(10, 15)
}

function renderer(){
    playground.render([{nodes : walls, asset : wallImg},{nodes : Object.values(foodItems), asset : food}])
    
    player.render()
    // 
}

function draw(){
    background(0)
    renderer()
    player.movement(keyPressed())
    ghostsManagement()
}

function ghostsManagement(){
    ghosts.forEach( ghost => {
        ghost.render()
        ghost.proceedToTarget()
    })
}

function init(){
    for(let i = 0; i < 20; i++){
        for(let j = 0; j < 20; j++){
                nodes[j+","+i] = new Node(j, i)
                if(Math.floor((Math.random() * (3- 0) + 0)) == 2  && j != 0 && i != 0){
                    delete nodes[j+","+i]
                    walls.push(new Wall(j, i))
                }
                else
                 if(Math.floor(Math.random() * (100 - 0) + 0) == 0){
                    foodItems[j+','+i] = new Food(j, i)
                }
        }   
    }
    PathFinder.mapToNodes()
    let a = PathFinder.BFS(player.lastPosition, { x : 0, y : 0 }).reverse();
    // resetIndex();
    // let b = PathFinder.BFS(player.lastPosition, { x : 19, y : 19 }).reverse()
    // resetIndex();
    // let c = PathFinder.BFS(player.lastPosition, { x : 0, y : 19 }).reverse()
    // resetIndex();
    // let d = PathFinder.BFS(player.lastPosition, { x : 19, y : 0 }).reverse()
    ghosts = [
        new Enemy(0, 0, a ),
        // new Enemy(19, 19,  b),
        // new Enemy(0, 19, c),
        // new Enemy(19, 0,  d)
    ]
}

function resetIndex(){
    Object.keys(nodes).map( key => nodes[key].indexFromSource = -1)
}

function keyPressed(){
    switch(keyCode){
        case RIGHT_ARROW: return 'right'        
        case LEFT_ARROW: return 'left'
        case UP_ARROW: return 'up'
        case DOWN_ARROW: return 'down'
        default : return 'right'
    }
}