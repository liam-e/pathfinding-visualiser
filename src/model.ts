import Tile from "./tile.js";
import Event from "./event.js";
import { AStarPath } from "./astarpath.js";

export default class Model {
  grid: Tile[][] = [];
  gridSize: number;

  pathLength: number = 0;

  isWallPaintMode: boolean = false;

  toggleWallEvent: Event = new Event();
  drawFinalPathEvent: Event = new Event();
  endPathStateEvent: Event = new Event();

  startTile: Tile | null = null;
  goalTile: Tile | null = null;

  state: string = "INITIAL_STATE";

  startTileDragMode: boolean = false;
  goalTileDragMode: boolean = false;

  constructor() {
    this.gridSize = 50;

    this.constructTiles();

    this.setStartTile(this.getTileAt(10, 10)!);
    this.setGoalTile(this.getTileAt(10, 50)!);
  }

  setStartTile(tile: Tile) {
    if (tile === null || tile.isGoal) return null;
    if (this.startTile !== null) this.startTile.isStart = false;
    this.startTile = tile;
    this.startTile.isStart = true;
  }

  setGoalTile(tile: Tile) {
    if (tile === null || tile.isStart) return null;
    if (this.goalTile !== null) this.goalTile.isGoal = false;
    this.goalTile = tile;
    this.goalTile.isGoal = true;
  }

  constructTiles() {
    this.grid = new Array(this.gridSize)
      .fill(0)
      .map((_, y) =>
        new Array(this.gridSize).fill(0).map((_, x) => new Tile(x, y))
      );
  }

  play(move: any) {
    console.log(move);
  }

  handleTileMouseEvent(eventType: string, tile: Tile) {
    switch (eventType) {
      case "mousedown": {
        if (tile.isStart){
          this.startTileDragMode = true;
        } else if (tile.isGoal){
          this.goalTileDragMode = true;
        } else {
          this.isWallPaintMode = true;
          this.handleTileMouseEvent("mouseover", tile);
          
        }
        break;
      }

      case "mouseup": {
        this.isWallPaintMode = false;
        this.startTileDragMode = false;
        this.goalTileDragMode = false;
        break;
      }

      case "mouseover": {
        if (this.isWallPaintMode && !tile.isStart && !tile.isGoal) {
          if (this.state ===  "FIND_PATH_STATE"){
            this.state = "INITIAL_STATE";
            this.endPathStateEvent.trigger(null);
          }
          tile.isWall = true;
          this.toggleWallEvent.trigger(tile);
        }
        break;
      }

      default: {
        throw new Error(eventType + "Event type not implemented.");
      }
    }
  }

  async handleFindPathButtonClickedEvent() {
    this.state = "FIND_PATH_STATE";
    const path = AStarPath.findPath(this.startTile!, this.goalTile!, this);

    this.drawFinalPathEvent.trigger(await path);
  }

  handleResetWallsBtnClickedEvent() {
    this.grid.forEach(row => row.forEach(tile => tile.isWall = false));
  }

  getTileAt(x: number, y: number): Tile | null {
    if (x < 0 || y < 0 || x >= this.gridSize || y >= this.gridSize) {
      return null;
    } else {
      return this.grid[y][x];
    }
  }

  getNeighbors(tile: Tile): Tile[] {
    const x = tile.x;
    const y = tile.y;
    const neighborsArr = new Array();

    neighborsArr.push(this.getTileAt(x - 1, y - 1)); // top left
    neighborsArr.push(this.getTileAt(x, y - 1)); // top
    neighborsArr.push(this.getTileAt(x + 1, y - 1)); // top right

    neighborsArr.push(this.getTileAt(x - 1, y)); // left
    neighborsArr.push(this.getTileAt(x + 1, y)); // right

    neighborsArr.push(this.getTileAt(x - 1, y + 1)); // bottom left
    neighborsArr.push(this.getTileAt(x, y + 1)); // bottom
    neighborsArr.push(this.getTileAt(x + 1, y + 1)); // bottom right

    return neighborsArr.filter((t) => t !== null && !t.isWall);
  }

  handleDragStartTile(e: MouseEvent, tile: Tile){
    this.setStartTile(tile);
  }

  handleDragGoalTile(e: MouseEvent, tile: Tile){
    this.setGoalTile(tile);
  }
}
