var SeatOptionEvent = require('SeatOptionEvent');
cc.Class({
    extends: cc.Component,

    properties: {
        EventName : 'MultiPlayerSeatOptionEvent',
        seatOptionEventList : {
            type : SeatOptionEvent,
            default : [],
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    getSeatOptionEventListLength : function(){
        return this.seatOptionEventList.length;
    },

    init : function(voteOptionList){
        for(var i = 0; i < voteOptionList.length; ++i){
            var seatOptionEvent = new SeatOptionEvent();
            seatOptionEvent.init(voteOptionList[i]);
            var uid = voteOptionList[i].uid;
            seatOptionEvent.setOptionChoice(voteOptionList[i].action);
            seatOptionEvent.setOptionOwnerUid(uid);
            this.seatOptionEventList.push(seatOptionEvent);
        }
    },

    removeAllOnlyChuPaiOptionEvent : function(){
        var seatOptionEventList = [];
        for(var i = 0 ; i < this.seatOptionEventList.length;++i){
            var seatOptionEvent = this.seatOptionEventList[i];
            if(!seatOptionEvent.isOnlyHaveChuPaiOption()){
                seatOptionEventList.push(seatOptionEvent);
            }
        }        
        this.seatOptionEventList = seatOptionEventList;
    },

    getOptionEventByUid : function(uid){
        for(var i = 0 ; i < this.seatOptionEventList.length;++i){
            var seatOptionEvent = this.seatOptionEventList[i];
            if(seatOptionEvent.uid == uid){
                return seatOptionEvent;
            }
        }
        return null;
    }
});
