import Model from "./model.js";
import View from "./view.js";
import Path from "./path.js";
export default class Controller {
    constructor() {
        this.model = new Model();
        this.view = new View(this.model);
        // Add listeners
        this.view.tileMouseEvent.addListener((o) => {
            this.model.handleTileMouseEvent(o.eventType, o.tile);
        });
        this.view.findPathBtnClicked.addListener(() => {
            this.model.handleFindPathButtonClickedEvent();
        });
        this.view.resetWallsBtnClicked.addListener(() => {
            this.model.handleResetWallsBtnClickedEvent();
        });
        this.view.startTileDragged.addListener((o) => {
            this.model.handleDragStartTile(o.e, o.tile);
        });
        this.view.goalTileDragged.addListener((o) => {
            this.model.handleDragGoalTile(o.e, o.tile);
        });
        this.model.toggleWallEvent.addListener((tile) => {
            this.view.handleToggleWall(tile);
        });
        this.model.drawFinalPathEvent.addListener((path) => {
            this.view.handleDrawFinalPath(path);
        });
        this.model.endPathStateEvent.addListener(() => {
            this.view.handleEndPathStateEvent();
        });
        Path.currentTileEvent.addListener((tile) => {
            this.view.handleSetCurrentTile(tile);
        });
        Path.fringeTileEvent.addListener((tile) => {
            this.view.handleSetFringeTile(tile);
        });
    }
    run() {
        this.view.render();
    }
}
