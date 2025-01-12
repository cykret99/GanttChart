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
import GanttChartEntity from "../entity/GanttChartEntity";
import GanttChartView from "./GanttChartView";

export default class HomeView extends ViewBase{

    public view:ViewBase;

    private tabContainer : DrowContainerBase;
    private tabLine : DrowShapeBase;
    private tabArray : Array<TabShape>;

    // メニュー描画用パラメタ
    private homeEntity : HomeEntity;


    // 座標保持用
    public static posParam={
        margin      :{x:5, y:5},
    }
    public static viewParam={
        headerPos   :{x:0+this.posParam.margin.x , y:0+this.posParam.margin.y},
        tabPos      :{x:0+this.posParam.margin.x, y:50+this.posParam.margin.y},
        contantPos  :{x:0+this.posParam.margin.x, y:75+this.posParam.margin.y}
    }

    constructor(stageObj: StageBase) {
        super(stageObj);
        this.stageObj.drowGroundContainer.addChild(this);
    }

    public init(){
        this.getBridgeBox();
        this.tabContainer = new DrowContainerBase;

        this.tabLine = new DrowShapeBase;
        this.tabLine.lineColor = "#AAAAAA";
        this.tabLine.begin();
        this.tabLine.graphics
            .moveTo(0, 25)
            .lineTo(0, 25);
        this.tabLine.end();
        this.tabContainer.addChild(this.tabLine);

        this.tabArray = new Array<TabShape>;

        this.homeEntity.tabArray.forEach((val:HomeEntity.TabForm, key) =>{
            let homeTab = new TabShape( this.homeEntity.tabArray.length == key+1, val.uuid, val.containsType, val.tabName);
            this.tabArray.push(homeTab);
            this.tabContainer.addChild(homeTab);
        });
        this.tabContainer.y = 50;

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

        // 描画コンテンツを画面から取得
        this.getBridgeBox();
        
        if(this.homeEntity.containsType == CanvasConst.CONTANER_TYPE_MENU){
            this.view = new MenuView(this.stageObj, this);
            this.view.init();
        }else if(this.homeEntity.containsType == CanvasConst.CONTANER_TYPE_GROUP){

        }else if(this.homeEntity.containsType == CanvasConst.CONTANER_TYPE_PROJECT){
            this.view = new GanttChartView(this.stageObj, this);
            this.view.init();
        }
        this.stageObj.endLoader();
    }

    public update(stage:StageBase):void{
        super.update(stage);
        let canvasSize:Utils.Size = stage.getCanvasSize();
        this.tabLine.begin();
        this.tabLine.graphics
            .moveTo(0, 25)
            .lineTo(canvasSize.width, 25);
        this.tabLine.end();
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
