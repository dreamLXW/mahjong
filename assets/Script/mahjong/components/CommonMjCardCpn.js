var CommonHelper = require('CommonHelper');
cc.Class({//普通麻将
    extends: cc.Component,

    properties: {
        isWinChip : true,
        _mahjongData : 0,
        brightBorder :{
            default : null,
            type : cc.Sprite,
        },
        mainMahjongSp : {
            default: null,
            type : cc.Sprite,
        },
        guiSp : {
            default: null,
            type : cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.init();        
    },

    init : function(){
        if(!this.mainMahjongSp){
            this.mainMahjongSp = this.node.getChildByName('mainmahjongsp').getComponent(cc.Sprite);
        }
    },

    setIsWinChip : function(isWinChip){
        this.isWinChip = isWinChip;
    },

    playingFanMa : function(cb){
        var fanMaAnimation = this.node.getComponent(cc.Animation);
        fanMaAnimation.on('finished',cb);
        fanMaAnimation.play();
    },

    onMahjongChipCompleted : function (){            
        this.brightBorder.node.active = this.isWinChip;
    },

    setMahjongData : function(mahjongData){
        if(this._mahjongData != mahjongData ){
            this._mahjongData = mahjongData; 
             var spriteFrame = CommonHelper.getMahjongWord(mahjongData);
             this.init();//onLoad有bug
             this.mainMahjongSp.spriteFrame = spriteFrame;
        }
             
    },

    getMahjongData : function(){
        return this._mahjongData;
    },

    setGuiData : function(guiData){
        this.guiData = guiData;
        this.setGuiVisible((guiData == this._mahjongData));
    },

    setGuiVisible : function(isGui){
        if(this.guiSp){
            this.guiSp.active = isGui;
        }else{
            console.log('该节点没有guisp');
        }
        
    },

    setVisible : function(isVisible){
        this.node.active = isVisible;
    },

    isVisible : function(){
        return this.node.active;
    },

    showLightBorder : function(type){
        var spriteAtlasUrl = 'mahjong/png/mjcard';
        var spriteAtlas = cc.loader.getRes(spriteAtlasUrl,cc.SpriteAtlas);
        var url = 'borderlight'+type;
        var spriteFrame = spriteAtlas.getSpriteFrame(url);
        
        if(this.brightBorder){
            console.log('showLightBorder:'+type + '' + spriteFrame);
            this.brightBorder.spriteFrame = spriteFrame;
            this.brightBorder.node.active = true;
        }
        
    },

    hideLightBorder : function(){
        if(this.brightBorder){
            this.brightBorder.node.active = false;
            console.log('hideLightBorder:');
        }
        
    },

    setMainMahjongSpRotate : function(rotation){
        this.init();
        this.mainMahjongSp.node.rotation = rotation;
    },
});
