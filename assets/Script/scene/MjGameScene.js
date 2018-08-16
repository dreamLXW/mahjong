var EventName = require('EventName');
var CommonHelper = require('CommonHelper');
var tempClient = require('MjRequestSpecificClient');
var GameToAppHelper = require('GameToAppHelper');
var HttpTaskMgr = require('HttpTaskMgr');
var SystemConfig = require('SystemConfig');
var ProtoUtil = require('ProtoUtil');
var BackStageConfig = require('BackStageConfig');
var GameToWechatGameHelper = require("GameToWechatGameHelper");
var MessageBoxMgr = require('MessageBoxMgr');
var GameToPlatformHelper = require('GameToPlatformHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        PlayerNodeArr : {
            default : [],
            type : cc.Node,
        },
        readyNodeArr : {
            default : [],
            type : cc.Node,
        },
        fanGuiNode :{
            default : null,
            type : cc.Node,
        },
        leftNumLabel : {
            default : null,
            type : cc.RichText,
        },
        gameNumLabel : {
            default : null,
            type : cc.Label,
        },
        directionsNode : {
            default : null,
            type : cc.Node,
        },
        roomIdLabel : {
            default : null,
            type : cc.Label,
        },
        animationLayerNode : {
            default : null,
            type : cc.Node,           
        },
        mahjongLayerNode : {
            default : null,
            type : cc.Node, 
        },
        mayHideButtons : {
            default : null,
            type : cc.Node,
        },
        playerPrefab : {
            default : null,
            type : cc.Prefab,
        },
        platformUiList : {
            default : [],
            type : cc.Node,   
        },
        goldRoomHideList : {
            default : [],
            type : cc.Node,
        },
        _isReconect :false,
    },

    // use this for initialization
    onLoad: function () {
        // this.initSeats();
        this.initPlayerNode();
        this.hideGameExtra();
        this.addEventListener();
        if(cc.mj.roomInfo.isGoldRoom()){
            this.hideMayHideButtons();
            this.hideGoldRoomHideList();
        }
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            // GameToWechatGameHelper.getOffShow();
            this.hideOtherPlatform();
        }
    },

    hideGoldRoomHideList : function(){
        for(var i = 0 ; i < this.goldRoomHideList.length; ++i){
            this.goldRoomHideList[i].active = false;
        }
    },

    hideOtherPlatform : function(){
        for(var i = 0 ; i < this.platformUiList.length; ++i){
            this.platformUiList[i].active = false;
        }
    },

    onDestroy : function(){
        this.removeEventListener();
        cc.mj.netMgr.close(false);
    },

    addEventListener : function(){
        cc.global.rootNode.on(EventName.OnGuiPai,this.OnGuiPai,this);
        cc.global.rootNode.on(EventName.OnGameExtraChange,this.onGameExtraChange,this);
        cc.global.rootNode.on(EventName.OnSeatEventComplete,this.onSeatActionComplete , this);
        cc.global.rootNode.on(EventName.OnTalktEventComplete,this.onTalktEventComplete , this);
        cc.global.rootNode.on(EventName.OnGameStatusChange,this.onGameStatusChange , this);
        cc.global.rootNode.on(EventName.OnSeatDissolve,this.onSeatDissolve , this);
        cc.global.rootNode.on(EventName.OnSeatApplyDissolve,this.onSeatApplyDissolve , this);
        cc.global.rootNode.on(EventName.OnSeatApplyStart,this.onSeatApplyStart , this);
        cc.global.rootNode.on(EventName.OnPlayerNumChange,this.onPlayerNumChange,this);
        cc.global.rootNode.on(EventName.OnClubTick,this.onClubTick,this);
        cc.global.rootNode.on('RequestReconnect',this.onRequestReconnect,this);
        cc.global.rootNode.on(EventName.OnCloseGame, this.OnCloseGame, this);
    },

    removeEventListener : function(){
        cc.global.rootNode.off(EventName.OnGuiPai,this.OnGuiPai,this);
        cc.global.rootNode.off(EventName.OnGameExtraChange,this.onGameExtraChange,this);
        cc.global.rootNode.off(EventName.OnSeatEventComplete,this.onSeatActionComplete , this);
        cc.global.rootNode.off(EventName.OnTalktEventComplete,this.onTalktEventComplete , this);
        cc.global.rootNode.off(EventName.OnGameStatusChange,this.onGameStatusChange , this);
        cc.global.rootNode.off(EventName.OnSeatDissolve,this.onSeatDissolve , this);
        cc.global.rootNode.off(EventName.OnSeatApplyDissolve,this.onSeatApplyDissolve , this);
        cc.global.rootNode.off(EventName.OnPlayerNumChange,this.onPlayerNumChange,this);
        cc.global.rootNode.off(EventName.OnSeatApplyStart,this.onSeatApplyStart , this);
        cc.global.rootNode.off(EventName.OnClubTick,this.onClubTick,this);
        cc.global.rootNode.off('RequestReconnect',this.onRequestReconnect,this);
        cc.global.rootNode.off(EventName.OnCloseGame, this.OnCloseGame, this);
    },

    initExtra : function(){
        this.leftNumLabel.active = false;
        this.gameNum.active = false;
    },

    start : function(){
        this.matchNewRoom();
    },

    initPlayerNode : function(){
        if(!this.readyNodeArr || !this.PlayerNodeArr){
            console.log('界面头像未赋值');
            return;
        }
        var sideNameArr = CommonHelper.getSideNameArr("myself",4);
        for(var i = 0 ; i < this.PlayerNodeArr.length; ++i){
            if(this.PlayerNodeArr[i].childrenCount == 0){
                this.PlayerNodeArr[i].addChild(cc.instantiate(this.playerPrefab));
            }
            var playercpn = this.PlayerNodeArr[i].children[0].getComponent('PlayerCpn');
            playercpn.init(sideNameArr[i],this.readyNodeArr[i]);
            if(cc.mj.roomInfo.isGoldRoom()){
                playercpn.setIsCanClickHead(false);
            }
            playercpn.setVisible(false);
        } 
    },

    onPlayerNumChange : function(event){//玩家离开和加入
        var playerDataList = event.detail.data;
        
        for(var i = 0 ; i < this.PlayerNodeArr.length; ++i){
            var playercpn = this.PlayerNodeArr[i].children[0].getComponent('PlayerCpn');
            var side = playercpn.side;
            var isPlayerLeave = (playerDataList.findIndex(function(value){return value.side == side}) == -1);
            playercpn.setVisible(!isPlayerLeave);
        }        

        var curPlayerNum = playerDataList.length;
        this.checkShowRequireStartBtn(curPlayerNum);
    },

    checkShowRequireStartBtn : function(curPlayerNum){
        var isShow = false;
        var isAutoStart = cc.mj.gameData.roomInfo.roomConfig.autoStart;
        var isWaitStatus = cc.mj.gameData.roomInfo.isGameStatusWait();
        if(isAutoStart && isWaitStatus && curPlayerNum >= 2){
            isShow = true;
        }
        this.mayHideButtons.getChildByName('btnRequireStart').active = isShow;
    },

    OnGuiPai:function(event){
        var data = event.detail.data;
        var guipai = data.guiPai;
        var isAction = data.isAction;
        var fanGuiJs = this.fanGuiNode.getComponent('FanGuiCpn');
        var type = cc.mj.gameData.roomInfo.getGuiType();
        fanGuiJs.fanGui(guipai,type,isAction);
    },

    onGameExtraChange : function(event){
        console.log('onGameExtraChange');
        var leftMjNum = event.detail.leftMjNum;
        var round = event.detail.round;
        var nextUid = event.detail.nextUid;

        if(leftMjNum != undefined && leftMjNum != null && this.leftNumLabel){         
            var string = "剩余<color=#a9f6b2>"+leftMjNum+"</color>张";
            this.leftNumLabel.node.active = true;
            this.leftNumLabel.string = string;
        }
        if(round && this.gameNumLabel && !cc.mj.roomInfo.isGoldRoom()){
            this.gameNumLabel.node.active = true;
            this.gameNumLabel.string = ''+round+'/'+cc.mj.gameData.roomInfo.roomConfig.maxGameRoundNum+'局';
        }
        if(nextUid && this.directionsNode){            
            var directionjs = this.directionsNode.getComponent('DirectionWheelsCpn');
            var side = cc.mj.gameData.getPlayerDataMgr().getSideByUid(nextUid);
            var myDirection = CommonHelper.convertDirection(cc.mj.ownUserData.direction,cc.mj.gameData.seatNum);
            directionjs.setMainDirection(myDirection);
            directionjs.setDirectionVisible(cc.mj.gameData.seatNum == 4);
            directionjs.blink(side);
            for(var i = 0 ; i < this.PlayerNodeArr.length; ++i){
                var playercpn = this.PlayerNodeArr[i].children[0].getComponent('PlayerCpn');
                playercpn.onNextUidChange(nextUid);
            } 
        }else{
            console.log('没有进入函数');
        }
    },

    update : function(dt){
        cc.mj.gameData.playingGameAction();
        cc.mj.gameData.playingGameChat();
        HttpTaskMgr.instance.playing();
        this.onSolveRequestReconnect();
    },

    onSeatActionComplete : function(){
        cc.mj.gameData.onSeatActionComplete();
    },

    onTalktEventComplete : function(){
        cc.mj.gameData.onTalktEventComplete();
    },

    onGameStatusChange : function(){
        console.log("------gameStatus="+cc.mj.gameData.gameStatus);
        if(cc.mj.gameData.roomInfo.isMySelfReadyAndGameStatusReady()){
            this.onGameStatusReady();
        }
        if(!cc.mj.gameData.roomInfo.isGameStatusWait()){
            this.hideMayHideButtons();
            if(!cc.mj.gameData.roomInfo.isGameStatusDissolve()){//不是结算的话隐藏结算
                var mahjongLayerCpn = this.mahjongLayerNode.getComponent('MahjongLayerCpn');
                mahjongLayerCpn.getSeatPlayerCardLayerCpn().hideAllSettleHandsMahjong();
            }
        }else{
            this.onGameStatusWait();
        }
        var roomInfo = cc.mj.gameData.roomInfo;
        this.roomIdLabel.node.active = roomInfo.isRoomNoValid();
        this.roomIdLabel.string = "房间号：" + roomInfo.roomNo;
        if(!SystemConfig.isReal()){
            this.roomIdLabel.string += "\n"+roomInfo.roomId;
        }
    },

    onGameStatusReady : function(){
        this.onGameNoStart();
    },

    onGameNoStart : function(){//wait,ready,
        var animationLayerCpn = this.animationLayerNode.getComponent('AnimationLayer');
        animationLayerCpn.clear();

        var mahjongLayerCpn = this.mahjongLayerNode.getComponent('MahjongLayerCpn');
        mahjongLayerCpn.hideSeatPlayerCardLayer();
        mahjongLayerCpn.hideOption();

        this.hideGameExtra();

        var fanGuiJs = this.fanGuiNode.getComponent('FanGuiCpn');
        fanGuiJs.setVisible(false);
    },

    onGameStatusWait : function(){
        var isMeRoomcreator = cc.mj.ownUserData.isMeRoomcreator();
        this.mayHideButtons.getChildByName('btndissolve').active = isMeRoomcreator;
        this.mayHideButtons.getChildByName('btnexit').active = !isMeRoomcreator;
        this.onGameNoStart();
    },

    hideMayHideButtons : function(){
        this.mayHideButtons.active = false;
    },

    hideGameExtra : function(){
        this.gameNumLabel.node.active = false;
        this.leftNumLabel.node.active = false;
        this.roomIdLabel.node.active = cc.mj.gameData.roomInfo.isRoomNoValid();
        var directionjs = this.directionsNode.getComponent('DirectionWheelsCpn');
        directionjs.setVisible(false);
    },

    onClickBtnExit : function(){
        if(cc.mj.ownUserData.isMeRoomcreator()){
             var contentText = cc.mj.i18n.t('tips.EXITROOMQUE')
             CommonHelper.showMessageBox('提示',contentText,function(){tempClient.RoomUidRequestDissove(true);},null,true);
        }else{
            var self = this;
            tempClient.CommonUidrequestExitRoom(function(){
                CommonHelper.showMessageBox('提示',"你已退出房间",function(){CommonHelper.backToLastScene();},null,false);
            },true);
        }
    },

    onClickBtnTraining : function(){
        if(!cc.mj.gameData.chatClient.isBusy()){
            cc.mj.gameData.chatClient.playTraining();
        }else{
            CommonHelper.showTips(cc.mj.i18n.t('tips.YUYINJIANGE'));
        }      
    },

    onClickBtnRequestStart : function(){
        tempClient.requestStart(true);
    },

    onSeatDissolve : function(){
        if(cc.mj.roomInfo.isGoldRoom()){
            if(!cc.mj.gameData.roomInfo.isMySelfInSettleStatus()){
                cc.mj.netMgr.close(true);
            }
        }else{
            var contentText = '房主已解散房间';
            CommonHelper.showMessageBox('提示',contentText,function(){CommonHelper.backToLastScene();},null,false);
        }
        cc.global.loading.hide();
    },

    onClubTick : function(event){
        var data = event.detail;
        var nickname = data.nickname;
        var contentText = nickname ? (nickname + "退出好友圈，房间已解散") : ("该好友圈被禁用，房间已解散");
        this.onResolveCloseGameByKick(contentText);
    },
    
    onSeatApplyDissolve : function(event){
        var data = event.detail;
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var applyDissolveLayerNode = ModalLayerMgr.getTop('RequireDissolveDialog');
        var applyDissolveLayerCpn = applyDissolveLayerNode.getComponent('RequestDissolveLayerCpn');
        ModalLayerMgr.showTop('RequireDissolveDialog',1);
        applyDissolveLayerCpn.init(data);
    },

    onSeatApplyStart : function(event){
        cc.global.loading.hide();
        var data = event.detail;
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var applyDissolveLayerNode = ModalLayerMgr.getTop('RequireStartDialog');
        var applyDissolveLayerCpn = applyDissolveLayerNode.getComponent('RequestStartLayerCpn');
        ModalLayerMgr.showTop('RequireStartDialog',1);
        applyDissolveLayerCpn.init(data);
    },

    onClickCusttomBtn : function(target,customdata){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var customData = Number(customdata);
        switch(customData){
            case 1 : {
                ModalLayerMgr.showTop('settinglayer');
            }
            break;
            case 2 : {
                if(!cc.mj.gameData.chatClient.isBusy()){
                    ModalLayerMgr.showTop('chatbox');
                }else{
                    CommonHelper.showTips(cc.mj.i18n.t('tips.YUYINJIANGE'));
                }
            }
            break;
            case 3:{
                var ruleLayerNode = ModalLayerMgr.getTop('RoomInfoLayer');
                var ruleLayerCpn = ruleLayerNode.getComponent('RoomInfoLayerCpn');
                ruleLayerCpn.init(cc.mj.gameData.roomInfo);
                ModalLayerMgr.showTop('RoomInfoLayer');
            }
            break;
            case 4:{//丁丁邀请
                var roomInfo = cc.mj.gameData.roomInfo.getShareRoomInfo();
                var params = roomInfo;
                console.log("dingdingRoomInvite" + JSON.stringify(params));
                GameToAppHelper.dingdingRoomInvite(params);
            }
            break;
             case 5:{//微信邀请
                var roomInfo = cc.mj.gameData.roomInfo.getShareRoomInfo();
                var params = roomInfo;
                console.log("weChatRoomInvite" + JSON.stringify(params));
                GameToPlatformHelper.weChatRoomInvite(params);
            }
            break;
             case 6:{//游戏后台运行
                GameToAppHelper.backToApp();
            }
            break;
        }
    },

    onRequestReconnect : function(){
        this._isReconect = true;
    },

    onSolveRequestReconnect : function(){
        if(this._isReconect == true){
            this._isReconect = false;
            //重新链接的时候关闭所有不必要的弹窗
            CommonHelper.getRunSceneModalMgr().closeAllTopByModalType("UNCOMMON");
            ////重新链接的时候重置短链接队列
            HttpTaskMgr.instance.reset();
            cc.global.loading.hide();
            var roomInfo = cc.mj.gameData.roomInfo;
            if(roomInfo.isGoldRoom() && roomInfo.isGameStatusDissolve()){
                this.matchNewRoom();
            }else{
                var contentText = '网络拥堵，是否要尝试重新连接';
                var self = this;
                var data = {"content":contentText,
                    "onOk":function(){
                        var initLogicCpn = self.node.getComponent('initLogic');
                        initLogicCpn.login();
                    },};
                if(roomInfo.isGoldRoom() && roomInfo.isMySelfInSettleStatus()){
                    data.isNeedCancel = true;
                    data.onCancel = function(){CommonHelper.backToLastScene();}
                }
                CommonHelper.showMessageBoxByRawData(data);
            }
        }
    },

    matchNewRoom : function(){
        var roomInfo = cc.mj.roomInfo;
        if(roomInfo.isGoldRoom()){
            cc.global.loading.setIsModal(false);
            cc.global.loading.setText("匹配中...");
            cc.global.loading.show();
            var initLogicCpn = this.node.getComponent('initLogic');
            initLogicCpn.login();
        }
    },

    OnCloseGame : function (event) {
        var showText = "游戏暂停运营，房间已解散";
        this.onResolveCloseGameByKick(showText);
    },

    onResolveCloseGameByKick : function(showText){
        CommonHelper.getRunSceneModalMgr().closeAllTopByModalType("UNCOMMON");
        MessageBoxMgr.reset();
        var roomInfo = cc.mj.gameData.roomInfo;
        cc.mj.netMgr.close(false);
        CommonHelper.showMessageBox("提示", showText, function () {
            //GameToAppHelper.ExitGame()
            if (!roomInfo.isGoldRoom() && cc.mj.gameData.isFirstRoundEnd()){
                cc.mj.gameData.requestTotalSettleInfo(true)
            }else{
                CommonHelper.backToLastScene();
            }           
        }, null, false);
    }
});