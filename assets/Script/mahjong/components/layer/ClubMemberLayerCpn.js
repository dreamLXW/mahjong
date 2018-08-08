var CommonHelper = require('CommonHelper');
var tempClient = require('MjRequestSpecificClient');
var Code = require('CodeCfg');
var ProtoUtil = require("ProtoUtil");
var Player = require('PlayerData');
var GameToAppHelper = require('GameToAppHelper');
var MjGameData = require('MjGameData');
var BackStageConfig = require('BackStageConfig');
var GameToWechatGameHelper = require("GameToWechatGameHelper");

var ClubInfo  = function(opt){
    this.clubId = opt.clubId;
    this.clubName = opt.clubName;
    this.inviteCode = opt.inviteCode
    this.manager = new Player();
    this.manager.initData(opt.manager);
    this.number = opt.number;
    this.maxNumber = opt.maxNumber;
};

cc.Class({
    extends: cc.Component,

    properties: {
        memberNumberTxt : {
            default : null,
            type : cc.Label
        },
        addMemberTxt : {
            default : null,
            type : cc.Label
        },
        memberContent : {
            default : null,
            type : cc.Node
        },
        clubMemberItem : {
            default : null,
            type : cc.Prefab
        },
        navbarNode : {
            default : null,
            type : cc.Node
        },
        manageNode : {
            default : null,
            type : cc.Node
        },
        applyNode : {
            default : null,
            type : cc.Node
        },
        tipsNode : {
            default : null,
            type : cc.Node
        },
        searchEdit : {
            default : null,
            type : cc.EditBox
        },
        memberScrollView : {
            default : null,
            type : cc.ScrollView
        },
        myData : null,
        sortType : 0,
        searchType : 0,
    },

    onEnable () {
        cc.global.rootNode.on('NeedToRequstClubManagementRecord',this.onNeedToRequstClubManagementRecord,this);
        cc.global.rootNode.on("NoCheckMessageDataChange",this.onNoCheckMessageDataChange,this);
        cc.global.rootNode.on('QuitClubInMemberLayer',this.onQuitClubInMemberLayer,this);
        cc.global.rootNode.on('FreshMemberLayer',this.freshMemberLayer,this);
        cc.global.rootNode.on('NeedToRequstClubApplyRecord',this.onNeedToRequstClubApplyRecord,this)
    },
    
    onDisable(){
        cc.global.rootNode.off('NeedToRequstClubManagementRecord',this.onNeedToRequstClubManagementRecord,this);
        cc.global.rootNode.off("NoCheckMessageDataChange",this.onNoCheckMessageDataChange,this);
        cc.global.rootNode.off('QuitClubInMemberLayer',this.onQuitClubInMemberLayer,this);
        cc.global.rootNode.off('NeedToRequstClubApplyRecord',this.onNeedToRequstClubApplyRecord,this);
        cc.global.rootNode.off('FreshMemberLayer',this.freshMemberLayer,this);
    },

    init : function(isFromClub,inviteCode){
        this.isFromClub = isFromClub;
        this.clubInviteCode=inviteCode;
        this.myData = null;
        this.freshMemberLayer();
        this.freshTipsNode();
    },

    freshTitle : function (clubInfo) {
        if (clubInfo.number && clubInfo.maxNumber) {
            this.memberNumberTxt.string = "(" + clubInfo.number + "/" + clubInfo.maxNumber + ")";
            this.addMemberTxt.string = clubInfo.number + "/" + clubInfo.maxNumber;
        }
    },

    freshMemberLayer : function () {
        tempClient.getClubRoomList(cc.gameConfig.clubId,false,this.onRequestClubRoomListCb.bind(this));
    },

    freshMemberList : function (memberList) {
        this.checkMemberList(memberList);
        this.removeMemberList();
        var adminCount = 0;
        for (let i = 0; i < memberList.length; i++) {
            if (memberList[i].type == 2) {
                adminCount++;
            }
            if (memberList[i].userId == cc.mj.ownUserData.uid) {
                // if (this.myData != null && this.myData.type != memberList[i].type) {
                //     CommonHelper.showMessageBox("提示","您的权限发生变动",function(){},null,false);
                // }
                this.myData = memberList[i];
                this.checkAuthority(this.myData);
            }
        }
        for (let i = 0; i < memberList.length; i++) {
            var member = cc.instantiate(this.clubMemberItem);
            member.getComponent("ClubMemberItemCpn").setData(memberList[i], this.myData, adminCount, this.sortType);
            this.memberContent.addChild(member);
        }
        this.memberScrollView.scrollToTop(0);
    },

    onNeedToRequstClubApplyRecord : function(){
        this.onClickBtnClubApplyRecord();
    },

    checkMemberList : function (memberList) {
        if (this.searchType) {
            this.searchMemberList(memberList);
        }
        this.sortMemberList(memberList);
    },

    searchMemberList : function (memberList) {
        var nameSearchList = [];
        var idSearchList = [];
        var searchStr = this.searchEdit.string;
        for (let i = 0; i < memberList.length; i++) {
            if (memberList[i].nickName.search(new RegExp(searchStr)) > -1) {
                nameSearchList.push(memberList[i]);
            }
            var searchID = (cc.sys.platform === cc.sys.WECHAT_GAME?memberList[i].userId + "":memberList[i].dingNo);
            if (searchID.search(new RegExp(searchStr)) > -1) {
                idSearchList.push(memberList[i]);
            }
        }
        memberList.length = 0;
        for (let i = 0; i < nameSearchList.length; i++) {
            memberList.push(nameSearchList[i]);
        }
        for (let i = 0; i < idSearchList.length; i++) {
            var repeat = false;
            for (let j = 0; j < memberList.length; j++) {
                if (idSearchList[i].userId == memberList[j].userId) {
                    repeat = true;
                }
            }
            if (!repeat) {
                memberList.push(idSearchList[i]);
            }
        }
        if (memberList.length == 0) {
            CommonHelper.showMessageBox("提示","该成员不存在",function(){},null,false);
        }
    },

    sortMemberList : function (memberList) {
        if (this.sortType >= 0) {
            CommonHelper.sortByTag(memberList, "createdAt", false);
        }
        if (this.sortType >= 1) {
            CommonHelper.sortByTag(memberList, "lastPlayTime", true);
        }
        if (this.sortType >= 2) {
            CommonHelper.sortByTag(memberList, "sevenDayCount", true);
        }
        CommonHelper.sortByTag(memberList, "type", true);
    },
    
    checkAuthority : function (memberDetal) {
        this.setReadyNodeIsFalse();
        if (memberDetal.type > 1) {
            this.navbarNode.active = true;
            this.applyNode.active = true;
        }
        if (memberDetal.type > 2) {
            this.manageNode.active = true;
        }
    },

    removeMemberList : function () {
        var removeChildList = [];
        for (let i = 0; i < this.memberContent.children.length; i++) {
            if (this.memberContent.children[i].name === "ClubMemberItem") {
                removeChildList.push(this.memberContent.children[i]);
            }
        }
        if (removeChildList.length) {
            for (let i = 0; i < removeChildList.length; i++) {
                removeChildList[i].removeFromParent();
            }
        }
    },

    closeSetting : function () {
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            GameToWechatGameHelper.hideKeyboard();
        }  
        this.searchEdit.string = "";
        this.myData = null;
        this.sortType = 0;
        this.searchType = 0;
        this.setReadyNodeIsFalse();
        this.setToggleGroupDefaultCheckmark();
    },

    closeMyself : function(){
        this.closeSetting();
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);        
    },

    setToggleGroupDefaultCheckmark : function () {
        cc.find("memberShipBtn", this.navbarNode).getComponent(cc.Toggle).isChecked = true;
    },

    setReadyNodeIsFalse : function () {
        this.navbarNode.active = false;
        this.applyNode.active = false;
        this.manageNode.active = false;
    },

    onClickButton : function (target,customdata) {
        var customData = Number(customdata);
        switch (customData) {
            case 1 : {//返回
                this.closeMyself();
            }
            break;
            case 2 : {//管理记录
                this.onRequestManagementRecord();
            }
            break;
            case 3 : {//申请记录
                this.onClickBtnClubApplyRecord();
            }
            break;
            case 4 : {//入会时间 sortType = 0
                this.setSortTypeAndFresh(0);
            }
            break;
            case 5 : {//最后牌局 sortType = 1
                this.setSortTypeAndFresh(1);
            }
            break;
            case 6 : {//7日牌局 sortType = 2
                this.setSortTypeAndFresh(2);
            }
            break;
            case 7 : {//搜索  sortType = 3
                this.searchType = 1;
                this.freshMemberLayer();
            }
            break;
            case 8 : {//邀请
                this.onIviteJoinClub(this.clubInviteCode);
            }
            break;
            case 9 : {//清除搜索框内容
                this.setToggleGroupDefaultCheckmark();
                this.setSortTypeAndFresh(0);
            }
            break;
        }
    },

    setSortTypeAndFresh : function (type) {
        this.sortType = type;
        this.searchType = 0;
        this.searchEdit.string = "";
        this.freshMemberLayer();
    },

    onRequestManagementRecord:function(start,length){
        var uid   = cc.mj.ownUserData.uid;
        var clubid = cc.gameConfig.clubId
        var data = {"uid":uid,"club_id":clubid};
        if(start){
            data.start=start;
            data.length=10;
        }
        tempClient.getManagementRecord(data,true,this.onRequestgetClubManagementRecord.bind(this));
    },

    onRequestgetClubManagementRecord:function(cbData){
        var myApplyRecord = [];
        for(var i = 0 ; i < cbData.clubLogList.length; ++i){
            var applyRecord = cbData.clubLogList[i];
            myApplyRecord.push(applyRecord);
        }
        //this.applyRecordList = this.applyRecordList.concat(myApplyRecord);
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var clubManagementRecors = ModalLayerMgr.getTop('ClubManagementRecords');
        var clubManagementCpn = clubManagementRecors.getComponent('ClubManagementRecordsCpn');
        ModalLayerMgr.showTop('ClubManagementRecords');
        clubManagementCpn.onSlideToTop();
        clubManagementCpn.init(myApplyRecord);
    },

    onNeedToRequstClubManagementRecord : function(){
        this.onRequestManagementRecord();
    },

    requestClubManagemntsRecord : function(start,length){
        var uid = cc.mj.ownUserData.uid;
        var data = {"club_id":cc.gameConfig.clubId,"uid":uid};
        if(start){
            data.start = start;
        }
        if(length){
            data.length = length;
        }
        tempClient.getManagementRecord(data,true,this.onRequestgetClubManagementRecord.bind(this));
    },

    onNoCheckMessageDataChange : function(){
        this.freshTipsNode();
    },
    onClickBtnClubApplyRecord : function(){
        var uid = cc.mj.ownUserData.uid;
        var data = {"club_id":cc.gameConfig.clubId,"uid":uid};
         tempClient.getClubApplyRecord(data,true,this.onRequestGetClubApplyRecord.bind(this)); 
        },

    onRequestGetClubApplyRecord : function(cbData){
        var applyRecord = [];
        for(var i = 0 ; i < cbData.clubApplyList.length; ++i){
            var applyRecordItem = cbData.clubApplyList[i];
            applyRecord.push(applyRecordItem);
        }
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var userClubLayer = ModalLayerMgr.getTop('ClubApplyRecord');
        var userClubApplyRecor = userClubLayer.getComponent("ClubApplyRecordCpn");
        ModalLayerMgr.showTop('ClubApplyRecord');
        userClubApplyRecor.onSlideToTop();
        userClubApplyRecor.init(applyRecord);

    },

    freshTipsNode : function(){
        if(this.tipsNode ){
            var NoCheckMessageData = require('NoCheckMessageData');
            this.tipsNode.active = cc.gameConfig.clubId ? NoCheckMessageData.value("4",cc.gameConfig.clubId) : false;
        }
    },

    onQuitClubInMemberLayer : function () {
        cc.gameConfig.clubId = null;
        CommonHelper.showMessageBox("提示","你已退出好友圈",function(){
            CommonHelper.getRunSceneModalMgr().closeAllTopByModalType("COMMON");
        },null,false);
    },

    onRequestClubRoomListCb : function(customHttpRequest1){
        this.isRequesting = false;
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            if(cbdata.code == Code.OK){      
                console.log('onRequestClubRoomListCb ' + JSON.stringify(cbdata));
                this.onGetClubRoomListSuc(ProtoUtil.decode(cbdata)); 
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },

    onGetClubRoomListSuc : function(cbData){
        var clubInfo = new ClubInfo(cbData.club);
        if(clubInfo.clubId != cc.gameConfig.clubId){
            return ; //如果网络回调返回时已经切换tab了，则放弃里面的数据
        }
        this.clubInfo = clubInfo;
        this.freshTitle(clubInfo);
        tempClient.getMemberList(cc.gameConfig.clubId, false, this.getClubMemberListCallback.bind(this));
    },

    getClubMemberListCallback : function (customHttpRequest) {
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.getMemberList ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                var decodeData = ProtoUtil.decode(cbdata);
                var code = decodeData.code;
                var err = decodeData.err;
                var memberList = decodeData.memberList;
                this.freshMemberList(memberList);
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },
    onIviteJoinClub:function(inviteCode){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var inviteJoinClubLayer = ModalLayerMgr.getTop('InvitJoinClub');
        var inviteJoinClubRecor = inviteJoinClubLayer.getComponent("ClubInviteJoinCpn");
        ModalLayerMgr.showTop('InvitJoinClub');
        inviteJoinClubRecor.init(this.clubInfo);
    }
});
