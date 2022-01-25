import Tile from "./tile";
import Model from "./model";
import Event from "./event.js";

export default abstract class Path {
  static currentTileEvent: Event = new Event();
  static fringeTileEvent: Event = new Event();

  static async findPath(start: Tile, goal: Tile, model: Model): Promise<Tile[]> {
    throw new Error("Method not implemented");
  }

  static distance(from: Tile, to: Tile): number {
    const dx = Math.abs(from.x - to.x);
    const dy = Math.abs(from.y - to.y);

    if (dx == 1 && dy == 1) {
      return Math.sqrt(2);
    } else if (dx == 1 || dy == 1) {
      return 1;
    } else {
      console.error("tiles are not neighbors!");
      return Math.sqrt(dx * dx + dy * dy);
    }
  }

  static heuristic(from: Tile, to: Tile) {
    const dx: number = Math.abs(from.x - to.x);
    const dy: number = Math.abs(from.y - to.y);

    const maxLen = Math.max(dx, dy);
    const minLen = Math.min(dx, dy);

    const a = Math.hypot(minLen, minLen);
    const b = maxLen - minLen;

    return a + b;
  }
}
