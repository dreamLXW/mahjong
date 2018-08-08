
cc.Class({
    extends: cc.Component,

    properties: {
        title : {
            default : null,
            type : cc.Label
        },
        lobbyNode : null,
    },

    onLoad : function () {

    },

    initData : function (array, index, lobbyNode) {
        this.lobbyNode = lobbyNode;
        this.loadHeadSp(this, array[index].content);
        this.title.string = array[index].title;
        this.node.opacity = 0;
    },

    loadHeadSp : function(target,url){
        cc.global.loading.show();
        this.node.getComponent('OnlineLoadData').getSpriteByUrl(url);
        this.schedule(this.updataShowNode, 0);
    },

    updataShowNode : function (dt) {
        if (this.node.getComponent('OnlineLoadData').getLoadingDone()) {
            this.lobbyNode.popupNoticeLayer.addChild(this.node);
            this.unschedule(this.updataShowNode);
            cc.global.loading.hide();
        }
    },

    onClickClose : function () {
        this.lobbyNode.checkPopUpNoticeQueue();
        this.node.removeFromParent();
    },
});
