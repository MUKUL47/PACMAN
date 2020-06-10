class Enemy{    
    constructor(id, x, y, ghostPath, asset, myGhostPath, findTimer, spawnLocation, hellTime){
        this.id = id
        this.x = x
        this.y = y
        this.lastPosition = {
            x : x,
            y : y
        }
        this.pathIndex = 1;
        this.ghostPath = ghostPath;
        this.originalAsset = asset;
        this.resetHidePath = false;
        this.myGhostPath = myGhostPath
        this.findTimer = findTimer;
        this.originalTimer = findTimer;
        this.isDead = false;
        this.spawnAgain = false;
        this.spawnLocation = spawnLocation;
        this.hellTime = hellTime
        this.speed = ENEMY_SPEED
    }

    setIncrement(x, y){
        this.x += x;
        this.y += y;
    }
    getX(){ return this.x }
    getY(){ return this.y }

    render(){
        image(!this.isDead ? this.originalAsset : this.spawnAgain ? enemy.deadMode : enemy.dead, this.x * 40, this.y * 40, 40, 40) 
        this.move()
    }

    resetMap(){
        Object.keys(this.myGhostPath).map( key => nodes[key].indexFromSource = -1)
    }

    move(){
        const dest = this.ghostPath[this.pathIndex];
        this.lastPosition = 
        {
            x : Math.round(this.x),
            y : Math.round(this.y)
        }
        const X = Number(this.x).toFixed(1)
        const Y = Number(this.y).toFixed(1)
        this.resetHidePath = this.isDead && (!this.ghostPath[this.pathIndex]) ? false : this.resetHidePath;
        if(dest){
            if(dest.y < Y){ this.setIncrement(0, -this.speed)  }
            if(dest.y > Y){ this.setIncrement(0, this.speed)   }
            if(dest.x > X){ this.setIncrement(this.speed, 0)   }
            if(dest.x < X){ this.setIncrement(-this.speed, 0)  } 
            if(X == dest.x && Y == dest.y){
                this.pathIndex +=1;    
                this.findTimer -=0.8;  
            }
        }else{
            if(this.spawnAgain){ 
                this.spawnAgain = false;
                this.isDead = false;
                this.speed = ENEMY_SPEED    
             }
            this.findTimer = -1
        }
    }

    reset(){
        this.pathIndex = 1;
    }

    proceedToTarget(){
        let playerPost;
        if(!this.isDead){
            playerPost = player.lastPosition;
        }else{
            if(!this.resetHidePath){
                playerPost = this.calcRandSafeSpot();
                this.resetHidePath = playerPost;
            }else{
                playerPost = this.resetHidePath;
            }
        }
        if(nodes[playerPost.x+","+playerPost.y]){
            if(this.findTimer <= 0){
                this.pathIndex = 1
                this.findTimer = this.originalTimer
                this.resetMap()
                this.ghostPath = PathFinder.BFS(playerPost, this.lastPosition, this.myGhostPath).reverse();
            }
        }
    }

    calcRandSafeSpot(){
        if(this.spawnAgain) return this.spawnLocation
        while(true){
            let x = GET_RAND(0, GLOBAL_BOUNDS)
            let y = GET_RAND(0, GLOBAL_BOUNDS)
            if(nodes[x+","+y]) return { x : x, y : y }
        }
    }

    resetSpawn(){
        /**
        * 1)if comes in contact with player during deadMode
        * 1.1)set ENEMY_HELL_TIME -infinity
        * 1.2)Assign specific spawn location for that ghost & set spawnAgain true
        * 1.3)check if spawnAgain is true & ghost is on that specific spawnLocation
        * 1.4)set spawnAgain, isDead = false
        */
        if(this.spawnAgain) return
        this.spawnAgain = true;
        this.hellTime = Infinity
        this.resetHidePath = false; 
        this.findTimer = 0      
        this.speed = 0.06 
    }

    removeSpawn(){
        this.spawnAgain = false;
        this.hellTime = this.spawnAgain
    }


}