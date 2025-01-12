// @ts-check

export namespace StringUtils {

    /**
     * 右からcnt分の文字列を切り出す
     * @param str 切り出し元文字列
     * @param cnt 切り出し文字数
     * @returns 切り出し後文字列
     */
    export function right(str:string, cnt:number):string{
        let result = str.slice(cnt*-1);
        return result;
    }
    /**
     * 左からcnt分の文字列を切り出す
     * @param str 切り出し元文字列
     * @param cnt 切り出し文字数
     * @returns 切り出し後文字列
     */
    export function left(str:string, cnt:number):string{
        let result = str.slice(cnt);
        return result;
    }
}


export default StringUtils;
