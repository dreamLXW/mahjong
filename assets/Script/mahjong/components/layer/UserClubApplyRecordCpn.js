var tempClient = require('MjRequestSpecificClient');
var CommonHelper = require('CommonHelper');
var ProtoUtil = require("ProtoUtil");
var Code = require('CodeCfg');
var GameToAppHelper = require('GameToAppHelper');
var Player = require('PlayerData');
var MjGameData = require('MjGameData');
var BackStageConfig = require('BackStageConfig');
var NoCheckMessageData = require('NoCheckMessageData');
cc.Class({
    extends: cc.Component,
    properties: {
        messageTxt :{
            default:null,
            type:cc.Label,
        },
        scrollViewNode : {
            default:null,
            type:cc.Node,
        },
    },

   // use this for initialization
   onLoad: function () {

    },

    onEnable : function(){
        this.node.getComponent('ListViewCtrl').setData([]);
        this.scrollViewNode.on("bounce-top",this.onSrollViewBounceTop,this);
        this.scrollViewNode.on("bounce-bottom",this.onSrollViewBounceBottom,this);
    },

    onDisable : function(){
        cc.global.rootNode.off('DefaultCheckClubIdChange',this.onDefaultCheckClubIdChange,this);
    },

    onSrollViewBounceTop : function(){
        console.log("onSrollViewBounceTop");
        cc.global.rootNode.emit('NeedToRequstMyApplyRecord');
    },

    onSrollViewBounceBottom : function(){
        console.log("onSrollViewBounceBottom");
        if(this.lastApplyId >= 0){
            // cc.global.rootNode.emit('NeedToRequstMyApplyRecord',this.lastApplyId);
            this.requestMyClubApplyRecord(this.lastApplyId);
        }
    },

    requestMyClubApplyRecord : function(start,length){
        var uid = cc.mj.ownUserData.uid;
        var data = {"uid":uid};
        if(start){
            data.start = start;
            data.length = 5;
        }
        tempClient.getMyClubApplyRecord(data,true,this.onRequestgetMyApplyRecord.bind(this));
    },

    onRequestgetMyApplyRecord : function(cbData){
        var myApplyRecord = [];
        for(var i = 0 ; i < cbData.applyList.length; ++i){
            var applyRecord = cbData.applyList[i];
            myApplyRecord.push(applyRecord);
        }
        this.applyRecordList = this.applyRecordList.concat(myApplyRecord);
        this.init(this.applyRecordList);
    },

    init : function(applyRecordList){
        this.applyRecordList = applyRecordList;
        this.freshClubList(applyRecordList);
        if (applyRecordList && applyRecordList.length>0){
            this.messageTxt.node.active=false;
        }else{
            this.messageTxt.node.active=true;
        }
        NoCheckMessageData.check("1001");
        NoCheckMessageData.emitChange();
    },
    onSlideToTop :function(){
        //this.scrollViewNode.getComponent(cc.ScrollView).scrollToTop(1);
        this.node.getComponent('ListViewCtrl').reset();
    },
    freshClubList : function(applyList){
        if (applyList && applyList.length>0){
            this.messageTxt.node.active=false;
        }else{
            this.messageTxt.node.active=true;
        }
        this.node.getComponent('ListViewCtrl').setData(applyList);
        if(applyList && applyList.length > 0){
            this.lastApplyId = applyList[applyList.length - 1].id;
        }else{
            this.lastApplyId = -1;
        }
    },

    onClubToggleChange : function(target,customEventData){
        var index = Number(customEventData);
        var club = this.clubList[index];
        var clubId = club.clubId;
        cc.gameConfig.clubId = clubId;
        cc.global.rootNode.emit('CheckClubIdChange');
        this.checkToggle(clubId);
    },

    checkToggle : function(clubId){
        for(var i = 0 ; i < this.clubListContent.childrenCount; ++i){
            var userClubItemCpn = this.clubListContent.children[i].getComponent('UserClubItemCpn');
            userClubItemCpn.setToggleTrueIfClubId(clubId);
        }
    },
});
