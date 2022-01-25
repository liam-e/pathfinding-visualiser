import Event from "./event.js";
export default class View {
    constructor(model) {
        var _a;
        this.gridSize = 400;
        this.xmlns = "http://www.w3.org/2000/svg";
        this.tileDefaultColor = "rgba(102, 102, 255, 0)";
        this.tileWallColor = "rgba(102, 102, 255, 255)";
        this.pathElement = null;
        this.animations = [];
        this.finalPath = [];
        this.tileMouseEvent = new Event();
        this.findPathBtnClicked = new Event();
        this.resetWallsBtnClicked = new Event();
        this.startTileDragged = new Event();
        this.goalTileDragged = new Event();
        this.model = model;
        this.tileSize = this.gridSize / this.model.gridSize;
        this.svg = document.querySelector("svg");
        this.findPathBtn = document.getElementById("find-path-btn");
        this.resetWallsBtn = document.getElementById("reset-btn");
        this.pathInfoDiv = document.getElementById("path-info");
        this.findPathBtn.addEventListener("click", () => {
            console.log("findPathBtn");
            this.resetPathVisuals();
            this.findPathBtnClicked.trigger(null);
        });
        this.resetWallsBtn.addEventListener("click", () => {
            this.resetWallsBtnClicked.trigger(null);
            console.log("resetWallsBtn");
            this.resetPathVisuals();
            document
                .querySelectorAll(".wall")
                .forEach((e) => e.classList.remove("wall"));
        });
        (_a = this.svg) === null || _a === void 0 ? void 0 : _a.addEventListener("mousemove", (e) => {
            var _a, _b;
            // Move logic out of View
            if (model.startTileDragMode) {
                // console.log(e.offsetX, e.offsetY);
                const tile = this.getTileAtPixelCoord(e.offsetX, e.offsetY, (_a = this.svg) === null || _a === void 0 ? void 0 : _a.clientWidth);
                if (tile !== null && !tile.isWall && !tile.isGoal) {
                    this.startTileDragged.trigger({ e, tile });
                    this.changeStart(tile);
                    this.resetPathVisuals();
                }
            }
            else if (model.goalTileDragMode) {
                const tile = this.getTileAtPixelCoord(e.offsetX, e.offsetY, (_b = this.svg) === null || _b === void 0 ? void 0 : _b.clientWidth);
                if (tile !== null && !tile.isWall && !tile.isStart) {
                    this.goalTileDragged.trigger({ e, tile });
                    this.changeGoal(tile);
                    this.resetPathVisuals();
                }
            }
        });
    }
    playAlgorithmAnimation() {
        if (this.animations.length > 0) {
            const tile = this.animations.shift();
            const elem = document.getElementById(tile.name);
            elem.classList.add("current");
            this.pathInfoDiv.innerHTML = "<p>Finding path....</p>";
        }
        else if (this.finalPath.length > 0) {
            this.drawFinalPath();
            this.displayPathInfo();
        }
        else {
        }
    }
    render() {
        var _a;
        for (let y = 0; y < this.model.gridSize; y++) {
            for (let x = 0; x < this.model.gridSize; x++) {
                const tile = this.model.grid[y][x];
                const elem = this.newTileElement(tile);
                (_a = this.svg) === null || _a === void 0 ? void 0 : _a.appendChild(elem);
                // tile.addElement(elem);
            }
        }
        setInterval(() => {
            this.playAlgorithmAnimation();
        }, 25);
        this.resetPathVisuals();
    }
    newTileElement(tile) {
        const elem = document.createElementNS(this.xmlns, "rect");
        elem.setAttribute("id", tile.name);
        elem.classList.add("tile");
        if (tile.isWall) {
            elem.classList.add("wall");
        }
        else if (tile.isStart) {
            elem.classList.add("start");
        }
        else if (tile.isGoal) {
            elem.classList.add("goal");
        }
        elem.setAttribute("x", `${tile.x * this.tileSize}`);
        elem.setAttribute("y", `${tile.y * this.tileSize}`);
        elem.setAttribute("width", `${this.tileSize}`);
        elem.setAttribute("height", `${this.tileSize}`);
        // elem.setAttribute("fill", tile.isWall ? this.tileWallColor : this.tileDefaultColor);
        // elem.addEventListener("click", () => {
        //     this.tileMouseEvent.trigger({ eventType: "click", tile });
        // });
        elem.addEventListener("mousedown", () => {
            this.tileMouseEvent.trigger({ eventType: "mousedown", tile });
        });
        elem.addEventListener("mouseup", () => {
            this.tileMouseEvent.trigger({ eventType: "mouseup", tile });
        });
        elem.addEventListener("mouseover", () => {
            this.tileMouseEvent.trigger({ eventType: "mouseover", tile });
        });
        return elem;
    }
    setWallOn(tile) {
        var _a;
        (_a = document.getElementById(tile.name)) === null || _a === void 0 ? void 0 : _a.classList.remove("nowall");
    }
    setWallOff(tile) {
        var _a;
        (_a = document.getElementById(tile.name)) === null || _a === void 0 ? void 0 : _a.classList.remove("wall");
    }
    changeStart(tile) {
        var _a, _b;
        (_a = document.getElementsByClassName("start")[0]) === null || _a === void 0 ? void 0 : _a.classList.remove("start");
        (_b = document.getElementById(tile.name)) === null || _b === void 0 ? void 0 : _b.classList.add("start");
    }
    changeGoal(tile) {
        var _a, _b;
        (_a = document.getElementsByClassName("goal")[0]) === null || _a === void 0 ? void 0 : _a.classList.remove("goal");
        (_b = document.getElementById(tile.name)) === null || _b === void 0 ? void 0 : _b.classList.add("goal");
    }
    handleSetCurrentTile(tile) {
        const elem = document.getElementById(tile.name);
        elem.classList.replace("fringe", "current");
        this.animations.push(tile);
    }
    handleSetFringeTile(tile) {
        const elem = document.getElementById(tile.name);
        elem.classList.replace("current", "fringe");
    }
    handleToggleWall(tile) {
        var _a, _b;
        if (tile.isWall) {
            (_a = document.getElementById(tile.name)) === null || _a === void 0 ? void 0 : _a.classList.add("wall");
        }
        else {
            (_b = document.getElementById(tile.name)) === null || _b === void 0 ? void 0 : _b.classList.remove("wall");
        }
    }
    handleDrawFinalPath(path) {
        this.finalPath = path;
    }
    handleEndPathStateEvent() {
        this.resetPathVisuals();
    }
    drawFinalPath() {
        var _a;
        if (this.finalPath === undefined || this.finalPath === [])
            return;
        this.pathElement = document.createElementNS(this.xmlns, "path");
        this.pathElement.classList.add("path-line");
        let d = "";
        for (let i = 0; i < this.finalPath.length; i++) {
            const tile = this.finalPath[i];
            // Moveto/Lineto
            d += i == 0 ? "M" : "L";
            d += tile.x * this.tileSize + this.tileSize / 2 + " ";
            d += tile.y * this.tileSize + this.tileSize / 2 + " ";
        }
        this.pathElement.setAttribute("d", d);
        (_a = this.svg) === null || _a === void 0 ? void 0 : _a.appendChild(this.pathElement);
        this.finalPath = [];
    }
    displayPathInfo() {
        let PathInfoStr = "";
        PathInfoStr += `<p>Path found! Length: ${this.model.pathLength.toFixed(2)} units</p>`;
        this.pathInfoDiv.innerHTML = PathInfoStr;
    }
    resetPathVisuals() {
        var _a;
        (_a = this.pathElement) === null || _a === void 0 ? void 0 : _a.remove();
        this.pathElement = null;
        document
            .querySelectorAll(".current")
            .forEach((e) => e.classList.remove("current"));
        document
            .querySelectorAll(".fringe")
            .forEach((e) => e.classList.remove("fringe"));
        this.animations = [];
        this.finalPath = [];
        this.pathInfoDiv.innerHTML = "<p>Begin by dragging the start (green), and goal (red) tiles, selecting walls with the mouse and hitting \"find shortest path\".</p>";
    }
    getTileAtPixelCoord(xCoord, yCoord, size) {
        const x = Math.floor(xCoord / (size / this.model.gridSize));
        const y = Math.floor(yCoord / (size / this.model.gridSize));
        console.log(x, y);
        if (x < 0 || y < 0 || x >= this.model.gridSize || y >= this.model.gridSize)
            return null;
        return this.model.grid[y][x];
    }
}
