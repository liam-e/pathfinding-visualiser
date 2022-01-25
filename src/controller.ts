import Model from "./model.js";
import View from "./view.js";
import Tile from "./tile.js";
import Path from "./path.js";

export default class Controller {
    model: Model;
    view: View;

    constructor(){
        this.model = new Model();
        this.view = new View(this.model);

        // Add listeners
        this.view.tileMouseEvent.addListener((o: { eventType: string; tile: Tile }) => {
            this.model.handleTileMouseEvent(o.eventType, o.tile)
        });

        this.view.findPathBtnClicked.addListener(() => {
            this.model.handleFindPathButtonClickedEvent();
        });

        this.view.resetWallsBtnClicked.addListener(() => {
            this.model.handleResetWallsBtnClickedEvent();
        });

        this.view.startTileDragged.addListener((o: { e: MouseEvent; tile: Tile }) => {
            this.model.handleDragStartTile(o.e, o.tile);
        })

        this.view.goalTileDragged.addListener((o: { e: MouseEvent; tile: Tile }) => {
            this.model.handleDragGoalTile(o.e, o.tile);
        })
    
        this.model.toggleWallEvent.addListener((tile: Tile) => {
          this.view.handleToggleWall(tile)
        });

        this.model.drawFinalPathEvent.addListener((path: Tile[]) => {
          this.view.handleDrawFinalPath(path);
        });

        this.model.endPathStateEvent.addListener(() => {
            this.view.handleEndPathStateEvent();
          });

        Path.currentTileEvent.addListener((tile: Tile) => {
            this.view.handleSetCurrentTile(tile);
        });

        Path.fringeTileEvent.addListener((tile: Tile) => {
            this.view.handleSetFringeTile(tile)
        });
    }

    run() {
        this.view.render();
    }
}