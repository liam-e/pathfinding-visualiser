export default class Tile {
    // neighbors: Tile[] = [];
    constructor(x, y) {
        this.isWall = false;
        this.isStart = false;
        this.isGoal = false;
        this.isChanged = false;
        this.elem = null;
        this.name = `tile_${x}_${y}`;
        this.x = x;
        this.y = y;
    }
    setIsStart(isStart) {
        this.isStart = isStart;
    }
    setIsGoal(isGoal) {
        this.isGoal = isGoal;
    }
}
