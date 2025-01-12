// @ts-check
import Utils from "../../util/Utils";
import CanvasConst from "../common/CanvasConst";
import DrowButtonBase from "../drowObject/base/DrowButtonBase";
import DrowShapeBase from "../drowObject/base/DrowShapeBase";
import DrowTextBase from "../drowObject/base/DrowTextBase";
import DrowSimpleTable from "../drowObject/DrowSimpleTable";
import MenuEntity from "../entity/MenuEntity";
import StageBase from "../stage/StageBase";
import HomeView from "./HomeView";
import ViewBase from "./ViewBase";
import RestAPI from "../../rest/RestAPI";
import { AxiosResponse } from "axios";
import HomeEntity from "../entity/HomeEntity";

export default class MenuView extends ViewBase{
    protected homeView : HomeView;

    public drowHeader: DrowSimpleTable; 
    public drowHeaderText: Array<DrowTextBase>;
    public drowTable: DrowSimpleTable; 

    public menuEntity : MenuEntity;
    public favoritesObjArray : Array<MenuLinkButton>;
    public projectObjArray : Array<MenuLinkButton>;


    private menuParam ={
        headerWidth:0,
        headerHeight:30,
        dataWidth:0,
        dataHeight:100,
    }

    private selectParam = {
        containsType:"",
        uuid:"",
        url:"",
    }

    constructor(stageObj: StageBase, homeView: HomeView) {
        super(stageObj);
        this.stageObj.drowGroundContainer.addChild(this);
        this.homeView = homeView;
    }

    public init(){
        this.getBridgeBox();

        let size = this.stageObj.getCanvasSize();
        this.menuParam.headerWidth = (size.width*0.7 < 1000 ? 1000 : (size.width*0.7))/2;
        this.menuParam.dataWidth = this.menuParam.headerWidth;

        // テーブル作成
        this.drowHeader = new DrowSimpleTable();
        this.drowHeader.setHLineStyle("#000000", 1, DrowShapeBase.LineStyle.DASH);
        this.drowHeader.setVLineStyle("#000000", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowHeader.setLineStyle("#000000", 1, DrowShapeBase.LineStyle.NOMAL);
        this.drowHeader.setTableStyle("#EEEEEE");
        this.drowHeader.create(1, 2, this.menuParam.headerWidth, this.menuParam.headerHeight);

        this.drowTable = new DrowSimpleTable();
        this.drowTable.setHLineStyle("#000000", 1, DrowShapeBase.LineStyle.NONE);
        this.drowTable.setVLineStyle("#000000", 1, DrowShapeBase.LineStyle.NONE);
        this.drowTable.setLineStyle("#000000", 1, DrowShapeBase.LineStyle.NONE);
        this.drowTable.setTableStyle("#FFFFFF");
        this.drowTable.create(1, 2, this.menuParam.dataWidth, this.menuParam.dataHeight);

        // ヘッダーテキスト作成
        this.drowHeaderText = new Array<DrowTextBase>();
        let favoritesText = new DrowTextBase;
        favoritesText.setText("お気に入り", "bold 20px serif", "#555555")
        favoritesText.setAlign(DrowTextBase.Align.CENTER);
        favoritesText.setBaseline(DrowTextBase.Baseline.MIDDLE);
        var pos = this.drowHeader.getCellPos(1,1,DrowSimpleTable.XStyle.MIDDLE, DrowSimpleTable.YStyle.MIDDLE);
        favoritesText.x = pos.x
        favoritesText.y = pos.y
        this.drowHeaderText.push(favoritesText)
        this.drowHeader.addChild(favoritesText);

        let projectText = new DrowTextBase;
        projectText.setText("プロジェクト", "bold 20px serif", "#555555")
        projectText.setAlign(DrowTextBase.Align.CENTER);
        projectText.setBaseline(DrowTextBase.Baseline.MIDDLE);
        var pos = this.drowHeader.getCellPos(1,2,DrowSimpleTable.XStyle.MIDDLE, DrowSimpleTable.YStyle.MIDDLE);
        projectText.x = pos.x
        projectText.y = pos.y
        this.drowHeaderText.push(projectText)
        this.drowHeader.addChild(projectText);

        // リンクボタン作成
        this.favoritesObjArray = new Array<MenuLinkButton>();
        this.projectObjArray = new Array<MenuLinkButton>();
        this.menuEntity.favoritesArray.forEach((val, key) => {
            let button = new MenuLinkButton(val.uuid, val.contenarType, val.groupCode + "：" + val.groupName, "#AAAAAA", "#FFFFFF"
                , this.menuParam.dataWidth-HomeView.posParam.margin.x, this.menuParam.dataHeight-HomeView.posParam.margin.y, 20);
            let pos = this.drowTable.getCellPos(key+1, 1);
            button.x = pos.x + HomeView.posParam.margin.x/2;
            button.y = pos.y + HomeView.posParam.margin.y/2;

            this.favoritesObjArray.push(button);
            this.drowTable.addChild(button);
        });
        this.menuEntity.groupArray.forEach((val, key) => {
            let button = new MenuLinkButton(val.uuid, CanvasConst.CONTANER_TYPE_GROUP, val.groupCode + "：" + val.groupName, "#AAAAAA", "#FFFFFF"
                , this.menuParam.dataWidth-HomeView.posParam.margin.x, this.menuParam.dataHeight-HomeView.posParam.margin.y, 20);
            let pos = this.drowTable.getCellPos(key+1, 2);
            button.x = pos.x + HomeView.posParam.margin.x/2;
            button.y = pos.y + HomeView.posParam.margin.y/2;

            this.projectObjArray.push(button);
            this.drowTable.addChild(button);
        });

        this.drowTable.setMaxRow(this.favoritesObjArray.length > this.projectObjArray.length ? this.favoritesObjArray.length : this.projectObjArray.length);

        this.stageObj.drowHMainContainer.addChild(this.drowHeader);
        this.stageObj.drowMainContainer.addChild(this.drowTable);

        // お気に入り状況を反映
        const favorites = document.querySelector("#favoIcon") as HTMLInputElement
        if(Utils.isEmpty(favorites))
            return;

        if(this.homeView.homeEntity.favorites == "1"){
            favorites.classList.add("bi-star-fill");
            favorites.classList.remove("bi-star");
        }else{
            favorites.classList.add("bi-star");
            favorites.classList.remove("bi-star-fill");
        }

        this.repaint();
    }

    /**
     * menuEntityの内容を画面に描画する
     *
     * @memberof MenuView
     */
    public repaint(){
        let size = this.stageObj.getCanvasSize();
        this.drowHeader.y = HomeView.viewParam.contantPos.y;
        this.drowHeader.x = (size.width- this.drowHeader.tableParam.tableSize.width)/2;
        this.drowHeader.x = this.drowHeader.x < 0 ? 0 : this.drowHeader.x;

        this.drowTable.y = HomeView.viewParam.contantPos.y + this.menuParam.headerHeight;
        this.drowTable.x = (size.width- this.drowHeader.tableParam.tableSize.width)/2;
        this.drowTable.x = this.drowHeader.x < 0 ? 0 : this.drowHeader.x;

        // ステージサイズを定義
        this.stageObj.setStageWidth(this.drowHeader.tableParam.tableSize.width);
        this.stageObj.setStageHeight(HomeView.viewParam.contantPos.y
             + this.drowHeader.tableParam.tableSize.height
             + this.drowTable.tableParam.tableSize.height);

    }

    public update(stage: StageBase): void {
        super.update(stage);        
        this.repaint();
    }
    

    /**
     * マウスクリック時に呼ばれるメソッド。
     * 選択したグループ、プロジェクトを保持する
     *
     * @param {createjs.Point} gPos
     * @param {createjs.Point} wPos
     * @param {createjs.Point} pPos
     * @param {createjs.Point} lPos
     * @param {StageBase} stage
     * @memberof MenuView
     */
    public mouseDown(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
        super.mouseDown(gPos, wPos, pPos, lPos, stage);
        let favorites;

        if(!Utils.isCollectionEmpty(this.favoritesObjArray)){
            favorites = this.favoritesObjArray.find((val, key) =>{
                let pos = this.localToLocal(lPos.x, lPos.y, val);
                return val.hitTest(pos.x, pos.y);
            });
    
            if(Utils.isNotEmpty(favorites)){
                this.selectParam.containsType = favorites.containsType;
                this.selectParam.uuid = favorites.viewUuid;
                this.selectParam.url = favorites.url;
                return ;
            }
        }

        let group;
        group = this.projectObjArray.find((val, key) =>{
            let pos = this.localToLocal(lPos.x, lPos.y, val);
            return val.hitTest(pos.x, pos.y);
        });

        if(Utils.isNotEmpty(group)){
            this.selectParam.containsType = CanvasConst.CONTANER_TYPE_GROUP;
            this.selectParam.uuid = group.viewUuid;
            this.selectParam.url = group.url;
            return ;
        }
    }

    /**
     * マウスクリックUP時に呼ばれるメソッド。
     * 選択したグループ、プロジェクトが保持された状態の場合、POSTする
     *
     * @param {createjs.Point} gPos
     * @param {createjs.Point} wPos
     * @param {createjs.Point} pPos
     * @param {createjs.Point} lPos
     * @param {StageBase} stage
     * @memberof MenuView
     */
    public mouseUp(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
        super.mouseUp(gPos, wPos, pPos, lPos, stage);
        let favorites;
        favorites = this.favoritesObjArray.find((val, key) =>{
            let pos = this.localToLocal(lPos.x, lPos.y, val);
            return val.hitTest(pos.x, pos.y);
        });

        if(Utils.isNotEmpty(favorites)){
            if(this.selectParam.uuid == favorites.viewUuid){
                let homeEntity = new HomeEntity;
                homeEntity.dispToEntity(this.stageObj.getBridgeBox());
                homeEntity.containsType = this.selectParam.containsType;
                homeEntity.viewUuid = this.selectParam.uuid;
                const csrf = document.querySelector("#csrf") as HTMLInputElement
                let body = new FormData()
                body.append('bridgeBox', JSON.stringify(homeEntity));
                let THIS = this;
                RestAPI.client.post(function(eve){THIS.response(eve);}, this.selectParam.url, body,
                {
                    headers:{'X-CSRF-TOKEN': csrf.value}
                });

                return ;
            }
        }

        let group;
        group = this.projectObjArray.find((val, key) =>{
            let pos = this.localToLocal(lPos.x, lPos.y, val);
            return val.hitTest(pos.x, pos.y);
        });

        if(Utils.isNotEmpty(group)){
            if(this.selectParam.uuid == group.viewUuid){
                let homeEntity = new HomeEntity;
                homeEntity.dispToEntity(this.stageObj.getBridgeBox());
                homeEntity.containsType = this.selectParam.containsType;
                homeEntity.viewUuid = this.selectParam.uuid;
                const csrf = document.querySelector("#csrf") as HTMLInputElement
                let body = new FormData()
                body.append('bridgeBox', JSON.stringify(homeEntity));
                let THIS = this;
                RestAPI.client.post(function(eve){THIS.response(eve);}, this.selectParam.url, body,
                {
                    headers:{'X-CSRF-TOKEN': csrf.value}
                });
                return ;
            }
        }
    }

    public response(eve:AxiosResponse<any, any>){
        if(eve.status == 200){
            this.stageObj.setBridgeBox(JSON.stringify(eve.data));
            this.homeView.changeView();
        }else{
            console.error(eve);
        }
    }


    /**
     * 画面のテキストボックス（BridgeBox）へView設定を反映
     *
     * @memberof MenuView
     */
    public setBridgeBox(){
    }

    /**
     *　画面のテキストボックス（BridgeBox）からデータを取得し、画面へ反映
     *
     * @memberof MenuView
     */
    public getBridgeBox(){
        let entity : MenuEntity = new MenuEntity;
        entity.jsonToEntity(this.stageObj.getBridgeBox());
        this.menuEntity = entity;
    }

}


class MenuLinkButton extends DrowButtonBase{
    private url : string = "home/changeView";
    public containsType : string;
    public viewUuid : string;
    
    constructor(viewUuid:string, containsType:string, label: string, color?: string, bgcolor?:string, width?:number, height?:number, radius?:number) {
        super(label, color, bgcolor, width, height, radius);
        let context = document.querySelector("#context") as HTMLInputElement;
        this.viewUuid = viewUuid;
        this.containsType = containsType;
        this.url =context.value + this.url;

        this.repaint();
    }
}
