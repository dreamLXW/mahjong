cc.Class({
    extends: cc.Component,

    properties: {
        scrollView : {
            type : cc.ScrollView,
            default : null,
        },
        curIndex : 0,
        ruleItemList : {
            default : [],
            type : cc.Prefab,
        },
        contentContainer : {
            type : cc.Node,
            default : null,
        }
    },

    // use this for initialization
    onLoad: function () {
        this.freshView();
    },

    onEnable : function() {
        this.scrollView.scrollToTop(0);
    },

    onClickMahjongTypeToggle : function(target,data){
        this.scrollView.scrollToTop(0);
        this.curIndex = data;
        this.freshView();
    },

    freshView : function(){
        this.contentContainer.removeAllChildren();
        var RuleItemPrefab = this.ruleItemList[this.curIndex];
        if(RuleItemPrefab){
            this.contentContainer.addChild(cc.instantiate(RuleItemPrefab));
        }
    },

});
