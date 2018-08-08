

cc.Class({
    extends: cc.Component,

    properties: {
        childrenNode : {
            default : null,
            type : cc.Prefab
        },
        activityNode : {
            default : null,
            type : cc.Node
        },
        headNode : {
            default : null,
            type : cc.Node
        },
        activitiesItem : [],
        noticesItem : [],
        page : 0,
    },

    onLoad : function () {
        
    },

    initData : function (data) {
        this.clearDataAndChild();
        this.addDataAndChild(data);
        this.freshView();
    },

    clearDataAndChild : function () {
        this.activityNode.children.length = 0;
        this.activitiesItem.length = 0;
        this.noticesItem.length = 0;
    },

    addDataAndChild : function (data) {
        for (let i = 0; i < data.length; i++) {
            var children = cc.instantiate(this.childrenNode);
            children.getComponent("ActiviteItem").initData(data[i], this);
            this.activityNode.addChild(children);
            if (data[i].type) {
                this.activitiesItem.push(children);
            } else {
                this.noticesItem.push(children);
            }
        }
    },

    changeToggleCheckMark : function (target, customdata) {
        var index = parseInt(customdata);
        this.page = index;
        this.freshView();
    },

    freshView : function () {      
        for (let i = 0; i < this.noticesItem.length; i++) {
            this.noticesItem[i].active = this.page;
        }
        for (let i = 0; i < this.activitiesItem.length; i++) {
            this.activitiesItem[i].active = !this.page;
        }
        if (!this.activitiesItem.length) {
            this.headNode.getChildByName("Toggle1").active = false;
            if (this.headNode.getChildByName("Toggle2")) {
                this.headNode.getChildByName("Toggle2").getComponent(cc.Toggle).check();
            }
        }
        if (!this.noticesItem.length) {
            this.headNode.getChildByName("Toggle2").active = false;
            if (this.headNode.getChildByName("Toggle1")) {
                this.headNode.getChildByName("Toggle1").getComponent(cc.Toggle).check();
            }
        }
        if (this.page) {
            if (this.noticesItem.length) {
                this.noticesItem[0].getComponent(cc.Toggle).check();
            }
        } else {
            if (this.activitiesItem.length) {
                this.activitiesItem[0].getComponent(cc.Toggle).check();
            }
        }
    },

    loadHeadSp : function(target,url){
        cc.global.loading.show();
        this.node.getComponent('OnlineLoadData').getSpriteByUrl(url);
        this.schedule(this.updataShowNode, 0);
    },

    updataShowNode : function (dt) {
        if (this.node.getComponent('OnlineLoadData').getLoadingDone()) {
            this.unschedule(this.updataShowNode);
            cc.global.loading.hide();
        }
    },
});
