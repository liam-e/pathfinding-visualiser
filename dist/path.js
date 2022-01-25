var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Event from "./event.js";
export default class Path {
    static findPath(start, goal, model) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented");
        });
    }
    static distance(from, to) {
        const dx = Math.abs(from.x - to.x);
        const dy = Math.abs(from.y - to.y);
        if (dx == 1 && dy == 1) {
            return Math.sqrt(2);
        }
        else if (dx == 1 || dy == 1) {
            return 1;
        }
        else {
            console.error("tiles are not neighbors!");
            return Math.sqrt(dx * dx + dy * dy);
        }
    }
    static heuristic(from, to) {
        const dx = Math.abs(from.x - to.x);
        const dy = Math.abs(from.y - to.y);
        const maxLen = Math.max(dx, dy);
        const minLen = Math.min(dx, dy);
        const a = Math.hypot(minLen, minLen);
        const b = maxLen - minLen;
        return a + b;
    }
}
Path.currentTileEvent = new Event();
Path.fringeTileEvent = new Event();
