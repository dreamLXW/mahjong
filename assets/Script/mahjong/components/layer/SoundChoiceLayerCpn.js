cc.Class({
    extends: cc.Component,

    properties: {
        toggleGroup : {
            type : cc.Node,
            default : null,
        },
    },

    // use this for initialization
    onLoad: function () {
        //this.clearToggleCheck();
    },

    onToggleChange : function(target){
        var name = target.node.name;
        const str = 'toggle';
        var i = Number(name.substr(str.length,name.length));
        cc.sys.localStorage.setItem('lanType',i);
    },

    onEnable : function(){
        var lanType = Number(cc.sys.localStorage.getItem('lanType'));
        console.log('lanType'+ lanType);
        if(lanType && lanType != 1){
            var self = this;
            this.node.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(function(){
                self.toggleGroup.getChildByName('toggle'+lanType).getComponent(cc.Toggle).check();
            })));
            
        }  
        if(lanType == 1){
            this.clearToggleCheck();
        }
    },

    clearToggleCheck : function(){
        //this.toggleGroup.getChildByName("mask").getChildByName('toggle1').getComponent(cc.Toggle).check();
        this.toggleGroup.getChildByName('toggle1').getComponent(cc.Toggle).check();
    },
});
