// @ts-check
import Utils from "../../util/Utils";
import DrowShapeBase from "./base/DrowShapeBase";
import DrowContainerBase from "./base/DrowContainerBase";

export class DrowSimpleTable extends DrowContainerBase {

    public drowObjLine: DrowShapeBase;        // 外周枠用
    public drowObjHLine: DrowShapeBase;       // 内横線用
    public drowObjVLine: DrowShapeBase;       // 内縦線用

    public tableParam:DrowSimpleTable.TableParam = {
        cellMaxCnt: { row: 0, col: 0 },         // 最大行列数
        cellSize: { width: 0, height: 0 },      // セルの初期サイズ
        tableSize: { width: 0, height: 0 },     // テーブルのサイズ
    }

    protected rowParamArray:Array<DrowSimpleTable.RowParam>;
    protected colParamArray:Array<DrowSimpleTable.ColParam>;


    constructor(uuid: string = '') {
        super(uuid);

        this.drowObjLine = new DrowShapeBase();
        this.drowObjHLine = new DrowShapeBase();
        this.drowObjVLine = new DrowShapeBase();

        // 一番外枠は塗りつぶしあり
        this.drowObjLine.fillFlg = true;

        // 初期値設定
        this.addChild(this.drowObjLine);
        this.addChild(this.drowObjHLine);
        this.addChild(this.drowObjVLine);

        // 初期化
        this.rowParamArray = new Array<DrowSimpleTable.RowParam>;
        this.colParamArray = new Array<DrowSimpleTable.ColParam>;
    }

    /**
     * 表の初期値を設定する
     * @param maxRow  最大行数
     * @param maxCol 最大列数
     * @param cellWidth  1セル当たりの幅
     * @param cellHeight  １セル当たりの高さ
     */
    public create(maxRow: number, maxCol: number, cellWidth: number, cellHeight: number): void {
        // 各パラメタ初期化
        this.tableParam.cellMaxCnt.row = maxRow;
        this.tableParam.cellMaxCnt.col = maxCol;
        this.tableParam.cellSize.width = cellWidth;
        this.tableParam.cellSize.height = cellHeight;
        this.tableParam.tableSize.width = maxCol * cellWidth;
        this.tableParam.tableSize.height = maxRow * cellHeight;

        // 行の設定
        this.rowParamArray = new Array<DrowSimpleTable.RowParam>(maxRow);
        for(var n=0; n<this.rowParamArray.length;n++)
            this.rowParamArray[n] = {height:cellHeight, color:"#888888"};
        // 列の設定
        this.colParamArray = new Array<DrowSimpleTable.ColParam>(maxCol);
        for(var n=0; n<this.colParamArray.length;n++)
            this.colParamArray[n] = {width:cellWidth, color:"#FFFFFF"};

        this.repaint();
    }

    /**
     * パラメタが変わったときに呼び出すことで表を更新する
     *
     * @memberof DrowSimpleTable
     */
    public repaint(): void {
        // 外罫線描画
        this.drowObjLine.begin();
        this.drowObjLine.graphics
            .moveTo(0, 0)
            .lineTo(this.tableParam.tableSize.width, 0)
            .lineTo(this.tableParam.tableSize.width, this.tableParam.tableSize.height)
            .lineTo(0, this.tableParam.tableSize.height)
            .lineTo(0, 0);
        this.drowObjLine.end();

        // 内罫線
        let sumHeight:number=0, sumWidth:number=0;

        // 一部の行、列だけ幅、高さを変えられるように積み上げ式で座標を計算する
        this.drowObjVLine.begin();
        for (let v = 0; v < this.tableParam.cellMaxCnt.col - 1; v++) {
            if(Utils.isEmpty(this.colParamArray) || v > this.colParamArray.length-1)
                sumWidth += this.tableParam.cellSize.width;
            else
                sumWidth += this.colParamArray[v].width;
            this.drowObjVLine.graphics
                .moveTo(sumWidth, 0)
                .lineTo(sumWidth, this.tableParam.tableSize.height);
        }
        this.drowObjVLine.end();

        this.drowObjHLine.begin();
        for (let h = 0; h < this.tableParam.cellMaxCnt.row - 1; h++) {
            if(Utils.isEmpty(this.rowParamArray) || h > this.rowParamArray.length-1)
                sumHeight += this.tableParam.cellSize.height;
            else
                sumHeight += this.rowParamArray[h].height;
            this.drowObjHLine.graphics
                .moveTo(0, sumHeight)
                .lineTo(this.tableParam.tableSize.width, sumHeight);
        }
        this.drowObjHLine.end();
    }

    /**
     * 罫線表示書式変更(横線)
     * @param color 線の色
     * @param thickness 線の太さ
     * @param style 実線／破線
     */
    public setHLineStyle(color: string, thickness: number, style: DrowShapeBase.LineStyle): void {
        this.drowObjHLine.lineColor = color;
        this.drowObjHLine.thickness = thickness;
        this.drowObjHLine.style = style;
    }
    /**
     * 罫線表示書式変更(縦線)
     * @param color 線の色
     * @param thickness 線の太さ
     * @param style 実線／破線
     */
    public setVLineStyle(color: string, thickness: number, style: DrowShapeBase.LineStyle): void {
        this.drowObjVLine.lineColor = color;
        this.drowObjVLine.thickness = thickness;
        this.drowObjVLine.style = style;
    }
    /**
     * 罫線表示書式変更(外周)
     * @param color 線の色
     * @param thickness 線の太さ
     * @param style 実線／破線
     */
    public setLineStyle(color: string, thickness: number, style: DrowShapeBase.LineStyle): void {
        this.drowObjLine.lineColor = color;
        this.drowObjLine.thickness = thickness;
        this.drowObjLine.style = style;
    }

    /**
     * テーブルの背景色変更
     * @param bgColor 色
     */
    public setTableStyle(bgColor: string) {
        this.drowObjLine.bgColor = bgColor;
    }

    /**
     * テーブルの最大行数追加
     * @param rowCnt 追加行数
     */
    public addMaxRow(rowCnt:number=1){
        // 行数の追加
        this.tableParam.cellMaxCnt.row += rowCnt;
        // テーブルサイズの追加
        this.tableParam.tableSize.height = this.tableParam.cellMaxCnt.row * this.tableParam.cellSize.height;

        let addRow:DrowSimpleTable.RowParam = {height:this.tableParam.cellSize.height, color:"#FFFFFF"};
        this.rowParamArray.push(addRow);
    }

    /**
     * テーブルの最大行数変更
     * @param rowCnt 追加行数
     */
    public setMaxRow(rowCnt:number){
        // 行数の追加
        this.tableParam.cellMaxCnt.row = rowCnt;
        // テーブルサイズの追加
        this.tableParam.tableSize.height = this.tableParam.cellMaxCnt.row * this.tableParam.cellSize.height;

        let addRow:DrowSimpleTable.RowParam = {height:this.tableParam.cellSize.height, color:"#FFFFFF"};
        this.rowParamArray.push(addRow);
    }

    public getCellPos(row:number, coll:number, xStyle:DrowSimpleTable.XStyle = DrowSimpleTable.XStyle.LEFT, yStyle:DrowSimpleTable.YStyle = DrowSimpleTable.YStyle.TOP):createjs.Point{
        let result = new createjs.Point;

        result.x = this.tableParam.cellSize.width * (coll-1);
        result.y = this.tableParam.cellSize.height * (row-1);

        switch(xStyle){
            case DrowSimpleTable.XStyle.LEFT:
                result.x = result.x;
                break;
            case DrowSimpleTable.XStyle.MIDDLE:
                result.x = result.x + this.tableParam.cellSize.width/2;
                break;
            case DrowSimpleTable.XStyle.RIGHT:
                result.x = result.x + this.tableParam.cellSize.width;
                break;
            default:
                result.x = result.x;
                break;
        }

        switch(yStyle){
            case DrowSimpleTable.YStyle.TOP:
                result.y = result.y;
                break;
            case DrowSimpleTable.YStyle.MIDDLE:
                result.y = result.y + this.tableParam.cellSize.height/2;
                break;
            case DrowSimpleTable.YStyle.BUTTOM:
                result.y = result.y + this.tableParam.cellSize.height;
                break;
            default:
                result.y = result.y;
                break;
        }

        return result;
    }

}

export namespace DrowSimpleTable {
    export enum XStyle {
        LEFT = 'LEFT',
        MIDDLE = 'MIDDLE',
        RIGHT = 'RIGHT',
    }

    export enum YStyle {
        TOP = 'TOP',
        MIDDLE = 'MIDDLE',
        BUTTOM = 'BUTTOM',
    }

    export interface TableParam{
        cellMaxCnt:Utils.Range;
        cellSize: Utils.Size;
        tableSize: Utils.Size;
    }

    export interface RowParam{
        height:number;
        color:string;
    }

    export interface ColParam{
        width:number;
        color:string;
    }
}
export default DrowSimpleTable;
