var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Tile from "./tile.js";
import Event from "./event.js";
import { AStarPath } from "./astarpath.js";
export default class Model {
    constructor() {
        this.grid = [];
        this.pathLength = 0;
        this.isWallPaintMode = false;
        this.toggleWallEvent = new Event();
        this.drawFinalPathEvent = new Event();
        this.endPathStateEvent = new Event();
        this.startTile = null;
        this.goalTile = null;
        this.state = "INITIAL_STATE";
        this.startTileDragMode = false;
        this.goalTileDragMode = false;
        this.gridSize = 50;
        this.constructTiles();
        this.setStartTile(this.getTileAt(10, 10));
        this.setGoalTile(this.getTileAt(10, 50));
    }
    setStartTile(tile) {
        if (tile === null || tile.isGoal)
            return null;
        if (this.startTile !== null)
            this.startTile.isStart = false;
        this.startTile = tile;
        this.startTile.isStart = true;
    }
    setGoalTile(tile) {
        if (tile === null || tile.isStart)
            return null;
        if (this.goalTile !== null)
            this.goalTile.isGoal = false;
        this.goalTile = tile;
        this.goalTile.isGoal = true;
    }
    constructTiles() {
        this.grid = new Array(this.gridSize)
            .fill(0)
            .map((_, y) => new Array(this.gridSize).fill(0).map((_, x) => new Tile(x, y)));
    }
    play(move) {
        console.log(move);
    }
    handleTileMouseEvent(eventType, tile) {
        switch (eventType) {
            case "mousedown": {
                if (tile.isStart) {
                    this.startTileDragMode = true;
                }
                else if (tile.isGoal) {
                    this.goalTileDragMode = true;
                }
                else {
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
                    if (this.state === "FIND_PATH_STATE") {
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
    handleFindPathButtonClickedEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = "FIND_PATH_STATE";
            const path = AStarPath.findPath(this.startTile, this.goalTile, this);
            this.drawFinalPathEvent.trigger(yield path);
        });
    }
    handleResetWallsBtnClickedEvent() {
        this.grid.forEach(row => row.forEach(tile => tile.isWall = false));
    }
    getTileAt(x, y) {
        if (x < 0 || y < 0 || x >= this.gridSize || y >= this.gridSize) {
            return null;
        }
        else {
            return this.grid[y][x];
        }
    }
    getNeighbors(tile) {
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
    handleDragStartTile(e, tile) {
        this.setStartTile(tile);
    }
    handleDragGoalTile(e, tile) {
        this.setGoalTile(tile);
    }
}
