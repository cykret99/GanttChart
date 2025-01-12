// @ts-check

import Utils from "../../../util/Utils";
import DrowContainerBase from "./DrowContainerBase";

/**
 * テキスト描画用オブジェクト
 *
 * @export
 * @class DrowTextBase
 * @extends {DrowContainerBase}
 */
export class DrowTextBase extends DrowContainerBase{
    public textObj:createjs.Text = new createjs.Text;

    public constructor(){
        super();
        this.addChild(this.textObj);
    }
    /**
     *　テキスト設定の初期化
     *
     * @param {string} [text] 描画内容
     * @param {string} [font] フォント
     * @param {string} [color] 文字色
     * @memberof DrowTextBase
     */
    public setText(text?: string, font?: string, color?: string):void{
        if(Utils.isNotEmpty(text))  this.textObj.text = text as string;
        else                        this.textObj.text = '';

        if(Utils.isNotEmpty(font))  this.textObj.font = font as string;
        else                        this.textObj.font = '12px serif';

        if(Utils.isNotEmpty(color))  this.textObj.color = color as string;
        else                        this.textObj.color = 'black';
    }

    public setColor(color:string){
        if(Utils.isNotEmpty(color))  this.textObj.color = color as string;
        else                        this.textObj.color = 'black';
    }

    public setAlign(algn : DrowTextBase.Align){
        this.textObj.textAlign = algn;
    }

    public setBaseline(baseline : DrowTextBase.Baseline){
        this.textObj.textBaseline = baseline;
    }

}



export namespace DrowTextBase {
    export enum Align {
        START   = "start",
        END     = "end",
        LEFT    = "left",
        RIGHT   = "right",
        CENTER  = "center"
    }

    export enum Baseline{
        TOP         = "top",
        HANGING     = "hanging",
        MIDDLE      = "middle",
        ALPHABETIC  = "alphabetic",
        IDEOGRAPHIC = "ideographic",
        BOTTOM      = "bottom"
    }
}
export default DrowTextBase;
