var EventName = require('EventName');
var CommonHelper = require('CommonHelper');
var BaseSeatPlayerCardLayerCpn = require('BaseSeatPlayerCardLayerCpn');
cc.Class({
    extends: BaseSeatPlayerCardLayerCpn,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        cc.global.rootNode.on(EventName.OnPlayerMjCardDataChange,this.onPlayerMjCardDataChange,this);
        cc.global.rootNode.on(EventName.OnSeatSettleMjCardDataChange,this.onSeatSettleMjCardDataChange,this);
    },

    onDestroy : function(){
        this._super();
        cc.global.rootNode.off(EventName.OnPlayerMjCardDataChange,this.onPlayerMjCardDataChange,this);
        cc.global.rootNode.off(EventName.OnSeatSettleMjCardDataChange,this.onSeatSettleMjCardDataChange,this);
    },



    initHandsMahjongCpn : function(side){
        var handsMahjong = this.getHandsMahjongNode(side);//手牌
        var handsMahjongCpn = handsMahjong.getComponent('HandsMahjongCpn');
        
        if(!handsMahjongCpn){
            handsMahjongCpn = handsMahjong.addComponent('HandsMahjongCpn');  
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

        this.hideSettleHandsMahjongBySide(sideNode,sideName);
    },  

    hideSettleHandsMahjongBySide : function(sideNode,sideName){
        var settlehandsMahjong = sideNode.getChildByName('handsmahjong1');//结算手牌
        var settlehandsMahjongCpn = settlehandsMahjong.getComponent('OnLookerHandsMahjongCpn');
        
        if(!settlehandsMahjongCpn){
            settlehandsMahjongCpn = settlehandsMahjong.addComponent('OnLookerHandsMahjongCpn');  
        }
        settlehandsMahjongCpn.initSide(sideName);
        settlehandsMahjongCpn.hideAllCards();
    },

    onPlayerMjCardDataChange : function(event){
        console.log('onPlayerMjCardDataChange');
        var side = event.detail.side;
        var data = event.detail.data;
        //var isLastOutCardUid = event.detail.data.isLastOutCardUid;
        console.log(data);
        if(data.handCardList != undefined || data.handCardList != null){  
            console.log('myHandCardListInit:'+data.handCardList);
            this.myHandCardListInit(side,data.handCardList,data.isSortByGui);        
        }else if(data.handNumber != undefined || data.handNumber != null){
            console.log('otherHandCardListInit');
            this.otherHandCardListInit(side,data.handNumber);
        }
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
        // if(isLastOutCardUid == true){
        //     this.setLastOutCardSide(side);
        // }
    },

    onSeatSettleMjCardDataChange : function(event){
        var side = event.detail.side;
        var data = event.detail.data;
        if(data.handCardList != undefined || data.handCardList != null){
            this.onlookerHandCardListInit(side,data.handCardList,data.isSortByGui); 
            this.hideHandsMahjongBySide(this.NodeMap[side],side);
        }
        this.showMaPai(side,data.maiMaList);
    },

    myHandCardListInit : function(side,handCardList,isSetGuiComplete){
        var handsMahjong = this.NodeMap[side].getChildByName('handsmahjong');//手牌
        this.commonHandCardListInit(handsMahjong,handCardList,isSetGuiComplete);
    },

    onlookerHandCardListInit : function(side,handCardList,isSetGuiComplete){
        var handsMahjong = this.NodeMap[side].getChildByName('handsmahjong1');//结算手牌
        this.commonHandCardListInit(handsMahjong,handCardList,isSetGuiComplete);
    },

    otherHandCardListInit(side,number){
        var handsMahjong = this.NodeMap[side].getChildByName('handsmahjong');//手牌
        var handsMahjongCpn = handsMahjong.getComponent('HandsMahjongCpn');
        handsMahjongCpn.showHandsByNumber(number);
    },

    onEnable : function(){
        cc.global.rootNode.on('CanvasTouchStart',this.onTouchStart,this);
        cc.global.rootNode.on('CanvasTouchMove',this.onTouchMove,this);
        cc.global.rootNode.on('CanvasTouchEnd',this.onTouchEnd,this);
        cc.global.rootNode.on('CanvasTouchCancel',this.onTouchCancel,this);
    },

    onDisable : function(){
        cc.global.rootNode.off('CanvasTouchStart',this.onTouchStart,this);
        cc.global.rootNode.off('CanvasTouchMove',this.onTouchMove,this);
        cc.global.rootNode.off('CanvasTouchEnd',this.onTouchEnd,this);
        cc.global.rootNode.off('CanvasTouchCancel',this.onTouchCancel,this);
    },

    onTouchStart : function(canvasTouch){
        var myHandsMahjongCpn = this.getHandsMahjongCpn('myself');
        if(myHandsMahjongCpn){
            var touch = canvasTouch.detail;
            myHandsMahjongCpn.onTouchStart(touch);
        }
    },

    onTouchMove : function(canvasTouch){
        var myHandsMahjongCpn = this.getHandsMahjongCpn('myself');
        if(myHandsMahjongCpn){
            var touch = canvasTouch.detail;
            myHandsMahjongCpn.onTouchMove(touch);
        }
    },

    onTouchEnd : function(canvasTouch){
        var myHandsMahjongCpn = this.getHandsMahjongCpn('myself');
        if(myHandsMahjongCpn){
            var touch = canvasTouch.detail;
            myHandsMahjongCpn.onTouchEnd(touch);
        }
    },

    onTouchCancel : function(canvasTouch){
        var myHandsMahjongCpn = this.getHandsMahjongCpn('myself');
        if(myHandsMahjongCpn){
            var touch = canvasTouch.detail;
            myHandsMahjongCpn.onTouchCancel(touch);
        }
    },
});
