var EventName = require('EventName');
var PriorQueue = require('PriorQueue');
cc.Class({
    extends: cc.Component,

    properties: {
        _isSeatEventPlaying : false,
        _seatEventPriorQueue : {
            type : PriorQueue,
            default : null,
        },
        interval : 0,//毫秒
        lastActionCompleteTimeStamp : 0,
        isActionOneByOne : true,
    },

    ctor : function(){
        this._seatEventPriorQueue = new PriorQueue();
        this.reset();
    },

    setIsActionOneByOne : function(isActionOneByOne){
        this.isActionOneByOne = isActionOneByOne;
    },

    reset : function(){
        this._isSeatEventPlaying = false;
        this._seatEventPriorQueue.clear();
    },
    //type : on_seat_action,on_seat_settle,on_seat_option
    pushSeatEvent : function( seatEvent){
        this._seatEventPriorQueue.pushData(seatEvent,0);
    },

    unshiftUrgentEvent : function(seatEvent,prior){
        this._seatEventPriorQueue.pushData(seatEvent,prior);
        this.onSeatActionComplete();
    },

    playing : function(){
        if(this.checkIsReachInterval()){
            this.playingSeatEventAction();
        }
    },

    isHaveAction : function(){
        return !(this._seatEventPriorQueue.isEmpty() == true)
    },

    playingSeatEventAction : function(){    
        if(this._isSeatEventPlaying || this._seatEventPriorQueue.isEmpty() == true){
            return;
        }
        console.log('playingSeatEventAction');
        
        var seatEvent = this._seatEventPriorQueue.shiftData();
        if(seatEvent){
            var type = seatEvent.EventName;
            if(type == 'SeatActionEvent'){
                if(this.isActionOneByOne){
                    this._isSeatEventPlaying = true;
                    if ( ! cc.mj.gameData.seatData.onSeatAction(seatEvent) ){
                        this._isSeatEventPlaying =  false;
                    }
                }else{
                    cc.mj.gameData.seatData.onSeatAction(seatEvent)
                }
            }else if(type == 'SeatOptionEvent'){
                //this._isSeatEventPlaying = true;
                cc.mj.gameData.seatData.onSeatOption(seatEvent);
            }else if(type == 'SeatSettleEvent'){
                this._isSeatEventPlaying = true;
                cc.mj.gameData.onSeatSettle(seatEvent);
            }else if(type == 'SeatCustomEvent'){
                this._isSeatEventPlaying = true;
                cc.mj.gameData.onSeatCustom(seatEvent);
            }else if(type == 'SeatTotalSettleEvent'){
                cc.mj.gameData.onSeatTotalSettle(seatEvent);
            }else if(type == 'MultiPlayerSeatOptionEvent'){
                this._isSeatEventPlaying = true;
                cc.mj.gameData.seatData.onMultiSeatOption(seatEvent);
            }
        }
    },

    onSeatActionComplete : function(){
        this._isSeatEventPlaying = false;
        this.lastActionCompleteTimeStamp = new Date().getTime();
    },

    setInterval : function(interval){
        this.interval = interval;
    },

    checkIsReachInterval : function(){
        var curTime = new Date().getTime();
        var deltaTime = curTime - this.lastActionCompleteTimeStamp;
        return (deltaTime > this.interval);
    },
});
