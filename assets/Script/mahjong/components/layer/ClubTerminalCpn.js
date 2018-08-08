var tempClient = require('MjRequestSpecificClient');
var CommonHelper = require('CommonHelper');
var TimeHelper = require('TimeHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        juShuLabel : {
            type : cc.Label,
            default : null,
        },
        timeRangeLabel : {
            type : cc.Label,
            default : null,
        },
        totalDiamondLabel : {
            type : cc.Label,
            default : null,
        },
        comfirmGameNumLabel : {
            type : cc.Label,
            default : null,
        },
        timeLabel : {
            type : cc.Label,
            default : null,
        },
        unConfirmDiamondLabel : {
            type : cc.Label,
            default : null,
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    onClickBtnChooseTime : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var chooseTimeLayerNode = ModalLayerMgr.getTop('ChooseTimeLayer');
        var chooseTimeLayerNodeCpn = chooseTimeLayerNode.getComponent('ChooseTimeLayerCpn');
        chooseTimeLayerNodeCpn.init(this.requestStartTime,this.requestEndTime);
        ModalLayerMgr.showTop('ChooseTimeLayer');
    },

    freshView : function(opt){
        this.juShuLabel.string = opt.todayGame + "/" + opt.yesterdayGame;
        var startStr = TimeHelper.getFormatTime(this.requestStartTime,"%Y-%M-%D %h:%m");
        var endStr = TimeHelper.getFormatTime(this.requestEndTime,"%Y-%M-%D %h:%m");
        this.timeRangeLabel.string = "<" + startStr + " 至 " + endStr + ">";
        this.totalDiamondLabel.string = opt.comfirmDiamond + opt.withholdDiamond;
        this.comfirmGameNumLabel.string = opt.finishGame;
        this.timeLabel.string = TimeHelper.getFormatTime(this.requestEndTime,"%M-%D %h:%m") + "时";
        this.unConfirmDiamondLabel.string = opt.withholdDiamond;
        console.log("ClubTerminalCpn fresh");
    },

    requestClubManagerDiamondRecord : function(startTime,endTime,cb){
        var today = new Date();
        today.setHours(0,0,0,0);
        startTime = startTime ? startTime : today.getTime();
        endTime = endTime ? endTime : new Date().getTime();
        console.log("startTime : " + startTime + " endtime: " + endTime);
        this.requestStartTime = startTime;
        this.requestEndTime = endTime;
        var isLoading = true;
        tempClient.getClubManagerDiamondRecord(cc.gameConfig.clubId,startTime,endTime,isLoading,cb);
    },

    onRequesClubManagerDiamondRecord : function(cbdata){
        this.freshView(cbdata);
    },

});
