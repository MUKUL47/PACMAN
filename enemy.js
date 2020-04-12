class Enemy{    
    constructor(x, y, ghostPath, asset){
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
    }

    setIncrement(x, y){
        this.x += x;
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

    move(){
        const dest = this.ghostPath[this.pathIndex];
        this.lastPosition = 
        {
            x : Math.round(this.x),
            y : Math.round(this.y)
        }
        this.resetHidePath = ENEMY_DEAD && (!this.ghostPath[this.pathIndex]) ? false : this.resetHidePath;
        if(dest){
            if(dest.y < this.y){
                this.setIncrement(0, -ENEMY_SPEED)
            }
            if(dest.y > this.y){
                this.setIncrement(0, ENEMY_SPEED)
            }
            if(dest.x > this.x){
                this.setIncrement(ENEMY_SPEED, 0)
            }
            if(dest.x < this.x){
                this.setIncrement(-ENEMY_SPEED, 0)
            } 
            if(this.x >= dest.x && this.y >= dest.y){
                this.pathIndex +=1;                
            }
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
                console.log(this.resetHidePath)
            }else{
                playerPost = this.resetHidePath;
            }
        }
        this.reset();
        if(nodes[playerPost.x+","+playerPost.y]){
            this.ghostPath = PathFinder.BFS(playerPost, this.lastPosition).reverse();
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
            let x = Math.floor((Math.random() * (20 - 0) + 0))
            let y = Math.floor((Math.random() * (20 - 0) + 0))
            if(nodes[x+","+y]){
                return { x : x, y : y }
            }
        }
    }

    getRandDirection(cP){
        const dir = ENEMY_DIR[GET_RAND(4,0)];
        console.log(dir, cP)
        switch(dir){
            case 'right' : {
                if(nodes[(cP.x+1)+','+(cP.y)]){
                    return { x : cP.x+1, y : cP.y }
                }
            }case 'left' : {
                if(nodes[(cP.x-1)+','+(cP.y)]){
                    return { x : cP.x-1, y : cP.y }
                }
            }case 'down' : {
                if(nodes[(cP.x)+','+(cP.y+1)]){
                    return { x : cP.x, y : cP.y+1 }
                }
            }case 'up' : {
                if(nodes[(cP.x)+','+(cP.y-1)]){
                    return { x : cP.x, y : cP.y-1 }
                }
            }
            default : this.getRandDirection(cP)
        }
    }
}