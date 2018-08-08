var DiamondConfig = require('DiamondConfig');
var GoodsConfig = require('GoodsConfig');
var ExchangeConfig = require("ExchangeConfig");

var BackStageConfig =  {

};
BackStageConfig.init = function(config){
    var diamondConfig = config.diamondList;
    var shieldConfig = config.shields;
    var roomCardList = config.roomCardList;
    var exchangeList = config.exchangeList;
    if(diamondConfig){
        DiamondConfig.addDiamondList(diamondConfig.priceList);
    }

    if (exchangeList) {
        ExchangeConfig.addExchangeList(exchangeList);
    }

    //测试代码
    // shieldConfig = {}
    // shieldConfig.displayAgent = false
    // shieldConfig.displayClub = true
    // shieldConfig.displayDiamondOriginalRecharge = true
    // shieldConfig.displayOriginalRechargeWeChatPayment = true
    // shieldConfig.displayOriginalRechargeAlipayPayment = true
    // shieldConfig.displayOriginalRechargeApplePayment = true
    //测试代码
    if(shieldConfig){
        this.shieldConfig = {};
        this.solveShieldConfig(shieldConfig);
    }

    if(roomCardList && roomCardList.length > 0){
        GoodsConfig.addGoodsList(roomCardList);
    }else{
        GoodsConfig.addDefaultData();
    }
};

BackStageConfig.isHaveRecharge = function(){
    if(this.shieldConfig){
        return this.shieldConfig.recharge;
    }else{
        return true;
    }
},

BackStageConfig.solveShieldConfig = function(shieldConfig){
    this.shieldConfig.agent = Boolean(shieldConfig.displayAgent);
    this.shieldConfig.club = Boolean(shieldConfig.displayClub);
    this.shieldConfig.originRecharge = Boolean(shieldConfig.displayDiamondOriginalRecharge);
    this.shieldConfig.originalWeChat = Boolean(shieldConfig.displayOriginalRechargeWeChatPayment);
    this.shieldConfig.originalAlipay = Boolean(shieldConfig.displayOriginalRechargeAlipayPayment);
    this.shieldConfig.originalApple = Boolean(shieldConfig.displayOriginalRechargeApplePayment);
    
    this.shieldConfig.originRecharge = (!this.shieldConfig.originalWeChat && !this.shieldConfig.originalAlipay && !this.shieldConfig.originalApple ) ? false : this.shieldConfig.originRecharge;
    this.shieldConfig.recharge = this.shieldConfig.originRecharge
    if(cc.gameConfig.isHide == true){
        this.shieldConfig.recharge = false;
        this.shieldConfig.agent = false;
        this.shieldConfig.club = false;
    }
},

module.exports = BackStageConfig;
