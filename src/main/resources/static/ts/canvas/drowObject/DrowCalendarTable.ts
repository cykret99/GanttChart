// @ts-check

import DateUtils from "../../util/DateUtils";
import Utils from "../../util/Utils";
import { DrowTextBase } from "./base/DrowTextBase";
import DrowSimpleTable from "./DrowSimpleTable";

export default class DrowCalendarTable extends DrowSimpleTable {

    public fromDate: Date;
    public toDate: Date;

    public printHeader: Array<DrowTextBase>;

    constructor(uuid: string = '') {
        super(uuid);
    }

    /**
     * カレンダの初期作成を行う。
     * 見出し部分に日付が表示される。
     * @param {Date} fromDate カレンダ表示開始地点の日付
     * @param {Date} toDate カレンダ表示終わり地点の日付
     * @param {number} maxRow 最大行数
     * @param {number} cellWidth 1セル当たりの幅
     * @param {number} cellHeight １セル当たりの高さ
     * @param {boolean} [header=false] 見出し有無
     * @memberof DrowCalendarTable
     */
    public createCalendar(fromDate: Date, toDate: Date, maxRow: number, cellWidth: number, cellHeight: number, header: boolean = false): void {
        // from ~ to から表示日数を決定
        let diffDate: number;
        diffDate = DateUtils.calcDiffDate(fromDate, toDate)+1;

        // 初期化
        this.fromDate = fromDate;
        this.toDate = toDate;

        // 画面描画用日付を格納
        // もし既存のヘッダーがあったら削除
        if( Utils.isCollectionNotEmpty(this.printHeader) ){
            for (let i = 0; i < this.printHeader.length; i++) {
                this.removeChild(this.printHeader[i]);
            }
        }

        if (header) {
            this.printHeader = new Array<DrowTextBase>(diffDate);
            for (let i = 0; i < this.printHeader.length; i++) {
                let header = new DrowTextBase();
                header.setText(DateUtils.toMMDD_sh(DateUtils.addDate(fromDate, i)), "14px sans-serif", "#000000"); 
                header.setAlign(DrowTextBase.Align.CENTER);
                header.setBaseline(DrowTextBase.Baseline.MIDDLE);
                this.printHeader[i] = header;
                this.addChild(header);
            }
        }

        super.create(maxRow, diffDate, cellWidth, cellHeight);
        this.repaint();
    }

    /**
     * 与えられた日付のx座標を取得
     *
     * @param {Date} vDate x座標取得日付
     * @param {DrowSimpleTable.XStyle} style 取得対象のx表スタイル(LEFT, MIDDLE, RIGHT)
     * @return {*}  {number} 取得日付のx座標
     * @memberof DrowCalendarTable
     */
    public getXPos(vDate:Date, style:DrowSimpleTable.XStyle):number{
        let xWidth:number = this.tableParam.cellSize.width;
        let xPos = (DateUtils.calcDiffDate(this.fromDate, vDate)) * xWidth;
        let result:number;

        switch(style){
            case DrowSimpleTable.XStyle.LEFT:
                result = xPos;
                break;
            case DrowSimpleTable.XStyle.MIDDLE:
                result = xPos + xWidth/2;
                break;
            case DrowSimpleTable.XStyle.RIGHT:
                result = xPos + xWidth;
                break;
            default:
                result = xPos;
                break;
        }

        return result;
    }

    public repaint() {
        super.repaint();

        if (Utils.isCollectionNotEmpty(this.printHeader)) {
            // ヘッダー（1行目）に日付文字列を描画
            let sumWidth = 0;
            for (let v = 0; v < this.tableParam.cellMaxCnt.col && v < this.printHeader.length; v++) {
                let tWidth = 0;
                if(Utils.isEmpty(this.colParamArray) || v > this.colParamArray.length-1)
                    tWidth = this.tableParam.cellSize.height;
                else
                    tWidth = this.colParamArray[v].width;

                this.printHeader[v].x = sumWidth + (tWidth / 2);
                this.printHeader[v].y = this.tableParam.cellSize.height / 2;
                sumWidth += tWidth;
            }
        }
    }

}
