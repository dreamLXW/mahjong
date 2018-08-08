
var tempClient = require('MjRequestSpecificClient');
var CommonHelper = require('CommonHelper');
var ProtoUtil = require("ProtoUtil");
var Code = require('CodeCfg');
var GameToAppHelper = require('GameToAppHelper');
var GameToWechatGameHelper = require('GameToWechatGameHelper');
var Player = require('PlayerData');
var MjGameData = require('MjGameData');
var BackStageConfig = require('BackStageConfig');
var GameToPlatformHelper = require('GameToPlatformHelper');

cc.Class({
    extends: cc.Component,

    properties: {
        platformUiList : {
            default : [],
            type : cc.Node,   
        },
        tipsNode : {
            default : null,
            type : cc.Node,  
        },
        iosPlatformUiList : {
            default : [],
            type : cc.Node,   
        },
        popupNoticeLayer : {
            default : null,
            type : cc.Node, 
        },
        popupNoticePrefab : {
            default : null,
            type : cc.Prefab, 
        },
        popupQueue : [],
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('onGetUserInfo',this.onGetUserInfo,this);
        cc.global.rootNode.on("onRechargeResponce",this.onRechargeResponce,this);
        cc.global.rootNode.on('RequestReconnect',this.onRequestReconnect,this);
        cc.global.rootNode.on("OnEnterRoomError",this.onEnterRoomError,this);
        cc.global.rootNode.on("NoCheckMessageDataChange",this.onNoCheckMessageDataChange,this);
        cc.global.rootNode.on("freshUserMoney",this.onFreshUserMoney,this);
        cc.global.rootNode.on("OnShow",this.onShow,this);
        this.loadServerData();
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            this.hideOtherPlatform();
        }
    },

    loadServerData : function(){
        //因为onload时显示不出loading的动画，所以延迟下再请求
        this.node.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(this.getUserInfo,this,true)))
        this.initGameData();
        this.uploadLocation();
        tempClient.getClubNoCheckMsgData();
    },

    hideOtherPlatform : function(){
        for(var i = 0 ; i < this.platformUiList.length; ++i){
            this.platformUiList[i].active = false;
        }
        if (cc.sys.os == cc.sys.OS_IOS) {
            for(var i = 0 ; i < this.iosPlatformUiList.length; ++i){
                this.iosPlatformUiList[i].active = false;
            }
        }
    },

    onDestroy:function(){
        cc.global.rootNode.off("onRechargeResponce",this.onRechargeResponce,this);
        cc.global.rootNode.off('RequestReconnect',this.onRequestReconnect,this);
        cc.global.rootNode.off("OnEnterRoomError",this.onEnterRoomError,this);
        cc.global.rootNode.off("OnShow",this.onShow,this);
        cc.global.rootNode.off("NoCheckMessageDataChange",this.onNoCheckMessageDataChange,this);
        cc.global.rootNode.off("freshUserMoney",this.onFreshUserMoney,this);
    },

    onShow : function (event) {
        var e = event.detail;
        var rid = null;
        var inviteCode = null;
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            rid = e.query.roomId;
            inviteCode = e.query.clubInviteCode;
        } else {
            rid = e.roomId;
            inviteCode = e.gameData.clubInviteCode;
        }
        cc.mj.roomInfo.initRoomId(rid);
        cc.gameConfig.clubInviteCode = inviteCode;
        this.getUserInfo();
    },

    enterRoom : function(){
        if(cc.mj.roomInfo.isGoldRoom()){
            this.jumpToMjScene();
        }else{
            var initLogicCpn = this.node.getComponent('initLogic');
            if(initLogicCpn){
                initLogicCpn.login(this.jumpToMjScene);
            }
        }
    },

    onRequestReconnect : function(){
        this.loadServerData();
    },

    jumpToMjScene : function(){
        cc.global.loading.show();
        cc.director.loadScene('mahjongscene');
        cc.global.isFirstIn = false;
    },

    getUserInfo : function(isLoading){
        console.log('hahahah');
        var self = this;
        tempClient.getUserInfo(isLoading,function(customHttpRequest){
            if(customHttpRequest){
                var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
                console.log('LobbyScene.onGetUserInfo ' + JSON.stringify(cbdata));
                if(cbdata.code == Code.OK){       //只有成功的时候才需要进行下一步，若不成功隔一会再请求一次
                    var decodeCbData = ProtoUtil.decode(cbdata); 
                    self.node.emit('onGetUserInfo',decodeCbData);
                    self.showFristNoticeLayer();
                }else{
                    CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
                }
            }else{  
                CommonHelper.showMessageBox("提示","网络错误，请重新连接",function(){self.getUserInfo(true)},null,false);
            }
        });
    },

    showFristNoticeLayer : function () {
        if (cc.sys.localStorage.getItem("FirstShow") != 0) {
            if(cc.sys.platform === cc.sys.WECHAT_GAME) {
                var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
                ModalLayerMgr.showTop('NoticeLayer');
            } else {
                tempClient.getBoardInfo(1, true, this.getBoardInfoCb.bind(this));
            }
        }
    },

    getBoardInfoCb : function (customHttpRequest) {
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.getBoardInfo ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){
                this.checkNotice(cbdata.data);       
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }
    },

    checkNotice : function (data) {
        if (cc.sys.localStorage.getItem("FirstShow") != 0) {
            cc.sys.localStorage.setItem("FirstShow", 0);
            this.addChildInPopupNoticeLayer(data.items);
        } else {
            var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
            var activiteLayer = ModalLayerMgr.getTop('ActiviteLayer');
            var activiteLayerCpn = activiteLayer.getComponent('ActiviteLayerCpn');
            activiteLayerCpn.initData(data.items);
            ModalLayerMgr.showTop('ActiviteLayer');
        }
    },

    addChildInPopupNoticeLayer : function (array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].pop_up) {
                var child = cc.instantiate(this.popupNoticePrefab);
                child.getComponent("PopupNoticeLayer").initData(array, i, this);
                child.zIndex = array.length - i;
                this.popupQueue.push(child);
            }
        }
        this.checkPopUpNoticeQueue();
    },

    checkPopUpNoticeQueue : function () {
        if (this.popupQueue.length) {
            var child = this.popupQueue.shift();
            child.opacity = 255;
        }
    },

    onShowInviteJoinclub :function(param){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var ClubLayer = ModalLayerMgr.getTop('ClubLayer');
        var ClubLayerCpn = ClubLayer.getComponent("ClubLayerCpn");
        if(!ModalLayerMgr.isTopVisible('ClubLayer')){
            ModalLayerMgr.showTop('ClubLayer');
        }
        ClubLayerCpn.onInviteJoinClub(param);
        console.log("invitjoinclu active",ClubLayer.active);
    },
    
    onGetUserInfo : function(eventCustom){
        var decodeCbData = eventCustom.detail;
        var roomInfo = decodeCbData.roomInfo;
        var rid = roomInfo ? roomInfo.rid : null;
        var player = decodeCbData.player;
        if(rid != null && rid != undefined){
            cc.mj.roomInfo.initData(roomInfo);
           this.showHasAGameContinueBox();
        }else{
            var rid = this.checkAppHasTransportRid();
            var clubInviteCode = this.checkHasTransportInviteCode();
            if(rid != null){
                 tempClient.getRoomInfo(rid,null,true,this.onGetRoomInfoCB.bind(this));
            }else if(clubInviteCode){
                this.onShowInviteJoinclub(clubInviteCode);
            }else if(cc.global.isLastTimeInClub){
                this.jumpToClubLayer();
            }
            cc.mj.roomInfo.clearData();
        }
        cc.global.isLastTimeInClub = false;
        cc.gameConfig.clubInviteCode = null;
        cc.mj.ownUserData.initData(player);
        cc.mj.ownUserData.emitChange();
    },

    checkAppHasTransportRid :  function(){
        if(cc.global.isFirstIn){
            var rid = cc.mj.roomInfo.roomId;
            if(rid != undefined && rid != null && rid != ''){
                return rid;
            }else{
                return null;
            }
        }else{
            return null;
        }
    },

    checkHasTransportInviteCode :  function(){
        return cc.gameConfig.clubInviteCode ? cc.gameConfig.clubInviteCode : null;
    },

    showHasAGameContinueBox : function(){
        var contentText = '您还有未完成的对局哦，\n现在进去看看吧~';
        var self = this;
        CommonHelper.showMessageBox('提示',contentText,function(){
            self.enterRoom();
        },null,false);
    },

    onGetRoomInfoCB : function(roomInfoData){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var ruleLayerNode = ModalLayerMgr.getTop('RoomInfoLayer');
        var ruleLayerCpn = ruleLayerNode.getComponent('RoomInfoLayerCpn');
        ruleLayerCpn.init(roomInfoData,true);
        ModalLayerMgr.showTop('RoomInfoLayer');        
    },

    onClickCreateRoom : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var createRoomNode = ModalLayerMgr.getTop('CreateRoom');
        var createRoomNodeCpn = createRoomNode.getComponent('CreateRoomLayerCpn');
        var isFromClub = false;
        createRoomNodeCpn.init(isFromClub);
        ModalLayerMgr.showTop('CreateRoom');
    },

    onClickJoinRoom : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.showTop('JoinGame');
    },
    
    onClickRecharge : function(target,customdata){
        var customData = Number(customdata);
        if(BackStageConfig.isHaveRecharge()){
            if (cc.sys.os == cc.sys.OS_IOS && customData == 1 && cc.sys.platform === cc.sys.WECHAT_GAME) {
                var wechatAgentStr = "Chvjtg168899";
                CommonHelper.showMessageBox('提示',"请联系客服微信：" + wechatAgentStr + "\n(点击确定可复制客服微信)",function(){
                    GameToWechatGameHelper.copyText(wechatAgentStr);
                },null,false);
            } else {
                this.onShowRechargeLayer(customData);
            }
        }
    },

    onShowRechargeLayer : function (customData) {
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var rechargeLayerNode = ModalLayerMgr.getTop('RechargeLayer');
        var rechargeLayerCpn = rechargeLayerNode.getComponent('RechargeLayerCpn');
        rechargeLayerCpn.init(true, customData);
        ModalLayerMgr.showTop('RechargeLayer');
    },

    onClickBtnAgent : function(){
        GameToPlatformHelper.goToAgentPage();
    },

    onClickBtnClub : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.showTop('ClubLayer'); 
    },

    onClickGoldGame : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.showTop('GoldGameLobby'); 
    },

    onClickCustomButton : function(target,customdata){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var customData = Number(customdata);
        switch(customData){
            case 1 : {//战绩
                this.onClickButtonVipRecord();
            }
            break;
            case 2 : {//玩法
                ModalLayerMgr.showTop('RuleLayer');
            }
            break;
            case 3 : {//设置
                ModalLayerMgr.showTop('settinglayer');
            }
            break;
            case 4 : {//返回
                GameToAppHelper.ExitGame();
            }
            break;
            case 5 : {//分享游戏
                GameToPlatformHelper.showShareLayer();
            }
            break;
            case 6 : {//活动
                if(cc.sys.platform === cc.sys.WECHAT_GAME) {
                    ModalLayerMgr.showTop('NoticeLayer');
                } else {
                    tempClient.getBoardInfo(0, true, this.getBoardInfoCb.bind(this));
                }
            }
            break;
            case 7 : {//任务
                var contentText = "暂未开放，敬请期待！";
                CommonHelper.showMessageBox('提示',contentText,function(){},null,false);
            }
            break;
        }        
    },

    onClickButtonVipRecord : function(){
        tempClient.getMyVipRecord(0,99,true,this.onRequestVipRecordCb.bind(this));
    },

    onRequestVipRecordCb : function(cbData){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var vipRecordLayerNode = ModalLayerMgr.getTop('VipRecordLayer');
        var vipRecordLayerCpn = vipRecordLayerNode.getComponent('VipRecordLayerCpn');
        ModalLayerMgr.showTop('VipRecordLayer');
        vipRecordLayerCpn.initTitle("viprecord");
        vipRecordLayerCpn.init(cbData.historySettleList);
    },

    initGameData : function(){
        cc.mj.gameData = new MjGameData;
        cc.mj.gameData.roomInfo.setGameStatusOver();
    },

    onRechargeResponce : function(event){
        var code = event.detail;
        var textArr = ["支付失败","支付成功","支付取消","钻石充值配置不一致\n请退出游戏重新尝试"];
        var text = textArr[code] ? textArr[code] : "未知错误";
        //var isUpdateUserInfo = (Number(code) == 1 );
        var showMessageBoxFunc = function(){
            if (Number(code) == 1){
                this.getUserInfo(true);
                CommonHelper.showMessageBox('提示', text, function () { }, null, false);
            }else if (Number(code) == 3) {
                CommonHelper.showMessageBox('提示', text, function () { 
                    GameToPlatformHelper.ExitGame();
                }, null, false);
            }
        } ;
        this.node.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(showMessageBoxFunc,this)));
    },

    jumpToClubLayer : function(){
        var turnToClubLayer = function(){
            cc.global.loading.hide();
            this.onClickBtnClub();  
        }
        cc.global.loading.setText("正在跳转到好友圈");
        cc.global.loading.show();
        this.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(turnToClubLayer,this)));
    },

    uploadLocation : function(){
        var self = this;
        var getLocationCB = function(status,res){
            var data = {"uid":cc.mj.ownUserData.uid}
            if(status == true){
                data.latitude = res.latitude.toString();
                data.longitude = res.longitude.toString();
            }else{
                data.latitude = "0";
                data.longitude = "0";
                if(self.isFirstIn){
                    CommonHelper.showTips("获取定位信息失败");
                }
            }
            tempClient.weChatUploadLocation(data,function(customHttpRequest){
                if(customHttpRequest){
                    var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
                    console.log('LobbyScene.getLocationCB ' + JSON.stringify(cbdata));
                    if(cbdata.code != Code.OK){
                        CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
                    }
                }else{  
                    CommonHelper.showMessageBox("提示","上传定位超时，请重新尝试",function(){self.uploadLocation()},null,false);
                }
            });
        }
        GameToWechatGameHelper.getLocation(getLocationCB);
    },

    onEnterRoomError : function(){
        this.loadServerData();
    },

    onNoCheckMessageDataChange : function(){
        if(this.tipsNode){
            var NoCheckMessageData = require('NoCheckMessageData');
            this.tipsNode.active = NoCheckMessageData.value("1000");
        }
    },
    
    onFreshUserMoney : function () {
        this.getUserInfo(true);
    },
});
