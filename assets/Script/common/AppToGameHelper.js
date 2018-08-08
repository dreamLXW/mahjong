var GameToAppHelper = require("GameToAppHelper");
var AppToGameHelper =  {
   
};

AppToGameHelper.exitGame = function(){//应用主动退出游戏
    GameToAppHelper.ExitGame();
};

AppToGameHelper.backToGame = function(){//返回游戏
    console.log("game返回游戏");
    cc.global.isSmallWindowMode = false;
    var tempClient = require('MjRequestSpecificClient');
    tempClient.requestBusy(false);
    cc.game.setFrameRate(60);

    var mjSoundHelper = require('MjSoundHelper');
    mjSoundHelper.playingBgMusic();
};

AppToGameHelper.onRechargeResponce = function(opt){//游戏充值回调
    cc.global.rootNode.emit("onRechargeResponce",Number(opt.code));
};

module.exports = AppToGameHelper;