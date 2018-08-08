var BackStageConfig = require('BackStageConfig');
cc.Class({
    extends: cc.Component,

    properties: {
        clubHideNodeList : {
            default : [],
            type : cc.Node,
        },
        agentHideNodeList : {
            default : [],
            type : cc.Node,
        },
        originRechargeHideNodeList : {
            default : [],
            type : cc.Node,
        },
        originalWeChatHideNodeList : {
            default : [],
            type : cc.Node,
        },
        originalAlipayHideNodeList : {
            default : [],
            type : cc.Node,
        },
        originalAppleHideNodeList : {
            default : [],
            type : cc.Node,
        },
        rechargeHideNodeList : {
            default : [],
            type : cc.Node,
        },

    },

    // use this for initialization
    onLoad: function () {
        var shieldConfig = BackStageConfig.shieldConfig;
        for(var key in shieldConfig){
            var name = key + "HideNodeList";
            var nodeList = this[name];
            if(nodeList){
                var isVisible = Boolean(shieldConfig[key]);
                this.setNodeListVisible(nodeList,isVisible);
            }
        }
    },
    
    setNodeListVisible : function(nodeList,isVisible){
        if(!nodeList){
            return;
        }
        for(var i = 0 ; i < nodeList.length; ++i){
            nodeList[i].active = isVisible;
        }
    },

});
