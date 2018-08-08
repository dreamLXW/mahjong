var Diamond = function(diamond){
    this.name = diamond.name;
    this.money = diamond.money;
    this.type = "diamond";
    this.flag = diamond.flag;
    this.diamondId = diamond.id;
    this.amount = diamond.amount;
    this.giveAmount = diamond.giveAmount;
    this.sort = diamond.sort;
};
var DiamondConfig =  {
    "diamondList" : {
    },
    diamondidsortlist:[],
};
DiamondConfig.addDiamondList = function(addDiamondList){
    for(var i = 0 ; i < addDiamondList.length; ++i){
        var diamond = new Diamond(addDiamondList[i]);
        this.diamondList[diamond.diamondId] = diamond;
        this.diamondidsortlist.push(diamond.diamondId);
    }
};

DiamondConfig.getDiamondById = function(diamondId){
    var diamond = this.diamondList[diamondId];
    return diamond;
};

DiamondConfig.getDiamondListByFlag = function(flag){
    var goodsList = [];
    for(var i = 0 ; i < this.diamondidsortlist.length; ++i){
        var diamondID = this.diamondidsortlist[i];
        var goods = this.getDiamondById(diamondID);
        if (goods.flag == flag) {
            goodsList.push(goods);
        }
    }
    return goodsList;
};

module.exports = DiamondConfig;
