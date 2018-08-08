cc.Class({
    extends: cc.Component,

    properties: {
        num : 0,
    },

    // use this for initialization
    onLoad: function () {

    },

    starCountDown : function(num){
        this.unscheduleAllCallbacks();
        var interval = 1;
        var repeat = num;
        var delay = 0;
        this.schedule(function(){
            if(num < 10){
                this.node.getComponent(cc.Label).string = '0'+num;
            }else{
                this.node.getComponent(cc.Label).string = num;
            }
            --num;
        }, interval, repeat, delay);
    },

    stopCountDown : function(){
        this.unscheduleAllCallbacks();
    },

});
