// @ts-check

export namespace Utils {
    
    export class Size{
        width:number;
        height:number;
    }
    export class Range{
        row:number;
        col:number;
    }

    /**
     * 引数がundefinedか判断する
     *
     * @export
     * @param {object} val 判断対象
     * @return {*}  {boolean} true:undefined false:defined
     */
    export function isUndefined(val:Object|undefined|null):boolean{
        if(typeof val == 'undefined')
            return true;
        else
            return false;
    }

    /**
     * 引数がdefinedか判断する
     *
     * @export
     * @param {*} val 判断対象
     * @return {*}  {boolean} true:defined false:undefined
     */
    export function isDefined(val:Object|undefined|null):boolean{
        return !Utils.isUndefined(val);
    }

    /**
     * 引数がnullか判断する
     *
     * @export
     * @param {Object} val 判断対象
     * @return {*}  {boolean} true:null false:not null
     */
    export function isNull(val:Object|undefined|null):boolean{
        if(val == null)
            return true;

        return false;
    }


    /**
     * 引数がnullではないかを判断する
     *
     * @export
     * @param {Object} val 判断対象
     * @return {*} true:not null false:null
     */
    export function isNotNull(val:Object|undefined|null){
        return !Utils.isNull(val);
    }

        
    /**
     * 引数がブランクかを判断する。
     * null , undefineも併せて判断する。
     * null, undefineはブランクと同じ扱いとする
     *
     * @export
     * @param {Object} val 判断対象
     * @return {*}  {boolean} true: ブランク false:not ブランク
     */
    export function isEmpty(val:Object|undefined|null):boolean{
        if(val == '')
            return true;
        
        if(Utils.isUndefined(val))
            return true;

        if(Utils.isNull(val))
            return true;

        return false;
    }

    
    /**
     * 引数に何か設定されているかを判断する
     * 
     * @export
     * @param {Object} val 判断対象
     * @return {*}  {boolean} true: not ブランク, false: ブランク
     */
    export function isNotEmpty(val:Object|undefined|null):boolean{
        return !Utils.isEmpty(val);
    }

    /**
     * 配列を引数として、未定義、カラ配列を判断する。
     * null , undefineも併せて判断する。
     * null, undefineはブランクと同じ扱いとする
     *
     * @export
     * @param {Object} val 判断対象
     * @return {*}  {boolean} true: ブランク false:not ブランク
     */
    export function isCollectionEmpty<T>(val:Array<T>|undefined|null):boolean{
        if(Utils.isUndefined(val))
            return true;

        if(Utils.isUndefined((val as Array<T>).length))
            return true;

        if(Utils.isNull(val))
            return true;

        if((val as Array<T>).length == 0)
            return true;

        return false;
    }

    /**
     * 配列を引数として、未定義、カラは配列ではないことを判断する。
     *
     * @export
     * @template T
     * @param {(Array<T>|undefined|null)} val
     * @return {*}  {boolean}
     */
    export function isCollectionNotEmpty<T>(val:Array<T>|undefined|null):boolean{
        return !Utils.isCollectionEmpty(val);
    }

    function toCastString(str:object){
        if(typeof str == 'undefined')
            return 'undefined';

        if(typeof str == 'string')
            return str;

        if(typeof str == 'number')
            return String(str);

        if(str == null)
            return 'null';

        if(Utils.isDefined(str.toString))
            return str.toString();

        return str;
    }

    export function toString(str:object):string{
        let result:string = '';

        if(typeof str == 'undefined')
            return 'undefined';

        if(typeof str == 'string')
            return str;

        if(typeof str == 'number')
            return String(str);

        if(str == null)
            return 'null';

        if(Utils.isDefined(str.toString))
            return str.toString();
        
        let key:string;
        for(key in str){
            result += key + " : " + toCastString(str[key]) + "\r\n"; 
        }

        return result;
    }

    export const getClassProperties = (obj: object): string[] => {
        const getOwnProperties = (obj: object) =>
            Object.entries(Object.getOwnPropertyDescriptors(obj))
                .filter(([name, {value}]) => typeof value !== 'function')
                .map(([name]) => name)
        const _getProperties = (o: object, properties: string[]): string[] =>
            o === Object.prototype ? properties : _getProperties(Object.getPrototypeOf(o), properties.concat(getOwnProperties(o)))
        return _getProperties(obj, [])
    }    

    /**
     * 要素をコピーする。
     * シャローコピー
     * @export
     * @param {object} from
     * @param {object} to
     * @return {*} 
     */
    export function copyProperties(from:object, to:object){
        if(Utils.isEmpty(from))
            return;

        if(Utils.isUndefined(to))
            return;

        let keyArray = Utils.getClassProperties(to);
        
        let key:string;
        for(key in keyArray){
            if(Utils.isDefined(from[key]) && Utils.isDefined(to[key]))
                to[key] = from[key];
        }
    }

    export function isObject(x: unknown): x is object{
        return x !== null && (typeof x === 'object' || typeof x === 'function');
    }

    export function isEmptyObject(obj: object){
        return Object.keys(obj).length === 0;
    }

    export function convertValidOrNull(data: unknown){
        if (data === null) return null;
        if (typeof data === 'undefined') return null;
        if (typeof data === 'undefined') return null;
        if (Array.isArray(data)) return data;
        if (isObject(data) && isEmptyObject(data)) return null;

        return data;
    };
}

export default Utils;
