const GameIdArr = ["none","niuniu","mj"];

var MjNetMgr = require('MjNetMgr');
var OwnUserData = require('OwnUserData');
var RoomInfoData = require('RoomInfoData');
var SystemConfig = require("SystemConfig");
var AppToGameHelper = require("AppToGameHelper");
var GameToAppHelper = require('GameToAppHelper');
var MjSoundHelper = require('MjSoundHelper');
var CommonHelper = require('CommonHelper');
var TimeHelper = require('TimeHelper');
var SeatCfg = require('SeatCfg');
var TempClient = require('MjRequestSpecificClient');
var BackStageConfig = require('BackStageConfig');
var ProtoUtil = require("ProtoUtil");
var Code = require('CodeCfg');
var GameToWechatGameHelper = require('GameToWechatGameHelper');
var GameToPlatformHelper = require('GameToPlatformHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        getUserInfoTipsNode : {
            default : null,
            type : cc.Node,
        },
        wechatShowUIList : {
            default : [],
            type : cc.Node,
        },
        _maxProgress : 0,
        _isUploading : false,
    },

    // use this for initialization
    onLoad: function () {
        this._maxProgress = 0;
        cc.global.loading.setProgressNum(0);
        this.addListener();
        if (SystemConfig.isShowTestNode) {
            this.node.getComponent('testLoginLogic').show()
        } else {
            this.node.getComponent('testLoginLogic').hide();
            this.startPlatformLoginLogic()
        }
        var initLogicCpn = this.node.getComponent('initLogic');
        if(initLogicCpn){
            initLogicCpn.showVesion();
        }
        this.isShowWechatUI();
    },

    ctor : function(){
        this._accTime = 0;
    },

    startPlatformLoginLogic : function(){
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            this.WeChatPlatformLoginLogic();
        }else{
            this.dingdingPlatformLoginLogic();
        }
    },

    onWeChatShow : function(event){
        console.log("onWeChatShow");
        var self = this;
        GameToWechatGameHelper.getSetting('scope.userInfo', function (status) {
            if (status == true) {
                if (self._isUploading == false) {
                    console.log("onshow scope.userInfo");
                    self.updateWeChatUserInfo();
                }
            } else {
                self.getUserInfoAuthFail();
            }
        })
    },

    addListener : function(){
        cc.global.rootNode.on('OnHotUpdateComplete',this.onHotUpdateComplete,this);
        cc.global.rootNode.on('OnShow',this.onWeChatShow,this);
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            GameToWechatGameHelper.addOnShowListener();
            GameToWechatGameHelper.addOnHideListener();
            GameToWechatGameHelper.onAudioInterruptionEvent();
            GameToWechatGameHelper.addShareBtn();
        } else {
            cc.game.on(cc.game.EVENT_HIDE, function () {
                console.log("cc.game.EVENT_HIDE");
            });
            cc.game.on(cc.game.EVENT_SHOW, function () {
                console.log("cc.game.EVENT_SHOW");
                var data = GameToAppHelper.getGameEnterInitData();
                var dataJson = JSON.parse(data);
                if (dataJson) {
                    cc.global.rootNode.emit("OnShow",dataJson);
                }
            });
        }
    },

    removeListener : function(){
        cc.global.rootNode.off('OnHotUpdateComplete',this.onHotUpdateComplete,this);
        cc.global.rootNode.off('OnShow',this.onWeChatShow,this);
    },

    WeChatPlatformLoginLogic : function(){
        var self = this;
        var weiChatLoginCallBack = function(status,userInitData){
            if(status == false){
                CommonHelper.showMessageBox("提示","微信登录失败，退出游戏后再尝试一次",function(){GameToPlatformHelper.ExitGame();;},null,false);
            }else{
                var uid = userInitData.uid;
                var msg = {"uid" : uid};
                var launchOption = GameToWechatGameHelper.getLaunchOptionsSync();
                if (launchOption.query.roomId) {
                    msg.roomId = launchOption.query.roomId;
                }
                if (launchOption.query.clubInviteCode) {
                    if(!msg.gameData){
                        msg.gameData = {};
                    }
                    msg.gameData.clubInviteCode = launchOption.query.clubInviteCode;
                }
                self.initGameCommonInitData(msg);
                self.initGameSpecialInitData(msg.gameData);
                self.updateWeChatUserInfo();
                self._maxProgress = 0.3;
            }
        };
        GameToWechatGameHelper.weiChatLogin(weiChatLoginCallBack);
    },

    updateWeChatUserInfo : function(){
        var self = this;
        var upLoadWeChatUserInfo = function(res){
            TempClient.weChatUserUploadUserInfo(res,function(customHttpRequest){
                if(customHttpRequest){
                    console.log('weChatUserUploadUserInfo:' + customHttpRequest.xhr.responseText);
                    var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
                    if(cbdata.code == Code.OK){  
                        var zeroTime = TimeHelper.changeDateToZeroTime(new Date());
                        cc.sys.localStorage.setItem("" + cc.mj.ownUserData.uid + "loginTime",curZeroTime.getTime());   
                        self.startLoadOnlineData();
                    }else{
                        CommonHelper.showMessageBox("提示","上传用户信息出错了",function(){},null,false);
                    }
                }else{  
                    CommonHelper.showMessageBox("提示","上传用户信息超时，请重新尝试",function(){self.updateWeChatUserInfo();},null,false);
                }
            });
        };
        var weChatUserInfoCb = function(status,res){
            if(status == false){
                var failCode = res;
                if(failCode == GameToWechatGameHelper.AUTH_FAIL){
                    self.getUserInfoAuthFail();
                }else{
                    CommonHelper.showMessageBox("提示","微信登录失败，退出游戏后再尝试一次",function(){GameToPlatformHelper.ExitGame();},null,false);
                }
            }else{
                res.uid = cc._rootMgr.ownUserData.uid;
                upLoadWeChatUserInfo(res);
            }
        };
        var curZeroTime = TimeHelper.changeDateToZeroTime(new Date());
        if(!(cc.sys.localStorage.getItem("" + cc.mj.ownUserData.uid + "loginTime") == curZeroTime.getTime())){
            self._isUploading = true;
            GameToWechatGameHelper.getWeiChatUserInfo(weChatUserInfoCb, self.getUserInfoTipsNode);
        }else{
            self.startLoadOnlineData();
        }
    },

    getUserInfoAuthFail : function(){
        var self = this;
        var onOk = function(){
            self._isUploading = false;
            GameToWechatGameHelper.onOpenSetting()
        };
        var onCancel = function(){
            self._isUploading = false;
            GameToPlatformHelper.ExitGame();
        };
        var data = {"content":"您需要授权小游戏获取您的登录信息","onOk":onOk,"onCancel":onCancel,"isNeedCancel":true};
        CommonHelper.showMessageBoxByRawData(data);
    },

    dingdingPlatformLoginLogic : function(){
        var initData = GameToAppHelper.getGameEnterInitData();
        var isInitDataValid = false;
        if(initData){
            var initDataJson = JSON.parse(initData);
            isInitDataValid = this.initGameCommonInitData(initDataJson);
            if(isInitDataValid){
                this.initGameSpecialInitData(initDataJson.gameData);
            }
        }else{
            console.log('没有传输初始化数据');
        }
        if(isInitDataValid == true){
            this.node.getComponent('testLoginLogic').hide();
            this.startLoadOnlineData();
        }else{
            var testLoginLogic = this.node.getComponent('testLoginLogic');
            testLoginLogic.setCanNormalLogin(true);
            testLoginLogic.show();    
        }
    },

    onDestroy : function(){
        this.removeListener();
    },

    loadRes : function(cb){
        var self = this;
        cc.global.loading.setProgressNum(0.8);
        self._maxProgress = 0.9;
        cc.loader.loadResDir("mahjong/png", function (err, assets) {
            console.log('加载完成1');
            MjSoundHelper.playingBgMusic();
        });   
        cc.loader.loadResDir("mahjong/prefab", function (err, assets) {
            console.log('加载完成2');
            if (cb) {
                cb();
            }
        });  
    },

    initMgr : function(gameId){
        cc.gameConfig = {};
        cc.gameConfig.gameId = gameId; 
        cc[GameIdArr[gameId]] = {};
        var rootmgr = cc[GameIdArr[gameId]];
        cc._rootMgr = rootmgr;
        rootmgr.i18n = require('LanguageData');
        rootmgr.i18n.init('zh');

        rootmgr.netMgr = new MjNetMgr;
        
        rootmgr.ownUserData = new OwnUserData;
        rootmgr.roomInfo = new RoomInfoData;
        
        cc.appToGameHelper = AppToGameHelper;
        cc.global.isSmallWindowMode = false;
        cc.global.isFirstIn = true;
        cc.global.isLastTimeInClub = false;
    },

    initGameCommonInitData : function(initJson){
        var uid = null,token = null,rid = null,gameId = null,gameData = null,isInitDataValid = false,serverMode = null;
        if(initJson){
            uid = Number(initJson.uid);
            token = initJson.uToken;
            rid = initJson.roomId;
            gameId = initJson.gameId;
            gameData = initJson.gameData;
            serverMode = initJson.serverType;
            if(uid && (cc.sys.platform === cc.sys.WECHAT_GAME || (token && gameId))){
                isInitDataValid = true;
                gameId = 2;
            }
        }
        if(isInitDataValid){
            this.initMgr(gameId);
            var msg = {"uid" : uid, "token" : token};
            cc._rootMgr.ownUserData.initData(msg);
            cc._rootMgr.roomInfo.roomId = rid;
            SystemConfig.setSysConfigMode(serverMode);
        }
        return isInitDataValid;
    },

    initGameSpecialInitData : function(gameData){
        switch(Number(cc.gameConfig.gameId)){
            case 2:
                {
                    cc.gameConfig.groupId = gameData ? gameData.groupId : null;
                    cc.gameConfig.isHide = gameData ? gameData.isHide : false;
                    cc.gameConfig.clubInviteCode = gameData ? gameData.clubInviteCode : null;
                }  
            break;
        }
    },

    jumpToLobbyScene : function(){
        cc.sys.localStorage.setItem("FirstShow", 1);
        cc.global.loading.setProgressNum(1);
        this.node.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(function(){cc.director.loadScene('lobbyscene');})));
        // cc.director.loadScene('lobbyscene');
    },

    update : function(dt){
        if(this._isUpdateProgress){
            return;
        }
        this._accTime += dt;
        if(this._accTime >= 0.1){
            this._accTime = 0;
            var maxprogress = cc.global.loading.getProgressNum() + 0.01;
            if(maxprogress  <= this._maxProgress){
                cc.global.loading.setProgressNum(maxprogress);
            }
        }
    },

    onGetNessarySuc : function(){
        this.loadRes(this.jumpToLobbyScene.bind(this))
    },

    startLoadLocalAndServerRes : function(){
        cc.global.loading.setProgressNum(this._maxProgress);
        this._maxProgress = 0.5;
        console.log("1。开始登录")
        this.getNecessaryServerData();
    },

    getNecessaryServerData : function(){
        var self = this;
        TempClient.getConfig(function(customHttpRequest){
            if(customHttpRequest){
                console.log('getNecessaryServerData:' + customHttpRequest.xhr.responseText);
                var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
                if(cbdata.code == Code.OK){      
                    var decodeData = ProtoUtil.decode(cbdata);
                    BackStageConfig.init(decodeData.config);
                    self.onGetNessarySuc();
                }else{
                    CommonHelper.showMessageBox("提示","出错了",function(){},null,false);
                }
            }else{  
                CommonHelper.showMessageBox("提示","网络错误，请重新连接",function(){self.getNecessaryServerData();},null,false);
            }
        });
    },

    onHotUpdateComplete : function(){
        this.startLoadLocalAndServerRes();
    },

    hotUpdate : function(){
        var HotUpdateCpn = this.node.getComponent('HotUpdate');
        if(HotUpdateCpn){
            this._isUpdateProgress = true;
            HotUpdateCpn.hotUpdate();
        }
    },

    startLoadOnlineData : function(){
        if (!cc.sys.isNative) {
            this.startLoadLocalAndServerRes();
        }else{
            this.hotUpdate();
        }
    },

    isShowWechatUI: function () {
        var isShowWechatUI = cc.sys.platform === cc.sys.WECHAT_GAME ? true : false
        for (let index = 0; index < this.wechatShowUIList.length; index++) {
            this.wechatShowUIList[index].active = isShowWechatUI
        }
    }
});
