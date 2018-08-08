cc.Class({
    extends: cc.Component,

    properties: {
        vipRecordPrefab : {
            type : cc.Prefab,
            default : null,
        },
        itemContanier : {
            type : cc.Node,
            default : null,
        },
        noLabel : {
            default : null,
            type : cc.Label,
        },
        titleArr : {
            type : cc.Node,
            default : [],  
        },
    },

    // use this for initialization
    onLoad: function () {
        for(var i = 0 ; i < 3; ++i){
            this.itemContanier.getChildByName('item'+i).addChild(cc.instantiate(this.vipRecordPrefab));
        }
    },

    initTitle : function(title){
        var titleMap = {"viprecord":0,"clubrecord":1,"clubUserRecord":2};
        for(var i = 0 ; i < this.titleArr.length; ++i){
            this.titleArr[i].active = (i == titleMap[title]);
        }
    },

    init : function(historySettleList){
        if(historySettleList == undefined || historySettleList == null){
            historySettleList = [];
        }
        var pageTool = this.node.getComponent('PageTool');
        pageTool.init(historySettleList);
        pageTool.jumpToPage(0);

        this.noLabel.node.active = (historySettleList.length <= 0);
    },
});
