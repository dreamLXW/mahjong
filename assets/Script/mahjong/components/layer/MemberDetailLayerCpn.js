var CommonHelper = require('CommonHelper');
var tempClient = require('MjRequestSpecificClient');
var Code = require('CodeCfg');
var ProtoUtil = require("ProtoUtil");

cc.Class({
    extends: cc.Component,

    properties: {
        userNameTxt : {
            default : null,
            type : cc.Label,
        },
        userIdTxt : {
            default : null,
            type : cc.Label,
        },
        totalCountTxt : {
            default : null,
            type : cc.Label,
        },
        playCountTxt : {
            default : null,
            type : cc.Label,
        },
        createRoomCountTxt : {
            default : null,
            type : cc.Label,
        },
        victoryCountTxt : {
            default : null,
            type : cc.Label,
        },
        levelArr : {
            default : [],
            type : cc.Node,
        },
        normalTotalCountTxt : {
            default : null,
            type : cc.Label,
        },
        normalPlayCountTxt : {
            default : null,
            type : cc.Label,
        },
        authorityNodeList : {
            default : [],
            type : cc.Node,
        },
        authorityNum : 0,//0详细 1简单
        administratorAuthorityList : {
            default : [],
            type : cc.Node,
        },
        administratorAuthorityNum : 0,//0设为管理员 1撤职
        inOrOutClubList : {
            default : [],
            type : cc.Node,
        },
        inOrOutClubNum : 0,//0退出好友圈 1踢出好友圈
        allowButtonList : {
            default : [],
            type : cc.Node,
        },
        allowButtonNum : 0,//0两种权限都没有 1踢出/退出好友圈 2设为管理员/撤职 + 踢出/退出好友圈

        memberData : null,
        myData : null,
    },

    onLoad () {

    },

    init : function(isFromClub){
        this.isFromClub = isFromClub;
    },

    //设置该用户对应的权限
    setData : function (memberData, myData, adminCount) {
        this.memberData = memberData;
        this.myData = myData;
        switch (parseInt(myData.type)) {
            case 3 : {
                this.authorityNum = 0;
                if (memberData.userId == cc.mj.ownUserData.uid) {
                    this.allowButtonNum = 0;
                    this.administratorAuthorityNum = 0;
                    this.inOrOutClubNum = 0;
                }
                switch (parseInt(memberData.type)) {
                    case 2 : {
                        this.allowButtonNum = 2;
                        this.administratorAuthorityNum = 1;
                        this.inOrOutClubNum = 1;
                    }
                    break;
                    case 1 : {
                        this.allowButtonNum = (adminCount >= 3) ? 1 : 2;
                        this.administratorAuthorityNum = 0;
                        this.inOrOutClubNum = 1;
                    }
                    break;
                }
            }
            break;
            case 2 : {
                this.authorityNum = 0;
                this.administratorAuthorityNum = 0;
                switch (parseInt(memberData.type)) {
                    case 3 : 
                    case 2 : {
                        this.inOrOutClubNum = 0;
                        this.allowButtonNum = (memberData.userId == cc.mj.ownUserData.uid) ? 1 : 0;
                    }
                    break;
                    case 1 : {
                        this.allowButtonNum = 1;
                        this.inOrOutClubNum = 1;
                    }
                    break;
                }
            }
            break;
            case 1 : {
                this.authorityNum = 1;
                this.administratorAuthorityNum = 0;
                this.inOrOutClubNum = 0;
                this.allowButtonNum = (memberData.userId == cc.mj.ownUserData.uid) ?  1 : 0;
            }
            break;
        }
        this.freshMemberLayer(memberData, myData);
    },

    //按照权限显示相应的界面
    freshMemberLayer : function (memberData, myData) {
        var nickName = memberData.nickName;
        this.userId = memberData.userId;
        this.userNameTxt.string = nickName;
        this.userIdTxt.string = "ID:" + (cc.sys.platform === cc.sys.WECHAT_GAME?memberData.userId:memberData.dingNo);
        this.loadHeadSp(this,memberData.upfile);
        this.levelArr[(memberData.type - 1)].active = true;

        if (this.authorityNum) {
            this.normalTotalCountTxt.string = "总牌局数：" + memberData.totalCount;
            this.normalPlayCountTxt.string = "昨日/今日牌局：" + memberData.yesterdayCount +"/" + memberData.currentCount;
        } else {
            this.totalCountTxt.string = "总牌局数：" + memberData.totalCount;
            this.playCountTxt.string = "昨日/今日牌局：" + memberData.yesterdayCount +"/" + memberData.currentCount;
            this.createRoomCountTxt.string = "昨日/今日开房数：" + memberData.yesterdayCreateRoomCount +"/" + memberData.currentCreateRoomCount;
            this.victoryCountTxt.string = "昨日/今日胜场数：" + memberData.yesterdayVictoryCount +"/" + memberData.currentVictoryCount;
        }
        
        this.administratorAuthorityList[this.administratorAuthorityNum].active = true;
        this.inOrOutClubList[this.inOrOutClubNum].active = true;
        this.authorityNodeList[this.authorityNum].active = true;
        if (this.allowButtonNum) {
            for (let i = 0; i < this.allowButtonList.length; i++) {
                if (this.allowButtonNum > i) {
                    this.allowButtonList[i].active = true;
                }
            }
        }
    },

    closeMyself : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);     
    },

    onDisable : function(){
        this.closeSetting();
    },

    closeSetting : function () {
        this.setNodeArrayActiveIsFalse(this.levelArr);
        this.setNodeArrayActiveIsFalse(this.authorityNodeList);
        this.setNodeArrayActiveIsFalse(this.administratorAuthorityList);
        this.setNodeArrayActiveIsFalse(this.inOrOutClubList);
        this.setNodeArrayActiveIsFalse(this.allowButtonList);
    },

    setNodeArrayActiveIsFalse : function (array) {
        for (let i = 0; i < array.length; i++) {
            array[i].active = false;
        }
    },

    loadHeadSp : function(target,url){
        this.node.getComponent('OnlineLoadData').getSpriteByUrl(url);
    },

    onClickButton : function (target,customdata) {
        var self = this;
        var customData = Number(customdata);
        switch (customData) {
            case 1 : {//撤职/设置管理员
                tempClient.changeAdmin(cc.gameConfig.clubId, this.myData.userId, this.memberData.userId, (this.administratorAuthorityNum ? 2 : 1), 
                    true, this.changeAdminCallback.bind(this));
            }
            break;
            case 2 : {//踢出好友圈/退出好友圈
                if (this.inOrOutClubNum) {//踢出好友圈
                    tempClient.tickClub(this.myData.userId, cc.gameConfig.clubId, this.memberData.userId, true, this.tickClubCallback.bind(this));
                } else {//退出好友圈
                    CommonHelper.showMessageBox("提示","确定要退出该好友圈吗？",function(){
                        tempClient.quitClub(cc.gameConfig.clubId, true, self.getQuitClubCallback.bind(self));
                    },null,true);
                }
            }
            break;
            case 3 : {//个人战绩
                this.requestUserRecord(this.userId);
            }
            break;
            case 4 : {//点击黑色背景关闭
                this.closeMyself();
            }
            break;
        }
    },

    changeAdminCallback : function (customHttpRequest) {
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.setAdmin ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                var decodeData = ProtoUtil.decode(cbdata);
                var code = decodeData.code;
                var err = decodeData.err;
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
                cc.global.rootNode.emit("FreshMemberLayer");
                this.closeMyself();
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },

    tickClubCallback : function (customHttpRequest) {
        var self = this;
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.tickClub ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                var decodeData = ProtoUtil.decode(cbdata);
                var code = decodeData.code;
                var err = decodeData.err;
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
                cc.global.rootNode.emit("FreshMemberLayer");
                this.closeMyself();
            }else if (cbdata.code == Code.CLUB_AUTH_NOT_ENOUGH) {
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){
                    cc.global.rootNode.emit("FreshMemberLayer");
                    self.closeMyself();
                },null,false);
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },

    getQuitClubCallback : function (customHttpRequest) {
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.quitClub ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                var decodeData = ProtoUtil.decode(cbdata);
                var code = decodeData.code;
                var err = decodeData.err;
                cc.global.rootNode.emit("QuitClubInMemberLayer");
                this.closeMyself();
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },
    requestUserRecord : function(param){
        var checkUid=param;
        var clubId =cc.gameConfig.clubId;
        var data = {"clubId" : clubId,"uid" : cc.mj.ownUserData.uid, "checkUid" : checkUid };
        tempClient.getClubUserRecord(data,true,this.onRequestUserClubRecordCb.bind(this))
    },
    onRequestUserClubRecordCb :function(cbdata){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var vipRecordLayerNode = ModalLayerMgr.getTop('VipRecordLayer');
        var vipRecordLayerCpn = vipRecordLayerNode.getComponent('VipRecordLayerCpn');
        ModalLayerMgr.showTop('VipRecordLayer');
        vipRecordLayerCpn.initTitle("clubUserRecord");
        vipRecordLayerCpn.init(cbdata.historySettleList)
    }
});
