// @ts-check
import DrowContainerBase from "./base/DrowContainerBase";
import DrowTextBase from "./base/DrowTextBase";
import DrowShapeBase from "./base/DrowShapeBase";
import StageBase from "../stage/StageBase";

export default class DrowLoader extends DrowContainerBase {

    protected glayCover: DrowShapeBase;
    protected loadObject: DrowShapeBase;
    protected loadText:DrowTextBase;

    constructor(){
        super();
        this.glayCover = new DrowShapeBase;
        this.loadObject = new DrowShapeBase;
        this.loadText = new DrowTextBase;

        this.glayCover.graphics.drawRect(0, 0, 2000, 2000); // 長方形を描画
        this.glayCover.bgColor = '#888888'
        this.glayCover.alpha = 0.7;
        this.glayCover.fillFlg = true;
        this.glayCover.style = DrowShapeBase.LineStyle.NONE;

        // this.loadObject.graphics.drawPolyStar(0, 0, 75, 5, 0.6, -90);
        // this.loadObject.bgColor = '#FFFFFF'
        // this.loadObject.alpha = 1;
        // this.loadObject.fillFlg = true;
        // this.loadObject.style = DrowShapeBase.LineStyle.NONE;
        
        this.loadText.setText("now loading...","60px serif", "#FFFFFF");
        this.loadText.alpha = 0.7;
        this.loadText.setBaseline(DrowTextBase.Baseline.BOTTOM);
        this.loadText.setAlign(DrowTextBase.Align.LEFT);
        
        this.addChild(this.glayCover);
        // this.addChild(this.loadObject);
        this.addChild(this.loadText);
        this.visible = false;
    }

    /**
     * ローディング表示
     *
     * @param {string} text ローディング画面描画文字列
     * @param {StageBase} stageObj
     * @memberof DrowLoader
     */
    public startLoader(text:string, stageObj:StageBase):void{
        this.visible = true;
        let size = stageObj.getCanvasSize();

        this.glayCover.begin();
        this.glayCover.graphics.drawRect(0,0,size.width,size.height);
        this.glayCover.end();

        this.loadText.setText(text,"60px serif", "#FFFFFF");
        this.loadText.x = 10;
        this.loadText.y = size.height-10;

    }

    /**
     * ローディング非表示
     *
     * @memberof DrowLoader
     */
    public endLoader():void{
        this.visible = false;
    }
}


