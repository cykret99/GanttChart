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
import HomeEntity from "../entity/HomeEntity";
import DrowTextBase from "../drowObject/base/DrowTextBase";
import RestAPI from "../../rest/RestAPI";
import CanvasConst from "../common/CanvasConst";
import DrowButtonBase from "../drowObject/base/DrowButtonBase";
import { AxiosResponse } from "axios";

export default class GanttChartView extends ViewBase{
    protected homeView : HomeView;
    protected type :string;

    public drowTaskHeader: DrowSimpleTable; 
    public drowTaskList: DrowSimpleTable;
    public drowTableHeader: DrowCalendarTable;
    public drowTableData: DrowCalendarTable;

    public taskBarArray:Array<DrowTaskBar>;     // タスクバー

    public taskNameArray:Map<string, DrowTextBase>;         // プロジェクト表示時はこちらを使う　タスク名
    public taskNameButtonArray:Map<string, DrowButtonBase>;   // グループ表示時はこちらを使う　タスク名

    public drowThunderLine:DrowShapeBase;       // イナヅマ線

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

    constructor(stageObj: StageBase, homeView: HomeView, type:string) {
        super(stageObj);
        this.stageObj.drowGroundContainer.addChild(this);
        this.homeView = homeView;
        this.type = type;
    }

    public init(): void {
        this.drowTaskHeader = new DrowSimpleTable();
        this.drowTaskList = new DrowSimpleTable();
        this.drowTableHeader = new DrowCalendarTable();
        this.drowTableData = new DrowCalendarTable();
        this.drowThunderLine = new DrowShapeBase();

        this.drowTaskHeader.setHLineStyle("#000000", 1, DrowShapeBase.LineStyle.DASH);
        this.drowTaskHeader.setVLineStyle("#0000FF", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTaskHeader.setLineStyle("#000000", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTaskHeader.setTableStyle("#FFFFDA");

        this.drowTaskList.setHLineStyle("#000000", 1, DrowShapeBase.LineStyle.DASH);
        this.drowTaskList.setVLineStyle("#0000FF", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTaskList.setLineStyle("#000000", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTaskList.setTableStyle("#FFFFDA");

        this.drowTableData.setHLineStyle("#000000", 1, DrowShapeBase.LineStyle.DASH);
        this.drowTableData.setVLineStyle("#0000FF", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTableData.setLineStyle("#000000", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowTableData.setTableStyle("#FFFFDA");

        this.drowTableHeader.setHLineStyle("#000000", 1, DrowShapeBase.LineStyle.NOMAL);
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

        /** タスクヘッダ記述  */
        let taskHead = new DrowTextBase;
        taskHead.setText("タスク名", "14px sans-serif", "#000000"); 
        taskHead.setAlign(DrowTextBase.Align.CENTER);
        taskHead.setBaseline(DrowTextBase.Baseline.MIDDLE);
        taskHead.x = this.taskWidth/2;
        taskHead.y = this.cellHeight/2;
        this.drowTaskHeader.addChild(taskHead);

        /** 初期位置変更 */
        this.drowTaskHeader.y = HomeView.viewParam.contantPos.y;
        this.drowTableHeader.y = HomeView.viewParam.contantPos.y;
    
        this.drowTaskList.y = HomeView.viewParam.contantPos.y + this.cellHeight;
        this.drowTableData.y = HomeView.viewParam.contantPos.y + this.cellHeight;
        this.drowTableData.x = this.taskWidth;
        this.drowTableHeader.x = this.taskWidth;

        /** stage登録 */
        this.stageObj.drowHVMainContainer.addChild(this.drowTaskHeader)
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
        this.taskNameArray = new Map<string, DrowTextBase>();
        this.taskNameButtonArray = new Map<string, DrowButtonBase>();

        // お気に入りボタン設定反映
        const favorites = document.querySelector("#favoIcon") as HTMLInputElement
        if(Utils.isNotEmpty(favorites)){
            if(this.homeView.homeEntity.favorites == "1"){
                favorites.classList.add("bi-star-fill");
                favorites.classList.remove("bi-star");
            }else{
                favorites.classList.add("bi-star");
                favorites.classList.remove("bi-star-fill");
            }
        }

        // 初期描画
        this.getBridgeBox();
        this.setTodayViewPos();
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

        // テーブル再描画
        this.drowTableHeader.createCalendar(this.viewFromDate, this.viewToDate, 1, this.cellWidth, this.cellHeight, true);
        this.drowTableData.createCalendar(this.viewFromDate, this.viewToDate, this.taskBarArray.length, this.cellWidth, this.cellHeight, false);
        this.drowTaskList.repaint();

        // カレンダーの幅に合わせてstageのサイズを変更
        this.stageObj.setStageWidth(this.drowTableHeader.tableParam.tableSize.width);
        this.stageObj.setStageHeight(this.drowTableHeader.tableParam.tableSize.height
            + this.drowTableData.tableParam.tableSize.height
            + HomeView.viewParam.contantPos.y
        );

        // タスクを再描画
        this.removeAllTaskBar();
        this.taskBarArray.sort(DateUtils.sortInfoByTaskBar);
        for(let i=0; i<this.taskBarArray.length; i++){
            // タスクバー描画
            this.taskBarArray[i].init(this.taskBarArray[i].taskName, this.taskBarArray[i].progress, this.taskBarArray[i].planPeriod.fromDate, this.taskBarArray[i].planPeriod.toDate,
                this.taskBarArray[i].handleColor, this.taskBarArray[i].planColor, this.taskBarArray[i].resultColor, this.cellWidth, this.cellHeight, 15);
            this.taskBarArray[i].x = this.drowTableData.getXPos(this.taskBarArray[i].planPeriod.fromDate, DrowSimpleTable.XStyle.LEFT);
            this.taskBarArray[i].y = this.drowTableData.tableParam.cellSize.height * i;
            this.drowTableData.addChild(this.taskBarArray[i]);

            // タスク名描画
            if(this.type == CanvasConst.CONTANER_TYPE_PROJECT){
                let taskBarName = this.taskNameArray.get(this.taskBarArray[i].uuid) as DrowTextBase;
                if(Utils.isDefined(taskBarName)){
                    taskBarName.x = 10;
                    taskBarName.y = this.drowTableData.tableParam.cellSize.height * i + this.drowTableData.tableParam.cellSize.height/2;
                    this.drowTaskList.addChild(taskBarName);
                }
            }else if(this.type == CanvasConst.CONTANER_TYPE_GROUP){
                let taskBarNameButton = this.taskNameButtonArray.get(this.taskBarArray[i].uuid) as DrowButtonBase;
                if(Utils.isDefined(taskBarNameButton)){
                    taskBarNameButton.x = 3;
                    taskBarNameButton.y = this.drowTableData.tableParam.cellSize.height * i + 3;
                    this.drowTaskList.addChild(taskBarNameButton);
                }
            }
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
     * カレンダの表示位置をシステム日付に移動
     *
     * @memberof GanttChartView
     */
    public setEndViewPos(){
        let tmpPosX = this.stageObj.stageParam.size.width;
        let setPosX = tmpPosX - this.stageObj.getCanvasSize().width
        this.stageObj.setMainContenarXPos(setPosX);
    }

    public setStartViewPos(){
        this.stageObj.setMainContenarXPos(0);
    }

    /**
     * タスク位置に画面を異動
     *
     * @param {string} uuid
     * @return {*} 
     * @memberof GanttChartView
     */
    public setTaskBarViewPos(uuid:string):void{
        let taskBar:DrowTaskBar;
        let row:number = 0;
        taskBar = this.taskBarArray.find((val, key) => {
            if(val.uuid == uuid){
                row = key;
                return true;
            }
            return false;
        }) as DrowTaskBar;

        if(Utils.isEmpty(taskBar)){
            return;
        }

        let tmpPosX = this.drowTableData.getXPos(taskBar.planPeriod.fromDate, DrowSimpleTable.XStyle.MIDDLE);
        let tmpPosY = this.drowTableData.getYPos(row, DrowSimpleTable.YStyle.BUTTOM);
        let point = this.drowTableData.localToGlobal(tmpPosX,tmpPosY);
        let setPos = this.stageObj.drowMainContainer.globalToLocal(point.x, point.y);
        setPos.x -= this.stageObj.getCanvasSize().width/2 + this.taskWidth/2;
        setPos.y -= this.stageObj.getCanvasSize().height - this.cellHeight;
        this.stageObj.setMainContenarXPos(setPos.x);
        this.stageObj.setMainContenarYPos(setPos.y);
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

        this.taskNameArray.forEach((val, key) => {
            this.drowTaskList.removeChild(val);
        });

        this.taskNameButtonArray.forEach((val, key) => {
            this.drowTaskList.removeChild(val);
        });
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
        let homeEntity :HomeEntity = new HomeEntity;
        let entity : GanttChartEntity;
        homeEntity.jsonToEntity(this.stageObj.getBridgeBox());
        entity = homeEntity.ganttchartForm;

        this.viewFromDate = entity.viewFromDate;
        this.viewToDate = entity.viewToDate;
        this.removeAllTaskBar();
        this.taskBarArray = new Array<DrowTaskBar>();
        this.taskNameArray = new Map<string, DrowTextBase>();
        this.taskNameButtonArray = new Map<string, DrowButtonBase>();

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
            if(this.type == CanvasConst.CONTANER_TYPE_GROUP){
                // グループ描画の時はクリックできなくする
                task.attribute.clickable = false;
                task.attribute.holdable = false;
                task.attribute.selectable = false;
            }

            this.taskBarArray.push(task);

            if(this.type == CanvasConst.CONTANER_TYPE_PROJECT){
                let taskname = new DrowTextBase;
                taskname.setText(task.taskName, "14px sans-serif", "#000000"); 
                taskname.setAlign(DrowTextBase.Align.LEFT);
                taskname.setBaseline(DrowTextBase.Baseline.MIDDLE);
                this.taskNameArray.set(task.uuid, taskname);

            }else if(this.type == CanvasConst.CONTANER_TYPE_GROUP){
                let tasknameButton = new DrowButtonBase(task.taskName, "#AAAAAA", "#FFFFDA", this.taskWidth-6, this.cellHeight-6, 5, DrowTextBase.Align.LEFT, DrowTextBase.Baseline.MIDDLE);
                this.taskNameButtonArray.set(task.uuid, tasknameButton);
            }
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
                }else if(this.taskBarArray[i].progress <= 0.0){
                    this.drowThunderLine.graphics.lineTo((planBar.x+planBar.width > todayPosX) ? todayPosX : planBar.x+planBar.width, planBar.y + planBar.height/2);
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

        if(Utils.isNotEmpty(selectTask)){
            // 現在描画しているオブジェクト以外の場合、描画を更新
            if(this.ganttChartParam.selectUuid != selectTask.uuid){
                this.ganttChartParam.selectUuid = selectTask.uuid;
                let entity = new TaskBarEntity();
                entity.taskBarToEntity(selectTask);
                this.stageObj.setInputDisp("main", JSON.stringify(entity));
            }
        }

        // グループ描画の場合プロジェクト繊維判定
        if(this.type == CanvasConst.CONTANER_TYPE_GROUP){
            let selectProject:DrowButtonBase;
            let nextUuid:string = "";
            this.taskNameButtonArray.forEach((val, key) =>{
                let pos = this.localToLocal(lPos.x, lPos.y, val);
                if(val.hitTest(pos.x, pos.y)){
                    selectProject = val;
                    nextUuid = key;
                }
                return;
            });

            if(Utils.isEmpty(nextUuid))
                return;

            let homeEntity = new HomeEntity;
            homeEntity.dispToEntity(this.stageObj.getBridgeBox());
            homeEntity.containsType = CanvasConst.CONTANER_TYPE_PROJECT;
            homeEntity.viewUuid = nextUuid;
            const csrf = document.querySelector("#csrf") as HTMLInputElement
            let body = new FormData()
            body.append('bridgeBox', JSON.stringify(homeEntity));
            let THIS = this;
            RestAPI.client.post(function(eve){THIS.response(eve);}, CanvasConst.getContext() + "home/changeView", body,
            {
                headers:{'X-CSRF-TOKEN': csrf.value}
            });
        }
    }

    public updateTaskBarFromDisp(){
        let json = this.stageObj.getInputDisp();
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
     * タスクバーを画面に追加する。
     * タスク期間は表示されているタスクの最後のものと開始日付が一致する。
     * 登録済みタスクが0である場合、システム日付を開始日とする
     *
     * @memberof GanttChartView
     */
    public addTaskBar():void {
        let bar = new DrowTaskBar();
        let fromDate:Date;
        let toDate:Date;

        if(Utils.isCollectionEmpty(this.taskBarArray)){
            fromDate = new Date;
            toDate = new Date;
        }else{
            fromDate = this.taskBarArray[this.taskBarArray.length-1].planPeriod.fromDate;
            toDate = fromDate;
        }

        bar.init("新しいタスク", 0, fromDate, toDate, "#FFFFA0", "#00FF00", "#0000FF", this.cellWidth, this.cellHeight, 10);

        let taskname = new DrowTextBase;
        taskname.setText(bar.taskName, "14px sans-serif", "#000000"); 
        taskname.setAlign(DrowTextBase.Align.LEFT);
        taskname.setBaseline(DrowTextBase.Baseline.MIDDLE);


        let entity = new TaskBarEntity;

        entity.uuid         = bar.uuid;
        entity.handleColor  = bar.handleColor;
        entity.planColor    = bar.planColor;
        entity.resultColor  = bar.resultColor;
        entity.taskName     = bar.taskName;
        entity.progress     = bar.progress;
        entity.planPeriodFrom   = bar.planPeriod.fromDate;
        entity.planPeriodTo     = bar.planPeriod.toDate;
        entity.memo         = bar.memo;

        // タスクに紐づかない値をセットする
        entity.deleteFlg = "0";
        entity.groupUuid = this.homeView.getHomeView().viewUuid;

        let body = new FormData()
        body.append('bridgeBox', JSON.stringify(entity));
        RestAPI.client.post(function(eve){;}, CanvasConst.getContext() + "home/updateTaskBar", body,
        {
            headers:{'X-CSRF-TOKEN': CanvasConst.getCsrf()}
        });


        this.taskBarArray.push(bar);
        this.taskNameArray.set(bar.uuid, taskname);

        this.drowTableData.addChild(bar);
        this.drowTableData.setMaxRow(this.taskBarArray.length);
        this.drowTaskList.setMaxRow(this.taskBarArray.length);

        this.setTaskBarViewPos(bar.uuid);

        this.repaint();
    }

    /**
     * 画面上に選択されているタスクバーを削除する
     *
     * @param {string} uuid
     * @memberof GanttChartView
     */
    public removeTaskBar():void {
        let uuid:string;
        let json = this.stageObj.getInputDisp();
        let entity = new TaskBarEntity();
        entity.dispToEntity(json);
        uuid = entity.uuid;

        let bar:DrowTaskBar;
        let row:number = 0;
        bar = this.taskBarArray.find((val, key) => {
            if(val.uuid == uuid){
                row = key;
                return true;
            }
            return false;
        }) as DrowTaskBar;

        if(Utils.isEmpty(bar))
            return;

        let taskName : DrowTextBase;
        taskName = this.taskNameArray.get(bar.uuid) as DrowTextBase;

        if(Utils.isEmpty(taskName))
            return;

        // タスクに紐づかない値をセットする
        entity.deleteFlg = "1";
        entity.groupUuid = this.homeView.getHomeView().viewUuid;

        let body = new FormData()
        body.append('bridgeBox', JSON.stringify(entity));
        RestAPI.client.post(function(eve){;}, CanvasConst.getContext() + "home/updateTaskBar", body,
        {
            headers:{'X-CSRF-TOKEN': CanvasConst.getCsrf()}
        });


        this.drowTableData.removeChild(bar);
        this.drowTaskList.removeChild(taskName);

        this.taskBarArray.splice(row,1);
        this.taskNameArray.delete(bar.uuid);

        this.drowTableData.setMaxRow(this.taskBarArray.length);
        this.drowTaskList.setMaxRow(this.taskBarArray.length);

        this.setTaskBarViewPos(bar.uuid);

        this.repaint();
        this.stageObj.clearInputDisp();
    }

    /**
     * 画面に表示されたタスクバーの内容でデータベースを更新する。
     *
     * @memberof GanttChartView
     */
    public updateTaskBar():void {
        let uuid:string;
        let json = this.stageObj.getInputDisp();
        let entity = new TaskBarEntity();
        entity.dispToEntity(json);
        uuid = entity.uuid;

        let bar:DrowTaskBar;
        let row:number = 0;
        bar = this.taskBarArray.find((val, key) => {
            if(val.uuid == uuid){
                row = key;
                return true;
            }
            return false;
        }) as DrowTaskBar;

        if(Utils.isEmpty(bar))
            return;

        let taskName : DrowTextBase;
        taskName = this.taskNameArray.get(bar.uuid) as DrowTextBase;

        if(Utils.isEmpty(taskName))
            return;

        // タスクに紐づかない値をセットする
        entity.groupUuid = this.homeView.getHomeView().viewUuid;

        let body = new FormData()
        body.append('bridgeBox', JSON.stringify(entity));
        RestAPI.client.post(function(eve){;}, CanvasConst.getContext() + "home/updateTaskBar", body,
        {
            headers:{'X-CSRF-TOKEN': CanvasConst.getCsrf()}
        });

        bar.handleColor    = entity.handleColor;
        bar.planColor      = entity.planColor;
        bar.resultColor    = entity.resultColor;
        bar.taskName       = entity.taskName;
        bar.progress       = entity.progress;
        bar.planPeriod.fromDate = new Date(entity.planPeriodFrom);
        bar.planPeriod.toDate   = new Date(entity.planPeriodTo);
        bar.memo           = entity.memo;

        taskName.setText(entity.taskName, "14px sans-serif", "#000000"); 
        taskName.setAlign(DrowTextBase.Align.LEFT);
        taskName.setBaseline(DrowTextBase.Baseline.MIDDLE);

        this.repaint();
    }


    /**
     * カレンダを１か月未来を表示する。
     *
     * @memberof GanttChartView
     */
    public calendarFuture1m():void {
        this.viewToDate = DateUtils.addMonth(this.viewToDate, 1);
        // テーブル再描画
        this.drowTableHeader.createCalendar(this.viewFromDate, this.viewToDate, 1, this.cellWidth, this.cellHeight, true);
        this.drowTableData.createCalendar(this.viewFromDate, this.viewToDate, this.taskBarArray.length, this.cellWidth, this.cellHeight, false);
        this.stageObj.setStageWidth(this.drowTableHeader.tableParam.tableSize.width);

        this.setEndViewPos();
        this.repaint();
    }

    /**
     * カレンダを１か月過去を表示する。
     *
     * @memberof GanttChartView
     */
    public calendarPast1m():void {
        this.viewFromDate = DateUtils.addMonth(this.viewFromDate, -1);
        // テーブル再描画
        this.drowTableHeader.createCalendar(this.viewFromDate, this.viewToDate, 1, this.cellWidth, this.cellHeight, true);
        this.drowTableData.createCalendar(this.viewFromDate, this.viewToDate, this.taskBarArray.length, this.cellWidth, this.cellHeight, false);
        this.stageObj.setStageWidth(this.drowTableHeader.tableParam.tableSize.width);

        this.setStartViewPos();
        this.repaint();
    }

    public pushFavo():void{
        const favorites = document.querySelector("#favoIcon") as HTMLInputElement
        if(Utils.isEmpty(favorites))
            return;

        if(this.homeView.homeEntity.favorites == "1"){
            this.homeView.homeEntity.favorites = "0";
            favorites.classList.add("bi-star");
            favorites.classList.remove("bi-star-fill");
        }else{
            this.homeView.homeEntity.favorites = "1";
            favorites.classList.add("bi-star-fill");
            favorites.classList.remove("bi-star");
        }

        let body = new FormData()
        body.append('bridgeBox', JSON.stringify(this.homeView.homeEntity));
        RestAPI.client.post(function(eve){;}, CanvasConst.getContext() + "home/pushFavo", body,
        {
            headers:{'X-CSRF-TOKEN': CanvasConst.getCsrf()}
        });

    }

    public response(eve:AxiosResponse<any, any>){
        if(eve.status == 200){
            this.stageObj.setBridgeBox(JSON.stringify(eve.data));
            this.homeView.changeView();
        }else{
            console.error(eve);
        }
    }
}
