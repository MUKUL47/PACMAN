class Node{
    constructor(x, y){
        this.x = x
        this.y = y
        this.children = {};
        this.parents = {};
        this.neighbours = []
        this.indexFromSource = -1;
        this.isValid = true;
    }

    setValid(val){
        this.isValid = val;
    }
}

class Food{
    constructor(x, y){
        this.x = x
        this.y = y
    }
    getX(){ return this.x }
    getY(){ return this.y }
}

class Energy{
    constructor(x, y){
        this.x = x
        this.y = y
    }
    getX(){ return this.x }
    getY(){ return this.y }
}