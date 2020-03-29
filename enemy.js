class Enemy{    
    constructor(x, y, ghostPath){
        this.x = x
        this.y = y
        this.lastPosition = {
            x : x,
            y : y
        }
        this.pathIndex = 1;
        this.ghostPath = ghostPath;
    }

    setIncrement(x, y){
        this.x += x;
        this.y += y;
        this.newMove = true;
    }

    getX(){ return this.x }
    getY(){ return this.y }

    render(){
        image(enemy['red'], this.x * 40, this.y * 40, 40, 40) 
    }

    move(){
        let newMove = false;
        const dest = this.ghostPath[this.pathIndex];
        this.lastPosition = 
        {
            x : Math.round(this.x),
            y : Math.round(this.y)
        }
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

    proceedToTarget(){
        resetIndex();
        const playerPost = player.lastPosition;
        this.move()
        this.reset();
        if(nodes[playerPost.x+","+playerPost.y]){
            this.ghostPath = PathFinder.BFS(playerPost, this.lastPosition).reverse();
        }
    }
}