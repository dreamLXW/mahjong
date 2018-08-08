var TempClient = require('MjRequestSpecificClient');
var PairCfg = require('PairCfg');
var SeatOptionEvent = require('SeatOptionEvent')
cc.Class({
    extends: cc.Component,

    properties: {
       chiBtn : {
            type : cc.Button,
            default : null,
       },
       pengBtn : {
            type : cc.Button,
            default : null,
       },
       huBtn : {
            type : cc.Button,
            default : null,
       },
       gangBtn : {
            type : cc.Button,
            default : null,
       },
       guoBtn : {
            type : cc.Button,
            default : null,
       },
       multiGangRootNode : {
            type : cc.Node,
            default : null,
       },
       customOptionRootNode : {
            type : cc.Node,
            default : null,
       },
       multiGangBtnArr : {
            type : cc.Node,
            default :[],
       },
       _seatOptionEvent : SeatOptionEvent,
       _myHandsMahjongCpn : null,      
    },

    // use this for initialization
    onLoad: function () {
        this.chiBtn.node.active = false;
        this.setVisible(false);
        this.showMultiGangView(null);
    },

    onClickBtnChi : function(){//不实现
    },

    onClickBtnGuo : function(){
        var optionTypeArr = [PairCfg.PENG,PairCfg.MING_GANG,PairCfg.CHI_HU,PairCfg.QIANG_GANG_HU];
        if(this._seatOptionEvent.isHavaOption(optionTypeArr)){//发送网络请求
            TempClient.requestGuo();
            this.clearOptionList();
            this.showBtn();
        }else{//暗杠，补杠，自摸胡
            var optionTypeArr = [PairCfg.AN_GANG,PairCfg.BU_GANG,PairCfg.MO_HU,PairCfg.QI_PAI];
            this._seatOptionEvent.removeOption(optionTypeArr);
            //this._seatOptionEvent.pushOption(PairCfg.CHU_PAI);
        }
        this.showBtn();
    },

    onClickMultiGangBtn : function(event,customEventData){
            //var node = event.target;
            console.log('customEventData:'  + customEventData) ;
            var node = this.multiGangBtnArr[customEventData];
            var option = node.gangOption;
            var type = option.type;
            var card = option.cardList[0];
            console.log('type : ' +  type + 'card:' + card);
            TempClient.requestGang(type,card);
            this.showMultiGangView(null);
    },

    clearOptionList : function(){
        this._seatOptionEvent = null;
    },  

    onClickBtnPeng : function(){
        TempClient.requestPeng();
        // var PairCfg = require('PairCfg');//测试碰 
        // var id = cc.mj.ownUserData.uid;
        // var type = PairCfg.PENG;
        // var cardList = [32];
        // var fromuid = 2;
        // var msg = {'uid':id,'type':type,'cardList':cardList,'number':10,'nextUid':id,'fromuid':fromuid,'number':101};
        // cc.mj.netMgr.onSeatAction(msg);

        this.clearOptionList();
        this.showBtn();
    },

    onClickBtnGang : function(){
        var optionTypeList = [PairCfg.BU_GANG,PairCfg.MING_GANG,PairCfg.AN_GANG];
        var optionListGOfGang = this._seatOptionEvent.getOption(optionTypeList);
        var optionListGOfGangLength = 0;
        for(var i = 0 ; i < optionListGOfGang.length ; ++i){
            optionListGOfGangLength += optionListGOfGang[i].cardList.length;
        }
        if(optionListGOfGangLength == 0){
            console.log('没有杠');
        }else if(optionListGOfGangLength == 1){
            var option = optionListGOfGang[0];
            var type = option.type;
            var card = option.cardList[0];
            TempClient.requestGang(type,card);
        }else{
            this.showMultiGangView(optionListGOfGang,optionListGOfGangLength);
        }
        this.clearOptionList();
        this.showBtn();
    },

    onClickBtnHu : function(){ 
        var optionTypeList = [PairCfg.MO_HU,PairCfg.QIANG_GANG_HU,PairCfg.CHI_HU];
        var optionListGOfHu = this._seatOptionEvent.getOption(optionTypeList);
        var optionListGOfHuLength = optionListGOfHu.length;
        if(optionListGOfHuLength == 0){
            console.log('没有胡');
        }else if(optionListGOfHuLength == 1){
            var option = optionListGOfHu[0];
            var type = option.type;
            TempClient.requestHu(type);
        }else{
            console.log('出错');
        }
        this.clearOptionList();
        this.showBtn();
    },

    showMultiGangView : function(optionListOfGang,length){
        if(optionListOfGang == undefined || optionListOfGang == null){
            if(this.multiGangRootNode){
                this.multiGangRootNode.active = false;
            }
            return;
        }
        var optionListGOfGangLength = length;
        if(optionListGOfGangLength < 2 || optionListGOfGangLength > 3 ){
            console.log('检查是否有错误');
            return;
        }

        var initMultiGangBtnArr = function(self,index,cardData,pairType){
            for(var j = 0 ; j < self.multiGangBtnArr[index].childrenCount; ++j){
                var commonMjNode = self.multiGangBtnArr[index].children[j];
                commonMjNode.active = true;
                var commonMjCardCpn = commonMjNode.getComponent('CommonMjCardCpn');
                if(!commonMjCardCpn){
                    commonMjCardCpn = commonMjNode.addComponent('CommonMjCardCpn');
                }
                commonMjCardCpn.setMahjongData(cardData);
            }
            self.multiGangBtnArr[index].gangOption = {'type':pairType,'cardList':[cardData]};
        };

        this.multiGangRootNode.active = true;
        this.multiGangBtnArr[2].active = (optionListGOfGangLength == 3);
        var index = 0;
        for(var i = 0 ; i < optionListOfGang.length; ++i){
            var option = optionListOfGang[i];
            var pairType = option.type;
            for(var k = 0 ; k < option.cardList.length ; ++k){
                var cardData = option.cardList[k];
                initMultiGangBtnArr(this,index,cardData,pairType);
                index++;
            }
        }
    },

    showBtn : function(){
        if(!this._seatOptionEvent || this._seatOptionEvent.getOptionListLength() == 0){
            this.setCustomOptionVisible(false);
            return;
        }
        if(this._seatOptionEvent.isOnlyHaveChuPaiOption()){
            //出牌
            if(this._myHandsMahjongCpn){
                this._myHandsMahjongCpn.unLock();
            }else{
                console.log('选项组件未被正确初始化');
            }
            this.setCustomOptionVisible(false);
            return;
        }
        this.setVisible(true);
        this.setCustomOptionVisible(true);
        var huTypeList = [PairCfg.MO_HU,PairCfg.QIANG_GANG_HU,PairCfg.CHI_HU];
        var gangTypeList = [PairCfg.BU_GANG,PairCfg.MING_GANG,PairCfg.AN_GANG];
        var pengTypeList = [PairCfg.PENG];
        var guoTypeList = [PairCfg.QI_PAI];
        var isHavePeng = this._seatOptionEvent.isHavaOption(pengTypeList);
        var isHaveGang = this._seatOptionEvent.isHavaOption(gangTypeList);
        var isHaveHu = this._seatOptionEvent.isHavaOption(huTypeList);
        var isHaveGuo = this._seatOptionEvent.isHavaOption(guoTypeList);
        this.pengBtn.node.active = isHavePeng;
        this.gangBtn.node.active = isHaveGang;
        this.huBtn.node.active = isHaveHu;
        this.guoBtn.node.active = isHaveGuo;
    },

    setVisible : function(isVisible){  
        this.node.active = isVisible;
    },

    setCustomOptionVisible : function(isVisible){
        this.customOptionRootNode.active = isVisible;
    },

    setMyHandsMahjongCpn : function(myHandsMahjongCpn){
        this._myHandsMahjongCpn = myHandsMahjongCpn;
    },

    onSeatOptionChange : function(seatOptionEvent){
        this._seatOptionEvent = seatOptionEvent;
        this.showBtn();
    },

    getOptionBtnNode : function(type){
        this.customOptionRootNode.getComponent(cc.Layout).updateLayout();
        var isOptionMap = {'peng':PairCfg.isPeng(type),'gang':PairCfg.isGang(type),'hu':PairCfg.isHu(type),'guo':PairCfg.isQi(type)};
        var node = null;
        for(var prefixName in isOptionMap){
            if(isOptionMap[prefixName] == true ){
                var name = prefixName + 'Btn';
                return this[name];
            }
        }
        return null;
    },
});
