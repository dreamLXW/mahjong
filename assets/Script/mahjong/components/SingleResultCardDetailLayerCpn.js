var HuTypeCfg = require('HuTypeCfg');
cc.Class({
    extends: cc.Component,

    properties: {
        ItemParentArr : {
            type : cc.Node,
            default : [],
        },
        leftCardGroup : {
            type : cc.Node,
            default : null,
        },
        commonMahjongPrefab : {
            type : cc.Prefab,
            default : null,
        },
        singleResultCardDetailItemPrefab : {
            type : cc.Prefab,
            default : null,
        },
        leftCardRootNode : {
            type : cc.Node,
            default : null,
        },
        scrollView : {
            type : cc.ScrollView,
            default : null,
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    init : function(seatSettleData,playerDataMgr){
        this.scrollView.scrollToTop(0);
        var playerCardList = [].concat(seatSettleData.playerCardList);
        var leftCardList = seatSettleData.leftCardList;
        var guiPai = seatSettleData.guiPai;
        var huTypeList = seatSettleData.settleData.getHasCardHuTypes();
        this.addHuPaiInPlayerCardList(playerCardList,huTypeList);
        this.checkItemArr();
        for(var i = 0 ; i < 4; ++i){
            if(i >= playerCardList.length){
                this.initSingleResultCardItem(i,null,null,null);
            }else{
                this.initSingleResultCardItem(i,playerDataMgr.getPlayerDataById(playerCardList[i].uid),playerCardList[i],guiPai);
            }
        }
        if(playerCardList.length < 4){
            this.scrollView.enabled = false;
            this.leftCardRootNode.y = -453;
            
        }else{
            this.scrollView.enabled = true;
            this.leftCardRootNode.y = -570.4;
        }
        this.leftCardGroup.active = false;
        var self = this;
        this.node.runAction(cc.sequence(cc.delayTime(0.6),cc.callFunc(function(){
            self.initLeftCardGroup(seatSettleData);
        })));
        //this.initLeftCardGroup(leftCardList);
    },

    addHuPaiInPlayerCardList : function(playerCardList,huTypeList){
        if(huTypeList.length == 0){
            return;
        }
        var uid = (huTypeList.length == 1)?huTypeList[0].uid : huTypeList[0].influenceUid[0];
        var huType = huTypeList[0].type;
        var huCard = huTypeList[0].huCard;
        if(!HuTypeCfg.isZiMo(huType)){//如果不是自摸则将胡的那张牌加入playerCard
            for(var i = 0 ; i < playerCardList.length; ++i){
                if(playerCardList[i].uid == uid){
                    var playerMjCardData = playerCardList[i];
                    if(!(playerMjCardData.handCardList.length % 3 == 2)){
                        playerMjCardData.addHandCard(huCard);
                    } 
                    break;
                }
            }
        }
    },

    initSingleResultCardItem : function(index,playerData,playerCard,guiPai){
        var singleResultCardDetailItem = this.ItemParentArr[index].children[0];
        if(!singleResultCardDetailItem){
            console.log('找不到singleResultCardDetailItem');
            return;
        }
        var singleResultCardDetailItemCpn = singleResultCardDetailItem.getComponent('SingleResultCardDetailItemCpn');
        if(playerData){
            singleResultCardDetailItemCpn.setVisible(true);
            singleResultCardDetailItemCpn.init(playerData,playerCard,guiPai);
        }else{
            singleResultCardDetailItemCpn.setVisible(false);
        }
    },

    initLeftCardGroup : function(seatSettleData){
        console.log('initLeftCardGroup');
        var leftCardList = seatSettleData.leftCardList;
        var guiData = seatSettleData.guiPai;
        this.leftCardGroup.active = true;
        this.leftCardGroup.removeAllChildren();
        for(var i = 0 ; i < leftCardList.length; ++i){
            var commonMahjongNode = cc.instantiate(this.commonMahjongPrefab);
            this.initCommonMahjongNode(commonMahjongNode,leftCardList[i],0.66,guiData);
            this.leftCardGroup.addChild(commonMahjongNode);
        }
    },

    initCommonMahjongNode : function(commonMahjongNode,mahjongData,scale,guiData){
        commonMahjongNode.scale = scale;
        var commonMahjongCpn = commonMahjongNode.getComponent('CommonMjCardCpn');
        commonMahjongCpn.setMahjongData(mahjongData);
        commonMahjongCpn.setGuiData(guiData);
    },

    checkItemArr : function(){
        for(var i = 0 ; i < this.ItemParentArr.length; ++i){
            if(this.ItemParentArr[i].childrenCount == 0){
                this.ItemParentArr[i].addChild(cc.instantiate(this.singleResultCardDetailItemPrefab));
            }
        }
    },
});
