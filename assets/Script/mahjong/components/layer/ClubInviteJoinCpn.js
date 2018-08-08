var CommonHelper = require('CommonHelper');
var tempClient = require('MjRequestSpecificClient');
var Code = require('CodeCfg');
var ProtoUtil = require("ProtoUtil");
var GameToWechatGameHelper = require("GameToWechatGameHelper");
var GameToAppHelper = require('GameToAppHelper');
var GameToPlatformHelper = require('GameToPlatformHelper');

cc.Class({
    extends: cc.Component,

    properties: {
        seekEditBox : {
            default : null,
            type : cc.EditBox,
        },
    },

    onLoad () {

    },

    init : function(param){
        this.clubInfo = param;
    },

    closeMyself : function(){
        this.closeSetting();
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);       
    },
    
    closeSetting : function () {
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            GameToWechatGameHelper.hideKeyboard();
        }  
        this.seekEditBox.string = "";
    },

    onClickButton : function (target,customdata) {
        var customData = Number(customdata);
        switch (customData) {
            case 1 : {//关闭
                this.closeMyself();
            }
            break;
            case 2 : {//邀请好友
                if (this.seekEditBox.string != "") {
                    tempClient.inviteOrJoinClub(this.seekEditBox.string, cc.gameConfig.clubId, cc.mj.ownUserData.uid, 2, true, this.inviteJoinClubCb.bind(this));
                } else {
                    CommonHelper.showTips("玩家ID不能为空");
                }
            }
            break;
            case 3 : {
                var content = "邀请你加入好友圈["+this.clubInfo.clubName+'],招财招脚!';
                var data={"clubInviteCode":this.clubInfo.inviteCode,"content":content}
                GameToPlatformHelper.inviteWeChatJoinClub(data);
            }
            break;
            case 4 : {
                var content = "邀请你加入好友圈["+this.clubInfo.clubName+'],招财招脚!';
                var data={"clubInviteCode":this.clubInfo.inviteCode,"content":content}
                GameToPlatformHelper.inviteDingdingJoinClub(data);
            }
            break;
        }
    },

    inviteJoinClubCb : function (customHttpRequest) {
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.inviteJoinClub ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                CommonHelper.showTips("发送成功");
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },
});
