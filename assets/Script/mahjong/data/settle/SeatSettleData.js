var PlayerCard = require("PlayerMjCardData");
var SettleData = require('SettleData'); 
var CommonHelper = require('CommonHelper');
var MaPai = function(opt){
    this.card = opt.card;
    this.type = opt.type; //0:不输不赢，1:赢
};
cc.Class({
    extends: cc.Component,

    properties: {
        number : -1,
        playerCardList : {
            default : [],
            type : PlayerCard,
        },
        createTime : -1,
        leftCardList : [],
        settleData : {
            default : null,
            type : SettleData,
        },
        guiPai : -1,
        round : -1,
        bid : -1,
        isLianZhuang : false,
        roomUid : -1,
    },

    // use this for initialization
    onLoad: function () {

    },

    init : function(opt){
        this.isLianZhuang = opt.lianZhuang;
        this.round = opt.round;
        this.guiPai = opt.guiPai;
        this.bid = opt.bid;

        this.number = opt.number || -1;
        this.createTime = opt.createtime;
        this.leftCardList = opt.cardList || [];
        
        this.initSettle(opt.settle);
        this.initPlayerCardList(opt.playerCardList);
        this.roomUid = opt.roomuid;
    },

    initPlayerCardList : function(playerCardList){
        if(!playerCardList){
            return;
        }
        this.playerCardList = [];
        this.myselfUid = cc.mj.ownUserData.uid;
        for(var i = 0 ; i < playerCardList.length; ++i){
            var p = new PlayerCard();
            var data = playerCardList[i];
            p.isSortByGui = true;
            p.initData(data,this);
            this.playerCardList.push(p); 
        }
        var length = this.playerCardList.length;
        var sides = CommonHelper.getSideNameArr("myself",length);
        var playerCardList = [];    // 重新排序，顺序 为 ["myself","right","up","left"];
        var p = this.getPlayerCard(this.myselfUid);
        for (var j = 0 ; j < sides.length; ++j ) {
             console.log(sides[j]);
            p.setSide(sides[j]);
            
            playerCardList.push(p);
            p = this.getNextPlayerCard(p.uid);
        }

        this.playerCardList = playerCardList;
    },

    getNextPlayerCard : function (uid) {//看不懂
        for (var i = 0; i < this.playerCardList.length ; ++i) {
            var p = this.playerCardList[i];
            if (p.uid == uid) {
                if ((i+1) < this.playerCardList.length) {//?
                    return this.playerCardList[i + 1];
                } else {
                    return this.playerCardList[0];
                }
            }
        }
    },

    getPlayerCard : function (uid) {
        console.log('getPlayerCard:'+uid);
        console.log(this);
        for (var i = 0; i < this.playerCardList.length ; ++i) {
            var p = this.playerCardList[i];
            if (p.uid == uid) {
                return p;
            }
        }
        return null;
    },

    initSettle : function(settle){
        if(!settle){
            return;
        }
        this.settleData = new SettleData();
        this.settleData.init(settle);
    },

    getJiangMaData : function(){
        for(var i = 0 ; i < this.playerCardList.length ; ++i){
            var playerCard = this.playerCardList[i];
            if(!(playerCard.jiangMaCardList) == false && playerCard.jiangMaCardList.length != 0 ){
                return playerCard.jiangMaCardList;
            }
        }
        return [];
    },
    
    emitAllSeatSettleMjCardDataChange : function(){
        if(this.round == cc.mj.gameData.seatData.round){
            for (var i = 0; i < this.playerCardList.length ; ++i) {
                var p = this.playerCardList[i];
                p.emitSeatSettleMjCardDataChange();
            }
        }
    }
});
