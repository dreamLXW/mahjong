var TempClient = require('MjRequestSpecificClient');
var CommonHelper = require('CommonHelper');
var CodeCfg = require('CodeCfg');
var SystemConfig = require("SystemConfig");
var GameToWechatGameHelper = require("GameToWechatGameHelper");
var GameToAppHelper = require("GameToAppHelper");
var MessageBoxMgr = require('MessageBoxMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        loadingsp : {
            type : cc.Node,
            default : null,
        },
        versionLabel : {
            type : cc.Label,
            default : null,
        },
        modalContainer : {
            type : cc.Node,
            default : null,
        },
    },

    getModalContainer : function(){
        return this.modalContainer;
    },

    // use this for initialization
    onLoad: function () {
        if(cc.global == undefined || cc.global == null){
            cc.global = {};
        }
        cc.global.loading = this.loadingsp.getComponent('LoadingSpCpn');
        cc.global.rootNode = this.node;//场景根节点，主要用来发送消息,cc.global.emit;cc.global.on

        cc.global.rootNode.on('OnSeatStart',this.onSeatStart,this);
        // if(cc._rootMgr){
        //     cc._rootMgr.netMgr.setLoginCallBack(this.onLoginSuccess.bind(this));
        // }
        this.showVesion();
        this.rejustCanvas();
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
    },

    rejustCanvas : function(){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            GameToWechatGameHelper.isIphoneX();
        } else {
            if(cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE){
                var size = cc.view.getFrameSize();
                var isIphoneX = GameToAppHelper.isIphoneX();
                cc.isIphoneX  = isIphoneX;
                if(isIphoneX){
                    var cvs = this.node.getComponent(cc.Canvas);
                    cvs.fitHeight = true;
                    cvs.fitWidth = true;
                }
            }
        }
    },

    onTouchStart : function(touch){
        cc.global.rootNode.emit('CanvasTouchStart',touch);
    },

    onTouchMove : function(touch){
        cc.global.rootNode.emit('CanvasTouchMove',touch);
    },

    onTouchEnd : function(touch){
        cc.global.rootNode.emit('CanvasTouchEnd',touch);
    },

    onTouchCancel : function(touch){
        console.log('init Logic onTouchCancel');
        cc.global.rootNode.emit('CanvasTouchCancel',touch);
    },
    showVesion : function(){
        if(this.versionLabel){
            if(SystemConfig.isReal()){
                this.versionLabel.node.active = false;
            }else{
                this.versionLabel.node.active = true;
                this.versionLabel.string = SystemConfig.version;
            }
        }
    },

    login : function(cb){
        this._cb = cb;
        cc.global.loading.show();
        cc._rootMgr.netMgr.setIsReconnnect(true);
        if(cc.mj.roomInfo.isGoldRoom()){
            var ProtoUtil = require("ProtoUtil");
            var msg = {uid : cc.mj.ownUserData.uid, token : cc.mj.ownUserData.token, config : cc.mj.roomInfo.roomConfig.getRawOpt()};
            msg = ProtoUtil.encode(msg);
            console.log("goldLogin:" + JSON.stringify(msg));
            cc._rootMgr.netMgr.goldLogin(msg, this.onLoginCb.bind(this));
        }else{
            cc._rootMgr.netMgr.roomCardLogin(this.onLoginCb.bind(this));
        }
        
    },

    onLoginCb : function(isSuc,code){
        cc.global.loading.hide();
        if(!isSuc){
            CommonHelper.showMessageBox("提示",CodeCfg.getCodeName(code),function(){
                CommonHelper.backToLastScene();
            },null,false);
            //关闭长链接
            cc.mj.netMgr.close(false);
            cc.mj.roomInfo.clearData();
        }else{
            var rid = cc._rootMgr.roomInfo.roomId;
            TempClient.enterRoom(rid,this.onEnterRoomCallBack.bind(this),true);
        }
    },

    onEnterRoomCallBack : function(cbdata){
        if(cbdata.code == CodeCfg.OK){
            if(this._cb){
                this._cb();
                this._cb = null;
            }
            var SeatCustomEvent = require('SeatCustomEvent');
            var seatCustomEvent = new SeatCustomEvent();
            seatCustomEvent.init('GameDataInitEvent',cbdata);
            //console.log("initLogic:"+JSON.stringify(cc._rootMgr));
            cc._rootMgr.gameData.pushSeatEvent(seatCustomEvent);
        }else{
            CommonHelper.showMessageBox("提示",CodeCfg.getCodeName(cbdata.code),function(){
                CommonHelper.backToLastScene();
            },null,false);
            cc.mj.netMgr.close(false);
            cc.mj.roomInfo.clearData();
        }
    },

    onSeatStart : function(event){
        var rid = cc._rootMgr.roomInfo.roomId;
        TempClient.syncGameData(rid,this.onEnterRoomCallBack.bind(this),true);
    },

    onDestroy : function(){
        cc.global.rootNode.off('OnSeatStart',this.onSeatStart,this);  
        this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);  
        MessageBoxMgr.reset();
    },
});
