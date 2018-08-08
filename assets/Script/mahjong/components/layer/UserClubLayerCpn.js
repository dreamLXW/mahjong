var tempClient = require('MjRequestSpecificClient');
var CommonHelper = require('CommonHelper');
var ProtoUtil = require("ProtoUtil");
var Code = require('CodeCfg');
var GameToAppHelper = require('GameToAppHelper');
var Player = require('PlayerData');
var MjGameData = require('MjGameData');
var BackStageConfig = require('BackStageConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        toggleGroup : {
            type : cc.ToggleGroup,
            default : null,
        },

        clubListContent : {
            type : cc.Node,
            default : null,
        },

        clubListScrollView : {
            type : cc.ScrollView,
            default : null,
        },

        clubItemPrefab : {
            default : null,
            type : cc.Prefab,
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
        cc.global.rootNode.on('DefaultCheckClubIdChange',this.onDefaultCheckClubIdChange,this);
        cc.global.rootNode.on('NeedToRequstMyApplyRecord',this.onNeedToRequstMyApplyRecord,this);
        cc.global.rootNode.on("NoCheckMessageDataChange",this.onNoCheckMessageDataChange,this);
    },

    onDisable : function(){
        cc.global.rootNode.off('DefaultCheckClubIdChange',this.onDefaultCheckClubIdChange,this);
        cc.global.rootNode.off('NeedToRequstMyApplyRecord',this.onNeedToRequstMyApplyRecord,this);
        cc.global.rootNode.off("NoCheckMessageDataChange",this.onNoCheckMessageDataChange,this);
    },

    onDefaultCheckClubIdChange : function(){
        this.checkToggle(cc.gameConfig.clubId);
    },

    init : function(clubList){
        this.clubList = clubList;
        this.freshClubList(clubList);
        this.freshTipsNode();
        if(!cc.gameConfig.clubId && this.clubList.length > 0){
            var clubId = this.clubList[0].clubId;
            this.checkToggle(clubId);
            this.onClubToggleChange(null,0);
            this.clubListScrollView.scrollToTop(0);
        }
    },

    freshClubList : function(clubList){
        this.clubListContent.removeAllChildren();
        for(var i = 0 ; i < clubList.length ; ++i){
            var clubItem = cc.instantiate(this.clubItemPrefab);
            this.clubListContent.addChild(clubItem);
            clubItem.getComponent('UserClubItemCpn').setToggleGroup(this.toggleGroup);
            var toogleEvent = new cc.Component.EventHandler();
            toogleEvent.target = this.node;
            toogleEvent.component = "UserClubLayerCpn";
            toogleEvent.handler = "onClubToggleChange";
            toogleEvent.customEventData = i;
            clubItem.getComponent('UserClubItemCpn').setToggleEvent(toogleEvent);
            clubItem.getComponent('UserClubItemCpn').init(clubList[i]);
        }
        this.checkToggle(cc.gameConfig.clubId);
    },

    onClubToggleChange : function(target,customEventData){
        var index = Number(customEventData);
        var club = this.clubList[index];
        var clubId = club.clubId;
        cc.gameConfig.clubId = clubId;
        cc.global.rootNode.emit('CheckClubIdChange');
        var toggleNode = this.checkToggle(clubId);
        // this.scrollToItem(toggleNode);
    },

    checkToggle : function(clubId){
        var toggle = null;
        for(var i = 0 ; i < this.clubListContent.childrenCount; ++i){
            var userClubItemCpn = this.clubListContent.children[i].getComponent('UserClubItemCpn');
            userClubItemCpn.setToggleTrueIfClubId(clubId);
            // if(userClubItemCpn.isChecked()){
            //     toggle = this.clubListContent.children[i];
            // }
        }
        return toggle;
    },

    onClickBtnMyAppRec : function(){
        this.requestMyClubApplyRecord();
    },

    onNeedToRequstMyApplyRecord : function(event){
        var applyId = event.detail;
        console.log("要请求的applyId= "+applyId);
        this.requestMyClubApplyRecord(applyId);
    },

    requestMyClubApplyRecord : function(start,length){
        var uid = cc.mj.ownUserData.uid;
        var data = {"uid":uid};
        if(start){
            data.start = start;
        }
        if(length){
            data.length = length;
        }
        tempClient.getMyClubApplyRecord(data,true,this.onRequestgetMyApplyRecord.bind(this));
    },

    onRequestgetMyApplyRecord : function(cbData){
        var myApplyRecord = [];
        for(var i = 0 ; i < cbData.applyList.length; ++i){
            var applyRecord = cbData.applyList[i];
            myApplyRecord.push(applyRecord);
        }
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var userClubLayer = ModalLayerMgr.getTop('UserClubApplyRecord');
        var userClubApplyRecor = userClubLayer.getComponent("UserClubApplyRecordCpn");
        ModalLayerMgr.showTop('UserClubApplyRecord');
        userClubApplyRecor.onSlideToTop();
        userClubApplyRecor.init(myApplyRecord)
    },

    onClickClubButton : function (target,customdata) {
        var customData = Number(customdata);
        switch (customData) {
            case 1 : {//创建
                var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
                var createClubNode = ModalLayerMgr.getTop('CreateClubLayer');
                var createClubNodeCpn = createClubNode.getComponent('CreateClubLayerCpn');
                createClubNodeCpn.init(true);
                ModalLayerMgr.showTop('CreateClubLayer');
            }
            break;
            case 2 : {//加入
                var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
                var joinClubNode = ModalLayerMgr.getTop('JoinClubLayer');
                var joinClubNodeCpn = joinClubNode.getComponent('JoinClubLayerCpn');
                joinClubNodeCpn.init(true);
                ModalLayerMgr.showTop('JoinClubLayer');
            }
            break;
        }
    },

    onNoCheckMessageDataChange : function(){
        this.freshTipsNode();
    },

    freshTipsNode : function(){
        if(this.tipsNode){
            var NoCheckMessageData = require('NoCheckMessageData');
            this.tipsNode.active = NoCheckMessageData.value("1001");
        }
    },

    scrollToItem : function(item){
        // if(item){
        //     this.clubListScrollView.scrollToOffset(item.y);
        // }
    },
});
