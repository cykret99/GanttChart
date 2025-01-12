// @ts-check

export class BaseEntity{
    public toString():string{
        let result:string = '';

        let key:string;
        for(key in this){
            if(typeof this[key] == 'undefined' || this[key] == null )
                result += key + " : " + this[key] + "\r\n"; 
            else
                result += key + " : " + this[key].toString() + "\r\n"; 
        }

        return result;
    }
}
