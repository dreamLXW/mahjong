var EventName = require('EventName');
cc.Class({
    extends: cc.Component,

    properties: {
        seatPlayerCardLayer : {
            type : cc.Node,
            default : null,
        },
        optionListNode : {
            default : null,
            type : cc.Node,
       },
    },

    // use this for initialization
    onLoad: function () {
        cc.global.rootNode.on(EventName.OnMySeatOption,this.onMySeatOption,this);
        this.hideSeatPlayerCardLayer();
        this.initOptionList();
    },

    onDestroy : function(){
        cc.global.rootNode.off(EventName.OnMySeatOption,this.onMySeatOption,this);
    },
    
    initOptionList : function(){
        var optionCpn = this.optionListNode.getComponent('OptionCpn');
        if(!optionCpn){
            optionCpn.addComponent('OptionCpn');
        }
        optionCpn.setMyHandsMahjongCpn(this.getSeatPlayerCardLayerCpn().getHandsMahjongCpn('myself'));
        return optionCpn;
    },

    hideSeatPlayerCardLayer : function(){//隐藏牌桌
        var SeatPlayerCardLayerCpn = this.getSeatPlayerCardLayerCpn();
        SeatPlayerCardLayerCpn.hideAllSides();
    },

    hideOption : function(){
        var optionCpn = this.initOptionList();
        optionCpn.setVisible(false);
    },

    onMySeatOption : function(event){
        var seatOptionEvent = event.detail.data;
        var optionCpn = this.optionListNode.getComponent('OptionCpn');
        optionCpn.onSeatOptionChange(seatOptionEvent);
    },

    getSeatPlayerCardLayerCpn : function(){
        var SeatPlayerCardLayerCpn = this.seatPlayerCardLayer.getComponent('SeatPlayerCardLayerCpn');
        return SeatPlayerCardLayerCpn;
    },
});
