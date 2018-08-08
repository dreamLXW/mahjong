var BaseSeatPlayerCardLayerCpn = require('BaseSeatPlayerCardLayerCpn');
var EventName = require('EventName');
cc.Class({
    extends: BaseSeatPlayerCardLayerCpn,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        cc.global.rootNode.on(EventName.OnPlayerMjCardDataChange,this.onPlayerMjCardDataChange,this);
    },

    onDestroy : function(){
        this._super();
        cc.global.rootNode.on(EventName.OnPlayerMjCardDataChange,this.onPlayerMjCardDataChange,this);
    },

    getHandsMahjongCpn : function(side){
        var handsNode = this.getHandsMahjongNode(side);
        return handsNode.getComponent('OnLookerHandsMahjongCpn');
    },

    initHandsMahjongCpn : function(side){
        var handsMahjong = this.getHandsMahjongNode(side);//手牌
        var handsMahjongCpn = handsMahjong.getComponent('OnLookerHandsMahjongCpn');
        
        if(!handsMahjongCpn){
            handsMahjongCpn = handsMahjong.addComponent('OnLookerHandsMahjongCpn');  
        }
        handsMahjongCpn.initSide(side);  
        return handsMahjongCpn;        
    },

    HideSides : function(sideNode,sideName){
        this.hideHandsMahjongBySide(sideNode,sideName);
        
        var outs = sideNode.getChildByName('outs');//打出的牌
        var outsMahjongCpn = outs.getComponent('OutsMahjongCpn');
        if(!outsMahjongCpn){
            outsMahjongCpn = outs.addComponent('OutsMahjongCpn');   
        }
        outsMahjongCpn.setMahjongLayerCpn(this);
        outsMahjongCpn.initSide(sideName);
        outsMahjongCpn.hideAllCards();
        var animationWorldPos = outsMahjongCpn.getAnimationWorldPos();
        var pairNode = sideNode.getChildByName('pair');//碰杠节点
        var pairsMahjongCpn = pairNode.getComponent('PairsMahjongCpn');
                
        if(!pairsMahjongCpn){
            var prefabMap = {'left':this.leftpengGangPrefab,'right':this.rightPengGangPrefab,'myself':this.myselfPengGangPrefab,'up':this.topPengGangPrefab};
            pairsMahjongCpn = pairNode.addComponent('PairsMahjongCpn');  
            pairsMahjongCpn.setPengGangPrefab(prefabMap[sideName]);   
        }   
        pairsMahjongCpn.setAnimationPlayWorldPos(animationWorldPos);
        pairsMahjongCpn.initSide(sideName);
        pairsMahjongCpn.hideAllPairs();
        
        var mj_ma = sideNode.getChildByName('mj_ma');//马牌
        for(var i = 0 ; i < mj_ma.childrenCount; ++i){//mj_zhu
            mj_ma.children[i].active = false;
        }      
    },  

    onPlayerMjCardDataChange : function(event){
        console.log('onPlayerMjCardDataChange');
        var side = event.detail.side;
        var data = event.detail.data;
        if(data.handCardList != undefined || data.handCardList != null){  
            this.myHandCardListInit(side,data.handCardList,data.isSortByGui);        
         }
        //else if(data.handNumber != undefined || data.handNumber != null){
        //     this.otherHandCardListInit(side,data.handNumber);
        // }
        if(data.tempOutCardList != undefined || data.tempOutCardList != null){
            this.getOutsMahjongCpn(side).showOutCards(data.tempOutCardList);
            if(data.tempOutCardList.length > 40){
                var sideMap = {"myself":"right","up":"left"};
                var anotherSide = sideMap[side];
                var leftCardList = data.tempOutCardList.slice(40,data.tempOutCardList.length);
                this.getOutsMahjongCpn(anotherSide).showOutCards(leftCardList);
            }
        }
        if(data.pairList != undefined || data.pairList != null){
            this.getPairMahjongCpn(side).initWithPairList(data.pairList);
        }
        
        this.showMaPai(side,data.getFillMaList());
    },

    myHandCardListInit : function(side,handCardList,isSetGuiComplete){
        var handsMahjong = this.NodeMap[side].getChildByName('handsmahjong');//手牌
        this.commonHandCardListInit(handsMahjong,handCardList,isSetGuiComplete);
    },
});
