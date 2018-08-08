var EventName = require('EventName');
var CommonHelper = require('CommonHelper');
var MjSoundHelper = require('MjSoundHelper');
var OnlineLoadData = require('OnlineLoadData');
var SystemConfig = require('SystemConfig');
var GameToWechatGameHelper = require("GameToWechatGameHelper");
cc.Class({
    extends: cc.Component,

    properties: {
        readySp : {
            default : null,
            type : cc.Node,
        },
        userNameLabel : {
            default : null,
            type : cc.Label,
        },
        userIdLabel : {
            default : null,
            type : cc.Label,           
        },
        userScoreLabel : {
            default : null,
            type : cc.Label,
        },
        headSp:{
            default : null,
            type : cc.Sprite,
        },
        leaveSp:{
            default : null,
            type : cc.Node,
        },   
        busySp:{
            default : null,
            type : cc.Node,
        },
        zhuangSp : {
            default : null,
            type : cc.Sprite,
        },
        lianSp : {
            default : null,
            type : cc.Sprite,            
        },
        rotateSp : {
            default : null,
            type : cc.Node,
        },
        bubbleBoxArr : {
            default : [],
            type : cc.Node,
        },
        moneyLabel : {
            default : null,
            type : cc.Label,            
        },
        goldLabel : {
            default : null,
            type : cc.Label,            
        },
        roomCardLabel : {
            default : null,
            type : cc.Label,            
        },
        dingNoLabel : {
            default : null,
            type : cc.Label,  
        },
        voiceBoxArr : {
            default : [],
            type : cc.Node,           
        },
        side : "",
        isCanClickHead : true,
        userNameHeight : 30,
    },

    init : function(side,readySp){
        this.initReadySp(readySp);
        this.initSide(side);
    },

    setIsCanClickHead : function(isCanClick){
        this.isCanClickHead = isCanClick;
    },

    fresh : function(){
        if(!this.playerData){
            return;
        }
        if(this.leaveSp){
            this.leaveSp.active = !(this.playerData.online);
        }
        if(this.busySp){
            this.busySp.active = (this.playerData.busy);
            if(!this.playerData.online){//不在线时不显示忙碌
                this.busySp.active = false;
            }
        }
        if(this.userNameLabel){
            this.userNameLabel.string = this.playerData.getDisplayName();
            if(this.userNameLabel.node.children[0]){
                this.userNameLabel.node.children[0].active = (this.userNameLabel.node.height > this.userNameHeight);
            }
        }
        if(this.userIdLabel){
            if ( SystemConfig.isReal()) {
                this.userIdLabel.string = '';
            } 
            else {
                var uid = this.playerData.uid;
                this.userIdLabel.string = uid;
            }
        }
        if(this.userScoreLabel){
            this.userScoreLabel.string = this.playerData.score;
        }
        this.setReadySpVisible(this.playerData.ready);
        if(this.moneyLabel){
            this.moneyLabel.string = this.playerData.money;
        }
        if (this.goldLabel) {
            this.goldLabel.string = CommonHelper.getNewNumber(this.playerData.gold);
        }
        if (this.roomCardLabel) {
            this.roomCardLabel.string = CommonHelper.getNewNumber(this.playerData.roomcard);
        }
        if(this.url != this.playerData.url){
            this.url = this.playerData.url;
            this.loadHeadSp(this,this.url);
        }
        if(this.dingNoLabel){
            this.dingNoLabel.string = this.playerData.getDisplayId();
        }
    },

    setReadySpVisible : function(isVisible){
        if(this.readySp){
            this.readySp.active = isVisible;
            if(cc.mj.gameData.roomInfo.isGameStatusStart() || cc.mj.gameData.roomInfo.isMySelfInSettleStatus()){
                this.readySp.active = false;
            }
        }
    },
    // use this for initialization
    onLoad: function () {
        console.log(cc.js.getClassName(this)+ ' onLoad');
        
    }, 

    onPlayerZhuangChange : function(event){//庄家变化，连庄变化
        var type = event.detail.data;//'lian','zhuang'
        var side = event.detail.side; 
        //this.zhuangSp.spriteFrame = '';
        if(side == this.side){
            this.setZhuangType(type);
        }else{
            this.setZhuangType(null);
        }
        
    },

    setZhuangType : function(type){//'lian','zhuang'
        var lianVisible = false;
        var zhuangVisible = false;
        if(type == 'lian'){
            lianVisible = true;
            zhuangVisible = false;
        }else if(type == 'zhuang'){
            zhuangVisible = true;
            lianVisible = false;
        }else{
            zhuangVisible = false;
            lianVisible = false;            
        }
        if(this.zhuangSp){
            this.zhuangSp.node.active = zhuangVisible;
        }
        if(this.lianSp){
            this.lianSp.node.active = lianVisible;
        }
    },

    onPlayerDataChange : function(event){//玩家数据变化
        var playerdata = event.detail.data;
        var side = event.detail.side;  
        if(side != this.side){
            return;
        }   
        this.playerData = playerdata;
        this.fresh();
    },

    

    onDestroy : function(){
        console.log(cc.js.getClassName(this) + ' onDestroy');
        cc.global.rootNode.off(EventName.OnPlayerDataChange,this.onPlayerDataChange,this);
        cc.global.rootNode.off(EventName.OnPlayerZhuangChange,this.onPlayerZhuangChange,this);
        cc.global.rootNode.off(EventName.OnGameStatusChange,this.onGameStatusChange,this);
        cc.global.rootNode.off(EventName.OnUserTalk,this.onUserTalk,this);
    },

    resetListener : function(){
        cc.global.rootNode.off(EventName.OnPlayerDataChange,this.onPlayerDataChange,this);
        cc.global.rootNode.off(EventName.OnPlayerZhuangChange,this.onPlayerZhuangChange,this);
        cc.global.rootNode.off(EventName.OnGameStatusChange,this.onGameStatusChange,this);
        cc.global.rootNode.off(EventName.OnUserTalk,this.onUserTalk,this);
        cc.global.rootNode.on(EventName.OnPlayerDataChange,this.onPlayerDataChange,this);
        cc.global.rootNode.on(EventName.OnPlayerZhuangChange,this.onPlayerZhuangChange,this);
        cc.global.rootNode.on(EventName.OnGameStatusChange,this.onGameStatusChange,this);
        cc.global.rootNode.on(EventName.OnUserTalk,this.onUserTalk,this);
    },

    onEnable : function(){
        console.log(cc.js.getClassName(this)+ ' onEnable');
        this.resetListener();
    },
    
    loadHeadSp : function(target,url){
        var OnlineLoadData = this.node.getComponent('OnlineLoadData');
        if(OnlineLoadData){
            OnlineLoadData.getSpriteByUrl(url);
        }
        
    },
    initReadySp : function(readySp){//因为player ui不包括准备节点，所以暂时这样做
        this.readySp = readySp;
        
    },
    initSide : function(side){
        this.side = side;
    },

    setVisible : function(isVisible){
        this.node.active = isVisible;
        if(!isVisible){
            this.setReadySpVisible(false);
        }else if(this.playerData){
            this.setReadySpVisible(this.playerData.ready);
        }       
    },

    onGameStatusChange : function(){
        if(cc.mj.gameData.roomInfo.isGameStatusStart()){
            this.onGameStart();
        }
    },

    onGameStart : function(){
        this.setReadySpVisible(false);
    },

    onNextUidChange : function(nextUid){
        var side = cc.mj.gameData.getPlayerDataMgr().getSideByUid(nextUid);
        if(side != this.side){
            this.rotateSp.stopAllActions();
            this.rotateSp.active = false;
        }else if(this.rotateSp.active == false){//防止重复执行runAction
            this.rotateSp.active = true;
            this.rotateSp.runAction(this.getRotateAction());
        }
    },

    getRotateAction : function(){
        return cc.rotateBy(0.2,15).repeatForever();
    },

    onClickHead : function(){
        if(this.isCanClickHead){
            var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
            if(ModalLayerMgr){
                var userInfoLayerNode = ModalLayerMgr.getTop('userinfolayer');
                var userInfoLayerCpn = userInfoLayerNode.getComponent('UserInfoLayerCpn');
                userInfoLayerCpn.init(this.playerData);
                ModalLayerMgr.showTop('userinfolayer');
            }
        }

    },

    onUserTalk : function(event){
        var side = event.detail.side;  
        if(side != this.side){
            return;
        }  
        var talkEvent = event.detail.data;  
        var eventType = talkEvent.EventName;    
        if(eventType == 'TalkVoiceEvent'){
            this.onTalkVoiceEvent(talkEvent);
        }else if(eventType == 'TalkChatEvent'){
            this.onTalkChatEvent(talkEvent);
        }
    },

    playVoice : function(talkVoiceEvent){
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.playVoiceForWechat(talkVoiceEvent.url);
        } else {
            this.playVoiceForNormal(talkVoiceEvent);
        }
    },

    playVoiceForNormal : function (talkVoiceEvent) {
        var filepath = talkVoiceEvent.getPlayableFilePath();
        console.log('播放路径 = '+filepath);
        if(filepath == ''){   
            return;
        }
        if(cc.sys.isNative){
            if(cc.sys.os == cc.sys.OS_ANDROID){
                var className = 'org/cocos2dx/javascript/RecordAndPlayHelper';
                var mathodName = 'playVoice';
                var mathodSignature = '(Ljava/lang/String;)V';
                var param = filepath;
                jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,param);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                var className = 'RecordAndPlayHelper';
                var mathodName = 'playVoice:';
                var arg1 = filepath;
                jsb.reflection.callStaticMethod(className,mathodName,arg1);                
            }   
        }
    },

    playVoiceForWechat : function (url) {
        console.log("url = " + url);
        if (this.innerAudioContext == null) {
            this.innerAudioContext = wx.createInnerAudioContext();
            this.innerAudioContext.onPlay(() => {
                console.log('开始播放录音');
            });
            this.innerAudioContext.onEnded(() => {
                console.log('停止播放录音');
            });
            this.innerAudioContext.onError((res) => {
                console.log("播放录音出错: " + res.errMsg + ",错误代码: " + res.errCode);
            });
        }
        this.innerAudioContext.src = url;
        this.innerAudioContext.autoplay = true;
    },

    onTalkVoiceEvent : function(talkVoiceEvent){
        var fullSideNameArr = CommonHelper.getSideNameArr("myself",4);
        var side = this.side;
        var viewPos = fullSideNameArr.findIndex(function(value){return (value == side);});
        var voiceBox = this.voiceBoxArr[viewPos];
        var second = talkVoiceEvent.second;
        this.playVoice(talkVoiceEvent);
        voiceBox.active = true;
        this.node.runAction(cc.sequence(cc.delayTime(second),cc.callFunc(function(){
            voiceBox.active = false;

            CommonHelper.emitTalkCompelete();
        })));
    },

    onTalkChatEvent : function(talkChatEvent){
        var content= talkChatEvent.content;
        var fullSideNameArr = CommonHelper.getSideNameArr("myself",4);
        var side = this.side;
        var viewPos = fullSideNameArr.findIndex(function(value){return (value == side);});
        var bubbleBox = this.bubbleBoxArr[viewPos];
        var textLable = bubbleBox.getChildByName('textLabel').getComponent(cc.Label);
        var expressSp = bubbleBox.getChildByName('express').getComponent(cc.Sprite);
        var isText = true;
        var second = 5;

        bubbleBox.active = true;
        if(talkChatEvent.isCommonSentence()){
            var commonSentenceId = content.id;
            var lanType = content.lanType;
            var index = lanType == 1 ? 1 : 2;
            var playerdata = talkChatEvent.playerData;
            textLable.string = cc.mj.i18n.t('commonsentence.lanType'+index+'.sex'+playerdata.sex+'.'+commonSentenceId);
            MjSoundHelper.playingCommonSentence(lanType,commonSentenceId,playerdata.sex);
        }else if (talkChatEvent.isExpress()){
            isText = false;
            var spriteAtlasUrl = 'mahjong/png/expression';
            var spriteAtlas = cc.loader.getRes(spriteAtlasUrl,cc.SpriteAtlas);
            var url = 'bq_'+content;
            var spriteFrame = spriteAtlas.getSpriteFrame(url);
            expressSp.spriteFrame = spriteFrame;
        }else if(talkChatEvent.isText()){
            textLable.overflow = cc.Label.Overflow.NONE;
            //textLable.node.width = 0;
            textLable.string = content;
            const maxWidth = 350;
            console.log('textLable.node.getContentSize().width:' + textLable.node.getContentSize().width);
            if(textLable.node.getContentSize().width > maxWidth){
                textLable.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
                textLable.node.width = maxWidth;
            }
        }else if(talkChatEvent.isTrainingMsg()){
            var trainingId = content;
            console.log("hahha"+cc.mj.i18n.t('training.'+trainingId));
            textLable.string = cc.mj.i18n.t('training.'+trainingId);
            MjSoundHelper.playTraining(trainingId);            
        }
        
        textLable.node.active = isText;
        expressSp.node.active = !isText;
        this.node.runAction(cc.sequence(cc.delayTime(second),cc.callFunc(function(){
            textLable.overflow = cc.Label.Overflow.NONE;
            bubbleBox.active = false;
            CommonHelper.emitTalkCompelete();
        })));
        // this.schedule(function(){

        // }, 1.0, 1, second);
    },

});
