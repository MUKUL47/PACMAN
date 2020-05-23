class Player{
    constructor(x, y){
        this.x = x
        this.y = y
        this.direction = 'right'
        this.onHalt = false;
        this.stop = -1;
        this.minToStop = false;
        this.previousMove = ''
        this.lastDirection = this.direction
        this.lastPosition = {
            x : x,
            y : y
        }
    }

    set(x, y){
        this.x = x
        this.y = y
    }

    setIncrement(x, y){
        if(this.tellMeWhenToStop(this.direction)) return;
        this.x += x;
        this.y += y;
        this.lastPosition = {
            x : Math.round(this.x),
            y : Math.round(this.y)
        };
        this.eatFood();
        this.getEnergy();
        this.checkBounds();
    }

    getX(){ return this.x }
    getY(){ return this.y }

    render(){
        image(pacman[this.direction], this.x * 40+5, this.y * 40+5, 30, 30)    
    }

    movement(dir){
        // const invalidDirection = this.invalidDirection(direction);
        // console.log('invalidDirection',invalidDirection)
        // let direction = this.checkValidDirection(dir);
        switch(dir){
            case 'right' : {
                this.direction = 'right'
                this.setIncrement(0.05, 0);
                this.lastDirection = 'right'
                if(this.previousMove != 'right'){
                    this.previousMove = 'right'
                    this.minToStop = this.getStopPostion(this.direction)
                }
                // console.log('right',)
                break;
            }
            case 'left' : {
                this.direction = 'left'
                this.setIncrement(-0.05, 0);
                this.lastDirection = 'left'
                if(this.previousMove != 'left'){
                    this.previousMove = 'left'
                    this.minToStop = this.getStopPostion(this.direction)
                }
                break;
            }
            case 'up' : {
                this.direction = 'up'
                this.setIncrement(0, -0.05);
                this.lastDirection = 'up'
                if(this.previousMove != 'up'){
                    this.previousMove = 'up'
                    this.minToStop = this.getStopPostion(this.direction)
                }
                break;
            }
            case 'down' : {
                this.direction = 'down'
                this.setIncrement(0, 0.05);
                this.lastDirection = 'down'
                if(this.previousMove !='down'){
                    this.previousMove = 'down'
                    this.minToStop = this.getStopPostion(this.direction)
                }
                break;
            }
        }
    }

    getStopPostion(direction){
        const properX =  Math.round(this.x)
        const properY = Math.round(this.y)
        if(direction == 'right'){
            return Math.min(...walls.filter( wall => { if(Math.abs(wall.y - this.y) <=0.85 && properX < wall.x){ return wall; } }).map( w => w.x ));
        }
        else if(direction == 'left'){
            return Math.max(...walls.filter( wall => { if(Math.abs(wall.y - this.y) <=0.85 && properX > wall.x){ return wall; } }).map( w => w.x ));   
        }
        else if(direction == 'up'){
            return Math.max(...walls.filter( wall => { if(Math.abs(wall.x - this.x) <=0.85 && properY > wall.y){ return wall; } }).map( w => w.y ));
        }
        return Math.min(...walls.filter( wall => { if(Math.abs(wall.x - this.x) <=0.85 && properY < wall.y){ return wall; } }).map( w => w.y ));
    }

    eatFood(){
        let f = Object.values(foodItems).filter(food => Math.abs(food.y - this.y) <=0.5 && Math.abs(food.x - this.x) <=0.5)[0]
        if(f){
            delete foodItems[f.x+','+f.y]
            totalFoodItems += 1;
            document.getElementById("score").innerHTML = `Score : ${totalFoodItems}`
        }
    }

    getEnergy(){
        let f = Object.values(energyBar).filter(food => Math.abs(food.y - this.y) <=0.5 && Math.abs(food.x - this.x) <=0.5)[0]
        if(f){
            ghosts.forEach( ghost => ghost.resetHidePath = false)
            ENEMY_DEAD = new Date();
            delete energyBar[f.x+','+f.y]
        }
    }

    checkBounds(){

        if(this.direction == 'right'){
            if(Math.round(this.x) >= (GLOBAL_BOUNDS-.5)){
                this.x = nodes[0+","+Math.round(this.y)] ? -0.5 : GLOBAL_BOUNDS - 0.5
            }
        }
        else if( this.direction == 'left'){
            if(Math.round(this.x) <= -0.5){
                this.x = nodes[19+","+Math.round(this.y)] ? GLOBAL_BOUNDS - 0.5 : -0.5
            }
        }
        else if( this.direction == 'down'){
            if(Math.round(this.y) >= (GLOBAL_BOUNDS-.5)){
                this.y = nodes[Math.round(this.x)+","+0] ? -0.5 : GLOBAL_BOUNDS - 0.5
            }
        }
        else if( this.direction == 'up'){
            if(Math.round(this.y) <= -0.5){
                this.y= nodes[Math.round(this.x)+","+19] ? GLOBAL_BOUNDS - 0.5 : -0.5
            }
        }
        this.minToStop = this.getStopPostion(this.direction)
    }


    tellMeWhenToStop(direction){
        switch(direction){
            case 'left' : return (this.x - this.minToStop) <= 1
            case 'right': return (this.x - this.minToStop) >= -1
            case 'up'   : return (this.y - this.minToStop) <= 1
            case 'down' : return (this.y - this.minToStop) >= -1
        }
    }

    positionChange(cb){
        let cp = Math.round(this.x)+","+Math.round(this.y);
        let lX = this.lastPosition.split(',')[0];
        let lY = this.lastPosition.split(',')[1];
        // if(Math.abs(lX - Math.round(this.x)) >= 3 || Math.abs(lY - Math.round(this.y)) >= 3 ){
        // if(cp != this.lastPosition){
        this.lastPosition = {
            x : Math.round(this.x),
            y : Math.round(this.y)
        };
            // cb(cp);
        // }
        cb(cp);
    }

    validDirection(direction){
        switch(direction){
            case 'right' : return nodes[Math.round(this.x+1)+','+Math.round(this.y)];
            case 'left' : return nodes[Math.round(this.x-1)+','+Math.round(this.y)];
            case 'down' : return nodes[Math.round(this.x)+','+Math.round(this.y+1)];
            case 'up' : return nodes[Math.round(this.x)+','+Math.round(this.y-1)];
        }
    }

    checkValidDirection(newDir){
        if(this.direction == 'up' || this.direction == 'down') return newDir;
        let isValid;
        if(this.direction == 'right' || this.direction == 'left' && newDir == 'up' || newDir == 'down'){
            if(newDir == 'up'){
                isValid = nodes[Math.floor(this.x)+","+Math.floor(this.y)];            
            }else{
                isValid = nodes[Math.floor(this.x)+","+Math.round(this.y)]
            }
        }
        return !isValid ? this.direction : newDir
    }
}