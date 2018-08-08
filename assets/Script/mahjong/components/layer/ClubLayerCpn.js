//import { fail } from 'assert';


var tempClient = require('MjRequestSpecificClient');
var CommonHelper = require('CommonHelper');
var ProtoUtil = require("ProtoUtil");
var Code = require('CodeCfg');
var GameToAppHelper = require('GameToAppHelper');
var Player = require('PlayerData');
var MjGameData = require('MjGameData');
var BackStageConfig = require('BackStageConfig');
var NoCheckMessageData = require('NoCheckMessageData');
var ClubInfo  = function(opt){
    this.clubId = opt.clubId;
    this.clubName = opt.clubName;
    this.inviteCode = opt.inviteCode
    this.manager = new Player();
    this.manager.initData(opt.manager);
    this.clubIcon = opt.upfile;
    this.number = opt.number;
    this.maxNumber = opt.maxNumber;
};
var ClubRoom  = function(opt){
    this.rid = opt.rid;
    this.majiangType = opt.majiangType;
    this.playList = [];
    for(var i = 0 ; i < opt.playerList.length; ++i){
        var player = new Player();
        player.initData(opt.playerList[i]);
        this.playList.push(player);
    }
};

cc.Class({
    extends: cc.Component,

    properties: {
        clubNameLabel : {
            type : cc.Label,
            default : null,
        },
        roomListContent : {
            type : cc.Node,
            default : null,
        },
        roomItemPrefab : {
            type : cc.Prefab,
            default : null,
        },
        diamondLabel : {
            type : cc.Label,
            default : null,
        },
        controlNode : {
            type : cc.Node,
            default : null,
        },
        recordNode : {
            type : cc.Node,
            default : null,
        },
        noRoomListTipLabel : {
            type : cc.Label,
            default : null,
        },
        noClubTipLabel : {
            type : cc.Label,
            default : null,
        },
        createRoomBtn : {
            type : cc.Button,
            default : null,
        },
        inviteCodeLabel : {
            type : cc.Label,
            default : null,
        },
        memberBtn : {
            type : cc.Node,
            default : null,
        },
        isRequesting : false,
    },

    // use this for initialization
    onLoad: function () {
        
    },

    onEnable : function(){
        this.isRequesting = false;
        this.setHasClub(false);
        cc.global.rootNode.on('CheckClubIdChange',this.onCheckClubIdChange,this);
        cc.global.rootNode.on("FreshClubList",this.onFreshClubList,this);
        cc.global.rootNode.on("NoCheckMessageDataChange",this.onNoCheckMessageDataChange,this);
        var interval = 5;
        cc.director.getScheduler().schedule(this.onTimeToGetRoomList,this, interval,cc.macro.REPEAT_FOREVER,0,false);
        if(!cc.gameConfig.clubId){
            this.onClickBtnClubList();
        }else{
            this.requestFreshEnterableRoomList(true);
        }
    },

    onClickReturn : function(){
        cc.gameConfig.clubId = null;
        cc.global.rootNode.emit("freshUserMoney");
    },

    onDisable : function(){
        cc.director.getScheduler().unschedule(this.onTimeToGetRoomList,this); 
        cc.global.rootNode.off('CheckClubIdChange',this.onCheckClubIdChange,this);
        cc.global.rootNode.off("FreshClubList",this.onFreshClubList,this);
        cc.global.rootNode.off("NoCheckMessageDataChange",this.onNoCheckMessageDataChange,this);
    },

    onInviteJoinClub : function (rid) {
        tempClient.getClubInfo(rid, true, this.getClubInfoCallback.bind(this));
        console.log("inviteCode NNNNNNN",rid);
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
            console.log('MahjongTempClient.joinClub ' + JSON.stringify(cbdata));
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

    onClickCreateRoom : function(){
        if(cc.gameConfig.clubId){
            var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
            var createRoomNode = ModalLayerMgr.getTop('CreateRoom');
            var createRoomNodeCpn = createRoomNode.getComponent('CreateRoomLayerCpn');
            createRoomNodeCpn.init(true);
            ModalLayerMgr.showTop('CreateRoom');
        }
    },
    //好友圈战绩
    onClickButtonClubRecord : function(){
        if(cc.gameConfig.clubId){
            tempClient.getClubRecord(cc.mj.ownUserData.uid,cc.gameConfig.clubId,0,99,true,this.onRequestClubRecordCb.bind(this));
        }
    },
    onClickButtonClubTerminal : function(){
        if(cc.gameConfig.clubId){
            var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
            var clubTerminalNode = ModalLayerMgr.getTop('ClubTerminal');
            var clubTerminalNodeCpn = clubTerminalNode.getComponent('ClubTerminalCpn');
            clubTerminalNodeCpn.requestClubManagerDiamondRecord(null,null,function(cbData){
                ModalLayerMgr.showTop('ClubTerminal');
                clubTerminalNodeCpn.freshView(cbData);
            })
        }  
    },

    onRequestClubRecordCb : function(cbData){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var vipRecordLayerNode = ModalLayerMgr.getTop('VipRecordLayer');
        var vipRecordLayerCpn = vipRecordLayerNode.getComponent('VipRecordLayerCpn');
        ModalLayerMgr.showTop('VipRecordLayer');
        vipRecordLayerCpn.initTitle("clubrecord");
        vipRecordLayerCpn.init(cbData.historySettleList);
    },

    requestFreshEnterableRoomList : function(isLoading){//isLoading==true时一定要及时请求
        if(cc.gameConfig.clubId && (!this.isRequesting || isLoading == true)){
            isLoading = (isLoading == null || isLoading == undefined) ? false : isLoading;
            this.isRequesting = true;
            tempClient.getClubRoomList(cc.gameConfig.clubId,isLoading,this.onRequestClubRoomListCb.bind(this));
        }        
    },

    onRequestClubRoomListCb : function(customHttpRequest1){
        this.isRequesting = false;
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            if(cbdata.code == Code.OK){      
                console.log('onRequestClubRoomListCb ' + JSON.stringify(cbdata));
                this.onGetClubRoomListSuc(ProtoUtil.decode(cbdata)); 
            }else{
                this.onGetClubRoomListFail();
                if(cbdata.code == Code.CLUB_NOT_AUTH || cbdata.code == Code.CLUB_WAS_NOT_FOUND){
                    cc.gameConfig.clubId = null;
                    var str = cbdata.code == Code.CLUB_NOT_AUTH ? "你已被踢出好友圈" : "该好友圈已被禁用或解散";
                    CommonHelper.showMessageBox("提示",str,function(){
                        CommonHelper.getRunSceneModalMgr().closeAllTopByModalType("COMMON");
                        cc.global.rootNode.emit("FreshClubList");
                    },null,false);
                }else{
                    CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
                }
            }
        }else{  
            this.onGetClubRoomListFail();
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },

    onGetClubRoomListSuc : function(cbData){
        var clubInfo = new ClubInfo(cbData.club);
        if(clubInfo.clubId != cc.gameConfig.clubId){
            return ; //如果网络回调返回时已经切换tab了，则放弃里面的数据
        }
        var roomList = [];
        if(cbData.roomList){
            for(var i = 0 ; i < cbData.roomList.length; ++i){
                var clubRoom = new ClubRoom(cbData.roomList[i]);
                roomList.push(clubRoom);
            }
        }
        this.freshClubInfo(clubInfo);
        this.freshRoomListView(roomList);
        this.freshTipsNode();
        this.clubId = cc.gameConfig.clubId;
    },

    onGetClubRoomListFail : function(){
        cc.gameConfig.clubId = this.clubId;
        cc.global.rootNode.emit('DefaultCheckClubIdChange');
    },

    freshClubInfo : function(clubInfo){
        this.clubNameLabel.node.active = true;
        var clubName = clubInfo.clubName;
        this.clubNameLabel.string = clubName;
        this.inviteCodeLabel.string = "邀请码："+clubInfo.inviteCode;
        const maxWidth = 210;
        if(this.clubNameLabel.node.getContentSize().width > maxWidth){
            clubName = clubName.slice(0,6);
            clubName += ".."
            this.clubNameLabel.string = clubName;
        }
        var managerUid = clubInfo.manager.uid;
        var managerMoney = clubInfo.manager.roomcard;
        var isMeManager = (managerUid == cc.mj.ownUserData.uid);
        this.diamondLabel.node.parent.active = isMeManager;
        this.diamondLabel.string = CommonHelper.getNewNumber(managerMoney);
        this.controlNode.active = isMeManager;
        this.setHasClub(true);
    },

    freshRoomListView : function(roomList){
        var data = [];
        for(var i = 0 ; i < parseInt(Math.ceil(roomList.length / 3)) ; ++i){
            data.push(roomList.slice(i *3,(i+1)*3));
        }
        this.node.getComponent('ListViewCtrl').setData(data);
        this.noRoomListTipLabel.node.active = !(roomList.length > 0);
    },

    onCheckClubIdChange : function(){
        var clubId = cc.gameConfig.clubId;
        this.requestFreshEnterableRoomList(true);
    },

    onClickBtnClubList : function(){
        tempClient.getMyClubList(true,this.onRequestClubListCb.bind(this));
    },

    convertToClubListFromRequestClubListCb : function(cbData){
        var clubList = [];
        for(var i = 0 ; i < cbData.clubList.length; ++i){
            var clubInfo = new ClubInfo(cbData.clubList[i]);
            clubList.push(clubInfo);
        }
        return clubList;
    },

    onRequestClubListCb : function(cbData){
        var clubList = this.convertToClubListFromRequestClubListCb(cbData);
        this.setHasClub(clubList.length > 0)
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var userClubLayer = ModalLayerMgr.getTop('UserClubLayer');
        var userClubLayerCpn = userClubLayer.getComponent('UserClubLayerCpn');
        ModalLayerMgr.showTop('UserClubLayer');
        userClubLayerCpn.init(clubList);
    },

    setHasClub : function(hasClub){
        if(!hasClub){
            this.clubNameLabel.node.active = false;
            this.diamondLabel.node.parent.active = false;
            this.noRoomListTipLabel.node.active = false;
            this.controlNode.active = false;
            this.node.getComponent('ListViewCtrl').setData([]);
            
        }
        this.memberBtn.active = hasClub;
        this.inviteCodeLabel.node.active = hasClub;
        this.noClubTipLabel.node.active = !hasClub;
        this.createRoomBtn.interactable = hasClub;
        this.recordNode.active = hasClub;
    },

    onTimeToGetRoomList : function(){
        this.requestFreshEnterableRoomList();
        tempClient.getClubNoCheckMsgData();
    },

    onFreshClubList : function () {
        this.onClickBtnClubList();
    },

    onClickMemberButton : function () {
        if (cc.gameConfig.clubId != null) {
            var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
            var clubMemberNode = ModalLayerMgr.getTop('ClubMemberLayer');
            var clubMemberNodeCpn = clubMemberNode.getComponent('ClubMemberLayerCpn');
            clubMemberNodeCpn.init(true,this.inviteCode);
            ModalLayerMgr.showTop('ClubMemberLayer');
        } else {
            CommonHelper.showMessageBox("提示",Code.getCodeName(403),function(){},null,false);
        }
    },
    
    onClickRecharge : function(){
        var canvas = cc.find('Canvas');
        if(canvas){
            var LobbyScene = canvas.getComponent('LobbyScene');
            LobbyScene.onShowRechargeLayer(3);
        } 
    },
    onNoCheckMessageDataChange : function(){
        this.freshTipsNode();
        if( NoCheckMessageData.value("5")){
            var onGetClubListCb = function(cbData){
                var clubList = this.convertToClubListFromRequestClubListCb(cbData);
                var clubNameListStr = "";
                    for(var i = 0 ; i < clubList.length; ++i){
                        var clubId = clubList[i].clubId;
                        if(NoCheckMessageData.value("5",clubId)){
                            if(clubNameListStr != ""){
                                clubNameListStr += ',';
                            }
                            clubNameListStr += "【" + clubList[i].clubName + "】";
                        }
                        NoCheckMessageData.check("5",clubId);
                    }
                if(clubNameListStr != ""){
                    var str = "您在好友圈" + clubNameListStr + "的权限发生变动"
                    CommonHelper.showMessageBox("提示",str,function(){
                        cc.global.rootNode.emit("FreshMemberLayer");
                    },null,false);
                }
                NoCheckMessageData.check("5");
            }
            tempClient.getMyClubList(true,onGetClubListCb.bind(this));
        }

    },

    freshTipsNode : function(){
        var tipsNode = this.memberBtn.getChildByName('tips');
        if(tipsNode ){
            tipsNode.active = cc.gameConfig.clubId ? NoCheckMessageData.value("1003",cc.gameConfig.clubId) : false;
        }
    },
});
