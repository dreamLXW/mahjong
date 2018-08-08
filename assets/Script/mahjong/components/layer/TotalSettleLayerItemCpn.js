var OnlineLoadData = require('OnlineLoadData');
var CommonHelper = require('CommonHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        userNameLabel : {
            type : cc.Label,
            default : null,
        },
        userIdLabel : {
            type : cc.Label,
            default : null
        },
        scoreLabel : {
            type : cc.Label,
            default : null
        },
        headSp : {
            type : cc.Sprite,
            default : null,
        },
        itemLabelArr : {
            type : cc.Label,
            default : [],
        },
        groupCtrl : {
            type : cc.Node,
            default : null,
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    init : function(roundPlayerSettle){
        var uid = roundPlayerSettle.uid;
        var playerData = cc.mj.gameData.getPlayerData(uid);
        this.userNameLabel.string = playerData.getDisplayName();
        this.userIdLabel.string = playerData.getDisplayId();
        var url = playerData.url;

        this.node.getComponent('OnlineLoadData').getSpriteByUrl(url);

        this.scoreLabel.string = CommonHelper.numberToString(roundPlayerSettle.totalScore);

        var arr = [roundPlayerSettle.moHuNum,roundPlayerSettle.chiHuNum,roundPlayerSettle.dianPaoNum,roundPlayerSettle.anGangNum,
                   roundPlayerSettle.mingGangNum,roundPlayerSettle.buGangNum,roundPlayerSettle.genZhuangNum,roundPlayerSettle.lianZhuangNum,
                   roundPlayerSettle.maPaiNum];
        for(var i = 0 ; i < this.itemLabelArr.length; ++i){
            this.itemLabelArr[i].string = arr[i];
        }
        this.groupCtrl.active = false;
        this.setIsMaxScorePlayer(roundPlayerSettle.isMaxScore);
    },

    setIsMaxScorePlayer : function(isMaxScorePlayer){
        this.groupCtrl.active = isMaxScorePlayer && cc.mj.gameData.roomInfo.roomConfig.isSetGroupCtl();
        if(this.groupCtrl.active){
            this.groupCtrl.getChildByName('scorelabel').getComponent(cc.Label).string = cc.mj.gameData.roomInfo.roomConfig.groupCtrlNum;
        }
    },

    setVisible : function(isVisible){
        this.node.active = isVisible;
    }

});
