var MultiPlayerSeatOptionEvent = require('MultiPlayerSeatOptionEvent');
var SeatActionEvent = require('SeatActionEvent');
var PlaybackActionOptionItem = function(opt){
    this.voteOptionList = opt.voteOptionList;
    this.seatAction = opt.action;

    this.converToEvent = function(){
        var event = null;
        if(this.isHaveVoteOptionList()){
            event = new MultiPlayerSeatOptionEvent();
            event.init(this.voteOptionList);
            event.removeAllOnlyChuPaiOptionEvent();
            if(event.getSeatOptionEventListLength() <= 0){
                event = 0;
            }
        }else if(this.isHaveSeatAction()){
            var event = new SeatActionEvent();
            event.init(this.seatAction);
        }
        return event;
    };

    this.isHaveVoteOptionList = function(){
        return !(this.voteOptionList == undefined || this.voteOptionList == null || this.voteOptionList.length == 0)
    };

    this.isHaveSeatAction = function(){
        return !(this.seatAction == undefined || this.seatAction == null);
    };


};
cc.Class({
    extends: cc.Component,

    properties: {
        playbackActionOptionList : {
            default : [],
            type : PlaybackActionOptionItem,
        },
        curIndex : 0,
    },

    // use this for initialization
    onLoad: function () {

    },

    initData : function(opt){
        this.initPlaybackActionOptionList(opt);
        this.reset();
    },

    initPlaybackActionOptionList : function(opt){
        opt = opt ? opt : [];
        for(var i = 0 ; i < opt.length; ++i){
            this.playbackActionOptionList.push(new PlaybackActionOptionItem(opt[i]));
        }
    },

    getNextOperationEvent : function(){
        var nextActionOption = this.nextPlaybackActionOption();
        if(nextActionOption){
            var event = nextActionOption.converToEvent();
            return event;
        }
        return null;
    },

    nextPlaybackActionOption : function(){
        var playbackActionOption = null;
        if(this.curIndex < this.playbackActionOptionList.length){
            playbackActionOption = this.playbackActionOptionList[this.curIndex];
            ++this.curIndex;
        }
        return playbackActionOption;
    },

    reset : function(){
        this.curIndex = 0;
    },

    isEnd : function(){
        return (this.curIndex >= this.playbackActionOptionList.length);
    },
});
