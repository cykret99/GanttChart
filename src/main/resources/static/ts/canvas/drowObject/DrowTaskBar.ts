// @ts-check

import DateUtils from "../../util/DateUtils";
import DrowContainerBase from "./base/DrowContainerBase";
import StageBase from "../stage/StageBase";
import Utils from "../../util/Utils";

export class DrowTaskBar extends DrowContainerBase {

    /**
     * タスク名
     *
     * @type {string}
     * @memberof DrowTaskBar
     */
    public taskName: string;

    /**
     * メモ
     *
     * @type {string}
     * @memberof DrowTaskBar
     */
    public memo: string;

    /**
     *　左つまみ描画オブジェクト
     *
     * @type {createjs.Shape}
     * @memberof DrowTaskBar
     */
    public leftHandle: createjs.Shape;       // 左つまみ
    /**
     * 右つまみ描画オブジェクト
     *
     * @type {createjs.Shape}
     * @memberof DrowTaskBar
     */
    public rightHandle: createjs.Shape;      // 右つまみ
    /**
     * タスク予定の描画オブジェクト
     *
     * @type {createjs.Shape}
     * @memberof DrowTaskBar
     */
    public planBar: createjs.Shape;          // 予定バー
    /**
     * タスク実績の描画オブジェクト
     *
     * @type {createjs.Shape}
     * @memberof DrowTaskBar
     */
    public resultBar: createjs.Shape;        // 実績バー

    public handleColor: string;
    public planColor: string;
    public resultColor: string;

    public progress: number;                 // 進捗割合
    public responsiblePerson:Array<string>;  // 担当者
    public planPeriod: DrowTaskBar.Period;   // タスク期間


    private beforePos: createjs.Rectangle    // 変更前座標
    public cellWidth: number;    // 1日単位の幅
    public heigth: number;       // バーの高さ
    public handleWidth: number;  // つまみの高さ

    // イベント用属性
    public attribute: DrowContainerBase.Attribute = {
        clickable: false,   // クリックイベント発生時に処理を行うか
        holdable: true,	    // ホールドされたら処理を行うか
        selectable: true,	// 選択されたら発生時に処理を行うか
    }

    public holdFlg = {
        leftHandle: false,
        rightHandle: false,
        planBar: false,
    }


    constructor(uuid: string = '') {
        super(uuid);

        this.leftHandle = new createjs.Shape();
        this.rightHandle = new createjs.Shape();
        this.planBar = new createjs.Shape();
        this.resultBar = new createjs.Shape();

        this.responsiblePerson = new Array<string>;

        this.addChild(this.planBar);
        this.addChild(this.resultBar);
        this.addChild(this.leftHandle);
        this.addChild(this.rightHandle);
    }

    /**
     * タスクバーの設定を行う
     *
     * @param {string} taskName タスク名
     * @param {Date} fDate 予定開始日付
     * @param {Date} tDate 予定修了日付
     * @param {number} dateCellWidth タスクバーの1日当たりの幅
     * @param {number} heigth タスクバーの高さ
     * @param {number} handleWidth つまみ表示幅
     * @memberof DrowTaskBar
     */
    init(taskName: string, progress: number, fDate: Date, tDate: Date, handleColor: string, planColor: string, resultColor: string,
         dateCellWidth: number, heigth: number, handleWidth: number) {
        this.taskName = taskName;
        this.progress = progress;
        this.planPeriod = { fromDate: fDate, toDate: tDate };
        this.cellWidth = dateCellWidth;
        this.heigth = heigth;
        this.handleWidth = handleWidth;

        this.handleColor = handleColor;
        this.planColor = planColor;
        this.resultColor = resultColor;

        let width: number = this.calcBarWidth(this.planPeriod.fromDate, this.planPeriod.toDate);
        this.planBar.graphics.drawRect(0, 0, width, this.heigth * 0.9);

        this.setBounds(0, 0, width, heigth);
        this.repaint();
    }

    /**
     * 描画内容を削除
     *
     * @public
     * @memberof DrowTaskBar
     */
    public clear() {
        this.leftHandle.graphics.clear();
        this.planBar.graphics.clear();
        this.resultBar.graphics.clear();
        this.rightHandle.graphics.clear();
    }

    /**
     * 日付を基にタスクバーを描画する
     *
     * @public
     * @memberof DrowTaskBar
     */
    public repaint() {
        // 日数からBarのサイズを取得
        let width: number = this.calcBarWidth(this.planPeriod.fromDate, this.planPeriod.toDate);

        this.repaintPlanBar(width);
    }

    /**
     * 予定バーの書き直し。併せて左右つまみ、予定バーを描き直す。
     *
     * @protected
     * @param {number} width 予定バーのサイズ
     * @memberof DrowTaskBar
     */
    protected repaintPlanBar(width: number) {
        // 事前に削除
        this.clear();

        let handleColor = this.handleColor;
        if (Utils.isEmpty(handleColor))
            handleColor = "yellow";

        let planColor = this.planColor;
        if (Utils.isEmpty(planColor))
            planColor = "DarkRed";

        let resultColor = this.resultColor;
        if (Utils.isEmpty(resultColor))
            resultColor = "Blue";

        let hightOffSet = this.heigth * 0.2;

        // 左つまみ
        this.leftHandle.graphics.beginFill(handleColor);
        this.leftHandle.graphics.beginStroke("black");
        this.leftHandle.graphics.drawRect(0, hightOffSet/2 , this.handleWidth, this.heigth - hightOffSet);
        this.leftHandle.setBounds(0, hightOffSet/2 , this.handleWidth, this.heigth - hightOffSet);

        // 予定バー
        this.planBar.graphics.beginFill(planColor);
        this.planBar.graphics.beginStroke("black");
        this.planBar.graphics.drawRect(0, hightOffSet/2, width, this.heigth - hightOffSet);
        this.planBar.setBounds(0, hightOffSet/2, width, this.heigth - hightOffSet);

        // 実績バー
        this.resultBar.graphics.beginFill(resultColor);
        this.resultBar.graphics.beginStroke("black");
        this.resultBar.graphics.drawRect(0, this.heigth * 0.7 - hightOffSet/2, width * this.progress, this.heigth * 0.3);
        this.resultBar.setBounds(0, this.heigth * 0.7 - hightOffSet/2, width * this.progress, this.heigth * 0.3);

        // 右つまみ
        this.rightHandle.graphics.beginFill(handleColor);
        this.rightHandle.graphics.beginStroke("black");
        this.rightHandle.graphics.drawRect(width - this.handleWidth, hightOffSet/2, this.handleWidth, this.heigth - hightOffSet);
        this.rightHandle.setBounds(width - this.handleWidth, hightOffSet/2, this.handleWidth, this.heigth - hightOffSet);
    }

    /**
     * タスクバーの長さを計算する。
     *
     * @protected
     * @param {Date} fromDate 予定開始日付
     * @param {Date} toDate 予定修了日付
     * @return {*} 
     * @memberof DrowTaskBar
     */
    protected calcBarWidth(fromDate: Date, toDate: Date) {
        let dates: number = 0;

        dates = DateUtils.calcDiffDate(fromDate, toDate) + 1;
        return dates * this.cellWidth;
    }

    /**
     * 進捗割合の更新。　0～1の少数をセットする。
     *
     * @param {number} ratio 進捗割合
     * @memberof DrowTaskBar
     */
    public setProgress(ratio: number): void {
        this.progress = ratio;
    }

    /**
     * 実績バーのRectangle取得
     *
     * @return {*}  {createjs.Rectangle}
     * @memberof DrowTaskBar
     */
    public getProgressBar():createjs.Rectangle{
        let result:createjs.Rectangle = new createjs.Rectangle;
        let resultBar:createjs.Rectangle = this.resultBar.getBounds();

        result.x = this.x + resultBar.x;
        result.y = this.y + resultBar.y;
        result.width = resultBar.width;
        result.height = resultBar.height;

        return result;
    }


    /**
     * Holdされた状態でマウスを移動した時に呼ばれる関数
     * 左右のつまみをホールドし場合、左右にplan barを伸ばす
     * plan barをホールドした場合、左右に異動させる
     *
     * @param {createjs.Point} gPos グローバル座標のマウス移動先
     * @param {createjs.Point} wPos ワールド座標のマウス移動先
     * @param {createjs.Point} pPos 親オブジェクト座標のマウス移動先
     * @param {createjs.Point} lPos ローカルオブジェクト座標のマウス移動先
     * @param {StageBase} stage オブジェクトが登録されたstage
     * @memberof DrowContainerBase
     */
    public mouseHoldMoveEvent(gPos: createjs.Point, wPos: createjs.Point, pPos: createjs.Point, lPos: createjs.Point, stage: StageBase): void {
        // クリック時の座標にて処理
        let beforeFromPos = this.beforePos.x;
        let beforeToPos = beforeFromPos + this.beforePos.width;
        let afterFromPos = Math.floor((pPos.x - this.offSet.x) / this.cellWidth) * this.cellWidth;
        let afterToPos = Math.floor(pPos.x / this.cellWidth) * this.cellWidth + this.cellWidth;

        if (this.holdFlg.leftHandle) {
            if (afterFromPos >= beforeToPos)  // 左つまみを右に移動できない
                return;

            let width = beforeToPos - afterFromPos;
            this.repaintPlanBar(width);
            this.setBounds(this.x, this.y, width, this.heigth);
            this.x = afterFromPos;
        } else if (this.holdFlg.rightHandle) {
            if (afterToPos <= beforeFromPos)  // 右つまみを左に移動できない
                return;

            let width = afterToPos - beforeFromPos;
            this.repaintPlanBar(width);
            this.setBounds(this.x, this.y, width, this.heigth);
        } else if (this.holdFlg.planBar) {
            this.x = afterFromPos; // 日付単位で移動させる
        }
    }


    public mouseHoldDownEvent(gPos: createjs.Point, wPos: createjs.Point, pPos: createjs.Point, lPos: createjs.Point, stage: StageBase): void {
        // クリック時の期間を保持
        let rectangle: createjs.Rectangle = this.getBounds();
        this.beforePos = new createjs.Rectangle(this.x, this.y, rectangle.width, rectangle.height);

        // ホールドした位置によって対応を変更
        if (this.leftHandle.hitTest(lPos.x, lPos.y)) {
            console.log("hold left handle");
            this.holdFlg.leftHandle = true;
            this.holdFlg.rightHandle = false;
            this.holdFlg.planBar = false;
        } else if (this.rightHandle.hitTest(lPos.x, lPos.y)) {
            console.log("hold right handle");
            this.holdFlg.leftHandle = false;
            this.holdFlg.rightHandle = true;
            this.holdFlg.planBar = false;
        } else if (this.planBar.hitTest(lPos.x, lPos.y)) {
            console.log("hold plan bar");
            this.holdFlg.leftHandle = false;
            this.holdFlg.rightHandle = false;
            this.holdFlg.planBar = true;
        }
    }

    /**
     * マウスUp時のイベント
     * hold状態の開放、変更後の予定日付を反映する
     *
     * @param {createjs.Point} gPos グローバル座標のマウス移動先
     * @param {createjs.Point} wPos ワールド座標のマウス移動先
     * @param {createjs.Point} pPos 親オブジェクト座標のマウス移動先
     * @param {createjs.Point} lPos ローカルオブジェクト座標のマウス移動先
     * @param {StageBase} stage 描画Stage
     * @memberof DrowTaskBar
     */
    public mouseHoldUpEvent(gPos: createjs.Point, wPos: createjs.Point, pPos: createjs.Point, lPos: createjs.Point, stage: StageBase): void {
        let bounds: createjs.Rectangle = this.getBounds();

        let afterFromPos = this.x;
        let afterToPos = this.x + bounds.width;

        let subFrom = afterFromPos - this.beforePos.x;
        let subTo = afterToPos - (this.beforePos.x + this.beforePos.width);

        this.planPeriod.fromDate = DateUtils.addDate(this.planPeriod.fromDate, subFrom / this.cellWidth);
        this.planPeriod.toDate = DateUtils.addDate(this.planPeriod.toDate, subTo / this.cellWidth);

        this.setBounds(this.x, this.y, Math.abs(afterToPos - afterFromPos), bounds.height);
        console.log("FROM:" + this.planPeriod.fromDate.toLocaleDateString() + " TO:" + this.planPeriod.toDate.toLocaleDateString());
    }


    /**
     * マウスUp時のイベント
     * select状態の処理
     *
     * @param {createjs.Point} gPos グローバル座標のマウス移動先
     * @param {createjs.Point} wPos ワールド座標のマウス移動先
     * @param {createjs.Point} pPos 親オブジェクト座標のマウス移動先
     * @param {createjs.Point} lPos ローカルオブジェクト座標のマウス移動先
     * @param {StageBase} stage 描画Stage
     * @memberof DrowTaskBar
     */
    public mouseSelectUpEvent(gPos: createjs.Point, wPos: createjs.Point, pPos: createjs.Point, lPos: createjs.Point, stage: StageBase): void {
    }

}


export namespace DrowTaskBar {
    export interface Period {
        fromDate: Date;
        toDate: Date;
    }
}
export default DrowTaskBar;
