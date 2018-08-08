var CommonHelper = require('CommonHelper');
var PairCfg = require('PairCfg');
var SoundHelper = require('MjSoundHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        side : 'null',
        pengGangPrefab : {
            type : cc.Prefab,
            default : [],
        },
        pengGangNum : 0,
        initZorder : 10,
        _animationNodePos : {
            default : new cc.Vec2()
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    setPengGangPrefab : function(pengGangPrefab){
        this.pengGangPrefab = pengGangPrefab;
    },

    hideAllPairs : function(){
        for(var i = 0 ; i < this.node.childrenCount; ++i){
            this.node.children[i].active = false;
        }
    },

    initSide : function(sideName){
        this.side = sideName;
    },

    clearPairs : function(){
        this.node.removeAllChildren();
        this.pengGangNum = 0;
        this.initZorder = 10;
    },

    initWithPairList : function(pairList){
        this.clearPairs();
        for(var i = 0 ; i < pairList.length; ++i){
            console.log('initWithPairList:'+pairList[i]);
            var pair = pairList[i];
            var type = pair.type;
            var fromUid = pair.fromuid;
            var uid = pair.uid;
            var cardData = pair.cardList[0];
            if(fromUid == undefined || fromUid == null){
                fromUid= pair.uid;
            }
            console.log(pair);
            if(PairCfg.isPengGangChi(type)){
                var pengGangPair = this.newPengGangPair(uid,fromUid);
                this.initPengGangPair(pengGangPair,cardData,type);
                this.pushPengGangPair(pengGangPair);
            }

        }
    },

    onCreatePengGangAction : function(seatAtionEvent){   
        if(!PairCfg.isPengGangChi(seatAtionEvent.type)){
            this.emitPengGangPaiComplete();
            return;
        }
        if(seatAtionEvent.type == PairCfg.BU_GANG){
            this.onCreateBuGangAction(seatAtionEvent);
        }else{
            this.onCreateCustomPengGangAction(seatAtionEvent);      
        }
    },

    newPengGangPair : function(uid,fromUid){
        var relativeSide = cc.mj.gameData.getPlayerDataMgr().getRelativeSideBetween(uid,fromUid);
        var  fullSideNameArr = CommonHelper.getSideNameArr("myself",4);
        var relativePos = fullSideNameArr.findIndex(function(value){return value == relativeSide});
        var prefab = this.pengGangPrefab[relativePos];
        var pengGangPair = cc.instantiate(prefab);
        return pengGangPair;
    },

    pushPengGangPair : function(pengGangPair){
        pengGangPair.setLocalZOrder(this.getZOrder());
        var localPos = this.getNextPos(pengGangPair);
        pengGangPair.position = localPos;
        this.lastPair = pengGangPair;
        this.node.addChild(pengGangPair);
        this.pengGangNum ++ ;
    },

    initPengGangPair : function(pengGangPair,mahjongdata,type){  
        var pairCpn = pengGangPair.getComponent('PairCpn');
        pairCpn.setMahjongData(mahjongdata);
        if(type != null || type != undefined){
            pairCpn.setPengGangType(type);
        }
    },

    onCreateCustomPengGangAction : function(seatAtionEvent){
        var uid = seatAtionEvent.uid;
        var fromUid = seatAtionEvent.fromUid;
        var cardData = seatAtionEvent.cardList[0];
        if(!seatAtionEvent.isHaveFromUid()){
            fromUid= uid;
        }
        var pengGangPair = this.newPengGangPair(uid,fromUid);
        var localPos = this.getNextPos(pengGangPair);
        this.initPengGangPair(pengGangPair,cardData);              
        var pairCpn = pengGangPair.getComponent('PairCpn');
        this.pushPengGangPair(pengGangPair);
        pairCpn.playingPengGangAction(this._animationNodePos,localPos,seatAtionEvent.type);
        if(PairCfg.isPeng(seatAtionEvent.type)){
            SoundHelper.playingPeng(cc.mj.gameData.getPlayerData(uid).sex);
        }else if(PairCfg.isGang(seatAtionEvent.type)){
            SoundHelper.playingGang(PairCfg.sound(seatAtionEvent.type),cc.mj.gameData.getPlayerData(uid).sex);
        }
        
    },

    onCreateBuGangAction : function(seatActionEvent){
        var cardData = seatActionEvent.cardList[0];
        var pairCpn = this.findPairCpn(cardData);
        if(!pairCpn){
            console.log('找不到补杠');
        }else{
            pairCpn.playingBuGangAction(this._animationWorldPos);
        }

        var uid = seatActionEvent.uid;
        SoundHelper.playingGang(PairCfg.sound(PairCfg.BU_GANG),cc.mj.gameData.getPlayerData(uid).sex);
    },

    findPairCpn : function(mahjongData){
        for(var i = 0 ; i < this.node.childrenCount; ++i){
            var pairCpn = this.node.children[i].getComponent('PairCpn');
            if(pairCpn && pairCpn.isMahjongDataEqual(mahjongData)){
                return pairCpn;
            }
        }
    },

    getZOrder : function(){
        if(this.pengGangNum == 0){
            return this.initZorder;
        }
        if(this.side == 'left'){
            this.initZorder += 1;
        }else if(this.side == 'right'){
            this.initZorder -= 1;
        }
        return this.initZorder;
    },

    setAnimationPlayWorldPos : function(worldPos){
        this._animationNodePos = this.node.convertToNodeSpaceAR(worldPos);
        this._animationWorldPos = worldPos;
    },

    getNextPos : function(curNode){
        if(this.pengGangNum == 0 ){
            console.log('cc.p(0,0)');
            return cc.p(0,0);
        }
        var width = 0;
        var height = 0;
        if(this.side == 'myself'){
            width = this.lastPair.x + (this.lastPair.width *(1-this.lastPair.anchorX)) + (curNode.width * curNode.anchorX) ;
        }else if(this.side == 'left'){
             height = this.lastPair.y - (this.lastPair.height *this.lastPair.anchorY) - (curNode.height * (1-curNode.anchorY)) ;
        }else if(this.side == 'up'){
            width = this.lastPair.x - (this.lastPair.width *this.lastPair.anchorX) - (curNode.width * (1-curNode.anchorX) );
        }else if(this.side == 'right'){
            height = this.lastPair.y + (this.lastPair.height *(1-this.lastPair.anchorY)) + (curNode.height * curNode.anchorY) ;
        }
        console.log('cc.p(width,height):'+width+'   '+height);
        return cc.p(width,height);
    },

    emitPengGangPaiComplete : function(){
        console.log('动作完毕');
        CommonHelper.emitActionCompelete();
    },

});
