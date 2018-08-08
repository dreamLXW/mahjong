var PlayerCard = require("PlayerMjCardData");
var CfgSeat = require("SeatCfg");
var EventName = require('EventName');
var CommonHelper  = require('CommonHelper');
var PairCfg = require('PairCfg');
var SeatOptionEvent = require('SeatOptionEvent');
var SeatCustomEvent = require('SeatCustomEvent');
var BaseSeatData = require('BaseSeatData');
//整个牌桌数据，包括四张牌
cc.Class({
    extends: BaseSeatData,

    properties: {
        status : "",             //牌局状态，
        cardNumber : 0,         // 剩余牌数
        optionList : [],

        nextUid : 0,        // 等待下一个动作玩家
        lastOutCardUid : -1,
        totalRound : -1, 
    },

    // use this for initialization
    onLoad: function () {
        
    },

    ctor : function(){
         
    },

    initData : function (opt) {
        if(!opt){
            console.log("没有座位信息");
            return;
        }
        this._super(opt);
        this.status = opt.status;
        
        this.setBanker(opt.bid,opt.lianZhuang);
        this.cardNumber = opt.cardNumber;
        this.nextUid = opt.nextUid;

        this.setGuiPai(opt.guiPai);
        this.initPlayerCardList(opt.playerCardList);
        this.emitGameExtraChange();
        this.setLastOutCardUid(opt.lastOutCardUid,true);
    },

    initPlayerCardList : function(playerCardList){
        if(!playerCardList){
            return;
        }
        this.playerCardList = [];
        var myselfUid = cc.mj.ownUserData.uid;
        var myData = null;
        for (var i = 0; i < playerCardList.length ; ++i) {
            var p = new PlayerCard();
            var data = playerCardList[i];
            p.initData(data,this);
            if(p.uid == myselfUid){
                myData = data;
            }
            this.playerCardList.push(p);
        }
        var length = this.playerCardList.length;
        var sides = CommonHelper.getSideNameArr("myself",cc.mj.gameData.seatNum);
        var playerCardList = [];    // 重新排序，顺序 为 ["myself","right","up","left"];
        var p = this.getPlayerCard(myselfUid);
        for (var j = 0 ; j < sides.length; ++j ) {
             console.log(sides[j]);
            p.setSide(sides[j]);
            p.emitPlayerMjCardDataInit(this.lastOutCardUid);
            playerCardList.push(p);
            p = this.getNextPlayerCard(p.uid);
        }
        this.playerCardList = playerCardList;
        this.initOptionList(myData);
    },

    onSeatAction : function (seatActionEvent) {
        var uid = seatActionEvent.uid;
        var fromUid = seatActionEvent.fromUid;
        var type = seatActionEvent.type;
        var p = this.getPlayerCard(uid);
        var fromP = this.getPlayerCard(fromUid);
        var isActionSuc = false;//有时候动作会在牌局初始化前就推送
        if(p){
            this.nextUid = seatActionEvent.nextUid;
            if(type == PairCfg.MO_PAI || type == PairCfg.GANG_MO_PAI){
                this.cardNumber -= 1;
            }
            this.number = seatActionEvent.number;
            this.emitGameExtraChange();
            p.onSeatAction(seatActionEvent);
            if(fromP){
                fromP.onBeingSeatAction(seatActionEvent);
            }
            isActionSuc = true;
        }
        return isActionSuc;
    },

    onSeatHu : function (seatEvent) {
        var uidList = seatEvent.uidList;
        for (var i = 0; i < uidList.length ; ++i) {
            var uid = uidList[i];
            var p = this.getPlayerCard(uid);
            p.onSeatHu(seatEvent);
        }
    },

    initOptionList : function(opt){
        this.optionList = opt.optionList;

        if(this.optionList == undefined || this.optionList == null){
            return;
        }
        var optionEvent = new SeatOptionEvent();
        optionEvent.init(opt);
        cc.mj.gameData.pushSeatEvent(optionEvent);
        
        //this.onSeatOption(optionEvent);
    },

    onSeatOption : function (seatOptionEvent) {
        var detail = {'side':'myself','data':seatOptionEvent};
        cc.global.rootNode.emit(EventName.OnMySeatOption,detail);      
    },

    setGuiPai :function(guipai){
        if(guipai == undefined || guipai == null){
            this.guiPai = null;
            return;
        }
        this.guiPai = guipai;
        var data = {'guiPai':guipai,'isAction':false};
        var detail = {'data':data};
        var fanguiSeatCustomEvent = new SeatCustomEvent();

        if(this.number == 1){//如果是刚开局，就做翻鬼动画
            data.isAction = true;
        }else{
        }     
        fanguiSeatCustomEvent.init('fangui',detail);  
        cc.mj.gameData.pushSeatEvent(fanguiSeatCustomEvent);
    },

    emitBankerChange : function(){
        var side = cc.mj.gameData.getPlayerDataMgr().getSideByUid(this.bid);
        var type = (this.isLianZhuang == true ?'lian':'zhuang');
        var detail = {'side':side,'data':type};
        cc.global.rootNode.emit(EventName.OnPlayerZhuangChange,detail);
    },

    onSetGuiPaiComplete : function(detail){
        var guiData = detail.data;
        for (var i = 0; i < this.playerCardList.length ; ++i) {
            var p = this.playerCardList[i];
            if(p){
                p.sortHandCardList(true);
                p.emitPlayerMjCardDataChange();
            }
        }
        this.setLastOutCardUid(this.lastOutCardUid, true);
    },

    setLastOutCardUid : function(uid,isCheck){
        this.lastOutCardUid = uid;
        if(isCheck == true){
            this.checkLastOutCardSide();
        }     
    },

    checkLastOutCardSide : function(){
        var playerCardData = this.getPlayerCard(this.lastOutCardUid);
        if(playerCardData){
            var isLastOutCard = playerCardData.isMeLastOutCardUid(this.lastOutCardUid);
            if(isLastOutCard){
                this.emitLastOutCardSideChange(playerCardData.getLastOutCardSide());
            }else{
                this.emitLastOutCardSideChange(null);
            }
        }else{
            this.emitLastOutCardSideChange(null);
        }
    },

    emitLastOutCardSideChange : function(side){
        cc.global.rootNode.emit(EventName.OnLastOutCardSideChange,side);
    },

});

