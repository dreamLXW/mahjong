cc.Class({
    extends: cc.Component,

    properties: {
        textLabel : {
            type : cc.Label,
            default : null,
        },
        _delayTime : 1.5,
        _disapearTime : 0.5,
    },

    // use this for initialization
    onLoad: function () {

    },

    run : function(text){
        this.textLabel.string = text;
        this.node.stopAllActions();
        this.node.opacity = 255;
        this.node.runAction(cc.sequence(cc.delayTime(this._delayTime),cc.fadeOut(this._disapearTime)));
    },

    init : function(delayTime,disapearTime){
        this._delayTime = delayTime || this._delayTime;
        this._disapearTime = disapearTime || this._disapearTime; 
    }

});
