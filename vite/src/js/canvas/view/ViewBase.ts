// @ts-check

import DrowContainerBase from "../drowObject/base/DrowContainerBase";
import StageBase from "../stage/StageBase";

export default abstract class ViewBase extends DrowContainerBase{
    protected stageObj: StageBase;

    constructor(stageObj: StageBase) {
        super();
        this.stageObj = stageObj;
    }
    
    abstract init():void;
    abstract repaint():void;
    abstract setBridgeBox():void;
    abstract getBridgeBox():void;
}
