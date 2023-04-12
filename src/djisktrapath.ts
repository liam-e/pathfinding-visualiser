import Path from "./path.js";
import Tile from "./tile.js";
import Model from "./model.js";

export class DjikstraPath extends Path {
  static async findPath(
    start: Tile,
    goal: Tile,
    model: Model
  ): Promise<Tile[]> {
    const fringe = new Fringe();
    const visited: Set<Tile> = new Set();

    let nodeStart = new AStarNode(start, null, Path.heuristic(start, goal, model.includesDiagonals), 0);

    fringe.poll(nodeStart);

    let path: Tile[] = new Array();

    while (!fringe.isEmpty()) {
      let currentNode: AStarNode | null = fringe.pop();

      if (currentNode === null) {
        console.error("popped node is null!");
        return path;
      }

      let current = currentNode.tile;

      // EVENT
      this.currentTileEvent.trigger(current);

      if (current === goal) {
        path = DjikstraPath.reconstructPath(currentNode, model);
        return path;
      }
      visited.add(current);

      const neighbors: Tile[] = model.getNeighbors(current);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          let g = currentNode.g + Path.distance(current, neighbor);
          let f = g;

          let neighborNode: AStarNode | null = fringe.removeNode(neighbor);

          if (neighborNode === null) {
            neighborNode = new AStarNode(neighbor, currentNode, f, g);
          } else {
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
  }

  static reconstructPath(goal: AStarNode, model: Model) {
    model.pathLength = goal.g;
    let current: AStarNode = goal;
    const path = [current.tile];
    while (current.prev !== null) {
      current = current.prev;
      path.unshift(current.tile);
    }
    return path;
  }
}

export class AStarNode {
  tile: Tile;
  prev: AStarNode | null;
  f: number;
  g: number;

  constructor(tile: Tile, prev: AStarNode | null, f: number, g: number) {
    this.tile = tile;
    this.prev = prev;
    this.f = f;
    this.g = g;
  }
}

export class Fringe {
  queue: AStarNode[];

  constructor() {
    this.queue = new Array(0);
  }

  poll(aStarNode: AStarNode) {
    for (let i = 0; i < this.queue.length; i++) {
      if (aStarNode.f >= this.queue[i].f) {
        this.queue.splice(i, 0, aStarNode);
        return;
      }
    }

    this.queue.push(aStarNode);
  }

  pop(): AStarNode | null {
    const oldLength = this.len();

    const popped = this.queue.pop();

    if (popped === undefined) {
      return null;
    } else {
      const newLength = this.len();
      return popped;
    }
  }

  isSorted(): boolean {
    let sorted: boolean = true;
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

  contains(tile: Tile): boolean {
    return this.queue.filter((n) => n.tile === tile).length > 0;
  }

  removeNode(tile: Tile): AStarNode | null {
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
