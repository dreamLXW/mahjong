var CfgPair = require("PairCfg");
var EventName = require('EventName');
var CommonHelper = require('CommonHelper');
//某个玩家所持有的所有牌信息
var Pair = require('PairData');
var OutCard = require('OutCard');
var MaPai = function(opt){
    this.card = opt.card;
    this.type = opt.type;//0:不输不赢，1:赢 2:输
};
cc.Class({
    extends: cc.Component,

    properties: {
        uid : 0,
        handCardList :  null,
        outCardList : null,
        pairList : null,
        handNumber : 0,
        side  : "",          // ["myself","right","up","left"]
        tempOutCardList : [],
        isSortByGui : false,

        maiMaList : [],
        jiangMaCardList : [],
        isShowMa : true,
    },

    onLoad: function () {
       this.clear(); 
    },

    setSide : function (side) {
        this.side = side;
    },

    isSelf : function () {
        return this.side == "myself";
    },

    isHandsCardListEmpty : function(){
        return (this.handCardList == null || this.handCardList == undefined || this.handCardList.length == 0 );
    },

    clear : function () {
        this.uid            = 0
        this.handCardList   = [];
        this.outCardList    = [];
        this.pairList       = [];
        this.handNumber     = 0;
        this.isSortByGui = false;
    },

    initData : function (opt,seatData) {
        console.log('PlayerMjData initData');
        this._seatData = seatData; 
        this.uid            = opt.uid || 0;
        this.handCardList   = opt.handCardList;
        this.handNumber     = opt.handNumber || this.handCardList.length;
        this.tempOutCardList = [];
        this.outCardList    = [];
        this.pairList       = [];

        var outCardList = opt.outCardList || [];
        var pairList = opt.pairList || [];
        this.initMaiMaList(opt);
        this.initJiangMaCardList(opt);
        for (var i = 0 ; i <  outCardList.length ; ++i) {
            this.outCardList.push(new OutCard(outCardList[i]));
        }
        // if(this.uid == 2){//测试碰杠
        //     this.outCardList.push(new OutCard({'type':CfgPair.CHU_PAI,'number':100,'card':32}));
        // }

        for (var i = 0 ; i <  pairList.length ; ++i) {
            pairList[i].uid = this.uid;
            this.pairList.push(new Pair(pairList[i]));
        }
        this.sortHandCardList(this.isSortByGui);
        this.removeInvalidOutCard();
    },

    setIsShowMa : function(isShowMa){
        this.isShowMa = isShowMa;
    },

    initMaiMaList : function(opt){
        var createMaiMaList = function(fa_or_maiCardList){
            var maList = [];
            for(var i = 0 ; i < fa_or_maiCardList.length; ++i){
                maList.push(new MaPai(fa_or_maiCardList[i]));
            }
            return maList;
        };
        if(opt.maiMaCardList){
            this.maiMaList = createMaiMaList(opt.maiMaCardList);
        }
        if(opt.faMaCardList){
            this.maiMaList = this.maiMaList.concat(createMaiMaList(opt.faMaCardList));
        }

    },

    getFillMaList : function(){//经过填充的马牌信息
        var fillMaList = [];
        if(this.maiMaList.length == 0 || this.isShowMa ==false){
            var faMaNum = cc.mj.gameData.roomInfo.roomConfig.faMaNumber;
            var maiMaNum = cc.mj.gameData.roomInfo.roomConfig.maiMaNumber;
            if( faMaNum > 0 && this.uid == this._seatData.bid){
                for(var i = 0 ; i < faMaNum; ++i){
                    fillMaList.push(new MaPai({'card':-1,'type':0}));
                }
            }
            if( maiMaNum > 0 ){
                for(var i = 0 ; i < maiMaNum; ++i){
                    fillMaList.push(new MaPai({'card':-1,'type':0}));
                }
            }
        }else{
            fillMaList = this.maiMaList;
        }
        return fillMaList;
    },

    initJiangMaCardList : function(opt){
        var initJiangMaCardList = opt.jiangMaCardList;
        if(!initJiangMaCardList){
            return;
        }
        this.jiangMaCardList = [];
        for(var i = 0 ; i < initJiangMaCardList.length; ++i){
            var jiangMaCard = new MaPai(initJiangMaCardList[i]);
            this.jiangMaCardList.push(jiangMaCard);
        }
    },  

    sortHandCardList : function(isSortByGui){//牌按小到大排序，排序时可能会除去最后一张牌
        if(this.handCardList == null || this.handCardList == undefined){
            return;
        };
        this.isSortByGui = isSortByGui;
        var sortByGui = null;
        var sortIncreaseFunc = function(v1, v2){ return (Number(v1) - Number(v2));};
        var guiPai = this._seatData.guiPai; 
        if(isSortByGui && guiPai){
            sortByGui = function(handCardList){
                
                var newArr = [].concat(handCardList);
                for(var i = 0 ; i < newArr.length; ++i){
                    if(newArr[i] == guiPai){
                        newArr.splice(i,1);
                        --i;
                    }
                }
                var removeNum =  handCardList.length - newArr.length ;
                newArr.sort(sortIncreaseFunc);
                handCardList = [];
                for(var j = 0 ; j < removeNum ; ++j){
                    handCardList.push(guiPai);
                }
                handCardList = handCardList.concat(newArr);
                return handCardList;
            };
        }

        if(this.handNumber % 3 == 2){
            var lastData = this.handCardList[this.handCardList.length-1];
            var newarr = [].concat(this.handCardList.slice(0,this.handCardList.length-1));//减去最后一个元素，是刚摸的牌
            if(sortByGui!=null){
                newarr = sortByGui(newarr);
            }else{
                newarr.sort(sortIncreaseFunc);
            }   
            newarr.push(lastData);
            this.handCardList = newarr;
        }else{
            if(sortByGui!=null){
                this.handCardList = sortByGui(this.handCardList);
            }else{
                this.handCardList.sort(sortIncreaseFunc);
            } 
        }
    },

    onSeatAction : function (seatActionEvent) {
        var t = seatActionEvent.type;
        cc.log("player %s onSeatAction %s %s", this.uid, CfgPair.name(t), JSON.stringify(seatActionEvent));

        if (t == CfgPair.CHU_PAI) {
            this.onChuPai(seatActionEvent);
        } else if (t == CfgPair.MO_PAI || t == CfgPair.GANG_MO_PAI) {
            this.onMoPai(seatActionEvent);
        } else if (t == CfgPair.PENG) {
            this.onPeng(seatActionEvent);
        } else if (t == CfgPair.MING_GANG) {
            this.onMingGang(seatActionEvent);
        } else if (t == CfgPair.BU_GANG) {
            this.onBuGang(seatActionEvent);
        } else if (t == CfgPair.AN_GANG) {
            this.onAnGang(seatActionEvent);
        } else{
            console.log("非法的seatoption:type = " + t);
            CommonHelper.emitActionCompelete();
        }
    },

    onBeingSeatAction : function(seatActionEvent){
        var t = seatActionEvent.type;
        if(t == CfgPair.MING_GANG){
            this.onBeingMingGang(seatActionEvent);
        }else if(t == CfgPair.PENG){
            this.onBeingPeng(seatActionEvent);
        }
    },

    //isErrorAlert:如果手牌中没有num张cardData牌是否需要报错
    removeHandCard : function(cardData,removeNum,isErrorAlert){
        if(!this.isHandsCardListEmpty()){
            var num = 0;
            for(var i = 0 ; i < this.handCardList.length ; ++ i){
                if(this.handCardList[i] == cardData){
                    this.handCardList.splice(i,1);
                    ++num;
                    --i;
                    if(num >= removeNum){
                        break;
                    }
                }
            }
            this.handNumber = this.handCardList.length;
        }
        if(num != removeNum){
            console.log('removeHandCard可能出错');
        }
        
    },

    //是不是应该考虑直接只存贮出牌类型的
    removeInvalidOutCard : function(){//只留下类型为出牌的
        this.tempOutCardList = [];
        for(var i = 0 ; i < this.outCardList.length ; ++i){
            console.log(this.outCardList[i]);
            if(this.outCardList[i].type == CfgPair.CHU_PAI){
                this.tempOutCardList.push(this.outCardList[i]);
            }
        }
    },

    emitSeatSettleMjCardDataChange : function(){
        var detail = {'side':this.side,'data':this};
        cc.global.rootNode.emit(EventName.OnSeatSettleMjCardDataChange,detail);
    },

    emitPlayerMjCardDataChange : function(){
        var detail = {'side':this.side,'data':this};
        cc.global.rootNode.emit(EventName.OnPlayerMjCardDataChange,detail);
    },

    emitPlayerMjCardDataInit : function(lastOutCardUid){
        //this.isLastOutCardUid = this.isMeLastOutCardUid(lastOutCardUid);
        this.emitPlayerMjCardDataChange();
    },

    isMeLastOutCardUid : function(lastOutCardUid){
        if(lastOutCardUid != undefined && lastOutCardUid != null){
            if(lastOutCardUid != this.uid || this.outCardList.length == 0 || (this.outCardList.length > 0 && this.outCardList[this.outCardList.length-1].type != CfgPair.CHU_PAI)){
                return false;
            }
        }
        return true;
    },

    onChuPai: function (seatActionEvent) {//出牌
        var cardData = seatActionEvent.cardList[0];
        if(!this.isHandsCardListEmpty()){           
            this.removeHandCard(cardData,1);         
        }else{
            this.handNumber -= 1;
        }
        cc.mj.gameData.seatData.setLastOutCardUid(this.uid);   
         var outCard = seatActionEvent.newOutCard();
         this.outCardList.push(outCard);
         this.tempOutCardList.push(outCard);
         this.sortHandCardList(this.isSortByGui);
         console.log('出牌后:handCardList='+this.handCardList  + ' handNumber= ' + this.handNumber  + ' outCardList: ' + this.outCardList ) ;
         this.emitChuPai(seatActionEvent);
    },

    emitChuPai : function(seatActionEvent){
        var side = this.side;
        var data = {'data' : seatActionEvent , 'handCardList' : this.handCardList , 'handNumber' : this.handNumber, 'outCardNumber' : this.tempOutCardList.length};
        var detail = {'side' : side , 'data' : data};
        cc.global.rootNode.emit(EventName.OnChuPaiAction,detail);
    },

    onMoPai : function (seatActionEvent) {//摸牌
        if(!this.isHandsCardListEmpty()){
            var cardData = seatActionEvent.cardList[0];
            this.handCardList.push(cardData);
            this.handNumber = this.handCardList.length;
        }else{
            this.handNumber += 1;
        }    
        this.emitMoPai();    
    },

    emitMoPai : function(){
        var data = {'handCardList':this.handCardList,'handNumber':this.handNumber};
        var detail = {'side':this.side,'data' : data};  
        cc.global.rootNode.emit(EventName.OnMoPaiAction,detail);
    },

    emitPengGangPai : function(seatActionEvent){
        var detail = {'side':this.side,'data' : seatActionEvent, 'uid':this.uid};  
        cc.global.rootNode.emit(EventName.OnPengGangPaiAction,detail);
    },

    onPeng : function (seatActionEvent) {//碰牌
        console.log('onpeng'+seatActionEvent);
        var cardData = seatActionEvent.cardList[0];
        if(!this.isHandsCardListEmpty()){           
            this.removeHandCard(cardData,2);         
        }else{
            this.handNumber -= 2;
        }  
        this.emitPlayerMjCardDataChange();
        this.onPengGangCustomControl(seatActionEvent);
    },

    onPengGangCustomControl : function(seatActionEvent){
        var pair = seatActionEvent.newPairData();
        this.pairList.push(pair);
        this.emitPengGangPai(seatActionEvent);
    },

    onMingGang : function (seatActionEvent) {//明杠
        var cardData = seatActionEvent.cardList[0];
        if(!this.isHandsCardListEmpty()){           
            this.removeHandCard(cardData,3);         
        }else{
            this.handNumber -= 3;
        }
        this.emitPlayerMjCardDataChange();
        this.onPengGangCustomControl(seatActionEvent);
    },

    onAnGang : function (seatActionEvent) {//暗杠
        var cardData = seatActionEvent.cardList[0];
        if(!this.isHandsCardListEmpty()){           
            this.removeHandCard(cardData,4);         
        }else{
            this.handNumber -= 4;
        }
        this.sortHandCardList(this.isSortByGui);
        this.emitPlayerMjCardDataChange();
        this.onPengGangCustomControl(seatActionEvent);    
    },

    onBuGang : function (seatActionEvent) {//补杠
        var cardData = seatActionEvent.cardList[0];
        if(!this.isHandsCardListEmpty()){           
            this.removeHandCard(cardData,1);         
        }else{
            this.handNumber -= 1
        }
        this.emitPlayerMjCardDataChange();
        //补杠不创造新的pair ,是修改pair
        for(var i = 0 ; i < this.pairList.length ; ++i){
            var pair = this.pairList[i];
            if(pair.type == CfgPair.PENG && pair.cardList[0] == cardData){
                pair.type = CfgPair.BU_GANG;
            }
        }
         this.emitPengGangPai(seatActionEvent);
        //this.onPengGangCustomControl(seatActionEvent);
    },

    onBeingPeng : function(seatActionEvent){//被碰
        var cardData = seatActionEvent.cardList[0];
        this.removeLastOutCardAndValidate(cardData,CfgPair.PENG);
        this.emitPlayerMjCardDataInit(this.uid);
        cc.mj.gameData.seatData.checkLastOutCardSide();
    },

    onBeingMingGang : function(seatActionEvent){//被杠
        var cardData = seatActionEvent.cardList[0];
        this.removeLastOutCardAndValidate(cardData,CfgPair.MING_GANG);
        this.emitPlayerMjCardDataInit(this.uid);
        cc.mj.gameData.seatData.checkLastOutCardSide();
    },

    removeLastOutCardAndValidate : function(cardData,type){
        if(this.outCardList.length ==0 ){
            console.log('没有最后一张牌');
            return;
        }
        var lastIndex = this.outCardList.length -1;
        if(this.outCardList[lastIndex].card != cardData){
            console.log('最后一张牌不是'+cardData,'而是'+this.outCardList[0].card);
            return;
        }
        this.outCardList[lastIndex].type = type;
        this.removeInvalidOutCard();
    },

    addHandCard : function(card){
        this.handCardList.push(card);
        this.handNumber = this.handCardList.length;
        this.sortHandCardList(this.isSortByGui);
    },

    getLastOutCardSide : function(){
        var side = this.side;
        if(this.tempOutCardList.length > 40){
            var sideMap = {"myself":"right","up":"left"};
            side = sideMap[this.side];
        }
        return side;
    },
});
