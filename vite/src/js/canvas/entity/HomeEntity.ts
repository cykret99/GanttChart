import Utils from "../../util/Utils";
import { BaseEntity } from "./BaseEntity";
import GanttChartEntity from "./GanttChartEntity";
import MenuEntity from "./MenuEntity";


export class HomeEntity extends BaseEntity{
	public containsType:string;
    public viewUuid:string;
    public favorites:string;
    public role:string;
	public tabArray:Array<HomeEntity.TabForm>;

	public ganttchartForm:GanttChartEntity;
	public menuForm:MenuEntity;

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
            return;
        } 

        this.containsType = json.containsType;
        this.favorites = json.favorites;
        this.tabArray = new Array<HomeEntity.TabForm>;
        json.tabArray.forEach((val:HomeEntity.TabForm, key:number) => {
            let tab = new HomeEntity.TabForm;
            tab.tabName = val.tabName;
            tab.containsType = val.containsType;
            tab.uuid = val.uuid;
            this.tabArray.push(val);
        });
    }

    public jsonToEntity(jsonStr:string) : void{
        let json:any;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            console.error(e);
            return;
        }
        this.containsType = json.containsType;
        this.viewUuid = json.viewUuid;
        this.role = json.role
        this.favorites = json.favorites;

        this.tabArray = new Array<HomeEntity.TabForm>;
        json.tabArray.forEach((val:HomeEntity.TabForm, key:number) => {
            let tab = new HomeEntity.TabForm;
            tab.tabName      = val.tabName;
            tab.containsType = val.containsType;
            tab.uuid         = val.uuid;
            
            this.tabArray.push(tab);
        });

        this.ganttchartForm  = new GanttChartEntity;
        this.ganttchartForm.jsonToEntity(jsonStr);


    }
}

export namespace HomeEntity{
    export class TabForm{
        public tabName:string;
        public containsType:string;
        public uuid:string;
    }
}

export default HomeEntity;