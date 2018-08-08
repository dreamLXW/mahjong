var SeatSettleData = require('SeatSettleData');
var SeatCustomEvent = require('SeatCustomEvent');
var HuTypeCfg = require('HuTypeCfg');
cc.Class({
    extends: cc.Component,

    properties: {
        EventName : 'SeatSettleEvent',
        playerList : [],
        seatSettleData : {
            default : null,
            type : SeatSettleData,
        },
        round : -1,
        isLianZhuang : false,
        nextBid : -1,
        roomUid : -1,
        mahjongType : '',
    },

    init : function(opt){
        this.playerList = opt.playerList;
        this.seatSettleData = new SeatSettleData();
        opt.seat.roomuid = opt.roomuid;
        this.seatSettleData.init(opt.seat);
        this.round = this.seatSettleData.round;
        this.isLianZhuang = opt.lianZhuang;
        this.nextBid = opt.nextBid;
        this.mahjongType = opt.majiangType;
        //this.splitSeatSettleEvent();
    },

    getPlayerList : function(){
        return this.playerList;
    },

    getSeatSettleData : function(){
        return this.seatSettleData;
    },

    getSingleSettleCustomEvent : function(){
        var seatSettleData = this.getSeatSettleData();
        var singlesettleCustom = new SeatCustomEvent();
        singlesettleCustom.init('singlesettle',this);
        return singlesettleCustom;
    },
    pushSplitSeatSettleEvent : function(){
        
        if(cc.mj.gameData.roomInfo.isMySelfInSettleStatus()){//如果在单局结算状态则播放结算动画和翻马动画
            var huTypeCustom = this.getHutypeCustomEvent();
            cc.mj.gameData.pushSeatEvent(huTypeCustom);
            var jiangmaCustom = this.getJiangMaCustomEvent();
            if(jiangmaCustom){
                cc.mj.gameData.pushSeatEvent(jiangmaCustom);
            }           
        }

        var singlesettleCustom = new SeatCustomEvent();
        singlesettleCustom.init('singlesettle',this);
        cc.mj.gameData.pushSeatEvent(singlesettleCustom);
    },

    getHutypeCustomEvent : function(){
        var seatSettleData = this.getSeatSettleData();
        var huTypeList = seatSettleData.settleData.getHuTypes();
        if(huTypeList.length == 0){
            huTypeList.push({'type':HuTypeCfg.HUANGZHUANG});
        }
        var huTypeCustom = new SeatCustomEvent();
        huTypeCustom.init('huType',huTypeList);
        return huTypeCustom;
        
    },

    getJiangMaCustomEvent : function(){
        var seatSettleData = this.getSeatSettleData();
        var jiangMaData = seatSettleData.getJiangMaData();
        if(jiangMaData.length > 0){
            var jiangmaCustom = new SeatCustomEvent();
            jiangmaCustom.init('fanma',jiangMaData);
            return jiangmaCustom;
        }
        return null;
    },
});
