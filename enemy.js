class Enemy{    
    constructor(x, y, ghostPath, asset, myGhostPath, findTimer){
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
    }

    setIncrement(x, y){
        this.x = this.x + x;
        this.y += y;
        this.newMove = true;
    }
    getX(){ return this.x }
    getY(){ return this.y }

    render(){
        image(!ENEMY_DEAD ? this.originalAsset : enemy.dead, this.x * 40, this.y * 40, 40, 40) 
        // !ENEMY_DEAD ? this.move() : false
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
        this.resetHidePath = ENEMY_DEAD && (!this.ghostPath[this.pathIndex]) ? false : this.resetHidePath;
        if(dest){
            if(dest.y < Y){ this.setIncrement(0, -ENEMY_SPEED)  }
            if(dest.y > Y){ this.setIncrement(0, ENEMY_SPEED)   }
            if(dest.x > X){ this.setIncrement(ENEMY_SPEED, 0)   }
            if(dest.x < X){ this.setIncrement(-ENEMY_SPEED, 0)  } 
            if(X == dest.x && Y == dest.y){
                this.pathIndex +=1;    
                this.findTimer -=0.8;  
            }
        }else{
            this.findTimer = -1
        }
    }

    reset(){
        this.pathIndex = 1;
    }

    proceedToTarget(isTar){
        // console.log(nodes[this.calcRandSafeSpot().x+","+this.calcRandSafeSpot().y])
        let playerPost;
        if(!ENEMY_DEAD){
            playerPost = player.lastPosition;
        }else{
            if(!this.resetHidePath){
                playerPost = this.calcRandSafeSpot();
                this.resetHidePath = playerPost;
            }else{
                playerPost = this.resetHidePath;
            }
        }
        // console.log(this.findTimer)
        if(nodes[playerPost.x+","+playerPost.y]){
            if(this.findTimer <= 0){
                this.pathIndex = 1
                this.findTimer = this.originalTimer
                this.resetMap()
                this.ghostPath = PathFinder.BFS(playerPost, this.lastPosition, this.myGhostPath).reverse();
            }
        }
    }

    hideFromPlayer(){
        // if(!this.hideFromPlayerSpawn){
        // this.hideFromPlayerSpawn = true;
        // this.reset();
        // this.ghostPath = PathFinder.BFS(this.calcRandSafeSpot(), this.lastPosition).reverse(); 
        // }
        // // if(this.pathIndex == this.ghostPath.length-1){
        // //     console.log(this)
        // //     this.hideFromPlayerSpawn = true;
        // // }

    }

    calcRandSafeSpot(){
        while(true){
            let x = GET_RAND(0, GLOBAL_BOUNDS)
            let y = GET_RAND(0, GLOBAL_BOUNDS)
            if(nodes[x+","+y]) return { x : x, y : y }
        }
    }

    // getRandDirection(cP){
    //     const dir = ENEMY_DIR[GET_RAND(4,0)];
    //     console.log(dir, cP)
    //     switch(dir){
    //         case 'right' : {
    //             if(nodes[(cP.x+1)+','+(cP.y)]){
    //                 return { x : cP.x+1, y : cP.y }
    //             }
    //         }case 'left' : {
    //             if(nodes[(cP.x-1)+','+(cP.y)]){
    //                 return { x : cP.x-1, y : cP.y }
    //             }
    //         }case 'down' : {
    //             if(nodes[(cP.x)+','+(cP.y+1)]){
    //                 return { x : cP.x, y : cP.y+1 }
    //             }
    //         }case 'up' : {
    //             if(nodes[(cP.x)+','+(cP.y-1)]){
    //                 return { x : cP.x, y : cP.y-1 }
    //             }
    //         }
    //         default : this.getRandDirection(cP)
    //     }
    // }
}