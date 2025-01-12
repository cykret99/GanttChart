// @ts-check

import Utils from "../../util/Utils";
import DrowTaskBar from "../drowObject/DrowTaskBar";
import { BaseEntity } from "./BaseEntity";

/**
 * タスク連携用Entity
 *
 * @export
 * @class taskBar
 */
export default class TaskBarEntity extends BaseEntity{

    /**
     * オブジェクトのUUID
     *
     * @type {string}
     * @memberof TaskBarEntity
     */
    public uuid:string;
    /**
     * つまみバーの色
     *
     * @type {string}
     * @memberof TaskBarEntity
     */
    public handleColor:string;
    /**
     * 予定バーの色
     *
     * @type {string}
     * @memberof TaskBarEntity
     */
    public planColor:string;
    /**
     * 実績バーの色
     *
     * @type {string}
     * @memberof TaskBarEntity
     */
    public resultColor:string;
    /**
     * タスク名
     *
     * @type {string}
     * @memberof TaskBarEntity
     */
    public taskName:string;
    /**
     * 進捗度 (割合)
     *
     * @type {number}
     * @memberof TaskBarEntity
     */
    public progress:number;
    /**
     * タスク予定期間（FROM）
     *
     * @type {Date}
     * @memberof TaskBarEntity
     */
    public planPeriodFrom:Date;
    /**
     * タスク予定期間（TO）
     *
     * @type {Date}
     * @memberof TaskBarEntity
     */
    public planPeriodTo:Date;

    /**
     * メモ
     *
     * @type {string}
     * @memberof TaskBarEntity
     */
    public memo:string;

    /**
     * DrowTaskBarをEntityに変換
     *
     * @param {DrowTaskBar} taskBar
     * @return {*}  {void}
     * @memberof TaskBarEntity
     */
    public taskBarToEntity(taskBar : DrowTaskBar):void{
        if(Utils.isEmpty(taskBar)) return;

        this.uuid           = taskBar.uuid;
        this.handleColor    = taskBar.handleColor;
        this.planColor      = taskBar.planColor;
        this.resultColor    = taskBar.resultColor;
        this.taskName       = taskBar.taskName;
        this.progress       = taskBar.progress;
        this.planPeriodFrom = taskBar.planPeriod.fromDate;
        this.planPeriodTo   = taskBar.planPeriod.toDate;
        this.memo           = taskBar.memo;
    }

    /**
     * 画面用FORMから受け取ったJSONを型変換
     *
     * @param {string} jsonStr 画面FORMから受け取ったJSON
     * @return {*}  {void}
     * @memberof TaskBarEntity
     */
    public dispToEntity(jsonStr:string):void{
        if(Utils.isEmpty(jsonStr)) return;
        let json;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            console.error(e);
        } 

        this.uuid           = json.uuid;
        this.handleColor    = json.handleColor;
        this.planColor      = json.planColor;
        this.resultColor    = json.resultColor;
        this.taskName       = json.taskName;
        this.progress       = json.progress;
        this.planPeriodFrom = new Date(json.planPeriodFrom);
        this.planPeriodTo   = new Date(json.planPeriodTo);
        this.memo           = json.memo;
    }

}
