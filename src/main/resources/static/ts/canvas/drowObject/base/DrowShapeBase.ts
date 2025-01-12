// @ts-check

export class DrowShapeBase extends createjs.Shape{
    public lineColor: string;
    public bgColor: string;
    public thickness: number;
    public style: DrowShapeBase.LineStyle;

    public fillFlg : boolean;

    constructor() {
        super();

        // デフォルト値をセット
        this.lineColor = '#000000';
        this.bgColor = '#FFFFFF';
        this.thickness = 1;
        this.style = DrowShapeBase.LineStyle.NOMAL;
        this.fillFlg = false;
    }

    /**
     * 線を引く前開始の合図
     */
    public begin(){
        this.graphics.clear();
        // べた塗
        if(this.fillFlg){
            if(this.style == DrowShapeBase.LineStyle.NONE){
                this.graphics.beginFill(this.bgColor);
                this.graphics.beginStroke(this.bgColor);
                this.graphics.setStrokeStyle(this.thickness);
            }else{
                this.graphics.beginFill(this.bgColor);
                this.graphics.beginStroke(this.lineColor);
                this.graphics.setStrokeStyle(this.thickness);
            }
        }else{
            // スケルトン
            if(this.style == DrowShapeBase.LineStyle.NONE){
                this.graphics.beginStroke(this.bgColor);
                this.graphics.setStrokeStyle(this.thickness);
            }else{
                this.graphics.beginStroke(this.lineColor);
                this.graphics.setStrokeStyle(this.thickness);
            }
        }

        if (this.style == DrowShapeBase.LineStyle.DASH)
            this.graphics.setStrokeDash([4, 4], 0);
        else
            this.graphics.setStrokeDash([0, 0], 0);
    }

    /**
     * 線の終わりの合図
     */
    public end(){
        // べた塗
        if(this.fillFlg){
            this.graphics.endFill();
            this.graphics.endStroke();
        }else{
        // スケルトン
            this.graphics.endStroke();
        }
    }
}


export namespace DrowShapeBase {
    /**
     * 罫線のスタイル設定
     * @param NOMAL:実線
     * @param DASH：破線
     * @param NONE：なし
     */
    export enum LineStyle {
        NOMAL = 'NOMAL',
        DASH = 'DASH',
        NONE = 'NONE',
    }

}
export default DrowShapeBase;
