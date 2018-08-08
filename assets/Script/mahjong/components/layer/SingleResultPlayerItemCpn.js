var HuTypeCfg = require('HuTypeCfg');
var OnlineLoadData = require('OnlineLoadData');
cc.Class({
    extends: cc.Component,

    properties: {
        zhuangSp : {
            type : cc.Sprite,
            default : null,
        },
        lianSp : {
            type : cc.Sprite,
            default : null,           
        },
        roomUidNode : {
            type : cc.Node,
            default : null,
        },
        headSp : {
            type : cc.Sprite,
            default : null,
        },
        userNameLabel : {
            type : cc.Label,
            default : null,
        },
        totalScoreLabel : {
            type : cc.Label,
            default : null,
        },
        curScoreLabel : {
            type : cc.Label,
            default : null,
        },
        resultTypeSp : {
            type : cc.Sprite,
            default : null,
        },
        yellowNumberFont : {
            type : cc.Font,
            default : null
        },
        grayNumberFont : {
            type : cc.Font,
            default : null
        },
        gray : {
            type : cc.Node,
            default : null,
        }

    },

    // use this for initialization
    onLoad: function () {

    },

    setVisible : function(isVisible){
        this.node.active = isVisible;
    },

    setEnable : function(isEnable){
        this.gray.active = !isEnable;
        if(!isEnable){
            this.zhuangSp.node.active = false;
            this.lianSp.node.active = false;
            this.roomUidNode.active = false;
            this.userNameLabel.string = "";
            this.totalScoreLabel.string = "";
            this.curScoreLabel.string = "";   
            this.node.getComponent('OnlineLoadData').getSpriteByUrl();
            this.resultTypeSp.node.active = false;
            this.node.getChildByName('radio').getComponent(cc.Toggle).interactable = false;
        }else{
            this.node.getChildByName('radio').getComponent(cc.Toggle).interactable = true;
        }
    },

    setToggleGroup : function(toggleGroup){
        this.node.getChildByName('radio').getComponent(cc.Toggle).toggleGroup = toggleGroup;
    },

    setToggleEvent : function(toggleEvent){
        this.node.getChildByName('radio').getComponent(cc.Toggle).checkEvents.push(toggleEvent);
    },

    init: function(singlePlayerResultData,playerData,bid,isLianZhuang,roomUid){
        console.log("bid="+bid+ "   " + "isLianzhuang=" + isLianZhuang);
        var uid = singlePlayerResultData.uid;
        
        var url = playerData.url;

        if(bid == uid ){
            this.zhuangSp.node.active = !isLianZhuang;
            this.lianSp.node.active = isLianZhuang;
        }else{
            this.zhuangSp.node.active = false;
            this.lianSp.node.active = false;
        }

        this.roomUidNode.active = (roomUid == uid);
        this.userNameLabel.string = playerData.getDisplayName();
        this.totalScoreLabel.string = singlePlayerResultData.totalScore;
        this.curScoreLabel.string = singlePlayerResultData.curScore;   
        this.curScoreLabel.font = Number(singlePlayerResultData.curScore)<0?this.grayNumberFont:this.yellowNumberFont;
        this.node.getComponent('OnlineLoadData').getSpriteByUrl(url);

        this.resultTypeSp.node.active = (singlePlayerResultData.huTypeItemDataList.length > 0);
        if(singlePlayerResultData.huTypeItemDataList.length > 0){
            var huType = singlePlayerResultData.huTypeItemDataList[0].huType;
            var realHutype = HuTypeCfg.huTypeMap[huType];
            var isPassive = singlePlayerResultData.huTypeItemDataList[0].isPassive;
            var beText = isPassive?'_be' : '';

            var spriteAtlasUrl = 'mahjong/png/mjtext';
            var spriteAtlas = cc.loader.getRes(spriteAtlasUrl,cc.SpriteAtlas);
            var url = 'hutype'+realHutype+beText;
            var spriteFrame = spriteAtlas.getSpriteFrame(url);
            this.resultTypeSp.spriteFrame = spriteFrame;
        }
    },

    setCheck : function(isCheck){
        this.node.getChildByName('radio').getComponent(cc.Toggle).isChecked = isCheck;
    },

});
