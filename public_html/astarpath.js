var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Path from "./path.js";
export class AStarPath extends Path {
    static findPath(start, goal, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const fringe = new Fringe();
            const visited = new Set();
            let nodeStart = new AStarNode(start, null, Path.heuristic(start, goal), 0);
            fringe.poll(nodeStart);
            let path = new Array();
            while (!fringe.isEmpty()) {
                let currentNode = fringe.pop();
                if (currentNode === null) {
                    console.error("popped node is null!");
                    return path;
                }
                let current = currentNode.tile;
                // EVENT
                this.currentTileEvent.trigger(current);
                if (current === goal) {
                    path = AStarPath.reconstructPath(currentNode, model);
                    return path;
                }
                visited.add(current);
                const neighbors = model.getNeighbors(current);
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        let g = currentNode.g + Path.distance(current, neighbor);
                        let f = g + Path.heuristic(neighbor, goal);
                        let neighborNode = fringe.removeNode(neighbor);
                        if (neighborNode === null) {
                            neighborNode = new AStarNode(neighbor, currentNode, f, g);
                        }
                        else {
                            if (g < neighborNode.g) {
                                neighborNode.f = f;
                                neighborNode.g = g;
                                neighborNode.prev = currentNode;
                            }
                        }
                        fringe.poll(neighborNode);
                        // EVENT
                        this.fringeTileEvent.trigger(current);
                    }
                }
            }
            return path;
        });
    }
    static reconstructPath(goal, model) {
        model.pathLength = goal.g;
        let current = goal;
        const path = [current.tile];
        while (current.prev !== null) {
            current = current.prev;
            path.unshift(current.tile);
        }
        return path;
    }
}
export class AStarNode {
    constructor(tile, prev, f, g) {
        this.tile = tile;
        this.prev = prev;
        this.f = f;
        this.g = g;
    }
}
export class Fringe {
    constructor() {
        this.queue = new Array(0);
    }
    poll(aStarNode) {
        for (let i = 0; i < this.queue.length; i++) {
            if (aStarNode.f >= this.queue[i].f) {
                this.queue.splice(i, 0, aStarNode);
                return;
            }
        }
        this.queue.push(aStarNode);
    }
    pop() {
        const oldLength = this.len();
        const popped = this.queue.pop();
        if (popped === undefined) {
            return null;
        }
        else {
            const newLength = this.len();
            return popped;
        }
    }
    isSorted() {
        let sorted = true;
        for (let i = 0; i < this.queue.length - 1; i++) {
            if (this.queue[i].f < this.queue[i + 1].f) {
                sorted = false;
            }
        }
        return sorted;
    }
    isEmpty() {
        return this.queue.length === 0;
    }
    contains(tile) {
        return this.queue.filter((n) => n.tile === tile).length > 0;
    }
    removeNode(tile) {
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].tile === tile) {
                let removed = this.queue.splice(i, 1);
                return removed[0];
            }
        }
        return null;
    }
    printInfo() {
        console.log("fringe:", this.queue.map((n) => n.f.toFixed(2)).join(" "));
    }
    len() {
        return this.queue.length;
    }
}
