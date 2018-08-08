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
    init : function(applyRecordList){
        this.applyRecordList = applyRecordList;
        this.freshClubList(applyRecordList);
        if(cc.gameConfig.clubId){
            NoCheckMessageData.check("4" ,cc.gameConfig.clubId);
            NoCheckMessageData.emitChange();
        }
    },

    onSrollViewBounceTop : function(){
        console.log("onSrollViewBounceTop");
        cc.global.rootNode.emit('NeedToRequstClubApplyRecord');
    },

    onSrollViewBounceBottom : function(){
        console.log("onSrollViewBounceBottom");
        if(this.lastApplyId >= 0){
            this.requestClubApplyRecord(this.lastApplyId);
            console.log("申请记录",this.lastApplyId);
        }
    },
    requestClubApplyRecord : function(start){
        var uid = cc.mj.ownUserData.uid;
        var data = {"club_id":cc.gameConfig.clubId,"uid":uid};
        if(start){
            data.start = start;
            data.length = 5;
        }
        tempClient.getClubApplyRecord(data,true,this.onRequestgetClubApplyRecord.bind(this));
    },

    onRequestgetClubApplyRecord : function(cbData){
        var myApplyRecord = [];
        for(var i = 0 ; i < cbData.clubApplyList.length; ++i){
            var applyRecord = cbData.clubApplyList[i];
            myApplyRecord.push(applyRecord);
        }
        this.applyRecordList = this.applyRecordList.concat(myApplyRecord);
        this.init(this.applyRecordList);
    },
    onSlideToTop :function(){
        //this.scrollViewNode.getComponent(cc.ScrollView).scrollToTop(1);
        this.node.getComponent('ListViewCtrl').reset();
    },
    freshClubList : function(applyList){
        if (applyList && applyList.length>0){
            this.messageTxt.node.active=false;
            this.lastApplyId = applyList[applyList.length - 1].id;
        }else{
            this.messageTxt.node.active=true;
            this.lastApplyId = -1;
        }
        this.node.getComponent('ListViewCtrl').setData(applyList);
    },
});
