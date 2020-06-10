class Playground {
    constructor(width, height) {
        this.width = width
        this.height = height
    }

    render(globalNodes) {
        globalNodes.map( renderBlock => renderBlock.nodes.map( node => image(renderBlock.asset, node.x * 40, node.y * 40, 40, 40)))
    }
}