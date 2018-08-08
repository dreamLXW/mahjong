var SettleData = require('SettleData'); 
var SeatData = require('SeatData');
var EventName = require('EventName');
var SeatCustomEvent = require('SeatCustomEvent');
cc.Class({
    extends: SeatData,

    properties: {
    },

    // use this for initialization
    onLoad: function () {

    },

    ctor : function(){
        
    },

    initData : function(opt){
        this._super(opt);
        this.setIsShowMa(false);
    },

    setIsShowMa : function(isShowMa){
        for(var i = 0 ; i < this.playerCardList.length; ++i){
            var playerCard = this.playerCardList[i];
            playerCard.setIsShowMa(isShowMa);
            playerCard.emitPlayerMjCardDataChange();
        }
    },

    onMultiSeatOption : function(multiSeatOptionEvent){
        var detail = {'data':multiSeatOptionEvent};
        cc.global.rootNode.emit(EventName.OnPlaybackMultiOption,detail);
    },

    setGuiPai :function(guipai){
        if(guipai == undefined || guipai == null){
            this.guiPai = null;
            return;
        }
        this.guiPai = guipai;
        var data = {'guiPai':guipai,'isAction':true};
        var detail = {'data':data};
        var fanguiSeatCustomEvent = new SeatCustomEvent();    
        fanguiSeatCustomEvent.init('fangui',detail);  
        cc.mj.gameData.pushSeatEvent(fanguiSeatCustomEvent);
    },
});
