cc.Class({
    extends: cc.Component,

    properties: {
        btnOrder : {
            type : cc.Node,
            default : [],
        },
        state : 0,
    },

    // use this for initialization
    onLoad: function () {
    },

    onDestroy : function(){
    },

    onTouchEnd : function(){
        this.goToNextState();
    },

    goToNextState : function(){
        var length = this.btnOrder.length;
        var state = this.state == (length-1) ? 0 : (this.state + 1);
        this.state = state; 
        this.fresh();
    },

    fresh : function(){
        for(var i = 0 ; i < this.btnOrder.length; ++i){
            this.btnOrder[i].active = (i == this.state);
        }
    },

    getCurStateNode : function(){
        return this.btnOrder[this.state];
    },

    goToState : function(state){
        this.state = state;
        this.fresh();
    },
});
