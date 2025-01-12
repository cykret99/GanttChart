// @ts-check

import { BaseEntity } from "./BaseEntity";
import TaskBarEntity from "./TaskBarEntity";

/**
 * GanttChartView用のEntity.
 * BridgeBoxでの連携用
 *
 * @export
 * @class GanttChartEntity
 * @extends {BaseEntity}
 */
export class GanttChartEntity extends BaseEntity{
    /**
     * 表示中のプロジェクトID
     *
     * @type {string}
     * @memberof GanttChartEntity
     */
    public viewProjectId:string;
    /**
     * 表示モード
     * R：参照のみ　RW：参照・更新
     *
     * @type {string}
     * @memberof GanttChartEntity
     */
    public viewRole:string;
    /**
     * 描画カレンダ期間FROM
     *
     * @type {Date}
     * @memberof GanttChartEntity
     */
    public viewFromDate:Date;
    /**
     * 描画カレンダ期間TO
     *
     * @type {Date}
     * @memberof GanttChartEntity
     */
    public viewToDate:Date;
    /**
     * 描画タスクオブジェクト
     *
     * @type {Array<TaskBarEntity>}
     * @memberof GanttChartEntity
     */
    public taskBarArray:Array<TaskBarEntity>;

    /**
     * JSON形式文字列からEntityに変換
     *
     * @param {string} jsonStr 格納Json文字列
     * @return {*}  {void}
     * @memberof GanttChartEntity
     */
    public jsonToEntity(jsonStr:string) : void{
        let json:any;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            console.error(e);
            return;
        }

        this.viewFromDate = new Date(json.viewFromDate);
        this.viewToDate = new Date(json.viewToDate);
        this.taskBarArray = new Array<TaskBarEntity>;
        json.taskBarArray.forEach((val:TaskBarEntity, key:number) => {
            let task = new TaskBarEntity;
            task.uuid             = val.uuid
            task.taskName         = val.taskName
            task.progress         = val.progress
            task.planPeriodFrom   = new Date(val.planPeriodFrom);
            task.planPeriodTo     = new Date(val.planPeriodTo);
            task.handleColor      = val.handleColor
            task.planColor        = val.planColor
            task.resultColor      = val.resultColor
            task.memo             = val.memo
            this.taskBarArray.push(task);
        });
    }

}

export default GanttChartEntity;
