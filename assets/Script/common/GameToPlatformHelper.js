var GameToAppHelper = require("GameToAppHelper");
var GameToWechatGameHelper = require('GameToWechatGameHelper');
var CommonHelper = require('CommonHelper');
var GameToPlatformHelper =  {
};

GameToPlatformHelper.ExitGame = function(){
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        GameToWechatGameHelper.ExitGame();
    }else{
        GameToAppHelper.ExitGame();
    }
},
GameToPlatformHelper.executeRecharge = function(goodsId,payType){
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        GameToWechatGameHelper.executeRecharge(goodsId,payType);
    }else{
        GameToAppHelper.executeRecharge(goodsId,payType);
    }
},
GameToPlatformHelper.inviteWeChatJoinClub = function (data) {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        GameToWechatGameHelper.inviteWeChatJoinClub(data);
    } else {
        GameToAppHelper.inviteWeChatJoinClub(data);
    }
},
GameToPlatformHelper.inviteDingdingJoinClub = function (data) {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        CommonHelper.showMessageBox('提示',"暂没开放",function(){},null,false);
    } else {
        GameToAppHelper.inviteDingdingJoinClub(data);
    }
},
GameToPlatformHelper.shareDingdingFriend = function (imagePath) {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        CommonHelper.showMessageBox('提示',"暂没开放",function(){},null,false);
    } else {
        GameToAppHelper.sharePicToDingdingFriend(imagePath);
    }
},
GameToPlatformHelper.shareWeChatFriend = function (imagePath) {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        CommonHelper.showMessageBox('提示',"暂没开放",function(){},null,false);
    } else {
        GameToAppHelper.sharePicToWeChatFriend(imagePath);
    }
},
GameToPlatformHelper.shareDingdingMoment = function (imagePath) {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        CommonHelper.showMessageBox('提示',"暂没开放",function(){},null,false);
    } else {
        GameToAppHelper.sharePicToDingdingMoment(imagePath);
    }
},
GameToPlatformHelper.shareWeChatMoment = function (imagePath) {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        CommonHelper.showMessageBox('提示',"暂没开放",function(){},null,false);
    } else {
        GameToAppHelper.sharePicToWeChatMoment(imagePath);
    }
},
GameToPlatformHelper.shareGameWechatFriend = function () {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        GameToWechatGameHelper.shareAppForFriendsGroup();
    } else {
        GameToAppHelper.shareGameToWeChatFriend();
    }
},
GameToPlatformHelper.shareGameWechatMoment = function () {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        CommonHelper.showMessageBox('提示',"暂没开放分享朋友圈功能",function(){},null,false);
    } else {
        GameToAppHelper.shareGameToWeChatMoment();
    }
},
GameToPlatformHelper.goToAgentPage = function () {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        GameToWechatGameHelper.goToAgentPage();
    } else {
        GameToAppHelper.goToAgentPage();
    }  
},
GameToPlatformHelper.showShareLayer = function () {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        GameToWechatGameHelper.shareAppForFriendsGroup();
    } else {
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var shareLayerNode = ModalLayerMgr.getTop('ShareLayer');
        var shareLayerCpn = shareLayerNode.getComponent('ShareLayerCpn');
        shareLayerCpn.initGameShare();
        ModalLayerMgr.showTop('ShareLayer');
    }
},
GameToPlatformHelper.weChatRoomInvite = function (params) {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        GameToWechatGameHelper.weChatRoomInvite(params);
    } else {
        GameToAppHelper.weChatRoomInvite(params);
    }
},
module.exports = GameToPlatformHelper;

