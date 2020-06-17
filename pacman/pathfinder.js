class PathFinder{
    static BFS(target, source, nodess){
        let verticies = new Array();
        let visitedNodes = new Array();
        verticies.push(nodess[source.x+','+source.y]);
        let c = 0;
        let current = nodess[target.x+','+target.y];
        // console.log(nodess[source.x+','+source.y], source)
        // console.log('-',target, current)
        let sourceCurrent = nodess[source.x+','+source.y];
        let found = false
        while(!verticies.length == 0){
            const currentNode = verticies.shift();
            visitedNodes.push(currentNode.x+","+currentNode.y)
            c++;
            const neighbours = Object.values(currentNode.children);
            neighbours.forEach( neighbour => {
                let x = neighbour.x;
                let y = neighbour.y;
                if(visitedNodes.indexOf(x+","+y) == -1){
                    nodess[x+","+y].indexFromSource = c;
                    visitedNodes.push(x+","+y)
                    verticies.push(nodess[x+","+y])
                }
            })
    }
       let path = [];
       path.push(current)
       while(true){
            const parenNodes = Object.values(current.children)
            if(current.x == sourceCurrent.x && current.y == sourceCurrent.y || parenNodes.indexOf(target) > -1 ) {return path;}
            const indexes = parenNodes.map( parents => parents.indexFromSource );
            let c = parenNodes[indexes.indexOf(Math.min(...indexes))];
            if(!c) return false;
            current = nodes[c.x+","+c.y]
            path.push(current)
       }
            
    }

    static mapToNodes(){
        for(let y = 0; y < NODES.y; y++){
            for(let x = 0; x < NODES.x; x++){
                if(nodes[x+","+y]){
                    if(x < NODES.x && nodes[(x+1)+","+y] ){
                        nodes[x+","+y].children[(x+1)+","+y] = nodes[(x+1)+","+y]
                    }
                    if(y < NODES.y    && nodes[x+","+(y+1)] ){
                        nodes[x+","+y].children[x+","+(y+1)] = nodes[x+","+(y+1)]
                    }
                    if( y > 0 && nodes[x+","+(y-1)]){
                        nodes[x+","+y].children[x+","+(y-1)] = nodes[x+","+(y-1)]
                    }
                    if( x > 0 && nodes[(x-1)+","+y]){
                        nodes[x+","+y].children[(x-1)+","+y] = nodes[(x-1)+","+y]
                    }
                }
            }   
        }
    }

    static validateMap(source, targetPostions, nodes){
        let verticies = new Array();
        let visitedNodes = new Array();
        let c = 0;
        verticies.push(nodes[source.x+','+source.y]);
        while(!verticies.length == 0){
            const currentNode = verticies.shift();
            visitedNodes.push(currentNode.x+","+currentNode.y)
            c++;
            const neighbours = Object.values(currentNode.children);
            neighbours.forEach( neighbour => {
                let x = neighbour.x;
                let y = neighbour.y;
                if(visitedNodes.indexOf(x+","+y) == -1){
                    nodes[x+","+y].indexFromSource = c;
                    if(visitedNodes.indexOf(`${x},${y}`) == -1){
                        visitedNodes.push(x+","+y)
                    }
                    verticies.push(nodes[x+","+y])
                }
            })
        }
        // let set = new Set()
        // visitedNodes.forEach(node => set.add(node))
        // set = Array.from(set)
        const targetVisitedNodes = targetPostions.filter(target => verticies.indexOf(target) > -1)
        return { isValid : true }
        return targetVisitedNodes.length == targetPostions.length ? { isValid : true } : { isValid : false }
    }
}

class Map{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.neighbours = new Array();
    }

    getNeighbours(){
        return this.neighbours;
    }

}