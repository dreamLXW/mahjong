var EventName = require('EventName');
var CommonHelper = require('CommonHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        leftNode : {
            default : null,
            type : cc.Node,
       },
       rightNode : {
            default : null,
            type : cc.Node,
       },
       myselfNode :{
            default : null,
            type : cc.Node,
       },
       topNode :{
            default : null,
            type : cc.Node,
       },
        myselfPengGangPrefab : {
            type : cc.Prefab,
            default : [],
        },
        rightPengGangPrefab : {
            type : cc.Prefab,
            default : [],
        },
        topPengGangPrefab : {
            type : cc.Prefab,
            default : [],
        },
        leftpengGangPrefab : {
            type : cc.Prefab,
            default : [],
        },
    },

    onLoad: function () {
        cc.global.rootNode.on(EventName.OnChuPaiAction,this.onChuPai,this);
        cc.global.rootNode.on(EventName.OnMoPaiAction,this.onMoPai,this);
        cc.global.rootNode.on(EventName.OnPengGangPaiAction,this.onPengGangPaiAction,this);
        cc.global.rootNode.on(EventName.OnLastOutCardSideChange,this.onLastOutCardSideChange,this);
    },

    onDestroy : function(){
        cc.global.rootNode.off(EventName.OnChuPaiAction,this.onChuPai,this);
        cc.global.rootNode.off(EventName.OnMoPaiAction,this.onMoPai,this);
        cc.global.rootNode.off(EventName.OnPengGangPaiAction,this.onPengGangPaiAction,this);
        cc.global.rootNode.off(EventName.OnLastOutCardSideChange,this.onLastOutCardSideChange,this);
    },

    hideAllSides : function(){//隐藏牌桌
        this.NodeMap = {'left':this.leftNode,'right':this.rightNode,'myself':this.myselfNode,'up':this.topNode};
        for(var i in this.NodeMap){
            this.HideSides(this.NodeMap[i],i);
        }
    },

    hideAllSettleHandsMahjong : function(){
        this.NodeMap = {'left':this.leftNode,'right':this.rightNode,'myself':this.myselfNode,'up':this.topNode};
        for(var i in this.NodeMap){
            this.hideSettleHandsMahjongBySide(this.NodeMap[i],i);
        }
    },

    hideHandsMahjongBySide : function(sideNode,sideName){
        var handsMahjongCpn = this.initHandsMahjongCpn(sideName);
        handsMahjongCpn.hideAllCards();
    },

    getHandsMahjongNode : function(side){
        return this.NodeMap[side].getChildByName('handsmahjong');
    },

    getHandsMahjongCpn : function(side){
        var handsNode = this.getHandsMahjongNode(side);
        return handsNode.getComponent('BaseHandsMahjongCpn');
    },

    initHandsMahjongCpn : function(side){

    },

    getOutsNode : function(side){
        console.log('side'+side);
        console.log(this.NodeMap);
        var outs = this.NodeMap[side].getChildByName('outs');//打出的牌
        //var mj_zhuo = outs.getChildByName('mj_zhuo');
        return outs;
    },

    getOutsMahjongCpn : function(side){
        return this.getOutsNode(side).getComponent('OutsMahjongCpn');
    },

    getPairNode : function(side){
        var pairNode = this.NodeMap[side].getChildByName('pair');
        return pairNode;
    },

    getPairMahjongCpn : function(side){
        return this.getPairNode(side).getComponent('PairsMahjongCpn');
    },

    getMaNode : function(side){
        var mj_ma = this.NodeMap[side].getChildByName('mj_ma');//马牌
        return mj_ma;
    },

    showMaPai : function(side,maPaiList){
        var maNode = this.getMaNode(side);
        var maLength = maPaiList.length;
        for(var i = 0 ; i < maNode.childrenCount; ++i){//mj_zhu
            var mj_zhu = maNode.children[i];
            var commonMjCardCpn = mj_zhu.getChildByName('mahjong').getComponent('CommonMjCardCpn');
            var mj_bg = mj_zhu.getChildByName('mj_bg');
             mj_zhu.active = false;
             if(i < maLength){
                mj_zhu.active = true;
                var maPai = maPaiList[i];
                if(Number(maPai.card) > 0 ){
                    mj_bg.active = false;
                    commonMjCardCpn.setVisible(true);
                    commonMjCardCpn.setMahjongData(maPai.card);
                    commonMjCardCpn.showLightBorder(maPai.type);
                }else{
                    mj_bg.active = true;
                    commonMjCardCpn.setVisible(false);
                }
             }
        }
    },

    setLastOutCardSide:function(side){
        console.log('side:'+side);
        var sideNames = CommonHelper.getSideNameArr("myself",4);
        for(var i = 0 ; i < sideNames.length ; ++i){
            console.log('sideNames[i] == side:'+(sideNames[i] == side));
            this.getOutsMahjongCpn(sideNames[i]).setIsLastOut((sideNames[i] == side));
        }
    },

    onLastOutCardSideChange : function(event){//
        var side = event.detail;
        this.setLastOutCardSide(side);
    },

    onChuPai : function(event){
        var side = event.detail.side;
        var seatActionEvent = event.detail.data.data;
        var chuCard = seatActionEvent.cardList[0];
        var handCardList = event.detail.data.handCardList;
        var handNumber = event.detail.data.handNumber;
        var outCardNumber = event.detail.data.outCardNumber;
        var sex = event.sex;
        var handsMahjongCpn = this.getHandsMahjongCpn(side);
        var outsMahjongCpn = null;
        handsMahjongCpn.onChuPaiAction(chuCard,handCardList,handNumber);
        if(outCardNumber <= 40){
            outsMahjongCpn = this.getOutsMahjongCpn(side);
        }else{
            var sideMap = {"myself":"right","up":"left"};
            var anotherSide = sideMap[side];
            outsMahjongCpn = this.getOutsMahjongCpn(anotherSide);
        }
        outsMahjongCpn.onChuPaiAction(seatActionEvent);
    },

    onMoPai : function(event){
        var side = event.detail.side;
        var handCardList = event.detail.data.handCardList;
        var handNumber = event.detail.data.handNumber;
        var handsMahjongCpn = this.getHandsMahjongCpn(side);
        handsMahjongCpn.onMoPaiAction(handCardList,handNumber);
    },

    onPengGangPaiAction : function(event){
        var side = event.detail.side;
        var seatActionEvent = event.detail.data;
        var pairMahjongCpn = this.getPairMahjongCpn(side);
        pairMahjongCpn.onCreatePengGangAction(seatActionEvent);
    },

    onPlayerMjCardDataChange : function(event){
    },

    commonHandCardListInit(handsMahjongNode,handCardList,isSetGuiComplete){
        var handsMahjongCpn = handsMahjongNode.getComponent('BaseHandsMahjongCpn');
        handsMahjongCpn.showHandsByData(handCardList);
        console.log('isSetGuiComplete:'+isSetGuiComplete + ' guiPai:' + cc.mj.gameData.seatData.guiPai);
        if(isSetGuiComplete){
            handsMahjongCpn.setGuiPaiComplete(cc.mj.gameData.seatData.guiPai);
        }else{
            handsMahjongCpn.setGuiPaiComplete(null);
        }
    },
});
