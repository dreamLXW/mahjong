var CommonHelper = require('CommonHelper');
var tempClient = require('MjRequestSpecificClient');
var Code = require('CodeCfg');
var ProtoUtil = require("ProtoUtil");
var GameToWechatGameHelper = require("GameToWechatGameHelper");

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

    init : function(isFromClub){
        this.isFromClub = isFromClub;
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
            case 1 : {//查找
                if (this.seekEditBox.string != "") {
                    tempClient.getClubInfo(this.seekEditBox.string, true, this.getClubInfoCallback.bind(this));
                } else {
                    CommonHelper.showTips("邀请码输入有误，请重新输入");
                }
            }
            break;
            case 2 : {//关闭
                this.closeMyself();
            }
            break;
        }
    },

    getClubInfoCallback : function (customHttpRequest) {
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.getClubInfo ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                var decodeData = ProtoUtil.decode(cbdata);
                var code = decodeData.code;
                var inviteCode = decodeData.club.invite_code;
                var clubId = decodeData.club.clubId;
                var managerName = decodeData.club.manager.nickname;
                var clubName = decodeData.club.name;
                var clubUsers = decodeData.club.number;
                var clubTotalUsers = decodeData.club.maxNumber;
                this.showJoinMessage(clubName, managerName, clubUsers, clubTotalUsers, clubId);
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },

    showJoinMessage : function (clubName, managerName, clubUsers, clubTotalUsers, clubId) {
        let self = this;
        CommonHelper.showMessageBox("提示","是否加入[" + clubName + "]好友圈\n经理:" + managerName + "\n人数:" + clubUsers + "/" + clubTotalUsers,
        function () {
            tempClient.inviteOrJoinClub(cc.mj.ownUserData.uid, clubId, 0, 1, true, self.getJoinClubCallback.bind(self));
        },null,true);
    },

    getJoinClubCallback : function (customHttpRequest) {
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.inviteJoinClub ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                var decodeData = ProtoUtil.decode(cbdata);
                var code = decodeData.code;
                var err = decodeData.err;
                CommonHelper.showTips("发送成功，请等待经理审核");
                cc.global.rootNode.emit("FreshClubList");
                this.closeMyself();
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },
});
