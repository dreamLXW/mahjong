var PlayerCard = require("PlayerMjCardData");
var EventName = require('EventName');
cc.Class({
    extends: cc.Component,

    properties: {
        guiPai : null,             // 鬼牌
        bid : -1,                // 庄家uid
        isLianZhuang : false,    //是否连庄
        playerCardList : {      // 玩家牌列表
            default : [],
            type : PlayerCard,
        },  
        number : 0,         // 当前动作序号，测试用
        round : 1,//当前局数
    },

    // use this for initialization
    onLoad: function () {

    },

    initData : function(opt){
        this.round = opt.round;
        this.guiPai = opt.guiPai;
        this.number = opt.number || -1;
    },

    getNextPlayerCard : function (uid) {
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

    setBanker : function(bid,isLianZhuang,isEmit){
        if(this.bid != bid || this.isLianZhuang != isLianZhuang){
            this.bid = bid;
            this.isLianZhuang = isLianZhuang;
            if(isEmit == undefined || isEmit == true){
                this.emitBankerChange();
            }
        }
    },

    emitGameExtraChange:function(){//剩余牌数，等待动作玩家，剩余局数
        var detail = {'leftMjNum':this.cardNumber,'round':this.round,'nextUid':this.nextUid};
        cc.global.rootNode.emit(EventName.OnGameExtraChange,detail);
    },
});
