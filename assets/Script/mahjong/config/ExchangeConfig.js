var Exchange = function(data){
    this.exchangeId = data.id;
    this.name = data.name;
    this.type = data.type;
    this.diamond = data.diamond;
    this.amount = data.amount;
    this.sort = data.sort;
    this.giveAmount = data.giveAmount;
    this.giveStartTime = data.giveStarttime;
    this.giveEndTime = data.giveEndtime;
    this.rawOpt = JSON.stringify(data);
    this.getRawOpt = function () {
        return JSON.parse(this.rawOpt);
    }
};

var ExchangeConfig =  {
    "exchangeList" : {
    },
    exchangesortlist:[],
};

ExchangeConfig.addExchangeList = function(addExchangeList){
    for(var i = 0 ; i < addExchangeList.length; ++i){
        var exchange = new Exchange(addExchangeList[i])
        this.exchangeList[exchange.exchangeId] = exchange;
        this.exchangesortlist.push(exchange.exchangeId);
    }
};

ExchangeConfig.getExchangeById = function(exchangeId){
    var exchange = this.exchangeList[exchangeId];
    return exchange;
};

ExchangeConfig.getExchangeListByType = function(type){
    var goodsList = [];
    for (var i = 0; i < this.exchangesortlist.length; ++i) {
        var exchangeId = this.exchangesortlist[i];
        var goods = this.getExchangeById(exchangeId);
        if (goods.type == type) {
            goodsList.push(goods);
        }
    }
    return goodsList;
};

module.exports = ExchangeConfig;
