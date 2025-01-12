// @ts-check

import DrowContainerBase from "../drowObject/base/DrowContainerBase";
import { DrowTextBase } from "../drowObject/base/DrowTextBase";
import Utils from "../../util/Utils";
import DrowLoader from "../drowObject/DrowLoader";

export class StageBase {
	private classname = 'StageBase';

	/* メンバ変数 */
	public stage: createjs.Stage;
	public canvasId: string;
	public stageParam:StageBase.StageParam = {
		size: { width: 0, height: 0 },
	}

	readonly bridgeBox:HTMLInputElement = document.getElementById('bridgeBox') as HTMLInputElement;


	private debugFlg: boolean = true;
	private FPS: number = 60;

	// 描画順制御用
	public drowGroundContainer: DrowContainerBase;
	public drowMainContainer: DrowContainerBase;
	public drowHMainContainer: DrowContainerBase;
	public drowFrontContainer: DrowContainerBase;
	public drowVMainContainer: DrowContainerBase;
	public drowSystemContainer: DrowContainerBase;
	public drowDebugContainer: DrowContainerBase;

	private sliderV: DrowSliderObj;	// システム描画、縦軸スライダー
	private sliderH: DrowSliderObj;	// システム描画、横軸スライダー
	private loader: DrowLoader;     // システム描画、ローダー

	// スワイプ、タップパラメタ
	public holdParam:StageBase.ObjectParam = {
		flg: false,
		uuid: '',
		offSet: new createjs.Point
	}
	// 選択パラメタ
	public selectDownParam:StageBase.ObjectParam = {
		flg: false,
		uuid: '',
		offSet: new createjs.Point
	}
	public selectUpParam:StageBase.ObjectParam = {
		flg: false,
		uuid: '',
		offSet: new createjs.Point
	}


	/*********************************************/
	/************* コンストラクタ  ***************/
	/**
	 * Creates an instance of StageBase.
	 * @param {string} canvasId CANVASのID名
	 * @memberof StageBase
	 */
	constructor(canvasId: string) {
		// 描画用Stageオブジェクト、すべての基礎
		this.stage = new createjs.Stage(canvasId);
		this.canvasId = canvasId;

		// マウスオーバーを有効にする
		this.stage.enableMouseOver();

		// 描画用コンテナ
		this.drowGroundContainer = new DrowContainerBase();	// 下に行くほど表に表示される
		this.drowMainContainer = new DrowContainerBase();		// MainContainerが画面外含めた全体とし、MainContainerのlocalposをworld posとする
		this.drowVMainContainer = new DrowContainerBase();		//
		this.drowHMainContainer = new DrowContainerBase();		//
		this.drowFrontContainer = new DrowContainerBase();		//
		this.drowSystemContainer = new DrowContainerBase();	//
		this.drowDebugContainer = new DrowContainerBase();		// 最前面

		this.stage.addChild(this.drowGroundContainer);
		this.stage.addChild(this.drowMainContainer);
		this.stage.addChild(this.drowVMainContainer);
		this.stage.addChild(this.drowHMainContainer);
		this.stage.addChild(this.drowFrontContainer);
		this.stage.addChild(this.drowSystemContainer);
		this.stage.addChild(this.drowDebugContainer);

		let canvasObj: HTMLCanvasElement = this.stage.canvas as HTMLCanvasElement;
		this.stageParam.size.width = canvasObj.width;
		this.stageParam.size.height = canvasObj.height;

		// デバッグ用コード
		let t = new DrowTextBase;
		t.setText('', "12px serif", "black");
		t.uuid = StageBase.OBJECT_ID.DEBUG_TXT;
		this.drowDebugContainer.addChild(t);

		// スライダー作成
		this.sliderH = new DrowSliderObj();
		this.sliderH.init(false,this.getCanvasSize());

		this.sliderV = new DrowSliderObj();
		this.sliderV.init(true,this.getCanvasSize());

		this.drowSystemContainer.addChild(this.sliderH);
		this.drowSystemContainer.addChild(this.sliderV);

		// ローダー用意
		this.loader = new DrowLoader();
		this.drowSystemContainer.addChild(this.loader);

	}

	drowStart(): void {
		const THIS = this;

		/*********************************************/
		/************** イベント登録  ****************/
		/*********************************************/
		this.stage.on('stagemousedown', function (evt) {
			THIS.mousedownEvent(evt);
		});

		this.stage.on('stagemousemove', function (evt) {
			THIS.mousemoveEvent(evt);
		});

		this.stage.on('stagemouseup', function (evt) {
			THIS.mouseupEvent(evt);
		});

		window.addEventListener("wheel", function (evt) {
			THIS.mouseWheel(evt);
		});
		window.addEventListener("resize", function (evt) {
			THIS.handleResize(evt);
		});
		THIS.handleResize(null);

		createjs.Ticker.addEventListener("tick", function (evt) { THIS.update(evt); });
		createjs.Ticker.framerate = this.FPS;

	}

	/*********************************************/
	/**************** クラス関数  ****************/
	/*********************************************/
	/** 描画オブジェクト追加 */
	public addSystemContainer(obj: DrowContainerBase): void {
		this.drowSystemContainer.addChild(obj);
	}

	/** 描画オブジェクト削除 */
	public removeGroundContainer(obj: DrowContainerBase): void {
		this.drowGroundContainer.addChild(obj);
	}

	public removeSystemContainer(obj: DrowContainerBase): void {
		this.drowSystemContainer.addChild(obj);
	}

	public setStageSize(width: number, height: number) {
		this.stageParam.size.width = width;
		this.stageParam.size.height = height;
	}

	public setStageWidth(width: number) {
		this.stageParam.size.width = width;
	}

	public setStageHeight(height: number) {
		this.stageParam.size.height = height;
	}

	/**
	 * メインコンテナの横軸位置を変更する
	 * 引数の座標は割合で
	 * @param {number} xPos 変更座標
	 * @memberof StageBase
	 */
	public setMainContenarXPosRatio(xPosRatio:number){
		let canvasSize:Utils.Size = this.getCanvasSize();

		// 描画サイズのほうがキャンバスサイズより小さければ何もしない。
		if(this.stageParam.size.width - canvasSize.width <= 0)
			return;

		let xPos = (this.stageParam.size.width - canvasSize.width) * xPosRatio;
		this.drowMainContainer.x = xPos * -1;
		this.drowHMainContainer.x = xPos * -1;
	}

	/**
	 * メインコンテナの横軸位置を変更する
	 * 
	 * @param {number} xPos 変更座標
	 * @memberof StageBase
	 */
	public setMainContenarXPos(xPos:number){
		let canvasSize:Utils.Size = this.getCanvasSize();

		// 描画サイズのほうがキャンバスサイズより小さければ何もしない。
		if(this.stageParam.size.width - canvasSize.width <= 0)
			return;

		this.drowMainContainer.x = xPos * -1;
		this.drowHMainContainer.x = xPos * -1;
	}

	/**
	 * メインコンテナの縦軸位置を変更する
	 *
	 * @param {number} yPos 変更座標
	 * @memberof StageBase
	 */
	public setMainContenarYPosRatio(yPosRatio:number){
		let canvasSize:Utils.Size = this.getCanvasSize();

		// 描画サイズのほうがキャンバスサイズより小さければ何もしない。
		if(this.stageParam.size.height - canvasSize.height < 0)
			return;

		let yPos = (this.stageParam.size.height - canvasSize.height) * yPosRatio;
		this.drowMainContainer.y = yPos * -1;
		this.drowVMainContainer.y = yPos * -1;
	}

	/**
	 * メインコンテナの位置座標をかえす
	 *
	 * @return {*}  {Utils.Pos} メインコンテナ位置
	 * @memberof StageBase
	 */
	public getMaincontenarPos():createjs.Point{
		let pos = new createjs.Point;
		pos.x = this.drowMainContainer.x;
		pos.y = this.drowMainContainer.y;

		return pos;
	}

	/**
	 * グローバル座標をメインコンテナのローカル座標に変換
	 *
	 * @param {number} x グローバル座標x
	 * @param {number} y グローバル座標y
	 * @return {*}  {Utils.Pos} メインコンテナ座標
	 * @memberof StageBase
	 */
	public globalToMainContainer(x:number, y:number):createjs.Point{
		let localPos:createjs.Point = this.drowMainContainer.globalToLocal(x,y);
		return localPos;
	}


	/**
	 * 引数がstageでholdされてるか判定
	 *
	 * @param {string} uuid 判定用uuid
	 * @return {*}  {boolean} true:Holdされている　false:Holdされていない
	 * @memberof StageBase
	 */
	public isHold(uuid:string):boolean{
		if(uuid == this.holdParam.uuid) return true;
		return false;
	}
	public isSelectDown(uuid:string):boolean{
		if(uuid == this.selectDownParam.uuid) return true;
		return false;
	}
	public isSelectUp(uuid:string):boolean{
		if(uuid == this.selectUpParam.uuid) return true;
		return false;
	}

	/**
	 * 与えられたuuidをstageでholdしているとしてセット
	 *
	 * @param {string} uuid セット用のuuid
	 * @return {*}  {boolean} true:Holdされている　false:Holdされていない
	 * @memberof StageBase
	 */
	public setHold(uuid:string):void{
		this.holdParam.flg = true;
		this.holdParam.uuid = uuid;

		return;
	}
	public clearHold():void{
		this.holdParam.flg = false;
		this.holdParam.uuid = "";
		this.holdParam.offSet.x = 0;
		this.holdParam.offSet.y = 0;

		return;
	}

	/**
	 * 与えられたuuidをstageでselectを放したタイミングで設定される
	 *
	 * @param {string} uuid セット用のuuid
	 * @return {*}  {boolean} true:Holdされている　false:Holdされていない
	 * @memberof StageBase
	 */
	public setSelectUp(uuid:string):void{
		this.selectUpParam.flg = true;
		this.selectUpParam.uuid = uuid;

		return ;
	}
	/**
	 * 与えられたuuidをstageでselectを放したタイミングで設定される
	 *
	 * @param {string} uuid セット用のuuid
	 * @return {*}  {boolean} true:Holdされている　false:Holdされていない
	 * @memberof StageBase
	 */
	public clearSelectUp():void{
		this.selectUpParam.flg = false;
		this.selectUpParam.uuid = "";

		return;
	}

	/**
	 * 与えられたuuidをstageでselectを押下したタイミングで設定される
	 *
	 * @param {string} uuid セット用のuuid
	 * @return {*}  {boolean} true:Holdされている　false:Holdされていない
	 * @memberof StageBase
	 */
	public setSelectDown(uuid:string):void{
		this.selectDownParam.flg = true;
		this.selectDownParam.uuid = uuid;

		return ;
	}

	public clearSelectDown():void{
		this.selectDownParam.flg = false;
		this.selectDownParam.uuid = "";

		return ;
	}

	/**
	 * canvasのサイズを返却する
	 * @return {*}  {Utils.Size} canvasサイズ
	 * @memberof StageBase
	 */
	public getCanvasSize():Utils.Size{
		var size : Utils.Size;
		let canvasObj: HTMLCanvasElement = this.stage.canvas as HTMLCanvasElement;
		size = {width:canvasObj.width, height:canvasObj.height};

		return size;
	}

	/**
	 * 画面のサイズと、画面の表示位置からスライダーのあるべき位置を割合で返す。
	 * スライダー自体の設定値は変更しない.
	 * 画面サイズが描画位置より小さいときはマイナス値を返却する
	 * @return {*}  {Utils.Pos} スライダー位置
	 * @memberof StageBase
	 */
	public getSliderPosRatio():createjs.Point{
		var stageSize = this.stageParam.size;
		var canvasSize = this.getCanvasSize();
		var sliderPos:createjs.Point = new createjs.Point;

		// 横軸計算
		if(stageSize.width <= canvasSize.width){
			// 描画サイズよりstageが小さい
			sliderPos.x = -1;
		}else{
			// スライダーの取りうる最大値
			var max_x = stageSize.width - canvasSize.width;
			// スライダー位置の割合から現在位置を出す
			sliderPos.x = this.drowMainContainer.x / max_x * -1;
		}

		// 縦軸計算
		if(stageSize.height <= canvasSize.height){
			// スライダーの取りうる最大値
			sliderPos.y = -1;
		}else{
			// スライダーの取りうる最大値
			var max_y = stageSize.height - canvasSize.height;
			// スライダー位置の割合から現在位置を出す
			sliderPos.y = this.drowMainContainer.y / max_y * -1;
		}
		return sliderPos;
	}


	/**
	 * backgroundとsystem, debugをのぞき、コンテナをすべてcloseする
	 *
	 * @memberof StageBase
	 */
	public contentsAllClose(){
		this.drowMainContainer.close();
		this.drowVMainContainer.close();
		this.drowHMainContainer.close();
		this.drowFrontContainer.close();
	}
	

	/*********************************************/
	/************** イベント定義  ****************/
	/*********************************************/
	public mousedownEvent(evt) {

		// hold処理はあと勝ち
		this.mousedownEventSub(this.drowGroundContainer);
		if(this.holdParam.flg == false) this.mousedownEventSub(this.drowMainContainer);
		if(this.holdParam.flg == false) this.mousedownEventSub(this.drowVMainContainer);
		if(this.holdParam.flg == false) this.mousedownEventSub(this.drowHMainContainer);
		if(this.holdParam.flg == false) this.mousedownEventSub(this.drowFrontContainer);
		if(this.holdParam.flg == false) this.mousedownEventSub(this.drowSystemContainer);
		if(this.holdParam.flg == false) this.mousedownEventSub(this.drowDebugContainer);
		
		// ホールド対象が無い場合、スワイプ処理と判断
		if(this.holdParam.flg == false){
			this.holdParam.offSet.x = this.stage.mouseX - this.drowMainContainer.x;
			this.holdParam.offSet.y = this.stage.mouseY - this.drowMainContainer.y;
			this.holdParam.flg = true;
			this.holdParam.uuid = StageBase.OBJECT_ID.WORLD;
		}
	}

	/**
	 * 各オブジェクトのmouseDownイベント呼び出し
	 * すべてStage直下のContenerからのみイベントを呼び出す。
	 *
	 * @param {DrowContainerBase} container 呼び出し元コンテナ
	 * @memberof StageBase
	 */
	public mousedownEventSub(container:DrowContainerBase):void{
		container.children.forEach( (val, key) => {
			let value : DrowContainerBase = val as DrowContainerBase;
			// すでにホールド済みであれば処理しない
			if(this.holdParam.flg==true || Utils.isEmpty(value.uuid))
				return ;
			var gPos : createjs.Point = new createjs.Point(Math.trunc(this.stage.mouseX), Math.trunc(this.stage.mouseY));
			var wPos : createjs.Point = container.globalToLocal(Math.trunc(this.stage.mouseX), Math.trunc(this.stage.mouseY));
			var lPos : createjs.Point = value.globalToLocal(Math.trunc(this.stage.mouseX), Math.trunc(this.stage.mouseY));
			value.mouseDown(gPos, wPos, wPos, lPos, this);
		} );
	}

	public mousemoveEvent(evt) {

		// スワイプ処理
		if(this.holdParam.uuid == 'WORLD' && this.holdParam.flg){
			let toX = this.stage.mouseX - this.holdParam.offSet.x;
			let toY = this.stage.mouseY - this.holdParam.offSet.y;

			let canvasObj: HTMLCanvasElement = this.stage.canvas as HTMLCanvasElement;
			let maxX = this.stageParam.size.width - canvasObj.width;
			let maxY = this.stageParam.size.height - canvasObj.height;

			// X
			if (maxX > 0) { // Canvasサイズのほうが小さいときのみ
				// 画面外判定（左上）
				if (toX > 0) toX = 0;
				// 画面外判定（右下）
				if (Math.abs(toX) > maxX) toX = -1 * maxX;

				this.drowMainContainer.x = toX;
				// 横だけ
				this.drowHMainContainer.x = toX;
			}else{
				this.drowMainContainer.x = 0;
				this.drowHMainContainer.x = 0;
			}

			// Y
			if (maxY > 0) {
				// 画面外判定（左上）
				if (toY > 0) toY = 0;
				// 画面外判定（右下）
				if (Math.abs(toY) > maxY) toY = -1 * maxY;

				this.drowMainContainer.y = toY;
				// 縦だけ
				this.drowVMainContainer.y = toY;
			}else{
				this.drowMainContainer.y = 0;
				// 縦だけ
				this.drowVMainContainer.y = 0;
			}

		}else{
			// オブジェクトごとの移動処理
			this.mousemoveEventSub(this.drowGroundContainer);
			this.mousemoveEventSub(this.drowMainContainer);
			this.mousemoveEventSub(this.drowVMainContainer);
			this.mousemoveEventSub(this.drowHMainContainer);
			this.mousemoveEventSub(this.drowFrontContainer);
			this.mousemoveEventSub(this.drowSystemContainer);
			this.mousemoveEventSub(this.drowDebugContainer);
		}
	}
	/**
	 * 各オブジェクトのmouseMoveイベント呼び出し
	 * すべてStage直下のContenerからのみイベントを呼び出す。
	 *
	 * @param {DrowContainerBase} container 呼び出し元コンテナ
	 * @memberof StageBase
	 */
	public mousemoveEventSub(container:DrowContainerBase):void{
		container.children.forEach( (val, key) => {
			let value : DrowContainerBase = val as DrowContainerBase;
			if(Utils.isEmpty(value.uuid))
				return ;
			var gPos : createjs.Point = new createjs.Point(Math.trunc(this.stage.mouseX), Math.trunc(this.stage.mouseY));
			var wPos : createjs.Point = container.globalToLocal(Math.trunc(this.stage.mouseX), Math.trunc(this.stage.mouseY));
			var lPos : createjs.Point = value.globalToLocal(Math.trunc(this.stage.mouseX), Math.trunc(this.stage.mouseY));
			value.mouseMove(gPos, wPos, wPos, lPos, this);
		} );
	}

	public mouseupEvent(evt) {
		if(this.holdParam.flg || this.selectDownParam.flg || this.selectUpParam.flg){
			this.mouseupEventSub(this.drowMainContainer);
			this.mouseupEventSub(this.drowVMainContainer);
			this.mouseupEventSub(this.drowHMainContainer);
			this.mouseupEventSub(this.drowFrontContainer);
			this.mouseupEventSub(this.drowSystemContainer);
			this.mouseupEventSub(this.drowDebugContainer);

			if(this.holdParam.uuid == StageBase.OBJECT_ID.WORLD){
				this.holdParam.flg = false;
				this.holdParam.uuid = '';
				this.holdParam.offSet.x = 0;
				this.holdParam.offSet.y = 0;
			}
		}
	}

	/**
	 * 各オブジェクトのmouseupMoveイベント呼び出し
	 * すべてStage直下のContenerからのみイベントを呼び出す。
	 *
	 * @param {DrowContainerBase} container 呼び出し元コンテナ
	 * @memberof StageBase
	 */
	public mouseupEventSub(container:DrowContainerBase):void{
		container.children.forEach( (val, key) => {
			let value : DrowContainerBase = val as DrowContainerBase;
			if(this.holdParam.flg==false || Utils.isEmpty(value.uuid))
				return ;
			var gPos : createjs.Point = new createjs.Point(Math.trunc(this.stage.mouseX), Math.trunc(this.stage.mouseY));
			var wPos : createjs.Point = container.globalToLocal(Math.trunc(this.stage.mouseX), Math.trunc(this.stage.mouseY));
			var lPos : createjs.Point = value.globalToLocal(Math.trunc(this.stage.mouseX), Math.trunc(this.stage.mouseY));
			value.mouseUp(gPos, wPos, wPos, lPos, this);
		} );
	}

	/**
	 * ウインドウサイズ変更時に呼ばれる関数
	 * ウインドウサイズに合わせてCANVASサイズを変更する
	 *
	 * @param {*} evt
	 * @memberof StageBase
	 */
	public handleResize(evt){
		const div : HTMLElement = document.querySelector<HTMLElement>('#' + this.canvasId) as HTMLElement;
		if(div == null) return;

		// 画面幅・高さを取得
		var w =  div.offsetWidth;
		var h = div.offsetHeight;
		// Canvas要素の大きさを画面幅・高さに合わせる
		let canvasObj: HTMLCanvasElement = this.stage.canvas as HTMLCanvasElement;
		canvasObj.width = w;
		canvasObj.height = h;

		this.stage.update();
	}

	/**
	 * マウスホイール実行時に呼ばれる関数
	 *
	 * @param {*} evt
	 * @memberof StageBase
	 */
	public mouseWheel(evt):void{
		// スワイプ処理
		if(this.holdParam.uuid == '' && !this.holdParam.flg){
			let toY = this.drowMainContainer.y - evt.deltaY;

			let canvasObj: HTMLCanvasElement = this.stage.canvas as HTMLCanvasElement;
			let maxY = this.stageParam.size.height - canvasObj.height;

			// Y
			if (maxY > 0) {
				// 画面外判定（左上）
				if (toY > 0) toY = 0;
				// 画面外判定（右下）
				if (Math.abs(toY) > maxY) toY = -1 * maxY;

				this.drowMainContainer.y = toY;
				// 縦だけ
				this.drowVMainContainer.y = toY;
			}else{
				this.drowMainContainer.y = 0;
				// 縦だけ
				this.drowVMainContainer.y = 0;
			}

		}
	}



	/****************************************/
	/************** 描画定義  ***************/
	/****************************************/
	public update(evt) {
		if (this.debugFlg) {
			let gPos = this.drowMainContainer.globalToLocal(this.stage.mouseX, this.stage.mouseY);
			let message = 'Mouse gPos(' + Math.trunc(this.stage.mouseX) + ',' + Math.trunc(this.stage.mouseY) + ') wPos(' + Math.trunc(gPos.x) + ',' + Math.trunc(gPos.y) + ')\r\n';
			message = message + 'Hold       Obj(' + (this.holdParam.flg ? this.holdParam.uuid : '')  + ')\r\n';
			message = message + 'SelectUp   Obj(' + (this.selectUpParam.flg ? this.selectUpParam.uuid : '')  + ')\r\n';
			message = message + 'SelectDown Obj(' + (this.selectDownParam.flg ? this.selectDownParam.uuid : '')  + ')\r\n';
			let obj = this.drowDebugContainer.getDrowObj(StageBase.OBJECT_ID.DEBUG_TXT) as DrowTextBase;
			if(Utils.isNotEmpty(obj))
				obj.textObj.text = message;
		}

		this.updateSub(this.drowGroundContainer);
		this.updateSub(this.drowMainContainer);
		this.updateSub(this.drowVMainContainer);
		this.updateSub(this.drowHMainContainer);
		this.updateSub(this.drowFrontContainer);
		this.updateSub(this.drowSystemContainer);
		this.updateSub(this.drowDebugContainer);
		
		this.stage.update();
		return;
	}

	/**
	 * 与えられたコンテナ直下のオブジェクトすべてに対してupdateを実行する
	 *
	 * @param {DrowContainerBase} container 実行対象コンテナ
	 * @memberof StageBase
	 */
	public updateSub(container:DrowContainerBase){
		container.children.forEach((val, key) => {
			let value:DrowContainerBase = val as DrowContainerBase;
			if(Utils.isNotEmpty(value.uuid)){
				value.update(this);
			}
		});
	}

	/**
	 * 画面のidがbridgeBoxであるtextBoxへ値を設定する
	 *
	 * @param {string} val
	 * @memberof StageBase
	 */
	public setBridgeBox(val:string):void{
		this.bridgeBox.value = val;
	}

	/**
	 * 画面のidがbridgeBoxであるtextBoxから内容を取得する。
	 *
	 * @return {*}  {string}
	 * @memberof StageBase
	 */
	public getBridgeBox():string{
		return this.bridgeBox.value;
	}

	/**
	 * 画面上のmain要素配下のinputを取得してjsonへ加工する
	 *
	 * @return {*} 
	 * @memberof StageBase
	 */
	public getInputDisp(inputID:string):string{
		let result:string = "";
		let main:HTMLElement;
		main = document.querySelector(inputID) as HTMLElement;

		if(Utils.isEmpty(main)){
			console.error("setInputFromEntity:ERROR " + inputID + "タグが見つかりません");
			return result;
		}

		let mainArray:HTMLCollection = main.children;
		let map = new Map;
		let i : number=0;
			
		for(i=0; i<mainArray.length; i++){
			let inputElement = mainArray[i] as HTMLInputElement;
			map.set(inputElement.id, inputElement.value);
		}
		result = JSON.stringify(Object.fromEntries(map));
		return result;
	}

	/**
	 * 引数のJsonの内容で画面のinputを更新する。
	 * inputとはjsonのkeyとidで紐づける。
	 *
	 * @param {string} jsonStr 画面描画用JSON
	 * @return {*} 
	 * @memberof StageBase
	 */
	public setInputDisp(inputID:string, jsonStr:string){
		let main:HTMLElement;
		main = document.querySelector(inputID) as HTMLElement;

		if(Utils.isEmpty(main)){
			console.log("setInputFromEntity:ERROR " + inputID + "タグが見つかりません");
			return;
		}

		if(Utils.isEmpty(jsonStr)){
			console.log("setInputFromEntity:ERROR Entityがカラです");
			return ;
		}

		let json;
		try{
			json = JSON.parse(jsonStr);
		}catch(e){
			console.error(e);
			return;
		}

		let mainArray:HTMLCollection = main.children;
		let key:string;
		for(key in json){
			if(Utils.isDefined(mainArray[key])){
				mainArray[key].value = json[key];
			}
		}
	}

	/**
	 * 画面全体を暗転してローディングを表示
	 *
	 * @param {string} [str] ローディング画面描画文字列
	 * @memberof StageBase
	 */
	public startLoader(str?:string){
		let tStr:string;
		tStr = str as string;
		if(Utils.isEmpty(str))
			tStr = "now loading...";

		this.loader.startLoader(tStr, this);
		this.stage.update();
	}

	/**
	 * ローディング表示を削除
	 *
	 * @memberof StageBase
	 */
	public endLoader(){
		this.loader.endLoader();
		this.stage.update();
	}

}


class DrowSliderObj extends DrowContainerBase{
	private sliderObj: createjs.Shape;
	private varticalFlg:boolean;

	public init(vartical:boolean=false, canvasSize:Utils.Size){
		this.sliderObj = new createjs.Shape();
		this.sliderObj.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
		this.varticalFlg = vartical;

		if(vartical){
			this.sliderObj.graphics.drawRoundRect(0, 0, 20, 50, 10); //100pxの正方形を描画。20pxの角丸を設定。
			this.uuid = StageBase.OBJECT_ID.SLIDER_V
			this.setBounds(0,0,20,50);
			this.x = canvasSize.width - 20;
		}else{
			this.sliderObj.graphics.drawRoundRect(0, 0, 50, 20, 10); //100pxの正方形を描画。20pxの角丸を設定。
			this.uuid = StageBase.OBJECT_ID.SLIDER_H
			this.setBounds(0,0,50,20);
			this.y = canvasSize.width - 20;
		}

		this.attribute.holdable = true;
		this.addChild(this.sliderObj);
	}


	/**
	 * Holdされた状態でマウスを移動した時に呼ばれる関数
	 * スライダー位置変更に加え、メインコンテンツ位置を変更する
	 *
	 * @param {createjs.Point} gPos グローバル座標のマウス移動先
	 * @param {createjs.Point} wPos ワールド座標のマウス移動先
	 * @param {createjs.Point} pPos 親オブジェクト座標のマウス移動先
	 * @param {createjs.Point} lPos ローカルオブジェクト座標のマウス移動先
	 * @param {StageBase} stage オブジェクトが登録されたstage
	 * @memberof DrowContainerBase
	 */
	public mouseMove(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
		if((stage.holdParam.uuid == StageBase.OBJECT_ID.SLIDER_H || stage.holdParam.uuid == StageBase.OBJECT_ID.SLIDER_V) && this.attribute.holdable && stage.holdParam.flg){
			let canvasSize: Utils.Size = stage.getCanvasSize();
			var objSize:createjs.Rectangle = this.getBounds();
			
			let ox:number = gPos.x - this.offSet.x;
			let oy:number = gPos.y - this.offSet.y;

			if(this.varticalFlg && stage.holdParam.uuid == StageBase.OBJECT_ID.SLIDER_V){
				this.x = canvasSize.width - objSize.width;
				
				if(oy < 0){
					this.y = 0;
				}else if ( oy > canvasSize.height - objSize.height){
					this.y = canvasSize.height - objSize.height;
				}else{
					this.y = oy;
				}
				let max_y = canvasSize.height - objSize.height;
				stage.setMainContenarYPosRatio( this.y / max_y);

			}else if(!this.varticalFlg && stage.holdParam.uuid == StageBase.OBJECT_ID.SLIDER_H){
				this.y = canvasSize.height - objSize.height;
				if(ox < 0){
					this.x = 0;
				}else if(ox > canvasSize.width - objSize.width){
					this.x = canvasSize.width - objSize.width;
				}else{
					this.x = ox;
				}
				let max_x = canvasSize.width - objSize.width;
				stage.setMainContenarXPosRatio(this.x / max_x);
			}
		}
	}

	/**
	 * 画面描画時にメインコンテンツの位置からスライダー位置を逆計算して反映する
	 *
	 * @param {StageBase} stage
	 * @memberof DrowSliderObj
	 */
	public update(stage: StageBase): void {
		if(!stage.isHold(this.uuid)){
			let canvasSize: Utils.Size = stage.getCanvasSize();
			let objSize:createjs.Rectangle = this.getBounds();
			let sliderPos:createjs.Point = stage.getSliderPosRatio();

			let drowPos:createjs.Point = stage.getMaincontenarPos();


			if(this.varticalFlg){
				// 描画範囲がキャンバスサイズ以下,かつ表示位置が原点の場合スライダーを非表示にする
				if(stage.stageParam.size.height - canvasSize.height <= 0 && drowPos.y == 0){
					this.sliderObj.alpha = 0;
				}else{
					this.sliderObj.alpha = 1;
				}

				this.x = canvasSize.width - objSize.width;
				let y = (canvasSize.height-objSize.height) * sliderPos.y;
				if(y < 0){
					this.y = 0;
				}else if ( y > canvasSize.height - objSize.height){
					this.y = canvasSize.height - objSize.height;
				}else{
					this.y = y;
				}
			}else{
				// 描画範囲がキャンバスサイズ以下である場合スライダーを非表示にする
				if(stage.stageParam.size.width - canvasSize.width <= 0 && drowPos.x == 0){
					this.sliderObj.alpha = 0;
				}else{
					this.sliderObj.alpha = 1;
				}

				let x = (canvasSize.width-objSize.width) * sliderPos.x;
				if(x < 0){
					this.x = 0;
				}else if(x > canvasSize.width - objSize.width){
					this.x = canvasSize.width - objSize.width;
				}else{
					this.x = x;
				}
				this.y = canvasSize.height - objSize.height;
			}
		}
	}
}

export namespace StageBase{
	export class StageParam {
		public size:Utils.Size;
	}

	export class ObjectParam{
		public flg:boolean;
		public uuid:string;
		public offSet:createjs.Point;
	}

	export enum OBJECT_ID {
		WORLD = 'WORLD',
		DEBUG_TXT = 'DEBUG_TXT',
		SLIDER_V = 'SLIDER_V',
		SLIDER_H = 'SLIDER_H'
	}
}


export default StageBase;
