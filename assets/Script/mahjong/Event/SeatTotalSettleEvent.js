var RoundPlayerSettle = function(opt){
    this.uid = opt.uid;
    this.moHuNum = opt.moHu;
    this.chiHuNum = opt.chiHu;
    this.dianPaoNum = opt.dianPao;
    this.anGangNum = opt.anGang;
    this.mingGangNum = opt.mingGang;
    this.buGangNum = opt.buGang;
    this.genZhuangNum = opt.genZhuang;
    this.lianZhuangNum = opt.lianZhuang;
    this.maPaiNum = opt.maPai;
    this.totalScore = opt.score;
    this.isMaxScore = false;
    this.dingNo = opt.dingNo;
    this.nickname = opt.nickname;
};

var RoundTotalSettle = function(opt){
    this.round = opt.round;
    this.createTime = opt.createtime;
    var PlayerScore = function(opt){
        this.uid = opt.uid;
        this.huType = opt.huType;
        this.type = opt.type;
        this.totalScore = opt.score;
        this.nickname = opt.nickname;
        
    };
    this.playerScoreList = [];
    for(var i = 0 ; i < opt.scoreList.length ; ++i){
        this.playerScoreList.push(new PlayerScore(opt.scoreList[i]));
    }
};

cc.Class({
    extends: cc.Component,

    properties: {
       EventName : 'SeatTotalSettleEvent',
       roundPlayerSettleList : {
            type : RoundPlayerSettle,
            default : [],
       },
       roundTotalSettleList : {
           type : RoundTotalSettle,
           default : [],
       },
       rid : -1,
       isMeIn : false,
    },

    init : function(opt){
        this.isMeIn = false;
        this.initRoundPlayerSettleList(opt.playerSettleList);
        this.initRoundTotalSettleList(opt.roundList);
        this.rid = opt.rid;
    },

    initRoundPlayerSettleList : function(playerSettleList){
        var index = 0;
        var maxNum = 0;
        for(var i = 0 ; i < playerSettleList.length ; ++i){
            this.roundPlayerSettleList.push(new RoundPlayerSettle(playerSettleList[i]));
            if(Number(playerSettleList[i].score) > maxNum  || (Number(playerSettleList[i].score) == maxNum && playerSettleList[i].position < playerSettleList[index].position)){
                index = i;
                maxNum = Number(playerSettleList[i].score);
            }
            if(playerSettleList[i].uid == cc.mj.ownUserData.uid){
                this.isMeIn = true;
            }
        }
        this.roundPlayerSettleList[index].isMaxScore = true;
    },

    initRoundTotalSettleList : function(roundList){
        for(var i = 0 ; i < roundList.length ; ++i){
            this.roundTotalSettleList.push(new RoundTotalSettle(roundList[i]));
        }
    }
});
