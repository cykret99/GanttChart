// @ts-check

import dayjs, { Dayjs } from "dayjs";
import StringUtils from "./StringUtils";
import DrowTaskBar from "../canvas/drowObject/DrowTaskBar";
import Utils from "./Utils";

export namespace DateUtils {
    /**
     * 日付同士の差を日付で返却する。
     * 時間は考慮しないものとする。
     * 
     * @param fromDate 計算日付FROM
     * @param toDate 計算日付TO
     * @returns 日付間の日数
     */
    export function calcDiffDate(fromDate:Date, toDate:Date) :number{
        let result : number;

        if(Utils.isEmpty(fromDate) || Utils.isEmpty(toDate))
            return 0;

        let tFromDate = new Date(fromDate);
        let tToDate = new Date(toDate);
    
        let from:Dayjs, to:Dayjs;
        from = dayjs(new Date(tFromDate.getFullYear(), tFromDate.getMonth(), tFromDate.getDate()));
        to = dayjs(new Date(tToDate.getFullYear(), tToDate.getMonth(), tToDate.getDate()));
        result = to.diff(from, 'day');
        return result;
    }

    /**
     * 時間を除外したDateインスタンスを新しく生成する
     *
     * @export
     * @param {string} dateStr 日付
     * @return {*}  {Date}
     */
    export function createDate(dateStr:string = ""):Date{
        let tmp:Date;
        if(Utils.isEmpty(dateStr))
            tmp = new Date();
        else
            tmp = new Date(dateStr);

        return new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
    }

    /**
     * Date型変数の日付計算。マイナスを入力した場合減算となる。
     * @param date  計算対象Date
     * @param addVal 加算日付
     * @returns 計算対象に日付加算した日付
     */
    export function addDate(date:Date, addVal:number) : Date{
        let result:Date = new Date(date);
        result.setDate(result.getDate() + addVal);
        return result;
    }

    /**
     * Date型変数の日付計算。マイナスを入力した場合減算となる。
     * @param date  計算対象Date
     * @param addVal 加算月数
     * @returns 計算対象に日付加算した日付
     */
    export function addMonth(date:Date, addVal:number) : Date{
        let result:Date = new Date(date);
        result.setMonth(result.getMonth() + addVal);
        return result;
    }

    export const sortInfoByTaskBar = (a:DrowTaskBar, b:DrowTaskBar)=>{
        let aFrom:Date = new Date(a.planPeriod.fromDate);
        let bFrom:Date = new Date(b.planPeriod.fromDate);
        return aFrom.getTime() - bFrom.getTime();
    }

    /**
     * 日付をyyyy/mm/ddフォーマット文字列に変換する
     * @param date 変換対象日付
     * @returns yyyy/mm/dd日付文字列
     */
    export function toYYYYMMDD_sh(date:Date):string{
        let result:Date = new Date(date);
        let str = result.toLocaleDateString('sv-SE');
        return str.replaceAll("-","/");
    }

    /**
     * 日付をmm/ddフォーマット文字列に変換する
     * @param date 変換対象日付
     * @returns mm/dd日付文字列
     */
    export function toMMDD_sh(date:Date):string{
        let str = DateUtils.toYYYYMMDD_sh(date);
        return StringUtils.right(str,5);
    }

    /**
     * 日付をyyyy-mm-ddフォーマット文字列に変換する
     * @param date 変換対象日付
     * @returns yyyy-mm-dd日付文字列
     */
    export function toYYYYMMDD_hyphen(date:Date):string{
        let result:Date = new Date(date);
        let str = result.toLocaleDateString('sv-SE');
        return str;
    }

    /**
     * 日付をyyyymmddフォーマット文字列に変換する
     * @param date 変換対象日付
     * @returns yyyymmdd日付文字列
     */
    export function toYYYYMMDD(date:Date):string{
        let result:Date = new Date(date);
        let str:string = result.toLocaleDateString('sv-SE');
        return str.replaceAll("-","");
    }

    

}

export default DateUtils;
