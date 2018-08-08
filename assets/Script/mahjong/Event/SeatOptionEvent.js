var PairCfg = require('PairCfg');
var Option = function (opt) {
    this.type       = opt.type;
    this.cardList   = opt.cardList || [-1];
    this.getCard = function(){
        if(this.cardList != null  && this.cardList != undefined && this.cardList.length >0){
            return this.cardList[0];
        }
        return null;
    };
};


cc.Class({
    extends: cc.Component,

    properties: {
        EventName : 'SeatOptionEvent',
        optionList : [],
        choiceOption : null,//已经选择的类型，可能为空
        uid : null,
    },

    init : function(opt){
        console.log('seatoptionevent:' + opt);
        var optionList = opt.optionList;
        for(var i = 0; i < optionList.length; ++i){
            this.optionList.push(new Option(optionList[i]));
        }
        this.autoAddOptionQiPai();
    },

    autoAddOptionQiPai : function(){//因为服务端没有加弃牌的选项，所以需要人为加上这个选项
        if(!this.isOnlyHaveChuPaiOption()){
            this.pushOption(PairCfg.QI_PAI);
        }
    },

    isOnlyHaveChuPaiOption : function(){
        return (this.getOptionListLength() == 1 && this.isHavaOption([PairCfg.CHU_PAI]));
    },

    isHavaOption :function(optionTypeArr){
        for(var i = 0 ; i < this.optionList.length ; ++i){
            for(var j = 0 ; j < optionTypeArr.length ; ++j){
                if(this.optionList[i].type == optionTypeArr[j]){
                    return true;
                }
            }
        }
        return false;
    },

    getOption : function(optionTypeArr){
        var optionListOfType = [];
        for(var i = 0 ; i < this.optionList.length ; ++i){
            for(var j = 0 ; j < optionTypeArr.length ; ++j){
                if(this.optionList[i].type == optionTypeArr[j]){
                    optionListOfType.push(this.optionList[i]);
                }
            }
        }    
        return optionListOfType;    
    },

    removeOption : function(optionTypeArr){
        for(var i = 0 ; i < this.optionList.length ; ++i){
            for(var j = 0 ; j < optionTypeArr.length ; ++j){
                if(this.optionList[i].type == optionTypeArr[j]){
                    this.optionList.splice(i,1);
                    --i;
                    break;
                }
            }
        }
    },

    pushOption : function(type,cardList){
        var opt = {'type':type,'cardList':cardList};
        var option = new Option(opt);
        this.optionList.push(option);
    },

    getOptionListLength : function(){
        return this.optionList.length;
    },

    getOptionByIndex : function(index){
        return this.optionList[index];
    },

    // use this for initialization
    onLoad: function () {

    },

    setOptionChoice : function(option){
        var choiceOption = new Option(option);
        var optionTypeArr = [PairCfg.AN_GANG,PairCfg.BU_GANG,PairCfg.MO_HU];
        if(this.isHavaOption(optionTypeArr) && choiceOption.type == PairCfg.CHU_PAI){
            var qiChoiceOption = new Option({'type':PairCfg.QI_PAI});
            this.choiceOption = qiChoiceOption;
        }else{
            this.choiceOption =choiceOption;
        }
        
    },

    isHasSetOptionChoice : function(){
        return !(this.choiceOption == null);
    },

    getChoiceOption : function(){
        return this.choiceOption;
    },
    
    setOptionOwnerUid : function(uid){
        this.uid = uid;
    },
});
