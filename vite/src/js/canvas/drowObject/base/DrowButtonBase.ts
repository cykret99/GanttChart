// @ts-check

import Utils from "../../../util/Utils";
import CanvasConst from "../../common/CanvasConst";
import DrowShapeBase from "./DrowShapeBase";
import DrowContainerBase from "./DrowContainerBase";
import DrowTextBase from "./DrowTextBase";

export default class DrowButtonBase extends DrowContainerBase {
    protected button: DrowShapeBase;
    protected buttonOber: DrowShapeBase;
    protected labelObj: DrowTextBase;

    public label: string;
    public color: string; 
    public bgcolor:string; 
    public width:number; 
    public height:number; 
    public radius:number;

    public align : DrowTextBase.Align;
    public baseline : DrowTextBase.Baseline;
    
    constructor(label: string, color?: string, bgcolor?:string, width?:number, height?:number, radius?:number, align?:DrowTextBase.Align, baseline?:DrowTextBase.Baseline) {
        super();
        let THIS = this;
        // ロールオーバーイベントを登録
        this.on("mouseover", function(event){THIS.handleMouseOver(event)});
        this.on("mouseout", function(event){THIS.handleMouseOut(event)});

        if (Utils.isUndefined(width))
            width = 75;
        if (Utils.isUndefined(height))
            height = 25;
        if (Utils.isUndefined(radius))
            radius = 0;
        if (Utils.isEmpty(color))
            color = "#AAAAAA";
        if (Utils.isEmpty(bgcolor))
            bgcolor = "#FFFFFF";

        this.label = label;
        this.color = color as string;
        this.bgcolor = bgcolor as string;
        this.width = width as number;
        this.height = height as number;
        this.radius = radius as number;

        if(Utils.isEmpty(align)){
            this.align = DrowTextBase.Align.CENTER;
        }else{
            this.align = align as DrowTextBase.Align;
        }
        if(Utils.isEmpty(baseline)){
            this.baseline = DrowTextBase.Baseline.MIDDLE;
        }else{
            this.baseline = baseline as DrowTextBase.Baseline;
        }
        this.setBounds(this.x, this.y, this.width, this.height);

        this.repaint();
    }

    public repaint() {
        this.button = new DrowShapeBase;
        this.button.bgColor = this.bgcolor;
        this.button.fillFlg = true;
        this.button.lineColor = this.color;
        this.button.begin();
        this.button.graphics.drawRoundRect(0, 0, this.width as number, this.height as number, this.radius as number);
        this.button.end();
        this.button.visible = true;

        this.buttonOber = new DrowShapeBase;
        this.buttonOber.bgColor = this.color;
        this.buttonOber.fillFlg = true;
        this.buttonOber.lineColor = this.bgcolor;
        this.buttonOber.begin();
        this.buttonOber.graphics.drawRoundRect(0, 0, this.width as number, this.height as number, this.radius as number);
        this.buttonOber.end();
        this.buttonOber.visible = false;

        this.labelObj = new DrowTextBase;
        this.labelObj.setText(this.label, "15px bold serif", this.color);
        
        if(this.align == DrowTextBase.Align.CENTER){
            this.labelObj.setAlign(this.align);
            this.labelObj.setBaseline(this.baseline);
            this.labelObj.x = this.width as number / 2;
            this.labelObj.y = this.height as number / 2;
        }else if(this.align == DrowTextBase.Align.LEFT) {
            this.labelObj.setAlign(this.align);
            this.labelObj.setBaseline(this.baseline);
            this.labelObj.x = 10;
            this.labelObj.y = this.height as number / 2;
        }

        this.close();
        this.cursor = CanvasConst.CREATEJS_POINTER;
        this.addChild(this.button);
        this.addChild(this.buttonOber);
        this.addChild(this.labelObj);
    }

    public handleMouseOver(event) {
        this.button.visible = false;
        this.buttonOber.visible = true;
        this.labelObj.setColor(this.button.bgColor);
    }
    public handleMouseOut(event) {
        this.button.visible = true;
        this.buttonOber.visible = false;
        this.labelObj.setColor(this.button.lineColor);
    }

}