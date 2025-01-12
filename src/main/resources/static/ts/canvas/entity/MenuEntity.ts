// @ts-check

import { BaseEntity } from "./BaseEntity";
import GroupEntity from "./GroupEntity";

/**
 * HomeView用のEntity.
 * BridgeBoxでの連携用
 *
 * @export
 * @class HomeEntity
 * @extends {BaseEntity}
 */
export class MenuEntity extends BaseEntity{

    public favoritesArray :Array<GroupEntity>;
    public groupArray :Array<GroupEntity>;

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
        let menuJson = json.menuForm;

        this.favoritesArray = new Array<GroupEntity>;
        menuJson.favoritesArray.forEach((val:GroupEntity, key:number) => {
            let favorites = new GroupEntity;
            favorites.uuid          = val.uuid;
            favorites.parentUuid    = val.parentUuid;
            favorites.level         = val.level;
            favorites.groupCode     = val.groupCode;
            favorites.groupName     =val.groupName;
            
            this.favoritesArray.push(favorites);
        });

        this.groupArray = new Array<GroupEntity>;
        menuJson.groupArray.forEach((val:GroupEntity, key:number) => {
            let group = new GroupEntity;
            group.uuid          = val.uuid;
            group.parentUuid    = val.parentUuid;
            group.level         = val.level;
            group.groupCode     = val.groupCode;
            group.groupName     =val.groupName;
            
            this.groupArray.push(group);
        });

    }

}

export default MenuEntity;
