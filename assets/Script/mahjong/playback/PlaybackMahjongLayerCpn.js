var BaseMahjongLayerCpn = require('BaseMahjongLayerCpn');
var EventName = require('EventName');
cc.Class({
    extends: BaseMahjongLayerCpn,

    properties: {
        MultiOptionLayer  : {
            default : null,
            type : cc.Node,
       },        
       chooseOptionHandPrefab : {
        type : cc.Prefab,
        default : null,
    }
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        cc.global.rootNode.on(EventName.OnPlaybackMultiOption,this.onPlaybackMultiOption,this);
        this.getMultiOptionLayerCpn().setVisible(false);
    },

    onDestroy : function(){
        cc.global.rootNode.off(EventName.OnPlaybackMultiOption,this.onPlaybackMultiOption,this);
    },

    onPlaybackMultiOption : function(event){
        var multiSeatOptionEvent = event.detail.data;
        var MultiOptionLayerCpn = this.getMultiOptionLayerCpn();
        MultiOptionLayerCpn.setVisible(true);
        MultiOptionLayerCpn.onMultiSeatOptionChange(multiSeatOptionEvent);
    },

    getSeatPlayerCardLayerCpn : function(){
        var SeatPlayerCardLayerCpn = this.seatPlayerCardLayer.getComponent('PlaybackSeatPlayerCardLayerCpn');
        return SeatPlayerCardLayerCpn;
    },

    initMultiOptionLayer : function(){
        var MultiOptionLayerCpn = this.MultiOptionLayer.getComponent('MultiOptionLayerCpn');
        if(!MultiOptionLayerCpn){
            MultiOptionLayerCpn = this.MultiOptionLayer.addComponent('MultiOptionLayerCpn');
            var optionConfig = {'myself':'option1','right':'option2','up':'option3','left':'option4'};
            MultiOptionLayerCpn.setOptionNodeNameConfig(optionConfig);
            MultiOptionLayerCpn.setChooseOptionHandPrefab(this.chooseOptionHandPrefab);
        }
        return MultiOptionLayerCpn;
    },

    getMultiOptionLayerCpn : function(){
        return this.initMultiOptionLayer();
    },

    hideOption : function(){
        var multiOptionCpn = this.initMultiOptionLayer();
        multiOptionCpn.setVisible(false);
    },
});
