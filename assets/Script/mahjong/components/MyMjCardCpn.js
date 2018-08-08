var TimeHelper = require('TimeHelper');
var TempClient = require('MjRequestSpecificClient');
var MjSoundHelper = require('MjSoundHelper');
var CfgPair = require("PairCfg");
var OriginState = 1;
var MoveState = 2;
var SingleClickState = 3;
cc.Class({//麻将的交互部分，比如出牌，出牌后可以把组件移除
    extends: cc.Component,

    properties: {
        _touchEndFunc : {
            default : null,
            type : Function,
        },
        _handsMahjongCpn : null,
        
        backToOringinSpeed : 400,
        _mahjongData : -1,
        _isLock : true,
        mahjongTouchState : 1,//OriginType
        height : 20,
    },

    // use this for initialization
    onLoad: function () {
    },

    ctor : function(){
        this._isLock = true;
    },

    initHandsMahjongCpn : function(handsMahjongCpn){
        this._handsMahjongCpn = handsMahjongCpn;
    },

    onStart : function(){
        this._touchEndFunc  = this.getDefaultTouchEndFunc;
    },

    onTouchStart : function(touch){  
        if(this._handsMahjongCpn._isActioning){
            return;
        }
        MjSoundHelper.playingClick();
        this.setMySelfOnTop();
        if(this.mahjongTouchState == OriginState){
            console.log('cc');
            this.node.position = cc.p(0,this.height);
        }
        this.clearMyHandsMahjongState();
    },

    onTouchMove : function(touch){
        if(this._handsMahjongCpn._isActioning){
            return;
        }
        var pos = this.node.parent.convertTouchToNodeSpaceAR(touch);
        if((pos.y < (this.node.getBoundingBox().height*(1 - this.node.anchorY) - this.height)) || cc.isIphoneX == true) {
            pos.x = 0;
        }else{
            this.mahjongTouchState = MoveState;
        }
        if(this.mahjongTouchState == OriginState || this.mahjongTouchState == SingleClickState){
            pos = cc.p(0,this.height);
        }else{
            pos.y = pos.y < 0 ? 0 : pos.y;
        }
        
        this.node.position = pos;
    },

    isRealMoveState : function(touch){//坐标偏移超过一定范围才变为movestate
        var startLoc = touch.getStartLocation();
        var loc = touch.getLocation();
        var deltaX = Math.abs(startLoc.x - loc.x);
        var deltaY = Math.abs(startLoc.y - loc.y);
        if(deltaX > 50 || deltaY > 50){
            return true;
        }else{
            return false;
        }
    },

    onTouchEnd : function(touch){
        this.node.parent.setLocalZOrder(0);
        if(this._handsMahjongCpn._isActioning){
            return;
        }
        var isChuPai = false;
        if(this.mahjongTouchState == OriginState){
            this.mahjongTouchState = SingleClickState;
            this.node.position = cc.p(0,20);
        }else if(this.mahjongTouchState == MoveState){
            if(this.isPosCanChuPai()){
                isChuPai = true;        
            }
            this.mahjongTouchState = OriginState;
        }else if(this.mahjongTouchState == SingleClickState){
            isChuPai = true;
            this.mahjongTouchState = OriginState;
        }
        if(isChuPai == true){
            if(this._isLock){//不能出牌
                this.BackToOrigin(false);
            }else{
                this.chuPai();
            }
        }else if(this.mahjongTouchState != SingleClickState){
            this.BackToOrigin(false);
        }
    },

    onTouchCancel : function(touch){
        if(this._handsMahjongCpn._isActioning){
            return;
        }
        this.clearState();
    },

    chuPai : function(){
        console.log('出牌:' + this._mahjongData);
        this._handsMahjongCpn.setWaitChuPaiNode(this.node);
        this.ChuPaiNet();
        this.LockMyHandsMahjong();
        cc.mj.netMgr.onSeatAction({'uid':cc.mj.ownUserData.uid,'type':CfgPair.CHU_PAI,'card_list':[this._mahjongData],'next_uid':cc.mj.ownUserData.uid});
    },

    ChuPaiNet : function(){//出牌请求
        TempClient.requestChu(this._mahjongData);
    },

    isPosCanChuPai : function(){
        //麻将中点相对于屏幕的坐标
        var thisworldSpace = this.node.parent.convertToWorldSpaceAR(this.node.position);
        var criticalPosY = this.getCriticalWorldY();
        if(thisworldSpace.y > criticalPosY){
            return true;
        }else{
            return false;
        }    
    },

    getCriticalWorldY : function(){//临界高度世界坐标
        //麻将原点相对于屏幕的坐标
        var parentWorldSpace = this.node.parent.convertToWorldSpaceAR(cc.p(0,0));
        console.log( '  parentWorldSpace:' + parentWorldSpace);
        var height = this.node.getBoundingBox().size.height ;
        var criticalPosY = parentWorldSpace.y + height * this.node.parent.scale ;//节点本身scale为1，需要与父节点scale相剩
        return criticalPosY;
    },

    getCriticalNodeY :function(){
        var criticalWorldPos = cc.p(0,this.getCriticalWorldY());
        var nodepos = this.node.parent.convertToNodeSpaceAR(criticalWorldPos);
        return nodepos.y;
    },

    BackToOrigin : function(isAction){//回到原点
        const speed = this.backToOringinSpeed;
        var duration = TimeHelper.getSpendTime(speed,this.node.position,cc.p(0,0));
        if(isAction){
            this._handsMahjongCpn._isActioning = true;
            this.node.runAction(cc.sequence(cc.moveTo(duration,cc.p(0,0)),cc.callFunc(function () {
                console.log(this._handsMahjongCpn._isActioning);
                this._handsMahjongCpn._isActioning = false;
            },this)));
        }else{
            this.node.position = cc.p(0,0);
        }
    },

    chuPaiBackToOringin : function(fromNodePos){
        this._handsMahjongCpn._isActioning = true;
        this.node.position = fromNodePos;

        var criticalNodeY = this.getCriticalNodeY();
        var fromUpPos = cc.p(fromNodePos.x,criticalNodeY);
        var toUpPos = cc.p(0,criticalNodeY);
        var duration = TimeHelper.getSpendTime(this.backToOringinSpeed,fromUpPos,toUpPos);
        const upAndDowmDuration = 0.01;
        console.log("chuPaiBackToOringin " + duration + " speed " + this.backToOringinSpeed);
        this.node.runAction(cc.sequence(cc.moveTo(upAndDowmDuration,fromUpPos),
                                        cc.moveTo(duration,toUpPos),
                                        cc.moveTo(upAndDowmDuration,cc.p(0,0)),
                                        cc.callFunc(function () {
                                            console.log(this._handsMahjongCpn._isActioning);
                                            this._handsMahjongCpn._isActioning = false;},this)
                                        )
                            );
    },

    onDestroy : function(){
    },

    setTouchEndFunc : function(func){
        this._touchEndFunc = func;
    },

    getDefaultTouchEndFunc : function(touch){
        
    },

    setMahjongData : function(data){//数值
        this._mahjongData = data;
    },

    getMahjongData : function(){
        return this._mahjongData;
    },

    LockMyHandsMahjong : function(){//锁住所有的牌
        if(this._handsMahjongCpn){
            this._handsMahjongCpn.Lock();
        }
    },

    clearState : function(){
        this.mahjongTouchState = OriginState;
        this.node.position = cc.p(0,0);
    },

    clearMyHandsMahjongState : function(){
         if(this._handsMahjongCpn){
            this._handsMahjongCpn.clearStateExcept(this.node);
        }       
    },

    LockChuPai : function(){//让自己不能出牌
        this._isLock = true;
    },

    unLockChuPai:function(){//让自己能出牌
        this._isLock = false;
    },

    unLockMyHandsMahjong : function(){//解锁所有的牌
        if(this._handsMahjongCpn){
            this._handsMahjongCpn.unLock();
        }
    },

    isContansPos : function(worldPos){
        var rect = this.node.getBoundingBoxToWorld();
        rect.height -= this.height;
        return (rect.contains(worldPos));
    },

    isIntersectsRect : function(worldRect){
        var rect1 = this.node.getBoundingBoxToWorld();
        return (rect1.intersects(worldRect));
    },

    setMySelfOnTop : function(){
        if(this._handsMahjongCpn){
            this._handsMahjongCpn.setHandsMahjongOnTop(this);
        }            
    },

    setZOrder : function(zOrder){
        this.node.parent.setLocalZOrder(zOrder);
    },
});
