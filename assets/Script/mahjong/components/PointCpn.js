cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
    },

    playing : function(){
        this.stopPlaying();
        this.node.active = true;
        this.node.runAction(this.getMoveUpDownAction());
    },

    getMoveUpDownAction : function(){
        return cc.repeatForever(cc.sequence(cc.moveBy(0.25,0,16),cc.moveBy(0.25,0,-16)));
    },

    stopPlaying : function(){
        this.node.stopAllActions();
        this.node.active = false;
    },
    
    setPos : function(WorldPos){
        var pos = this.node.parent.convertToNodeSpaceAR(WorldPos);
        pos.y += 9.1;
        this.node.position = pos;
    }
});
