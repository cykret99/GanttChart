// @ts-check

import DrowShapeBase from "../drowObject/base/DrowShapeBase";
import DrowContainerBase from "../drowObject/base/DrowContainerBase";
import StageBase from "../stage/StageBase";
import ViewBase from "./ViewBase";
import Utils from "../../util/Utils";
import DrowButtonBase from "../drowObject/base/DrowButtonBase";
import { HomeEntity } from "../entity/HomeEntity";
import CanvasConst from "../common/CanvasConst";
import MenuView from "./MenuView";
import GanttChartView from "./GanttChartView";
import RestAPI from "../../rest/RestAPI";
import { AxiosResponse } from "axios";

export default class HomeView extends ViewBase{

    public view:ViewBase;

    private tabContainer : DrowContainerBase;
    private tabLine : DrowShapeBase;
    private tabBackground : DrowShapeBase;
    private tabArray : Array<TabShape>;

    // メニュー描画用パラメタ
    public homeEntity : HomeEntity;


    // 座標保持用
    public static posParam={
        margin      :{x:5, y:10},
    }
    public static viewParam={
        headerPos   :{x:0+this.posParam.margin.x , y:0+this.posParam.margin.y},
        tabPos      :{x:0+this.posParam.margin.x, y:10+this.posParam.margin.y},
        contantPos  :{x:0+this.posParam.margin.x, y:35+this.posParam.margin.y}
    }

    constructor(stageObj: StageBase) {
        super(stageObj);
        this.stageObj.drowFrontContainer.addChild(this);
    }

    public init(){
        this.getBridgeBox();
        this.tabContainer = new DrowContainerBase;

        this.tabBackground = new DrowShapeBase;
        this.tabBackground.lineColor = "#FFFFFF";
        this.tabBackground.bgColor = "#FFFFFF";
        this.tabBackground.fillFlg = true;
        this.tabBackground.begin();
        this.tabBackground.graphics.rect(0,0,10,10);
        this.tabBackground.end();
        this.addChild(this.tabBackground);

        this.tabLine = new DrowShapeBase;
        this.tabLine.lineColor = "#AAAAAA";
        this.tabLine.begin();
        this.tabLine.graphics
            .moveTo(0, 25)
            .lineTo(0, 25);
        this.tabLine.end();
        this.tabContainer.addChild(this.tabLine);

        this.tabArray = new Array<TabShape>;
        this.tabContainer.y = HomeView.viewParam.tabPos.y - HomeView.posParam.margin.y;

        this.addChild(this.tabContainer);

        // View描画
        this.changeView();
    }

    public repaint(){

    }

    public changeView(){
        // 読み込み中
        this.stageObj.startLoader("読み込み中...");
        if(Utils.isNotEmpty(this.view)){
            this.view.close();
        }
        // コンテンツをいったんクローズ
        this.stageObj.contentsAllClose();
        this.tabArray.forEach((val, key) => {
            this.tabContainer.removeChild(val);
        });
        this.tabArray = new Array<TabShape>;

        // 描画位置をリセット
        this.stageObj.setMainContenarYPosRatio(0);
        this.stageObj.setMainContenarXPosRatio(0);

        // 描画内容を削除
        this.stageObj.clearInputDisp();


        // 描画コンテンツを画面から取得
        this.getBridgeBox();
        
        if(this.homeEntity.containsType == CanvasConst.CONTANER_TYPE_MENU){
            this.view = new MenuView(this.stageObj, this);
            this.view.init();
        }else if(this.homeEntity.containsType == CanvasConst.CONTANER_TYPE_GROUP){
            this.view = new GanttChartView(this.stageObj, this, this.homeEntity.containsType);
            this.view.init();
        }else if(this.homeEntity.containsType == CanvasConst.CONTANER_TYPE_PROJECT){
            this.view = new GanttChartView(this.stageObj, this, this.homeEntity.containsType);
            this.view.init();
        }

        let tabXPos : number = HomeView.posParam.margin.x;
        this.homeEntity.tabArray.forEach((val:HomeEntity.TabForm, key) =>{
            let homeTab = new TabShape( this.homeEntity.tabArray.length == key+1, val.uuid, val.containsType, val.containsType);
            homeTab.x = tabXPos;
            this.tabArray.push(homeTab);
            this.tabContainer.addChild(homeTab);

            // タブ位置は累積で計算する
            tabXPos += homeTab.getBounds().width;
        });

        this.stageObj.endLoader();
    }

    public getHomeView():HomeEntity{
        return this.homeEntity;
    }

    public update(stage:StageBase):void{
        super.update(stage);
        let canvasSize:Utils.Size = stage.getCanvasSize();
        this.tabLine.begin();
        this.tabLine.graphics
            .moveTo(0, 25)
            .lineTo(canvasSize.width, 25);
        this.tabLine.end();

        this.tabBackground.begin();
        this.tabBackground.graphics.rect(0,0,canvasSize.width, HomeView.viewParam.contantPos.y);
        this.tabBackground.end();

    }

    protected removeTabObject(){
        this.tabArray.forEach((val:TabShape, key) =>{
            this.tabContainer.removeChild(val);
        });
        this.tabArray = new Array<TabShape>;
    }

    /**
     * 画面のテキストボックス（BridgeBox）へView設定を反映
     *
     * @memberof GanttChartView
     */
    public setBridgeBox(){
    }

    /**
     *　画面のテキストボックス（BridgeBox）からデータを取得し、画面へ反映
     *
     * @memberof GanttChartView
     */
    public getBridgeBox(){
        let entity : HomeEntity = new HomeEntity;
        entity.jsonToEntity(this.stageObj.getBridgeBox());
        this.homeEntity = entity;
        
    }


    /**
     * マウス左クリックボタンが押された時に呼ばれる関数
     *
     * @param {createjs.Point} gPos グローバル座標のマウス移動先
     * @param {createjs.Point} wPos ワールド座標のマウス移動先
     * @param {createjs.Point} pPos 親オブジェクト座標のマウス移動先
     * @param {createjs.Point} lPos ローカルオブジェクト座標のマウス移動先
     * @param {StageBase} stage
     * @return {*}  {void}
     * @memberof DrowContainerBase
     */
    public mouseDown(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
        super.mouseDown(gPos, wPos, pPos, lPos, stage);

        // タブがクリックされたとき実行
        let selectTab:TabShape;
        selectTab = this.tabArray.find((val, key) =>{
            let pos = this.localToLocal(lPos.x, lPos.y, val);
            return val.hitTest(pos.x, pos.y);
        }) as TabShape;

        if(Utils.isEmpty(selectTab))
            return ;

        let homeEntity = new HomeEntity;
        homeEntity.dispToEntity(this.stageObj.getBridgeBox());
        homeEntity.containsType = selectTab.containsType;
        homeEntity.viewUuid = selectTab.uuid;
        const csrf = document.querySelector("#csrf") as HTMLInputElement
        const context = document.querySelector("#context") as HTMLInputElement;
        let body = new FormData()
        body.append('bridgeBox', JSON.stringify(homeEntity));
        let THIS = this;
        RestAPI.client.post(function(eve){THIS.response(eve);}, context.value + "home/changeView", body,
        {
            headers:{'X-CSRF-TOKEN': csrf.value}
        });

        return;
    }
    public response(eve:AxiosResponse<any, any>){
        if(eve.status == 200){
            this.stageObj.setBridgeBox(JSON.stringify(eve.data));
            this.changeView();
        }else{
            console.error(eve);
        }
    }
    
}

class TabShape extends DrowButtonBase{
    public tabName : string;
    public currentFlg : boolean;
    public containsType : string;
    public uuid : string;
    
    constructor(currentFlg:boolean, uuid:string, containsType:string,  label: string, color?: string, bgcolor?:string) {
        super(label, color, bgcolor, 75, 25, 0);
        this.currentFlg = currentFlg;
        this.containsType = containsType;
        this.tabName = label;
        this.uuid = uuid;
        this.repaint();
    }

    public repaint() {
        super.repaint();
        if(this.currentFlg){
            let bottomLine = new DrowShapeBase;
            bottomLine.lineColor = this.bgcolor;
            bottomLine.thickness = 2;
            bottomLine.begin();
            bottomLine.graphics
                .moveTo(0, this.height)
                .lineTo(this.width, this.height)
            ;
            bottomLine.end();
            // 親クラスですでにremove済みのbottomLineをサイド追加
            this.addChild(bottomLine);
        }
    }
    
}
