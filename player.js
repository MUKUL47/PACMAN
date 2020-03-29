class Player{
    constructor(x, y){
        this.x = x
        this.y = y
        this.direction = 'right'
        this.onHalt = false;
        this.stop = -1;
        this.minToStop = false;
        this.previousMove = ''
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
        this.checkBounds();
    }

    getX(){ return this.x }
    getY(){ return this.y }

    render(){
        image(pacman[this.direction], this.x * 40+5, this.y * 40+5, 30, 30)    
    }

    movement(direction){
        // const invalidDirection = this.invalidDirection(direction);
        // console.log('invalidDirection',invalidDirection)
        switch(direction){
            case 'right' : {
                this.direction = 'right'
                this.setIncrement(0.05, 0);
                if(this.previousMove != 'right'){
                    this.previousMove = 'right'
                    this.minToStop = this.getStopPostion(this.direction)
                }
                break;
            }
            case 'left' : {
                this.direction = 'left'
                this.setIncrement(-0.05, 0);
                if(this.previousMove != 'left'){
                    this.previousMove = 'left'
                    this.minToStop = this.getStopPostion(this.direction)
                }
                break;
            }
            case 'up' : {
                this.direction = 'up'
                this.setIncrement(0, -0.05);
                if(this.previousMove != 'up'){
                    this.previousMove = 'up'
                    this.minToStop = this.getStopPostion(this.direction)
                }
                break;
            }
            case 'down' : {
                this.direction = 'down'
                this.setIncrement(0, 0.05);
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
        let f = Object.values(foodItems).map( (food, i) => { if(Math.abs(food.y - this.y) <=0.5 && Math.abs(food.x - this.x) <=0.5){ return food; } }).filter(unwanted => unwanted != undefined)[0]
        f ? delete foodItems[f.x+','+f.y] : false;
    }

    checkBounds(){
        if(Math.round(this.x) >= 20 && this.direction == 'right'){
            this.x =- 0.5
        }
        else if(Math.round(this.x) <= -0.5 && this.direction == 'left'){
            this.x = 19.5
        }
        else if(Math.round(this.y) >= 20 && this.direction == 'down'){
            this.y =- 0.5
        }
        else if(Math.round(this.y) <= -0.5 && this.direction == 'up'){
            this.y = 19.5
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

    invalidDirection(direction){
        this.minToStop = this.getStopPostion(direction);
        return this.tellMeWhenToStop(direction)
    }
}