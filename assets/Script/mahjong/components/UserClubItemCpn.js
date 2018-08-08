var CommonHelper = require('CommonHelper');
var tempClient = require('MjRequestSpecificClient');
var Code = require('CodeCfg');
var ProtoUtil = require("ProtoUtil");

cc.Class({
    extends: cc.Component,

    properties: {
        clubNameLabel : {
            default : null,
            type : cc.Label
        },
        clubIdLabel : {
            default : null,
            type : cc.Label
        },
        exitBtn : {
            default : null,
            type : cc.Node
        },
        tipsNode : {
            type : cc.Node,
            default : null, 
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    onEnable : function(){
        cc.global.rootNode.on("NoCheckMessageDataChange",this.onNoCheckMessageDataChange,this);
    },

    onDisable : function(){
        cc.global.rootNode.off("NoCheckMessageDataChange",this.onNoCheckMessageDataChange,this);
    },

    setToggleGroup : function(toggleGroup){
        this.node.getComponent(cc.Toggle).toggleGroup = toggleGroup;
    },

    setToggleEvent : function(toggleEvent){
        this.node.getComponent(cc.Toggle).checkEvents.push(toggleEvent);
    },

    init : function(clubInfo){
        this.clubId = clubInfo.clubId;
        this.clubIdLabel.string = "ID：" + clubInfo.clubId;

        var clubName = clubInfo.clubName;
        this.clubNameLabel.string = clubName;
        const maxWidth = 165;
        if(this.clubNameLabel.node.getContentSize().width > maxWidth){
            clubName = clubName.slice(0,6);
            clubName += ".."
            this.clubNameLabel.string = clubName;
        }
        if (clubInfo.manager.uid == cc.mj.ownUserData.uid) {
            this.exitBtn.active = false;
        }
        this.loadHeadSp(this,clubInfo.clubIcon);
        this.freshTipsNode();
    },

    onClickClubButton : function (target,customdata) {
        var self = this;
        var customData = Number(customdata);
        switch (customData) {
            case 1 : {//退出
                CommonHelper.showMessageBox("提示","确定要退出该好友圈吗？",function(){
                    tempClient.quitClub(self.clubId, true, self.getQuitClubCallback.bind(self));
                },null,true);
            }
            break;
        }
    },

    loadHeadSp : function(target,url){
        this.node.getComponent('OnlineLoadData').getSpriteByUrl(url);
    },

    setToggleTrueIfClubId : function(clubId){
        this.node.getComponent(cc.Toggle).isChecked = (clubId == this.clubId);
    },

    isChecked : function(){
        return this.node.getComponent(cc.Toggle).isChecked;
    },

    getQuitClubCallback : function (customHttpRequest) {
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.quitClub ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                var decodeData = ProtoUtil.decode(cbdata);
                var code = decodeData.code;
                var err = decodeData.err;
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
                if (this.clubId == cc.gameConfig.clubId) {
                    cc.gameConfig.clubId = null;
                }
                cc.global.rootNode.emit("FreshClubList");
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },

    onNoCheckMessageDataChange : function(){
        this.freshTipsNode();
    },

    freshTipsNode : function(){
        if(this.tipsNode){
            var NoCheckMessageData = require('NoCheckMessageData');
            this.tipsNode.active = NoCheckMessageData.value("1002" , this.clubId);
        }
    },
});
