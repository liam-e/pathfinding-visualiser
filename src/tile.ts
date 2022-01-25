export default class Tile {

    name: string;

    x: number;
    y: number;

    isWall: boolean = false;
    isStart: boolean = false;
    isGoal: boolean = false;
    
    isChanged: boolean = false;

    elem: Element | null = null;

    // neighbors: Tile[] = [];

    constructor(x: number, y: number) {

        this.name = `tile_${x}_${y}`;

        this.x = x;
        this.y = y;
    }

    setIsStart(isStart: boolean){
        this.isStart = isStart;
    }

    setIsGoal(isGoal: boolean){
        this.isGoal = isGoal;
    }

    // addNeighbor(neighbor: Tile){
    //     this.neighbors.push(neighbor);
    // }

    // getNeighbors(){
    //     return this.neighbors;
    // }
}