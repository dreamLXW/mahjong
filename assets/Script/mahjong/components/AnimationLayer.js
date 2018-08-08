var CommonHelper = require('CommonHelper');
var HuTypeCfg = require('HuTypeCfg');
var SoundHelper = require('MjSoundHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        dianPaoAniPrefab : {
            default : null,
            type : cc.Prefab,
        },
        gangBaoAniPrefab : {
            default : null,
            type : cc.Prefab,
        },
        HaiDiLaoYuePrefab : {
            default : null,
            type : cc.Prefab,
        },
        QiangGangHuAniPrefab : {
            default : null,
            type : cc.Prefab,
        },
        ZimoAniPrefab : {
            default : null,
            type : cc.Prefab,
        },
        genZhuangPrefab : {
            default : null,
            type : cc.Prefab,           
        },
        huangZhuangPrefab : {
            default : null,
            type : cc.Prefab,               
        },
        chooseOptionHandPrefab : {
            default : null,
            type : cc.Prefab,            
        },
        bg : {
            type : cc.Node,
            default : null,
        },
        animationContainer : {
            type : cc.Node,
            default : null,
        },
    },

    onLoad: function () {

    },

    playSettleAnimation : function(huTypeList){//'type':item.huType,'uid':item.uid,'influenceUid':item.influenceUidList
        this.clear();
        
        var huType = huTypeList[0].type;
        var card = huTypeList[0].huCard;
        var posList = [];
        const posArr = {"myself":cc.p(0,-170),"right":cc.p(390,-40),"up":cc.p(0,80),"left":cc.p(-390, -40)};
        if(huType != HuTypeCfg.HUANGZHUANG){
            for(var i = 0 ; i < huTypeList.length; ++i){
                var uid = huTypeList[i].uid;
                var fromUid = huTypeList[i].influenceUid[0];//只有放炮类型时需要知道输家，刚好放炮类型时输家只有一个
                var sideUid = cc.mj.gameData.getPlayerDataMgr().getSideByUid(uid);
                var sideFromUid = cc.mj.gameData.getPlayerDataMgr().getSideByUid(fromUid);
                var fromPos = (sideUid != -1) ? posArr[sideUid] : cc.p(0,0);
                var toPos = (sideFromUid != -1) ? posArr[sideFromUid] : cc.p(0,0);
                posList.push({'fromPos': fromPos,'toPos':toPos});
            }
        }
        switch(huType){
            case  HuTypeCfg.HAIDIPAO:
                this.playingHaiPaoAni(card,posList);
                break;
            case  HuTypeCfg.HAIDILAO:
            case  HuTypeCfg.HAIDILAOGANGBAO:
                this.playingHaiDiLao(posList);
                break;
            case  HuTypeCfg.QIANGGANGHU:
                this.playingQiangGangHu(card,posList);
                break;
            case  HuTypeCfg.GANGBAO:
                this.playingGangBao(posList);
                break;
            case  HuTypeCfg.TIANHU:
                this.playingTianHuAni(card,posList);
            break;
            case  HuTypeCfg.CHIDIHU:
            case  HuTypeCfg.MODIHU:
            case  HuTypeCfg.DIHU:
                this.playingDiHuAni(card,posList,HuTypeCfg.isZiMo(huType));
            break;
            case  HuTypeCfg.DIANPAOHU:
                this.playingDianPaoAni(card,posList);
            break;
            case  HuTypeCfg.ZIMO:
                this.playingZimoAni(card,posList);
            break;
            case HuTypeCfg.HUANGZHUANG:
                this.playingHuangZhuang();
            break;
        }
        if(huType != HuTypeCfg.HUANGZHUANG){
            var sex = cc.mj.gameData.getPlayerData(huTypeList[0].uid).sex;
            SoundHelper.playingHu(HuTypeCfg.huTypeIntroArr[huType].sound,sex);
        }

    },

    playingGenZhangAni : function(){//跟庄
        var animationNode = cc.instantiate(this.genZhuangPrefab);
        this.initSettleAni(animationNode,null,cc.p(0,0));
        var animation = animationNode.getComponent(cc.Animation);
        animation.play();
    },

    playingDianPaoAni : function(card,posList,dianPaoHuText){//点炮
        for(var i = 0 ; i < posList.length; ++i){
            var animationNode = cc.instantiate(this.dianPaoAniPrefab);
            if(dianPaoHuText != null && dianPaoHuText != undefined && dianPaoHuText != ''){
                this.setDianPaoHuNodeText(animationNode,dianPaoHuText);
            }
            this.initSettleAni(animationNode,card,posList[i].toPos);
            animationNode.runAction(cc.moveTo(1.0,posList[i].fromPos));
            var animation = animationNode.getComponent(cc.Animation);
            animation.play();
        }
        this.playingBgOpacityChange();
    },

    setDianPaoHuNodeText : function(node,spUrl){
        var url = 'mahjong/png/mjtext';
        var spriteAtlas = cc.loader.getRes(url,cc.SpriteAtlas);
        var spriteFrame = spriteAtlas.getSpriteFrame(spUrl);
        node.getChildByName('win_dianpao').getChildByName('textsp').getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },

    setZimoHuNodeText : function(node,spUrl){
        var url = 'mahjong/png/mjtext';
        var spriteAtlas = cc.loader.getRes(url,cc.SpriteAtlas);
        var spriteFrame = spriteAtlas.getSpriteFrame(spUrl);
        node.getChildByName('win_dianpao').getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },

    playingDiHuAni : function(card,posList,isZimo){//地胡 修改字
        if(isZimo){
            this.playingZimoAni(card,posList,'dihu');
        }else{
            this.playingDianPaoAni(card,posList,'dihu');
        }
        
    },

    playingZimoAni : function(card,posList,zimoText){//自摸
        var animationNode = cc.instantiate(this.ZimoAniPrefab);
        if(zimoText != null && zimoText != undefined && zimoText != ''){
            this.setZimoHuNodeText(animationNode,zimoText);
        }
        this.initSettleAni(animationNode,card,posList[0].fromPos);
        var animation = animationNode.getComponent(cc.Animation);
        animation.play();
        this.playingBgOpacityChange();
    },

    playingQiangGangHu : function(card,posList){//抢杠胡
        var animationNode = cc.instantiate(this.QiangGangHuAniPrefab);
        this.initSettleAni(animationNode,card,posList[0].fromPos); 
        var animation = animationNode.getComponent(cc.Animation);
        animation.play(); 
        this.playingBgOpacityChange();
    },

    playingHaiDiLao : function(posList){//海底捞
        var animationNode = cc.instantiate(this.HaiDiLaoYuePrefab);
        this.initSettleAni(animationNode,null,posList[0].fromPos);
        var animation = animationNode.getComponent(cc.Animation);
        animation.play();      
        this.playingBgOpacityChange(); 
    },

    playingHaiPaoAni : function(card,posList){//海底炮    修改字
        this.playingDianPaoAni(card,posList,'hdp');
    },

    playingGangBao : function(posList){//杠爆
        var animationNode = cc.instantiate(this.gangBaoAniPrefab);
        this.initSettleAni(animationNode,null,posList[0].fromPos);
        var animation = animationNode.getComponent(cc.Animation);
        animation.play();
        this.playingBgOpacityChange();
    },

    playingTianHuAni : function(card,posList){//天胡   修改字
        this.playingZimoAni(card,posList,'tianhu');
    },    

    playingHuangZhuang : function(){
        var animationNode = cc.instantiate(this.huangZhuangPrefab);
        this.initSettleAni(animationNode,null,cc.p(0,0));
        var animation = animationNode.getComponent(cc.Animation);
        animation.play();
        this.playingBgOpacityChange();
    },

    playingChooseOptionAni : function(posList){
        for(var i = 0 ; i < posList.length; ++i){
            var animationNode = cc.instantiate(this.chooseOptionHandPrefab);
            var animation = animationNode.getComponent(cc.Animation);
            var nodePos = this.animationContainer.convertToNodeSpaceAR(posList[i]);
            animation.initSettleAni(animationNode,null,nodePos);
        }
    },

    initSettleAni : function(animationNode,card,pos){
        animationNode.position = pos;
        var animation = animationNode.getComponent(cc.Animation);
        animation.on('finished',this.onPlayingSettleAniComplete,this);
        if(card){
            var commonMjCardCpn = animationNode.getComponent('CommonMjCardCpn');
            commonMjCardCpn.setMahjongData(card);
        }
        this.animationContainer.addChild(animationNode);
    },

    onPlayingSettleAniComplete : function(){
        console.log('动作完毕');
        CommonHelper.emitActionCompelete();
        this.clear();
    },

    playingBgOpacityChange : function(){
        this.bg.active = true;
        this.bg.opacity = 0;
        this.bg.runAction(cc.fadeTo(1.0,168));
    },

    clear : function(){
        this.animationContainer.removeAllChildren();
        this.bg.active = false;
    }
});
