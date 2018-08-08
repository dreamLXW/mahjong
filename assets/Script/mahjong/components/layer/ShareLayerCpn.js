var GameToPlatformHelper = require('GameToPlatformHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        sharePicNode: {
            type : cc.Node,
            default : null,
        },
        shareGameNode: {
            type : cc.Node,
            default : null,            
        },        
    },

    // use this for initialization
    onLoad: function () {

    },

    initFilePath : function(filePath){
        this._imagePath = filePath;
        this.shareGameNode.active = false;
        this.sharePicNode.active = true;
    },

    initGameShare : function(){
        this.shareGameNode.active = true;
        this.sharePicNode.active = false;
    },

    onClickShareDingdingFriend : function(){
        GameToPlatformHelper.shareDingdingFriend(this._imagePath);
    },
    
    onClickShareWeChatFriend : function(){
        GameToPlatformHelper.shareWeChatFriend(this._imagePath);
    },

    onClickShareDingdingMoment : function(){
        GameToPlatformHelper.shareDingdingMoment(this._imagePath);
    },

    onClickShareWeChatMoment : function(){
        GameToPlatformHelper.shareWeChatMoment(this._imagePath);
    },

    onClickShareGameWechatFriend : function(){
        GameToPlatformHelper.shareGameWechatFriend();
    },

    onClickShareGameWechatMoment : function(){
        GameToPlatformHelper.shareGameWechatMoment();
    },
});
