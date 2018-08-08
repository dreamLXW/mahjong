var CommonHelper = require('CommonHelper');
var tempClient = require('MjRequestSpecificClient');
var Code = require('CodeCfg');
var ProtoUtil = require("ProtoUtil");
var GameToWechatGameHelper = require("GameToWechatGameHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        clubNameEditBox : {
            default : null,
            type : cc.EditBox,
        },
        phoneEditBox : {
            default : null,
            type : cc.EditBox,
        },
        yzmEditBox : {
            default : null,
            type : cc.EditBox,
        },
        timeLabel: {
            default : null,
            type : cc.Node,
        },
        yzmLabel : {
            default : null,
            type : cc.Node,
        },
        maskBtn : {
            default : null,
            type : cc.Node,
        },
        timeCount : 0,
        isCanYzm : true,
        stopTime : 0,
        timeOutNum : 0,
    },

    onLoad () {
        
    },

    init : function(isFromClub){
        var self = this;
        this.isFromClub = isFromClub;
        this.getIntervalTime();
        if (cc.mj.ownUserData.telephone != "") {//判断是否绑定了手机号码
            this.phoneEditBox.string = "" + cc.mj.ownUserData.telephone;
            this.maskBtn.active = true;
        }
    },

    getIntervalTime : function () {
        var curTime = new Date().getTime();
        var intervalTime = parseInt((curTime - this.stopTime)/1000);
        var trueTime = this.timeOutNum - intervalTime;
        if (trueTime > 0) {
            this.timeOutNum = trueTime;
        } else {
            this.timeCount = 0;
            this.setYzmButtonState(true);
        }
    },

    closeMyself : function(){
        this.closeSetting();
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);     
    },

    closeSetting : function () {
        this.stopTime = new Date().getTime();
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            GameToWechatGameHelper.hideKeyboard();
        }
        this.clubNameEditBox.string = "";
        this.phoneEditBox.string = "";
        this.yzmEditBox.string = "";
        this.setYzmButtonState(true);
    },

    onClickButton : function (target,customdata) {
        var customData = Number(customdata);
        switch (customData) {
            case 1 : {//获取验证码
                if (this.checkEditBox() && this.isCanYzm) {
                    tempClient.getVirifyCode(this.phoneEditBox.string, true, this.getVirifyCodeCallback.bind(this));
                }
            }
            break;
            case 2 : {//提交
                if (this.checkEditBox() && this.yzmEditBox.string.length != "") {
                    tempClient.createClub(this.clubNameEditBox.string, this.phoneEditBox.string, this.yzmEditBox.string, true, this.createClubCallback.bind(this));
                } else {
                    CommonHelper.showTips("请输入正确的验证码");
                }
            }
            break;
            case 3 : {//关闭
                this.closeMyself();
            }
            break;
        }
    },

    checkEditBox : function () {
        if (this.clubNameEditBox.string == "") {
            CommonHelper.showTips("好友圈名字不能为空");
            return false;
        }
        if (this.phoneEditBox.string.length != 11) {
            CommonHelper.showTips("请输入正确的手机号");
            return false;
        }
        return true;
    },

    setYzmButtonState : function (isShow) {
        this.isCanYzm = isShow;
        this.timeLabel.active = !isShow;
        this.yzmLabel.active = isShow;
        if (!isShow) {            
            this.schedule(this.updataTimer, 0);
        } else {
            this.unschedule(this.updataTimer);
        }
    },

    getVirifyCodeCallback : function (customHttpRequest) {
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.getVirifyCode ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                var decodeData = ProtoUtil.decode(cbdata);
                var code = decodeData.code;
                var err = decodeData.err;
                this.timeOutNum = decodeData.expireTime;
                this.setYzmButtonState(false);
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },

    createClubCallback : function (customHttpRequest) {
        var self = this;
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.createClub ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                var decodeData = ProtoUtil.decode(cbdata);
                var code = decodeData.code;
                var err = decodeData.err;
                if (cc.mj.ownUserData.telephone == "") {
                    cc.mj.ownUserData.telephone = this.phoneEditBox.string;
                }
                CommonHelper.showMessageBox("提示","好友圈创建成功！",function(){
                    cc.global.rootNode.emit("FreshClubList");
                    self.closeMyself();
                },null,false);
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },

    updataTimer : function (dt) {
        this.timeLabel.getComponent(cc.Label).string = this.timeOutNum + "s";
        this.timeCount += dt;
        if (this.timeCount > 1) { 
            this.timeOutNum--;
            this.timeCount = 0;
            if (this.timeOutNum < 0) {
                this.setYzmButtonState(true);
            }
        }
    },
});
