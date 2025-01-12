// @ts-check

import StageBase from "../../stage/StageBase";
import { uuidv7 } from 'uuidv7'
import Utils from "../../../util/Utils";

export class DrowContainerBase extends createjs.Container{

	/**
	 * オブジェクトごとに設定されるID
	 * 
	 * @type {string}
	 * @memberof DrowContainerBase
	 */
	public uuid:string;

	/**
	 * ホールドされた際の自己位置とクリック位置との差
	 *
	 * @type {createjs.Point}
	 * @memberof DrowContainerBase
	 */
	public offSet:createjs.Point;

	// イベント用属性
	public attribute:DrowContainerBase.Attribute = {
		clickable: false,  // クリックイベント発生時に処理を行うか
		holdable: false,	// ホールドされたら処理を行うか
		selectable: false,	// 選択されたら発生時に処理を行うか
	}

	/**
	 * Creates an instance of DrowContainerBase.
	 * @param {string} [uuid=''] オブジェクトのユニークID、未設定の場合自動発番される
	 * @memberof DrowContainerBase
	 */
	public constructor(uuid:string = '') {
		super();
        if(uuid == '')
    		this.uuid = this.createUuid();
        else
            this.uuid = uuid;

		this.offSet = new createjs.Point;
	}

	/**
	 * 引数オブジェクトを最前面へ表示
	 *
	 * @param {createjs.DisplayObject} obj 最前面へ移動するオブジェクト
	 * @memberof DrowContainerBase
	 */
	public bringToFront(obj:createjs.DisplayObject):void{
		this.setChildIndex(obj, this.children.length-1);
	}
	/**
	 * 引数オブジェクトを最背面へ表示
	 *
	 * @param {createjs.DisplayObject} obj 最背面へ移動するオブジェクト
	 * @memberof DrowContainerBase
	 */
	public bringToBack(obj:createjs.DisplayObject):void{
		this.setChildIndex(obj, 0);
	}

	/**
	 * マウスを移動した時に呼ばれる関数
	 *
	 * @param {createjs.Point} gPos グローバル座標のマウス移動先
	 * @param {createjs.Point} wPos ワールド座標のマウス移動先
	 * @param {createjs.Point} pPos 親オブジェクト座標のマウス移動先
	 * @param {createjs.Point} lPos ローカルオブジェクト座標のマウス移動先
	 * @param {StageBase} stage 描画Stage
	 * @return {*}  {void}
	 * @memberof DrowContainerBase
	 */
	public mouseMove(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
		// すべての紐づくobjectに対しても実施
		this.children.forEach(
			(val, key) => {
				let value : DrowContainerBase = val as DrowContainerBase;
				if(Utils.isEmpty(value.uuid))
					return ;
				var childPos : createjs.Point = new createjs.Point(lPos.x - value.x, lPos.y - value.y)
				value.mouseMove(gPos, wPos, lPos, childPos ,stage);
			}
		);

		if(!stage.isHold(this.uuid))
			return;

		if(this.attribute.holdable){
			this.mouseHoldMoveEvent(gPos, wPos, pPos, lPos, stage);
		}
	}

	public mouseHoldMoveEvent(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
		this.x = pPos.x - this.offSet.x;
		this.y = pPos.y - this.offSet.y;
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
		// すべての紐づくobjectに対しても実施
		this.children.forEach(
			(val, key) => {
				let value : DrowContainerBase = val as DrowContainerBase;
				if(Utils.isEmpty(value.uuid))
					return ;
				var childPos : createjs.Point = new createjs.Point(lPos.x - value.x, lPos.y - value.y)
				value.mouseDown(gPos, wPos, lPos, childPos ,stage);
			}
		);

		if(stage.selectDownParam.flg == false && this.hitTest(lPos.x, lPos.y)){
			if(this.attribute.selectable){
				stage.setSelectDown(this.uuid);
				stage.clearSelectUp();
				this.mouseSelectDownEvent(gPos, wPos, pPos, lPos, stage);
			}
		}

		// ホールド処理
		if (stage.holdParam.flg == false && this.hitTest(lPos.x, lPos.y)) {
			if (this.attribute.holdable || this.attribute.clickable) {
				stage.setHold(this.uuid);
				this.offSet.x = lPos.x;
				this.offSet.y = lPos.y;
				this.mouseHoldDownEvent(gPos, wPos, pPos, lPos, stage);
			}
		}
		return;
	}

	public mouseSelectDownEvent(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
	}

	public mouseHoldDownEvent(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
	}

	/**
	 * マウス左クリックボタンが放された時に呼ばれる関数
	 *
	 * @param {createjs.Point} gPos グローバル座標のマウス移動先
	 * @param {createjs.Point} wPos ワールド座標のマウス移動先
	 * @param {createjs.Point} pPos 親オブジェクト座標のマウス移動先
	 * @param {createjs.Point} lPos ローカルオブジェクト座標のマウス移動先
	 * @param {StageBase} stage
	 * @memberof DrowContainerBase
	 */
	public mouseUp(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
		// すべての紐づくobjectに対しても実施
		this.children.forEach(
			(val, key) => {
				let value : DrowContainerBase = val as DrowContainerBase;
				if(Utils.isEmpty(value.uuid))
					return ;
				var childPos : createjs.Point = new createjs.Point(lPos.x - value.x, lPos.y - value.y)
				value.mouseUp(gPos, wPos, lPos, childPos ,stage);
			}
		);

		// select可能オブジェクト、かつ自身がSelectされている場合のみ処理
		// selectはクリックUP時に対象オブジェクトに重なっていないと処理されない
        if(this.attribute.selectable && stage.isSelectDown(this.uuid)){
			stage.clearSelectDown();
			if(this.attribute.selectable && this.hitTest(lPos.x, lPos.y)){
				stage.setSelectUp(this.uuid);
				this.mouseSelectUpEvent(gPos, wPos, pPos, lPos, stage);
			}
        }

		// hold可能オブジェクト、かつ自身がholdされている場合のみ処理
		// holdはクリックUP時に対象オブジェクトに重なっていない久手も処理される
        if(this.attribute.holdable && stage.isHold(this.uuid)){
			this.mouseHoldUpEvent(gPos, wPos, pPos, lPos, stage);
			stage.clearHold();
        }
	}

	/**
	 * マウス左クリックボタンが放された時に呼ばれる関数
	 *
	 * @param {createjs.Point} gPos グローバル座標のマウス移動先
	 * @param {createjs.Point} wPos ワールド座標のマウス移動先
	 * @param {createjs.Point} pPos 親オブジェクト座標のマウス移動先
	 * @param {createjs.Point} lPos ローカルオブジェクト座標のマウス移動先
	 * @param {StageBase} stage
	 * @memberof DrowContainerBase
	 */
	public mouseHoldUpEvent(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
	}


	/**
	 * マウス左クリックボタンが放された時に呼ばれる関数
	 *
	 * @param {createjs.Point} gPos グローバル座標のマウス移動先
	 * @param {createjs.Point} wPos ワールド座標のマウス移動先
	 * @param {createjs.Point} pPos 親オブジェクト座標のマウス移動先
	 * @param {createjs.Point} lPos ローカルオブジェクト座標のマウス移動先
	 * @param {StageBase} stage
	 * @memberof DrowContainerBase
	 */
	public mouseSelectUpEvent(gPos:createjs.Point, wPos:createjs.Point, pPos:createjs.Point,lPos:createjs.Point, stage:StageBase):void{
	}

    public update(stage:StageBase):void{}


	/**
	 * 配下のオブジェクトをすべてremoveする。
	 * 入れ子のオブジェクトもすべてremoveする
	 *
	 * @param {StageBase} stage
	 * @memberof DrowContainerBase
	 */
	public close():void{
		// すべての紐づくobjectに対しても実施
		this.children.forEach(
			(val, key) => {
				let value : DrowContainerBase = val as DrowContainerBase;
				if(Utils.isEmpty(value.uuid))
					return ;
				value.close();
			}
		);

		this.removeAllChildren();
	}

	// uuid初版用。コンストラクタで1度呼ばれるのみとする
	private createUuid() { return uuidv7() }

	/**
	 * セットしたPOINTに自己位置を更新する。
	 * 対象オブジェクトのlocalpointへ自己位置を変更するために使う
	 *
	 * @param {createjs.Point} pos 変更後ポイント
	 * @memberof DrowContainerBase
	 */
	public setLocalPos(obj:createjs.DisplayObject):void{
		let pos = new createjs.Point;
		pos = obj.localToGlobal(this.x, this.y);

		this.x = pos.x;
		this.y = pos.y;
	}

	/**
	 * セットしたPOINTに自己位置を更新する。
	 * 対象オブジェクトのglobalpointへ自己位置を変更するために使う
	 *
	 * @param {createjs.Point} pos 変更後ポイント
	 * @memberof DrowContainerBase
	 */
	public setGlobalPos(obj:createjs.DisplayObject):void{
		let pos = new createjs.Point;
		pos = obj.globalToLocal(this.x, this.y);

		this.x = pos.x;
		this.y = pos.y;
	}

	/**
	 * 紐づく子オブジェクトから指定したIDの対象を抜き出す
	 *
	 * @param {string} uuid 参照オブジェクトのID
	 * @return {*}  {(DrowContainerBase | undefined)}
	 * @memberof DrowContainerBase
	 */
	public getDrowObj(uuid:string):DrowContainerBase | undefined{
		let result : DrowContainerBase | undefined;
		if(Utils.isEmpty(uuid))
			return undefined;

		// すべての紐づくobjectに対しても実施
		result = this.children.find(
			(val, key) => {
				let value : DrowContainerBase = val as DrowContainerBase;
				if(Utils.isEmpty(value.uuid))
					return false;
				if(uuid == value.uuid)
					return true;
			}
		) as DrowContainerBase;

		return result;
	}
}

export namespace DrowContainerBase{
	export interface Attribute{
		clickable: boolean;  	// クリックイベント発生時に処理を行うか
		holdable: boolean;		// ホールドされたら処理を行うか
		selectable: boolean;	// 選択されたら発生時に処理を行うか
	};
}

export default DrowContainerBase;
