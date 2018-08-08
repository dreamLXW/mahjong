var PlayerDataMgr = require('PlayerDataMgr');
var BaseSeatData = require('BaseSeatData');
var GameActionMgr = require('GameActionMgr');
var RoomInfo = require('RoomInfoData');
cc.Class({
    extends: cc.Component,

    properties: {
        seatData : BaseSeatData,
        playerDataMgr : PlayerDataMgr,
        gameActionMgr : GameActionMgr,
        roomInfo : RoomInfo,
        seatNum : 4,  
        _isInit : false,
    },

    // use this for initialization
    onLoad: function () {

    },

    ctor : function(){
        this.playerDataMgr = new PlayerDataMgr();
        this.gameActionMgr = new GameActionMgr();
        this.roomInfo = new RoomInfo(); 
    },

    getSeatData : function(){
        return this.seatData;
    },

    getPlayerDataMgr : function(){
        return this.playerDataMgr;
    },

    initData : function(data){
        this._isInit = true;
    },

    initRoomInfo : function(roomInfo){
        this.roomInfo = new RoomInfo();
        this.roomInfo.initData(roomInfo);
        var playerNum = this.roomInfo.roomConfig.playerNum;
        this.setMaxSeatNum(playerNum);
    },

    initSeat : function(seatData){
    },

    initPlayerDataList : function(dataList){
        this.setMySelfData(dataList);
        this.playerDataMgr.initData(dataList,this.seatNum);
    },

    setMySelfData : function(dataList){
        for(var i = 0 ; i < dataList.length; ++i){
           var originData = dataList[i];
           if(originData.uid == cc.mj.ownUserData.uid){
               cc.mj.ownUserData.initData(originData);
               // cc.mj.ownUserData.direction = originData.position;
               // cc.mj.ownUserData.ready = originData.ready;
           }
       }
   },

    changePlayerListData : function(dataList){
        this.setMySelfData(dataList);
        this.playerDataMgr.changePlayerDataListData(dataList);
    },

    addPlayerDataInList : function(originData){//格式是已经decode过的
        this.playerDataMgr.addPlayerDataInList(originData);
    },

    removePlayerDataFromList : function(uid){
        this.playerDataMgr.removePlayerDataFromList(uid);
    },

    getPlayerData : function(uid){
        return this.playerDataMgr.getPlayerData(uid);
    },

    playingGameAction : function(){
        if(this.gameActionMgr){
            this.gameActionMgr.playing();
        }
    },

    pushSeatEvent : function(seatEvent){
        if(this.gameActionMgr){
            this.gameActionMgr.pushSeatEvent(seatEvent);
        }
    },

    unshiftUrgentEvent : function(seatEvent,prior){
        if(this.gameActionMgr){
            this.gameActionMgr.unshiftUrgentEvent(seatEvent,prior);
        }
    },

    onSeatActionComplete : function(){
        if(this.gameActionMgr){
            this.gameActionMgr.onSeatActionComplete();
        }
    },

    onSeatCustom : function(seatCustomEvent){
        
    },

    isInit : function(){
        return this._isInit;
    },

    setMaxSeatNum : function(seatNum){
        this.seatNum = seatNum;
    },

    changeSeatNum : function(seatNum){
        this.roomInfo.roomConfig.playerNum = seatNum;
        this.setMaxSeatNum(seatNum);
        this.playerDataMgr.changeMaxNum(seatNum);
        this.playerDataMgr.emitPlayerNumChange();
        this.playerDataMgr.refresh();
    },
});
