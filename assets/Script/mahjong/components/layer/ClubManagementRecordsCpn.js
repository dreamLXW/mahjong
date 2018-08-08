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
    this.freshManagementRecordList(applyRecordList);
},

onSrollViewBounceTop : function(){
    console.log("onSrollViewBounceTop");
    cc.global.rootNode.emit('NeedToRequstClubManagementRecord');
},

onSrollViewBounceBottom : function(){
    console.log("onSrollViewBounceBottom");
    if(this.lastApplyId >= 0){
        this.requestClubManagementRecord(this.lastApplyId);
        console.log("管理记录",this.lastApplyId);
    }
},
requestClubManagementRecord : function(start){
    var uid = cc.mj.ownUserData.uid;
    var data = {"uid":uid,"club_id":cc.gameConfig.clubId};
    if(start){
        data.start = start;
        data.lenght = 5;
    }
    tempClient.getManagementRecord(data,true,this.onRequestgetClubManagementRecord.bind(this));
},

onRequestgetClubManagementRecord : function(cbData){
    var managementRecord = [];
    for(var i = 0 ; i < cbData.clubLogList.length; ++i){
        var mangeRecord = cbData.clubLogList[i];
        managementRecord.push(mangeRecord);
    }
    this.applyRecordList = this.applyRecordList.concat(managementRecord);
    this.init(this.applyRecordList);
},
onSlideToTop :function(){
    //this.scrollViewNode.getComponent(cc.ScrollView).scrollToTop(1);
    this.node.getComponent('ListViewCtrl').reset();
},

freshManagementRecordList : function(applyList){
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
