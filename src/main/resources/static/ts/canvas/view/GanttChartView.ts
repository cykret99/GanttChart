// @ts-check
import DrowCalendarTable from "../drowObject/DrowCalendarTable";
import DrowShapeBase from "../drowObject/base/DrowShapeBase";
import DrowSimpleTable from "../drowObject/DrowSimpleTable";
import DrowTaskBar from "../drowObject/DrowTaskBar";
import GanttChartEntity from "../entity/GanttChartEntity";
import StageBase from "../stage/StageBase";
import DateUtils from "../../util/DateUtils";
import Utils from "../../util/Utils";
import TaskBarEntity from "../entity/TaskBarEntity";
import HomeView from "./HomeView";
import ViewBase from "./ViewBase";

export default class GanttChartView extends ViewBase{
    protected homeView : HomeView;

    public drowTaskHeader: DrowSimpleTable; 
    public drowTaskList: DrowSimpleTable;
    public drowTableHeader: DrowCalendarTable;
    public drowTableData: DrowCalendarTable;
    public taskBarArray:Array<DrowTaskBar>;
    public drowThunderLine:DrowShapeBase;

    public viewFromDate:Date;
    public viewToDate:Date;

    // 表示パラメタ
    public taskWidth:number = 400;
    public cellWidth:number = 50;
    public cellHeight:number = 30;
    public ThunderLineDisplayFlg:boolean;

    public ganttChartParam = {
        selectUuid:''
    }

    constructor(stageObj: StageBase, homeView: HomeView) {
        super(stageObj);
        this.stageObj.drowMainContainer.addChild(this);
        this.homeView = homeView;
    }

    public init(): void {
        this.drowTaskHeader = new DrowSimpleTable();
        this.drowTaskList = new DrowSimpleTable();
        this.drowTableHeader = new DrowCalendarTable();
        this.drowTableData = new DrowCalendarTable();
        this.drowThunderLine = new DrowShapeBase();

        this.drowTaskHeader.setHLineStyle("#00FF00", 1, DrowShapeBase.LineStyle.DASH);
        this.drowTaskHeader.setVLineStyle("#0000FF", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTaskHeader.setLineStyle("#000000", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTaskHeader.setTableStyle("#FFFFDA");

        this.drowTaskList.setHLineStyle("#00FF00", 1, DrowShapeBase.LineStyle.DASH);
        this.drowTaskList.setVLineStyle("#0000FF", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTaskList.setLineStyle("#000000", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTaskList.setTableStyle("#FFFFDA");

        this.drowTableData.setHLineStyle("#00FF00", 1, DrowShapeBase.LineStyle.DASH);
        this.drowTableData.setVLineStyle("#0000FF", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTableData.setLineStyle("#000000", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTableData.setTableStyle("#FFFFDA");

        this.drowTableHeader.setHLineStyle("#00FF00", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTableHeader.setVLineStyle("#0000FF", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTableHeader.setLineStyle("#000000", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTableHeader.setTableStyle("#FFFFDA");

        this.drowThunderLine.lineColor = "#FF0000";
        this.drowThunderLine.thickness = 2;

        /** 初期描画期間設定 */
        this.viewFromDate = DateUtils.addDate(DateUtils.createDate(), -30);
        this.viewToDate = DateUtils.addDate(DateUtils.createDate(), 30);

        /** テーブル設定初期化 */
        this.drowTaskHeader.create(1, 1, this.taskWidth, this.cellHeight);
        this.drowTaskList.create(1, 1, this.taskWidth, this.cellHeight);
        this.drowTableHeader.createCalendar(this.viewFromDate, this.viewToDate, 1, this.cellWidth, this.cellHeight, true);
        this.drowTableData.createCalendar(this.viewFromDate, this.viewToDate, 1, this.cellWidth, this.cellHeight, false);

        /** 初期位置変更 */
        this.drowTaskList.y = this.cellHeight;
        this.drowTableData.y = this.cellHeight;
        this.drowTableData.x = this.taskWidth;
        this.drowTableHeader.x = this.taskWidth;

        /** stage登録 */
        this.stageObj.drowFrontContainer.addChild(this.drowTaskHeader)
        this.stageObj.drowVMainContainer.addChild(this.drowTaskList)
        this.stageObj.drowHMainContainer.addChild(this.drowTableHeader)
        this.stageObj.drowMainContainer.addChild(this.drowTableData)

        // カレンダーの幅に合わせてstageのサイズを変更
        this.stageObj.setStageWidth(this.drowTableHeader.tableParam.tableSize.width);
        this.stageObj.setStageHeight(this.drowTableHeader.tableParam.tableSize.height
            + this.drowTableData.tableParam.tableSize.height);

        // イナヅマ線表示
        this.ThunderLineDisplayFlg = true;
        this.drowTableData.addChild(this.drowThunderLine);

        // タスク格納用配列初期化
        this.taskBarArray = new Array<DrowTaskBar>();
    }

    /**
     * 現時点の設定でカレンダテーブルを再描画
     * 行列数の再計算を行い、拡張縮小を行う。
     * 
     * @memberof GanttChartView
     */
    public repaint() {

        // タスクバー数に列数を変更
        this.drowTableData.setMaxRow(this.taskBarArray.length);
        this.drowTaskList.setMaxRow(this.taskBarArray.length);
        this.drowTaskList.y = this.drowTaskHeader.tableParam.tableSize.height;
        this.drowTableData.y = this.drowTableHeader.tableParam.tableSize.height;

        // テーブル再描画
        this.drowTableHeader.createCalendar(this.viewFromDate, this.viewToDate, 1, this.cellWidth, this.cellHeight, true);
        this.drowTableData.createCalendar(this.viewFromDate, this.viewToDate, this.taskBarArray.length, this.cellWidth, this.cellHeight, false);
        this.drowTaskList.repaint();

        // カレンダーの幅に合わせてstageのサイズを変更
        this.stageObj.setStageWidth(this.drowTableHeader.tableParam.tableSize.width);
        this.stageObj.setStageHeight(this.drowTableHeader.tableParam.tableSize.height
            + this.drowTableData.tableParam.tableSize.height);

        // タスクを再描画
        this.removeAllTaskBar();
        this.taskBarArray.sort(DateUtils.sortInfoByTaskBar);
        for(let i=0; i<this.taskBarArray.length; i++){
            this.taskBarArray[i].init(this.taskBarArray[i].taskName, this.taskBarArray[i].progress, this.taskBarArray[i].planPeriod.fromDate, this.taskBarArray[i].planPeriod.toDate,
                this.taskBarArray[i].handleColor, this.taskBarArray[i].planColor, this.taskBarArray[i].resultColor, this.cellWidth, this.cellHeight, 15);
            this.taskBarArray[i].x = this.drowTableData.getXPos(this.taskBarArray[i].planPeriod.fromDate, DrowSimpleTable.XStyle.LEFT);
            this.taskBarArray[i].y = this.drowTableData.tableParam.cellSize.height * i;
            this.drowTableData.addChild(this.taskBarArray[i]);
        }
        // イナヅマ線を最前面へ移動
        this.drowTableData.bringToFront(this.drowThunderLine);
    }

    /**
     * カレンダの表示位置をシステム日付に移動
     *
     * @memberof GanttChartView
     */
    public setTodayViewPos(){
        let tmpPosX = this.drowTableData.getXPos(new Date(), DrowSimpleTable.XStyle.MIDDLE);
        let setPosX = this.stageObj.drowMainContainer.globalToLocal(this.drowTableData.localToGlobal(tmpPosX,0).x, 0);
        setPosX.x -= this.stageObj.getCanvasSize().width/2 + this.taskWidth/2;
        this.stageObj.setMainContenarXPos(setPosX.x);
    }

    /**
     * タスクバーをすべてオブジェクト削除する
     *
     * @return {*} 
     * @memberof GanttChartView
     */
    public removeAllTaskBar(){
        if(Utils.isCollectionEmpty(this.taskBarArray))
            return ;

        for(let i=0; i<this.taskBarArray.length; i++){
            this.drowTableData.removeChild(this.taskBarArray[i]);
        }
    }

    /**
     * 画面のテキストボックス（BridgeBox）へView設定を反映
     *
     * @memberof GanttChartView
     */
    public setBridgeBox(){
        let entity : GanttChartEntity = new GanttChartEntity;
        entity.viewFromDate = this.viewFromDate;
        entity.viewToDate = this.viewToDate;
        entity.taskBarArray = new Array<TaskBarEntity>;
        this.taskBarArray.forEach((val, key) => {
            let task = new TaskBarEntity;
            task.uuid               = val.uuid;
            task.taskName           = val.taskName;
            task.progress           = val.progress;
            task.planPeriodFrom     = val.planPeriod.fromDate;
            task.planPeriodTo       = val.planPeriod.toDate;
            task.handleColor        = val.handleColor
            task.planColor          = val.planColor
            task.resultColor        = val.resultColor
            task.memo = val.memo;
            entity.taskBarArray.push(task);
        });
        this.stageObj.setBridgeBox(JSON.stringify(entity));
    }

    /**
     *　画面のテキストボックス（BridgeBox）からデータを取得し、画面へ反映
     *
     * @memberof GanttChartView
     */
    public getBridgeBox(){
        let entity : GanttChartEntity = new GanttChartEntity;
        entity.jsonToEntity(this.stageObj.getBridgeBox());

        this.viewFromDate = entity.viewFromDate;
        this.viewToDate = entity.viewToDate;
        this.removeAllTaskBar();
        this.taskBarArray = new Array<DrowTaskBar>();

        entity.taskBarArray.forEach((val, key) => {
            let task = new DrowTaskBar;
            task.uuid            = val.uuid
            task.taskName         = val.taskName
            task.progress         = val.progress
            task.planPeriod       = {fromDate:val.planPeriodFrom, toDate:val.planPeriodTo};
            task.handleColor      = val.handleColor
            task.planColor        = val.planColor
            task.resultColor      = val.resultColor
            task.memo             = val.memo
            this.taskBarArray.push(task);
        });

        this.repaint();
        this.setTodayViewPos();
    }

    /** ---------------     イベント用関数        ---------------*/

    /**
     * 常に実行されるupdate関数
     *
     * @memberof GanttChartView
     */
    public update(){
        // イナヅマ線描画
        this.drowThunderLine.graphics.clear();
        if(this.ThunderLineDisplayFlg){
            // 当日座標取得
            let now = new Date();
            let timeRatio = (now.getHours()*60*60 + now.getMinutes()*60 + now.getSeconds())/(24*60*60+60*60+60);
            let todayPosX = this.drowTableData.getXPos(new Date(), DrowSimpleTable.XStyle.LEFT) + this.drowTableData.tableParam.cellSize.width * timeRatio;

            // 線描画開始
            this.drowThunderLine.begin();
            this.drowThunderLine.graphics.moveTo(todayPosX , 0);

            // タスクの実績場所を通る。実績が100%である場合、当日座標を通る。
            for(let i=0; i<this.taskBarArray.length; i++){
                var planBar:createjs.Rectangle = this.taskBarArray[i].getProgressBar();
                if(this.taskBarArray[i].progress >= 1.0){
                    this.drowThunderLine.graphics.lineTo((planBar.x+planBar.width > todayPosX) ? planBar.x+planBar.width : todayPosX, planBar.y + planBar.height/2);
                }else{
                    this.drowThunderLine.graphics.lineTo(planBar.x+planBar.width, planBar.y + planBar.height/2);
                }
            }
            this.drowThunderLine.graphics.lineTo(todayPosX , this.drowTableData.tableParam.tableSize.height);
            this.drowThunderLine.end();
        }

    }


    /**
     * マウスクリック時に呼ばれるメソッド。
     * 各タスクバーのselectを行い、内容を画面に描画する
     *
     * @param {createjs.Point} gPos
     * @param {createjs.Point} wPos
     * @param {createjs.Point} pPos
     * @param {createjs.Point} lPos
     * @param {StageBase} stage
     * @memberof GanttChartView
     */
    public mouseDown(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
        super.mouseDown(gPos, wPos, pPos, lPos, stage);
        let selectTask:DrowTaskBar;
        selectTask = this.taskBarArray.find((val, key) =>{
            let pos = this.localToLocal(lPos.x, lPos.y, val);
            return val.hitTest(pos.x, pos.y);
        }) as DrowTaskBar;

        if(Utils.isEmpty(selectTask))
            return ;

        // 現在描画しているオブジェクト以外の場合、描画を更新
        if(this.ganttChartParam.selectUuid != selectTask.uuid){
            this.ganttChartParam.selectUuid = selectTask.uuid;
            let entity = new TaskBarEntity();
            entity.taskBarToEntity(selectTask);
            this.stageObj.setInputDisp("main", JSON.stringify(entity));
        }
    }

    public updateTaskBarFromDisp(){
        let json = this.stageObj.getInputDisp("main");
        let entity = new TaskBarEntity();
        entity.dispToEntity(json);

        let taskBar:DrowTaskBar;
        if(Utils.isCollectionNotEmpty(this.taskBarArray)){
            this.taskBarArray.forEach((val, key) => {
                if(val.uuid == entity.uuid){
                    val.handleColor    = entity.handleColor;
                    val.planColor      = entity.planColor;
                    val.resultColor    = entity.resultColor;
                    val.taskName       = entity.taskName;
                    val.progress       = entity.progress;
                    val.planPeriod     = {fromDate:entity.planPeriodFrom, toDate: entity.planPeriodTo};
                    val.memo           = entity.memo;
                }
            });
        }
        this.setBridgeBox();
        this.repaint();
    }

    
    /**
     * デバッグ用
     *
     * @param {string} taskNmae
     * @param {Date} [fromDate=DateUtils.createDate()]
     * @param {Date} [toDate=DateUtils.createDate()]
     * @memberof GanttChartView
     */
    public addTaskBar(taskNmae:string, fromDate:Date=DateUtils.createDate(), toDate:Date=DateUtils.createDate()):void {
        let bar = new DrowTaskBar();
        bar.init(taskNmae, 0, fromDate, toDate, "yellow", "darkred", "blue", this.cellWidth, this.cellHeight, 10);
        this.taskBarArray.push(bar);

        this.drowTableData.addChild(bar);
        this.drowTableData.setMaxRow(this.taskBarArray.length);
        this.drowTaskList.setMaxRow(this.taskBarArray.length);

        this.taskBarArray.sort(DateUtils.sortInfoByTaskBar);

        this.repaint();
        this.setBridgeBox();
    }
}
