function preload() {
  //load all required assets
  walkable = loadImage("assets/walkable.png");
  wallImg = loadImage("assets/wall1.png");
  pacman["right"] = loadImage("assets/pacman_right.jpg");
  pacman["left"] = loadImage("assets/pacman_left.jpg");
  pacman["down"] = loadImage("assets/pacman_down.jpg");
  pacman["up"] = loadImage("assets/pacman_up.jpg");
  food = loadImage("assets/pacman_food.png");
  energy = loadImage("assets/pacman_energy.webp");

  enemy.red = loadImage("assets/redEnemyy.jpg");
  enemy.yellow = loadImage("assets/yellowEnemy.jpg");
  enemy.blue = loadImage("assets/blueEnemy.jpg");
  enemy.pink = loadImage("assets/pinkEnemy.jpg");
  enemyStripes = [enemy.red, enemy.yellow, enemy.blue, enemy.pink];
  enemy.dead = loadImage("assets/dead_pacman.png");
  enemy.deadMode = loadImage("assets/ghostDead.jpg");
  PLAYER_START = { x: 10, y: 15 };
  DEFAULT_LOCATIONS = [
    { x: 0, y: 0 },
    { x: 0, y: 19 },
    { x: 19, y: 0 },
    { x: 19, y: 19 },
  ];
}

function resetGame() {
  wallImg, walkable, (foodItems = {});
  pacman = {};
  enemy = {};
  energyBar = {};
  totalFoodItems = 0;
  $("#score").text("Score : 0");
  preload();
  FRAME_RATE = 60;
  setup();
  loop();
  setTimeout((_) => noLoop(), 100);
}

function setup() {
  noLoop(); //game will be paused during main menu setup will be re-triggering once player hits PLAY
  frameRate(FRAME_RATE);
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  resizeCurrentCanvas()
  initInstance();
  init();
  renderer();
}
function initInstance() {
  walls = new Array();
  walkablePath = new Array();
  foodItems = new Array();
  nodes = new Array();
  playground = new Playground(PLAYGROUND_COORD.x, PLAYGROUND_COORD.y);
  player = new Player(PLAYER_START.x, PLAYER_START.y);
}

function renderer() {
  playground.render([
    { nodes: Object.values(walls), asset: wallImg },
    { nodes: Object.values(foodItems), asset: food },
    { nodes: Object.values(energyBar), asset: energy },
    // {nodes : Object.values(ghosts[0].ghostPath), asset : energy}
  ]);
  player.render();
}

function draw() {
  background(0);
  if (CREATION_ENABLED) {
    initFloorTiling();
    return;
  }
  renderer();
  player.movement(keyPressed());
  ghostsManagement();
}

function ghostsManagement() {
  ghosts.forEach((ghost) => {
    ghost.render();
    ghost.proceedToTarget();
    contactWithPlayer(ghost);
    if (
      ghost.isDead &&
      ((new Date() - ghost.isDead) / 1000).toFixed() >= ghost.hellTime
    ) {
      ghost.isDead = false;
    }
  });
}

function contactWithPlayer(ghost) {
  if (
    Math.abs(ghost.x - player.x) <= 0.4 &&
    Math.abs(ghost.y - player.y) <= 0.4
  ) {
    if (ghost.isDead) {
      ghost.resetSpawn();
      return;
    }
    noLoop();
    if (IS_CREATION_DATA && !loadSaveCreation) {
      toggleTestMap();
      return;
    }
    $(".gameover-screen").show();
  }
}

function init() {
  if (IS_CREATION_DATA) {
    console.log('creation')
    overwriteDefaultConfig(false);
    player = new Player(PLAYER_START.x, PLAYER_START.y);
  } else {
    for (let i = 0; i < NODES.x; i++) {
      for (let j = 0; j < NODES.y; j++) {
        nodes[j + "," + i] = new Node(j, i);
        if (
          GET_RAND(3, 0) == 2 &&
          ENEMY_X.indexOf(j) == -1 &&
          ENEMY_Y.indexOf(i) == -1 &&
          PLAYER_START.x != j &&
          PLAYER_START.y != i
        ) {
          delete nodes[j + "," + i];
          walls.push(new Wall(j, i));
        } else if (GET_RAND(25, 0) == 0) {
          foodItems[j + "," + i] = new Food(j, i);
        } else if (GET_RAND(75, 0) == 0) {
          energyBar[j + "," + i] = new Energy(j, i);
        }
      }
    }
  }

  PathFinder.mapToNodes();
  let ghostRoute = [];
  DEFAULT_LOCATIONS.forEach((location) => {
    const clonedNode = {};
    Object.assign(clonedNode, nodes);
    ghostRoute.push({
      clonedNode: clonedNode,
      path: PathFinder.BFS(player.lastPosition, location, clonedNode).reverse(),
    });
    resetIndex();
  });
  ghosts = DEFAULT_LOCATIONS.map(
    (location, i) =>
      new Enemy(
        i,
        location.x,
        location.y,
        ghostRoute[i]["path"],
        enemyStripes[i],
        ghostRoute[i]["clonedNode"],
        ghostDifficulty[i],
        location,
        ENEMY_HELL_TIME
      )
  );
}

function resetIndex() {
  Object.keys(nodes).map((key) => (nodes[key].indexFromSource = -1));
}

function keyPressed() {
  switch (keyCode) {
    case RIGHT_ARROW:
      return "right";
    case LEFT_ARROW:
      return "left";
    case UP_ARROW:
      return "up";
    case DOWN_ARROW:
      return "down";
    default:
      return "right";
  }
}
