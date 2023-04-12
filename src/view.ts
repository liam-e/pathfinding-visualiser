import Model from "./model.js";
import Tile from "./tile.js";
import Event from "./event.js";

export default class View {
  gridSize = 400;
  tileSize: number;
  model: Model;
  xmlns = "http://www.w3.org/2000/svg";
  tileDefaultColor: string = "rgba(102, 102, 255, 0)";
  tileWallColor: string = "rgba(102, 102, 255, 255)";
  svg;
  findPathBtn;
  resetWallsBtn;
  algorithmSelector: HTMLSelectElement | null;
  diagonalsCheckbox: HTMLInputElement | null;
  pathElement: Element | null = null;
  pathInfoDiv: Element | null;

  animations: Tile[] = [];
  finalPath: Tile[] = [];

  tileMouseEvent: Event = new Event();
  findPathBtnClicked: Event = new Event();
  resetWallsBtnClicked: Event = new Event();
  algorithmSelectorChanged: Event = new Event();
  diagonalsCheckboxToggled: Event = new Event();
  startTileDragged: Event = new Event();
  goalTileDragged: Event = new Event();

  constructor(model: Model) {
    this.model = model;
    this.tileSize = this.gridSize / this.model.gridSize;
    this.svg = document.querySelector("svg");

    this.findPathBtn = document.getElementById("find-path-btn");
    this.resetWallsBtn = document.getElementById("reset-btn");

    this.algorithmSelector = document.getElementById("algorithm-selector") as HTMLSelectElement;
    this.diagonalsCheckbox = document.getElementById("diagonals-checkbox") as HTMLInputElement;

    this.pathInfoDiv = document.getElementById("path-info");

    this.findPathBtn!.addEventListener("click", () => {
      this.resetPathVisuals();
      this.findPathBtnClicked.trigger(null);
    });

    this.resetWallsBtn!.addEventListener("click", () => {
      this.resetWallsBtnClicked.trigger(null);
      this.resetPathVisuals();
      document
        .querySelectorAll(".wall")
        .forEach((e) => e.classList.remove("wall"));
    });

    this.algorithmSelector!.addEventListener("change", () => {
      this.algorithmSelectorChanged.trigger(this.algorithmSelector!.value);
    })

    this.diagonalsCheckbox!.addEventListener("change", () => {
      this.diagonalsCheckboxToggled.trigger(this.diagonalsCheckbox!.checked);
    })

    this.svg?.addEventListener("mousemove", (e) => {
      // Move logic out of View
      if(model.startTileDragMode){
        const tile = this.getTileAtPixelCoord(e.offsetX, e.offsetY, this.svg?.clientWidth!);
        if (tile !== null && !tile.isWall && !tile.isGoal){
          this.startTileDragged.trigger({e, tile});
          this.changeStart(tile);
          this.resetPathVisuals();
        }
      } else if (model.goalTileDragMode){
        const tile = this.getTileAtPixelCoord(e.offsetX, e.offsetY, this.svg?.clientWidth!);
        if (tile !== null && !tile.isWall && !tile.isStart){
          this.goalTileDragged.trigger({e, tile});
          this.changeGoal(tile);
          this.resetPathVisuals();
        }
      }
    })
  }

  playAlgorithmAnimation() {
    if (this.animations.length > 0) {
      const tile = this.animations.shift();
      const elem: Element = document.getElementById(tile!.name)!;
      elem.classList.add("current");
      this.pathInfoDiv!.innerHTML = "<p>Finding path....</p>";
    } else if (this.finalPath.length > 0) {
        this.drawFinalPath();
        this.displayPathInfo();
    } else {

    }
  }

  render() {
    for (let y = 0; y < this.model.gridSize; y++) {
      for (let x = 0; x < this.model.gridSize; x++) {
        const tile = this.model.grid[y][x];
        const elem: Element = this.newTileElement(tile);
        this.svg?.appendChild(elem);
        // tile.addElement(elem);
      }
    }

    setInterval(() => {
        this.playAlgorithmAnimation();
    }, 25);

    this.resetPathVisuals();
  }

  newTileElement(tile: Tile) {
    const elem: Element = document.createElementNS(this.xmlns, "rect");
    elem.setAttribute("id", tile.name);
    elem.classList.add("tile");
    if (tile.isWall) {
      elem.classList.add("wall");
    } else if (tile.isStart) {
      elem.classList.add("start");
    } else if (tile.isGoal) {
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

  setWallOn(tile: Tile) {
    document.getElementById(tile.name)?.classList.remove("nowall");
  }

  setWallOff(tile: Tile) {
    document.getElementById(tile.name)?.classList.remove("wall");
  }

  changeStart(tile: Tile){
    document.getElementsByClassName("start")[0]?.classList.remove("start");
    document.getElementById(tile.name)?.classList.add("start");
  }

  changeGoal(tile: Tile){
    document.getElementsByClassName("goal")[0]?.classList.remove("goal");
    document.getElementById(tile.name)?.classList.add("goal");
  }

  handleSetCurrentTile(tile: Tile) {
    const elem: Element = document.getElementById(tile.name)!;
    elem.classList.replace("fringe", "current");
    this.animations.push(tile);
  }

  handleSetFringeTile(tile: Tile) {
    const elem: Element = document.getElementById(tile.name)!;

    elem.classList.replace("current", "fringe");
  }

  handleToggleWall(tile: Tile) {
    if (tile.isWall) {
      document.getElementById(tile.name)?.classList.add("wall");
    } else {
      document.getElementById(tile.name)?.classList.remove("wall");
    }
  }

  handleDrawFinalPath(path: Tile[]) {
    this.finalPath = path;
  }

  handleEndPathStateEvent() {
    this.resetPathVisuals();
  }

  drawFinalPath(){
      if (this.finalPath === undefined || this.finalPath.length === 0) return;
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
    this.svg?.appendChild(this.pathElement);

    this.finalPath = [];
  }

  displayPathInfo(){
    let PathInfoStr = "";
    PathInfoStr += `<p>Path found! Length: ${this.model.pathLength.toFixed(2)} units</p>`;
    this.pathInfoDiv!.innerHTML = PathInfoStr;
  }

  resetPathVisuals() {
    this.pathElement?.remove();
    this.pathElement = null;

    document
      .querySelectorAll(".current")
      .forEach((e) => e.classList.remove("current"));
    document
      .querySelectorAll(".fringe")
      .forEach((e) => e.classList.remove("fringe"));

      this.animations = [];
      this.finalPath = [];

      this.pathInfoDiv!.innerHTML = "<p>Begin by dragging the start (green), and goal (red) tiles, selecting walls with the mouse and hitting \"find path\".</p>";
  }

  getTileAtPixelCoord(xCoord: number, yCoord: number, size: number): Tile | null {
    const x = Math.floor(xCoord/ (size / this.model.gridSize));
    const y = Math.floor(yCoord/ (size / this.model.gridSize));
    if (x < 0 || y < 0 || x >= this.model.gridSize || y >= this.model.gridSize) return null;
    return this.model.grid[y][x];
  }
}
