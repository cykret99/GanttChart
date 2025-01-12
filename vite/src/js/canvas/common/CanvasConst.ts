// @ts-check

export namespace CanvasConst{
    export const CREATEJS_POINTER = "pointer";

    // EContanerType
    export const CONTANER_TYPE_MENU = "MENU";
    export const CONTANER_TYPE_GROUP = "GROUP";
    export const CONTANER_TYPE_PROJECT = "PROJECT";
    
    export const HOME_BUTTON_TYPE_FAVORITE = "FAVORITE";
    export const HOME_BUTTON_TYPE_FUTURE = "FUTURE";
    export const HOME_BUTTON_TYPE_PAST = "PAST";


    export function getCsrf():string{
        const csrf = document.querySelector("#csrf") as HTMLInputElement
        return csrf.value;
    }
    export function getContext():string{
        let context = document.querySelector("#context") as HTMLInputElement;
        return context.value;
    }


    

}

export default CanvasConst;

