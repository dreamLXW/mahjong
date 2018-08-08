var Pair = require('PairData');
var OutCard = require('OutCard');
var PairCfg = require('PairCfg');
cc.Class({
    extends: cc.Component,

    properties: {
        EventName : 'SeatActionEvent',
        uid : cc.Integer,
        type : cc.Integer,
        cardList : [],
        number : cc.Integer,
        nextUid : cc.Integer,
        fromUid : cc.Integer,
    },

    init : function(opt){
        this.uid = opt.uid;
        this.type = opt.type;
        this.cardList = opt.cardList;
        this.number = opt.number;
        this.nextUid = opt.nextUid;
        this.fromUid = opt.fromuid;
    },

    newPairData : function(){
        if(this.type != PairCfg.CHI && this.type != PairCfg.PENG &&this.type != PairCfg.BU_GANG &&this.type != PairCfg.MING_GANG &&this.type != PairCfg.AN_GANG){
            console.log('newPairData错误的函数调用');
        }else{
            var opt = {'cardList':this.cardList,'type':this.type,'fromuid':this.fromUid,'number':this.number,'uid':this.uid};
            var pair = new Pair(opt);
            return pair; 
        }
        return null;
    },

    newOutCard : function(){
        if(this.type != PairCfg.CHU_PAI){
            console.log('newOutCard错误的函数调用');
        }else{
            var opt = {'card':this.cardList[0],'type':this.type};
            var outCard = new OutCard(opt);
            return outCard; 
        }
        return null;
    },

    isHaveFromUid : function(){
        return (this.type == PairCfg.PENG || this.type == PairCfg.MING_GANG || this.type == PairCfg.BU_GANG);
    }

});
