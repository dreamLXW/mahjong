var PlaybackSeatData = require('PlaybackSeatData');
var BaseGameData = require('BaseGameData');
var PlaybackOperationRecord = require('PlaybackOperationRecord');
var CommonHelper = require('CommonHelper');
var EventName = require('EventName');
var SeatSettleEvent = require('SeatSettleEvent');
var SeatCustomEvent = require('SeatCustomEvent');
cc.Class({
    extends: BaseGameData,

    properties: {
        playbackOperationRecord : PlaybackOperationRecord,
        seatSettleEvent : SeatSettleEvent,
        isEnd : false,
        originPlaybackInit : null,
    },

    // use this for initialization
    onLoad: function () {

    },

    ctor : function(){
        this.seatData = new PlaybackSeatData();
        this.playbackOperationRecord = new PlaybackOperationRecord();
        this.seatSettleEvent = new SeatSettleEvent();
    },

    initData : function(data){
        this._super(data);
        this.originPlaybackInit = JSON.stringify(data.playbackInit);
        var playbackInit = data.playbackInit;
        this.initRoomInfo(playbackInit.roomInfo);
        this.initPlayerDataList(playbackInit.playerList);
        this.initSeat(playbackInit.seat);
        this.initSeatSettleEvent(playbackInit);
        this.initPlaybackOperationRecord(data.playbackOptionActionList);
        cc.global.rootNode.emit(EventName.OnGameStatusChange); 
    },

    setMySelfData : function(dataList){
        for(var i = 0 ; i < dataList.length; ++i){
           var originData = dataList[i];
           if(originData.uid == cc.mj.ownUserData.uid){
               cc.mj.ownUserData.direction = originData.position;
           }
       }
   },

    initSeatSettleEvent : function(opt){
        this.seatSettleEvent = new SeatSettleEvent();
        this.seatSettleEvent.init(opt);
    },



    initPlaybackOperationRecord : function(operationRecord){
        this.playbackOperationRecord = new PlaybackOperationRecord();
        this.playbackOperationRecord.initData(operationRecord);
    },

    initSeat : function(seatData){
        
        this.seatData = new PlaybackSeatData();
        this.seatData.initData(seatData);
    },

    onSeatCustom : function(seatCustomEvent){
        var detail = seatCustomEvent.data;
        if(seatCustomEvent.type == 'huType'){
            cc.global.rootNode.emit(EventName.OnHuType,detail);
        }else if(seatCustomEvent.type == 'GameDataInitEvent'){
            this.initData(seatCustomEvent.data);
            CommonHelper.emitActionCompelete();
        }else if(seatCustomEvent.type == 'fangui'){
            cc.global.rootNode.emit(EventName.OnGuiPai,detail);
        }else if(seatCustomEvent.type == 'fanma'){

            cc.global.rootNode.emit(EventName.OnFanMa,detail);
            this.seatData.setIsShowMa(true);
        }else if(seatCustomEvent.type == 'playbackEnd'){
            cc.global.rootNode.emit(EventName.OnPlaybackEnd,detail);
        }
    },

    createGameAction : function(){
        if(!this.gameActionMgr.isHaveAction()){//如果队列里没有要播放的event才push新的event
            if(this.playbackOperationRecord.isEnd()){
                if(this.isEnd == false){
                    this.isEnd = true;
                    this.pushSeatEvent(this.seatSettleEvent.getHutypeCustomEvent());
                    var jiangMaCustom = this.seatSettleEvent.getJiangMaCustomEvent();
                    if(jiangMaCustom){
                        this.pushSeatEvent(jiangMaCustom);
                    }
                    //var playbackEndCustom = new 
                    var playbackEndCustom = new SeatCustomEvent();
                    playbackEndCustom.init('playbackEnd');
                    this.pushSeatEvent(playbackEndCustom);
                }
            }else{
                var nextEvent = this.playbackOperationRecord.getNextOperationEvent();
                if(nextEvent){
                    this.pushSeatEvent(nextEvent);
                }
            }
        }
    },

    replay : function(){
        var playbackInit = JSON.parse(this.originPlaybackInit);
        this.initRoomInfo(playbackInit.roomInfo);
        this.initPlayerDataList(playbackInit.playerList);
        this.initSeat(playbackInit.seat);
        this.playbackOperationRecord.reset();
        this.isEnd = false;
    },

});
