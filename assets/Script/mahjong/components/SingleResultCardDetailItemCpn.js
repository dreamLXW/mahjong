var PairCfg = require('PairCfg');
var OnlineLoadData = require('OnlineLoadData');
cc.Class({
    extends: cc.Component,

    properties: {
        headSp : {
            default : null,
            type : cc.Sprite,
        },
        userNameLabel :{
            default : null,
            type : cc.Label,
        },
        settlePengGangPrefab : {
            default : null,
            type : cc.Prefab,
        },
        jiangMaRootNode : {
            default : null,
            type : cc.Node,            
        },
        famaiMaRootNode : {
            default : null,
            type : cc.Node,  
        },
        handCardsRootNode : {
            default : null,
            type : cc.Node,             
        },
        outCardsContent : {
             default : null,
             type : cc.Node,            
        },
        outCardScrollView : {
            default : null,
            type : cc.ScrollView,             
        },
        _commonMahjongPrefab : {
            type : cc.Prefab,
            default : null,
        },
        leftCardGroupPrefab : {
            type : cc.Prefab,
            default : null,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.outcardScale = 0.66;
        var url = 'mahjong/prefab/FrontViewMahjong'
        this._commonMahjongPrefab = cc.loader.getRes(url,cc.Prefab);
    },

    setVisible : function(isVisible){
        this.node.active = isVisible
    },

    init : function(playerData,playerCard,guiPai){
        var uid = playerCard.uid;
        var tempOutCardsList = playerCard.tempOutCardList;
        var faMaiMaCardList = playerCard.maiMaList;
        var jiangMaCardList = playerCard.jiangMaCardList;
        var pairList = playerCard.pairList;
        var handsCardList = playerCard.handCardList;
        this.initMaRootNode(this.jiangMaRootNode,'jiangma',jiangMaCardList);
        this.initMaRootNode(this.famaiMaRootNode,'famaima',faMaiMaCardList);
        this.initUserNode(playerData);
        this.initOutCardContent(tempOutCardsList);
        this.initHandCardsRootNode(pairList,handsCardList,guiPai);
    },

    initOutCardContent : function(outCardList){
        this.outCardsContent.removeAllChildren();
        for(var i = 0 ; i < outCardList.length; ++i){
            var card = outCardList[i].card;
            var commonMahjongNode = cc.instantiate(this._commonMahjongPrefab);
            this.initCommonMahjongNode(commonMahjongNode,card,0.66,null);
            this.outCardsContent.addChild(commonMahjongNode);
        }
        this.outCardScrollView.enabled = (outCardList.length > 26);
        this.outCardScrollView.scrollToLeft(0);
    },

    initMaRootNode : function(rootNode,rootNodeChildName,maCardList){
        var MaListLength = (!maCardList == true)? 0 : maCardList.length;
        for(var i = 0 ; i < rootNode.childrenCount; ++i){
            var index = i + 1;
            var mahjongNode = rootNode.getChildByName(rootNodeChildName+index).children[0];
            var commonMahjongCpn = mahjongNode.getComponent('CommonMjCardCpn');
            if(i < MaListLength){
                var card = maCardList[i].card;
                var type = maCardList[i].type;
                commonMahjongCpn.setMahjongData(card);
                commonMahjongCpn.setVisible(true);
                if(type == 0){
                    commonMahjongCpn.hideLightBorder();
                }else{
                    commonMahjongCpn.showLightBorder(type);
                }
            }else{
                commonMahjongCpn.setVisible(false);
            }
        }
    },

    initUserNode : function(playerData){
        var userName = playerData.getDisplayName();
        var url = playerData.url;
        this.userNameLabel.string = userName;

        this.node.getComponent('OnlineLoadData').getSpriteByUrl(url);
    },

    initCommonMahjongNode : function(commonMahjongNode,mahjongData,scale,guiData){
        commonMahjongNode.scale = scale;
        var commonMahjongCpn = commonMahjongNode.getComponent('CommonMjCardCpn');
        commonMahjongCpn.setMahjongData(mahjongData);
        commonMahjongCpn.setGuiData(guiData);
    },

    initHandCardsRootNode : function(pairList,handsCardList,guiPai){
        this.handCardsRootNode.removeAllChildren();
        for(var i = 0 ; i < pairList.length; ++i){
            var pair = pairList[i];
            var mahjongdata = pair.cardList[0];
            var type = pair.type;
             if(PairCfg.isPengGangChi(type)){
                var pengGangPair = cc.instantiate(this.settlePengGangPrefab);   
                var pairCpn = pengGangPair.getComponent('PairCpn');
                pairCpn.setPengGangType(type);
                pairCpn.setMahjongData(mahjongdata);
                this.handCardsRootNode.addChild(pengGangPair);
             }
        }   

        var copyMahjongDataArr = [].concat(handsCardList);
        var isHaveLast = (copyMahjongDataArr.length % 3 == 2);
        var lastNum = null;
        if(isHaveLast){//如果有最后一张牌
            lastNum = copyMahjongDataArr[copyMahjongDataArr.length-1];
            copyMahjongDataArr.pop();
        }

        var lefthandCardGroup = cc.instantiate(this.leftCardGroupPrefab);
        for(var i = 0 ; i < copyMahjongDataArr.length; ++i){
            var commonMahjongNode = cc.instantiate(this._commonMahjongPrefab);
            this.initCommonMahjongNode(commonMahjongNode,copyMahjongDataArr[i],1,guiPai);
            lefthandCardGroup.addChild(commonMahjongNode);
        }
        this.handCardsRootNode.addChild(lefthandCardGroup);

        if(lastNum){
            var HuPaiNode = cc.instantiate(this._commonMahjongPrefab);
            this.initCommonMahjongNode(HuPaiNode,lastNum,1,guiPai);
            this.handCardsRootNode.addChild(HuPaiNode);            
        }
    },
});
