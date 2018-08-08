var EventName = require('EventName');
var SystemConfig = require('SystemConfig');
var CommonHelper = require('CommonHelper');
var StateNode = require('StateNode');
cc.Class({
    extends: cc.Component,

    properties: {
        PlayerNodeArr : {
            default : [],
            type : cc.Node,
        },
        fanGuiNode :{
            default : null,
            type : cc.Node,
        },
        leftNumLabel : {
            default : null,
            type : cc.RichText,
        },
        gameNumLabel : {
            default : null,
            type : cc.Label,
        },
        directionsNode : {
            default : null,
            type : cc.Node,
        },
        roomIdLabel : {
            default : null,
            type : cc.Label,
        },
        animationLayerNode : {
            default : null,
            type : cc.Node,           
        },
        mahjongLayerNode : {
            default : null,
            type : cc.Node, 
        },
        playerPrefab : {
            default : null,
            type : cc.Prefab,
        },
        playAndPauseStateNode : {
            default : null,
            type : StateNode,
        },
        speedStateNode : {
            default : null,
            type : StateNode,
        },
        modalLayer : {
            default : null,
            type : cc.Node,             
        },
        speed : 1,
        isStop : false,
        isCanReplay : false,
    },

    // use this for initialization
    onLoad: function () {
        //this.resetPlaybackLayerUi();
        this.init();
        this.addEventListener();
        this.setPlaybackSpeed(this.speed);
    },

    init : function(){
        this.speedArr = [1,2,4];
        this.initSpeedConfig();
        this.resetData();
        this.initPlayerNode();
    },

    resetData : function(){
        this.setPlaybackSpeed(1);
        this.isStop = false;
    },

    setPlaybackSpeed : function(speed){
        this.speed = speed;
        var interval = this.speedConfig[this.speed];
        cc.mj.gameData.gameActionMgr.setInterval(interval);
    },

    initSpeedConfig : function(){
        this.speedConfig = {'1':1000,'2':500,'4':100};
    },

    onDestroy : function(){
        this.removeEventListener();
    },

    addEventListener : function(){
        cc.global.rootNode.on(EventName.OnGameExtraChange,this.onGameExtraChange,this);
        cc.global.rootNode.on(EventName.OnSeatEventComplete,this.onSeatActionComplete , this);
        cc.global.rootNode.on(EventName.OnGameStatusChange,this.onGameStatusChange , this);
        cc.global.rootNode.on(EventName.OnGuiPai,this.OnGuiPai,this);
        cc.global.rootNode.on(EventName.OnHuType,this.OnPlayingHuType,this);
        cc.global.rootNode.on(EventName.OnFanMa,this.onFanMa,this);
        cc.global.rootNode.on(EventName.OnPlaybackEnd,this.onPlaybackEnd,this);
        cc.global.rootNode.on(EventName.OnPlayerNumChange,this.onPlayerNumChange,this);
    },

    removeEventListener : function(){
        cc.global.rootNode.off(EventName.OnGameExtraChange,this.onGameExtraChange,this);
        cc.global.rootNode.off(EventName.OnSeatEventComplete,this.onSeatActionComplete , this);
        cc.global.rootNode.off(EventName.OnGameStatusChange,this.onGameStatusChange , this);
        cc.global.rootNode.off(EventName.OnGuiPai,this.OnGuiPai,this);
        cc.global.rootNode.off(EventName.OnHuType,this.OnPlayingHuType,this);
        cc.global.rootNode.off(EventName.OnFanMa,this.onFanMa,this);
        cc.global.rootNode.off(EventName.OnPlaybackEnd,this.onPlaybackEnd,this);
        cc.global.rootNode.off(EventName.OnPlayerNumChange,this.onPlayerNumChange,this);
    },

    initPlayerNode : function(){
        if(!this.PlayerNodeArr){
            console.log('界面头像未赋值');
            return;
        }
        var fullSideNameArr = CommonHelper.getSideNameArr("myself",4);
        //var sideNameArr = CommonHelper.getSideNameArr("myself",cc.mj.gameData.seatNum);
        for(var i = 0 ; i < this.PlayerNodeArr.length; ++i){
            if(this.PlayerNodeArr[i].childrenCount == 0){
                this.PlayerNodeArr[i].addChild(cc.instantiate(this.playerPrefab));
            }
            var playercpn = this.PlayerNodeArr[i].children[0].getComponent('PlayerCpn');
            var sideName = fullSideNameArr[i]
            playercpn.init(sideName,null);
            playercpn.setIsCanClickHead(false);
            playercpn.setVisible(false);
            // var isFind = (sideNameArr.findIndex(function(value){return value == sideName}) != -1);
            // playercpn.setVisible(isFind);
        }
        
    },
    onGameExtraChange : function(event){
        console.log('onGameExtraChange');
        var leftMjNum = event.detail.leftMjNum;
        var round = event.detail.round;
        var nextUid = event.detail.nextUid;

        if(leftMjNum != undefined && leftMjNum != null && this.leftNumLabel){    
            var string = "剩余<color=#a9f6b2>"+leftMjNum+"</color>张";
            console.log(this.leftNumLabel);
            this.leftNumLabel.node.active = true;
            this.leftNumLabel.string = string;
        }
        if(round && this.gameNumLabel){
            this.gameNumLabel.node.active = true;
            this.gameNumLabel.string = ''+round+'/'+cc.mj.gameData.roomInfo.roomConfig.maxGameRoundNum+'局';
        }
        if(nextUid && this.directionsNode){            
            var directionjs = this.directionsNode.getComponent('DirectionWheelsCpn');
            var side = cc.mj.gameData.getPlayerDataMgr().getSideByUid(nextUid);
            var myDirection = CommonHelper.convertDirection(cc.mj.ownUserData.direction,cc.mj.gameData.seatNum);
            directionjs.setMainDirection(myDirection);//防止没有设置自己的方位而出错，每次都设一次
            directionjs.setDirectionVisible(cc.mj.gameData.seatNum == 4);
            directionjs.blink(side);
            for(var i = 0 ; i < this.PlayerNodeArr.length; ++i){
                var playercpn = this.PlayerNodeArr[i].children[0].getComponent('PlayerCpn');
                playercpn.onNextUidChange(nextUid);
            } 
        }else{
            console.log('没有进入函数');
        }
    },

    onPlayerNumChange : function(event){//玩家离开和加入
        var playerDataList = event.detail.data;
        
        for(var i = 0 ; i < this.PlayerNodeArr.length; ++i){
            var playercpn = this.PlayerNodeArr[i].children[0].getComponent('PlayerCpn');
            var side = playercpn.side;
            var isPlayerLeave = (playerDataList.findIndex(function(value){return value.side == side}) == -1);
            playercpn.setVisible(!isPlayerLeave);
        }        
    },

    onGameStatusChange : function(){
        var roomInfo = cc.mj.gameData.roomInfo;
        this.roomIdLabel.string = "房间号：" + roomInfo.roomNo;
        if(!SystemConfig.isReal()){
            this.roomIdLabel.string += "\n"+roomInfo.roomId;
        }
    },
    update : function(dt){
        if(!this.isStop){
            cc.mj.gameData.playingGameAction();
            cc.mj.gameData.createGameAction();
        }
    },

    onSeatActionComplete : function(){
        cc.mj.gameData.onSeatActionComplete();
    },

    OnGuiPai:function(event){
        var data = event.detail.data;
        var guipai = data.guiPai;
        var isAction = data.isAction;
        var fanGuiJs = this.fanGuiNode.getComponent('FanGuiCpn');
        var type = cc.mj.gameData.roomInfo.getGuiType();
        fanGuiJs.fanGui(guipai,type,isAction);
    },

    onClickRoomInfo : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var ruleLayerNode = ModalLayerMgr.getTop('RoomInfoLayer');
        var ruleLayerCpn = ruleLayerNode.getComponent('RoomInfoLayerCpn');
        ruleLayerCpn.init(cc.mj.gameData.roomInfo);
        ModalLayerMgr.showTop('RoomInfoLayer');
    },

    OnPlayingHuType : function(event){
        var data = event.detail;
        var animationLayerNode = this.animationLayerNode;
        if(animationLayerNode){
            var animationLayer = animationLayerNode.getComponent('AnimationLayer');
            animationLayer.playSettleAnimation(data);
        }        
    },

    resetPlaybackLayerUi : function(){
        var animationLayerNode = this.animationLayerNode;
        if(animationLayerNode){
            var animationLayer = animationLayerNode.getComponent('AnimationLayer');
            animationLayer.clear();
        }       
        this.speedStateNode.goToState(0);
        this.playAndPauseStateNode.goToState(0);
        var mahjongLayerCpn = this.mahjongLayerNode.getComponent('BaseMahjongLayerCpn');
        mahjongLayerCpn.hideSeatPlayerCardLayer();
        mahjongLayerCpn.hideOption();

        var fanGuiJs = this.fanGuiNode.getComponent('FanGuiCpn');
        fanGuiJs.setVisible(false);
    },

    onEnable :function(){
        this.resetData();
        this.resetPlaybackLayerUi();
    },

    onClickPlayAndPauseBtnGroup : function(event){
        if(this.isCanReplay){
            this.isCanReplay = false;
            this.replay();
        }else{
            this.isStop = !this.isStop;
        }
        this.freshPlayBtn();
    },

    replay : function(){
        this.resetPlaybackLayerUi();
        cc.mj.gameData.gameActionMgr.reset();
        cc.mj.gameData.replay();
        this.resetData();
    },

    onClickBtnSpeedGroup : function(event){
        var target = event.target;
        var stateNodeCpn = target.getComponent('StateNode');
        stateNodeCpn.goToNextState();
        var speed = this.getNextSpeed();
        this.setPlaybackSpeed(speed);
    },

    getNextSpeed : function(){
        var index = 0;
        for(var i = 0 ; i < this.speedArr.length; ++i){
            if(this.speedArr[i] == this.speed){
                index = i;
                break;
            }
        }
        var nextIndex = (index == (this.speedArr.length-1) ? 0 : (index + 1))
        return this.speedArr[nextIndex];
    },

    onFanMa : function(event){
        var data = event.detail;
        var ModalLayerMgr = this.modalLayer.getComponent('ModalLayerMgr');
        if(ModalLayerMgr){
            var Node = ModalLayerMgr.getTop('FanmaGroup');
            var NodeCpn = Node.getComponent('fanMaMgr');
            NodeCpn.playingFanMa(data);
            ModalLayerMgr.showTop('FanmaGroup');
        }
    },

    freshPlayBtn : function(){
        if(this.isCanReplay){
            this.playAndPauseStateNode.goToState(2);
        }else{
            this.playAndPauseStateNode.goToState(this.isStop ? 1 : 0);
        }
    },

    onPlaybackEnd : function(){
        this.isCanReplay = true;
        this.freshPlayBtn();
    },
});
