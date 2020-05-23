var walkablePath
var playground
var player
var ghosts = []
var walls, food, nodes = {}, energy;
let wallImg, walkable, foodItems = {}; pacman = {};; enemy = {}; energyBar = {}; 
let ghostPath, ghost

let ALL_PATH = {}

//_________GLOBAL CONST_________________
const GLOBAL_BOUNDS = 20
const CANVAS_SIZE = 800
const STRIPE_SIZE = 40
const FRAME_RATE = Infinity
const GET_RAND = (min, max) => Math.floor((Math.random() * (max- min) + min))
const ENEMY_X = [0, 19]
const ENEMY_Y = [0, 19]
const NODES = { x : 20, y : 20 }
//__________________________________

//_________PLAYER CONST_________________
const PLAYER_START = {x : 10, y : 15}
const PLAYGROUND_COORD = { x : 20, y : 20 }
//__________________________________


//___________ENEMY CONST_____________
let ENEMY_SPEED = 0.03
let ENEMY_DEAD = false;
let ENEMY_HELL_TIME = 15
const ENEMY_DIR = ['right', 'left', 'down', 'up']
//__________________________________

//________MISC______________
let totalFoodItems = 0;
//

function preload() {
    walkable        = loadImage('assets/walkable.png')
    wallImg         = loadImage('assets/wall1.png')
    pacman['right'] = loadImage('assets/pacman_right.jpg')
    pacman['left']  = loadImage('assets/pacman_left.jpg')
    pacman['down']  = loadImage('assets/pacman_down.jpg')
    pacman['up']    = loadImage('assets/pacman_up.jpg')
    food            = loadImage('assets/pacman_food.png')
    energy          = loadImage('assets/pacman_energy.webp')
    enemy.red       = loadImage('assets/redEnemyy.jpg')
    enemy.yellow    = loadImage('assets/yellowEnemy.jpg')
    enemy.blue    = loadImage('assets/blueEnemy.jpg')
    enemy.pink    = loadImage('assets/pinkEnemy.jpg')
    enemy.dead      = loadImage('assets/dead_pacman.png')
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
    playground      = new Playground(PLAYGROUND_COORD.x, PLAYGROUND_COORD.y)
    player          = new Player(PLAYER_START.x, PLAYER_START.y)
}

function renderer(){
    playground.render(
        [{nodes : Object.values(walls), asset : wallImg},
        {nodes : Object.values(foodItems), asset : food},
        {nodes : Object.values(energyBar), asset : energy},
        // {nodes : Object.values(ghosts[0].ghostPath), asset : energy}
    ])
    player.render()
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
        contactWithPlayer(ghost)
    })
    if(ENEMY_DEAD && (((new Date() - ENEMY_DEAD)/1000).toFixed() >= ENEMY_HELL_TIME)){
        ENEMY_DEAD = false;
    }
}

function contactWithPlayer(ghost){
        if(Math.abs(ghost.x - player.x) <= 0.4 && Math.abs(ghost.y - player.y) <= 0.4){
            if(ENEMY_DEAD){
                alert(`ghost(${ghost.originalTimer}) dead`)
            }else{
                alert(`Player died`)
            }
            noLoop()
        }
    }


function init(){
    for(let i = 0; i < NODES.x; i++){
        for(let j = 0; j < NODES.y; j++){
                nodes[j+","+i] = new Node(j, i)
                if(GET_RAND(3,0) == 2 && 
                ENEMY_X.indexOf(j) == -1 && 
                ENEMY_Y.indexOf(i) == -1 &&
                PLAYER_START.x != j && 
                PLAYER_START.y != i
                ){
                        delete nodes[j+","+i]
                        walls.push(new Wall(j, i))
                }
                else
                 if(Math.floor(Math.random() * (25 - 0) + 0) == 0){
                    foodItems[j+','+i] = new Food(j, i)
                }
                else if(Math.floor(Math.random() * (50 - 0) + 0) == 0){
                    energyBar[j+','+i] = new Energy(j, i)
                }
        }   
    }
    PathFinder.mapToNodes()
    const originalNode = [];
    const originalNode1 = [];
    const originalNode2 = [];
    const originalNode3 = [];
    Object.assign(originalNode, nodes)
    Object.assign(originalNode1, nodes)
    Object.assign(originalNode2, nodes)
    Object.assign(originalNode3, nodes)
    let a = PathFinder.BFS(player.lastPosition, { x : 0, y : 0 }, originalNode).reverse();
    resetIndex();
    let b = PathFinder.BFS(player.lastPosition, { x : 19, y : 19 }, originalNode1).reverse()
    resetIndex();
    let c = PathFinder.BFS(player.lastPosition, { x : 0, y : 19 }, originalNode2).reverse()
    resetIndex();
    let d = PathFinder.BFS(player.lastPosition, { x : 19, y : 0 }, originalNode3).reverse()
    ghosts = [
        new Enemy(0, 0,     a,      enemy.red ,     originalNode,   20),
        new Enemy(19, 19,   b,      enemy.yellow,   originalNode1,  10 ),
        new Enemy(0, 19,    c,      enemy.blue,      originalNode2,  5 ),
        new Enemy(19, 0,    d,      enemy.pink,      originalNode3,   2.5 )
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