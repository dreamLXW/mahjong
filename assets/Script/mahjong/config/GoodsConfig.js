var Goods = function(goods){
    this.name = goods.name;
    this.diamond = goods.diamond || goods.roomCard;
    this.type = goods.type;
    this.tag = goods.tag || "";
    this.goodsId = goods.id;
    this.gameNum = goods.gameNum;
    this.rawOpt = JSON.stringify(goods);
    this.getRawOpt = function () {
        return JSON.parse(this.rawOpt);
    }
};

var GoodsConfig =  {
    "goodsList" : {
    },
};
GoodsConfig.addGoodsList = function(addGoodsList){
    var goodsList = this.goodsList;
    for(var i = 0 ; i < addGoodsList.length; ++i){
        var goods = addGoodsList[i];
        goodsList[goods.id] = new Goods(goods);
    }
};

GoodsConfig.getGoodsById = function(goodsId){
    var goods = this.goodsList[goodsId];
    return goods;
};

GoodsConfig.getGoodsListByType = function(type){
    var goodsList = [];
    for(var goodsId in this.goodsList){
        var goods = this.goodsList[goodsId];
        if(goods.type == type){
            goodsList.push(GoodsConfig.getGoodsById(goods.goodsId))
        }
    }
    return goodsList;
};

GoodsConfig.isTypeAllFree = function(type){
    var goodList = GoodsConfig.getGoodsListByType(type);
    var isFree = true;
    for(var i = 0 ; i < goodList.length; ++i){
        if(goodList[i].diamond > 0 ){
            isFree = false
            break;
        }
    }
    return isFree;
};

GoodsConfig.addDefaultData = function(){  
    var goodsList = [{"name":"16局","type":1,"id":1,"gameNum":16,"diamond":6,"tag":""},
    {"name":"8局","type":1,"id":2,"gameNum":8,"diamond":3},
    {"name":"16局","type":2,"id":3,"gameNum":16,"diamond":6},
    {"name":"8局","type":2,"id":4,"gameNum":8,"diamond":3},
    {"name":"16局","type":3,"id":5,"gameNum":16,"diamond":6},
    {"name":"8局","type":3,"id":6,"gameNum":8,"diamond":3}];
    GoodsConfig.addGoodsList(goodsList);
};

module.exports = GoodsConfig;
