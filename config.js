//walls = 100, food = 15, energy = 5
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
let FRAME_RATE = Infinity
const GET_RAND = (min, max) => Math.floor((Math.random() * (max- min) + min))
const getObjectIndex = (array, x, y) => {
    const index = array.map((arr, i) => { if(arr.x == x && arr.y == y) return i }).filter(i => i >= 0)[0]
    return index > -1 ? index : -1
}
const ENEMY_X = [0, 19]
const ENEMY_Y = [0, 19]
const NODES = { x : 20, y : 20 }
//__________________________________

//_________PLAYER CONST_________________
let PLAYER_START = {x : 10, y : 15}
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
//__________________________

//_______SPAWN_LOCATION_______
let DEFAULT_LOCATIONS = 
    [{ x : 0,   y : 0   }, 
     { x : 0,   y : 19  }, 
     { x : 19,  y : 0   }, 
     { x : 19,  y : 19  }]
const ghostDifficulty = [20, 10, 5, 2.5]
let enemyStripes = []
//_____________________________________________________________________________________________________________________________________________________________
//creation
let CREATION_ENABLED = false
let FREE_HAND = false;
let manualWalls = {} 
let manualFood = {}
let manualEnergy = {}
let manualEnemyDefaultLocations = []
let manualPlayerStart = {}
let IS_CREATION_DATA = false;
///////////////

