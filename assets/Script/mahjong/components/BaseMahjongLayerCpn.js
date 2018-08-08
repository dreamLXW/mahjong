var EventName = require('EventName');
cc.Class({
    extends: cc.Component,

    properties: {
        seatPlayerCardLayer : {
            type : cc.Node,
            default : null,
        },

    },

    // use this for initialization
    onLoad: function () {
        this.hideSeatPlayerCardLayer();
    },

    onDestroy : function(){
    },
    
    hideSeatPlayerCardLayer : function(){//隐藏牌桌
        var SeatPlayerCardLayerCpn = this.getSeatPlayerCardLayerCpn();
        SeatPlayerCardLayerCpn.hideAllSides();
    },

    getSeatPlayerCardLayerCpn : function(){

    },

    hideOption : function(){
        
    },

});
