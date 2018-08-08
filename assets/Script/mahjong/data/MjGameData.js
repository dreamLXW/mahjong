//存贮游戏总数据，包括四个玩家信息，四个玩家牌的信息

var SeatData = require('SeatData');
var ProtoUtil = require('ProtoUtil');
var EventName = require('EventName');
var GameChatMgr = require('GameChatMgr');
var SeatCustomEvent = require('SeatCustomEvent');
var HuTypeCfg = require('HuTypeCfg'); 
var CommonHelper = require('CommonHelper');
var tempClient = require('MjRequestSpecificClient');
var ChatClient = require('ChatClient');
var BaseGameData = require('BaseGameData');
cc.Class({
    extends: BaseGameData,
    properties: {
        gameChatMgr : GameChatMgr,
        chatClient : ChatClient,
    },
    
    ctor : function(){
        this.seatData = new SeatData();
        this.gameChatMgr = new GameChatMgr();
        this.chatClient = new ChatClient();
    },

    initData : function(data){
        this._super();
        this.initRoomInfo(data.roomInfo);
        this.initPlayerDataList(data.playerList);
        if(this.roomInfo.isGameStatusStart() || this.roomInfo.isMySelfInSettleStatus()){
            this.initSeat(ProtoUtil.decode(data.seat));   
        }
        if(this.roomInfo.isMySelfInSettleStatus()){//房间在结算状态且自己没有点击继续游戏时弹出结算框
             this.requestSeatSettle();
        }
        if(this.roomInfo.isGameStatusOver()){
            this.requestTotalSettleInfo(true);            
        }     
        if(this.roomInfo.isClubGame()){
            cc.global.isLastTimeInClub = true;
            cc.gameConfig.clubId = this.roomInfo.clubId;
        }
        this.gameActionMgr.setInterval(100);
        this.gameActionMgr.setIsActionOneByOne(false);
        cc.global.rootNode.emit(EventName.OnGameStatusChange); 
    },

    isLastRound : function(){
        if(this.seatData.totalRound != -1){
            return (this.seatData.round >= this.seatData.totalRound);
        }else{
            return (this.seatData.round >= this.roomInfo.roomConfig.maxGameRoundNum);
        }
    },

    isFirstRoundEnd : function () {
        return ((this.seatData.round == 1 && this.roomInfo.isGameStatusReady()) || this.seatData.round > 1)
    },

    initSeat : function(seatData){
        this.seatData = new SeatData;
        this.seatData.initData(seatData);
    },

    playingGameChat : function(){
        if(this.gameChatMgr){
            this.gameChatMgr.playing();
        }        
    },

    pushTalkEvent : function(talkEvent){
        if(this.gameChatMgr){
            this.gameChatMgr.pushTalkEvent(talkEvent);
        }
    },

    playTalkEvent : function(talkEvent){
        this.playerDataMgr.onTalkAction(talkEvent);
    },

    onTalktEventComplete : function(){
        if(this.gameChatMgr){
            this.gameChatMgr.onTalktEventComplete();
        }        
    },

    requestSeatSettle : function(){
        tempClient.requestSettleInfoByRoundIdWithHttp(this.roomInfo.roomId,this.seatData.round,this.onHttpRequsetSingleSettleInfo.bind(this),true,true);
    },

    onHttpRequsetSingleSettleInfo : function(decodeMsg){
        var SeatSettleEvent = require('SeatSettleEvent');        
        var seatSettleEvent = new SeatSettleEvent();
        seatSettleEvent.init(ProtoUtil.decode(decodeMsg));
        this.pushSeatEvent(seatSettleEvent);
        seatSettleEvent.pushSplitSeatSettleEvent();
    },

    requestSeatTotalSettle : function(){
        this.requestTotalSettleInfo(true);     
    },

    requestTotalSettleInfo : function(isShowLoading){
        //总结算时关闭长链接
        cc.mj.netMgr.close(false);
        var rid = this.roomInfo.roomId;
        tempClient.requestTotalSettleInfoWithHttp(rid,this.onHttpRequestTotalSettleInfo.bind(this),isShowLoading,true);  
    },

    onHttpRequestTotalSettleInfo : function(decodeMsg){
        var SeatTotalSettleEvent = require('SeatTotalSettleEvent');        
        var seatTotalSettleEvent = new SeatTotalSettleEvent();
        seatTotalSettleEvent.init(decodeMsg);
        this.pushSeatEvent(seatTotalSettleEvent);
    },

    onSeatSettle : function(seatSettleEvent){
        seatSettleEvent.getSeatSettleData().emitAllSeatSettleMjCardDataChange();
        var playerList = seatSettleEvent.getPlayerList();
        this.changePlayerListData(playerList);
        this.seatData.setBanker(seatSettleEvent.nextBid,seatSettleEvent.isLianZhuang,false);
        CommonHelper.emitActionCompelete();
    },
        
    onSeatTotalSettle : function(seatTotalSettleEvent){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        if(ModalLayerMgr){
            //设置游戏状态
            this.roomInfo.setGameStatusOver();

            var Node = ModalLayerMgr.getTop('GameRecordLayer');
            var NodeCpn = Node.getComponent('TotalSettleLayerCpn');
            NodeCpn.init(seatTotalSettleEvent);
            ModalLayerMgr.showTop('GameRecordLayer');           
        }        
    },

    onSeatCustom : function(seatCustomEvent){
        if(seatCustomEvent.type == 'huType'){
            var animationLayerNode = cc.find('Canvas/uiLayer/animationLayer');
            if(animationLayerNode){
                var animationLayer = animationLayerNode.getComponent('AnimationLayer');
                animationLayer.playSettleAnimation(seatCustomEvent.data);
            }    
        }else if(seatCustomEvent.type == 'fanma'){
            var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
            if(ModalLayerMgr){
                var Node = ModalLayerMgr.getTop('FanmaGroup');
                var NodeCpn = Node.getComponent('fanMaMgr');
                NodeCpn.playingFanMa(seatCustomEvent.data);
                ModalLayerMgr.showTop('FanmaGroup');
            }
        }else if(seatCustomEvent.type == 'singlesettle'){
            var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
            if(ModalLayerMgr){
                //设置游戏状态
                // this.gameStatus = ReadyStatus;

                this.playerDataMgr.refresh();
                this.seatData.emitBankerChange();
                var Node = ModalLayerMgr.getTop('SingleResultLayer');
                var NodeCpn = Node.getComponent('SingleResultLayerCpn');
                NodeCpn.init(seatCustomEvent.data);
                ModalLayerMgr.showTop('SingleResultLayer');           
            }
        }else if(seatCustomEvent.type == 'genZhuang'){
            var animationLayerNode = cc.find('Canvas/uiLayer/animationLayer');
            if(animationLayerNode){
                var animationLayer = animationLayerNode.getComponent('AnimationLayer');
                animationLayer.playingGenZhangAni();
            }               
        }else if(seatCustomEvent.type == 'GameDataInitEvent'){
            this.initData(seatCustomEvent.data);
            CommonHelper.emitActionCompelete();
            if(!cc.global.isSmallWindowMode){
                tempClient.requestBusy(false);
            }
        }else if(seatCustomEvent.type == 'on_seat_comfirm_dissolve'){
            cc.global.rootNode.emit(EventName.OnSeatApplyDissolve,seatCustomEvent.data);
            CommonHelper.emitActionCompelete();
        }else if(seatCustomEvent.type == 'on_seat_dissolve'){
            cc.global.rootNode.emit(EventName.OnSeatDissolve);
            CommonHelper.emitActionCompelete();
        }else if(seatCustomEvent.type == 'on_seat_total_settle'){
            this.requestSeatTotalSettle();
            CommonHelper.emitActionCompelete();
        }else if(seatCustomEvent.type == 'on_seat_settle'){
            this.roomInfo.setGameStatusReady();
            cc.mj.ownUserData.ready = false;
            //this.playerDataMgr.setAllSeatReady(false);
            this.requestSeatSettle();
            CommonHelper.emitActionCompelete();
        }else if(seatCustomEvent.type == 'fangui'){
            var detail = seatCustomEvent.data;
            cc.global.rootNode.emit(EventName.OnGuiPai,detail);
        }else if(seatCustomEvent.type == 'on_seat_comfirm_start'){
            var detail = seatCustomEvent.data;
            cc.global.rootNode.emit(EventName.OnSeatApplyStart,detail);
            CommonHelper.emitActionCompelete();
        }else if(seatCustomEvent.type == 'on_seat_enter'){
            var detail = seatCustomEvent.data;
            this.addPlayerDataInList(detail);
            CommonHelper.emitActionCompelete();
        }else if(seatCustomEvent.type == 'on_seat_exit'){
            var detail = seatCustomEvent.data;
            this.removePlayerDataFromList(detail);
            CommonHelper.emitActionCompelete();
        }
    },
});