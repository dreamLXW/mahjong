var GameToAppHelper =  {
   
};

GameToAppHelper.weChatRoomInvite = function(param){//邀请微信进入房间
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'weChatRoomInvite';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'weChatRoomInvite:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
};

GameToAppHelper.dingdingRoomInvite = function(param){//丁丁邀请进入房间
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'dingdingRoomInvite';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'dingdingRoomInvite:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
};

GameToAppHelper.shareGameToWeChatFriend = function(){//微信好友分享游戏
    var gameId = cc.gameConfig.gameId;
    var param = {'gameId':gameId};
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){       
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'shareGameToWeChatFriend';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'shareGameToWeChatFriend:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
};

GameToAppHelper.shareGameToWeChatMoment = function(){//微信朋友圈分享游戏
    var gameId = cc.gameConfig.gameId;
    var param = {'gameId':gameId};
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){       
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'shareGameToWeChatMoment';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'shareGameToWeChatMoment:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
};


GameToAppHelper.sharePicToWeChatMoment = function(imagePath){//分享图片到微信朋友圈
    var roomId = cc.mj.gameData.roomInfo.roomId;
    var gameId = cc.gameConfig.gameId;
    var param = {'roomId':roomId,'gameId':gameId,'shareImagePath':imagePath};
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){       
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'sharePicToWeChatMoment';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'sharePicToWeChatMoment:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
};

GameToAppHelper.sharePicToDingdingMoment = function(imagePath){//分享图片到丁丁朋友圈
    var roomId = cc.mj.gameData.roomInfo.roomId;
    var gameId = cc.gameConfig.gameId;
    var param = {'roomId':roomId,'gameId':gameId,'shareImagePath':imagePath};
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){       
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'sharePicToDingdingMoment';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'sharePicToDingdingMoment:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
};

GameToAppHelper.sharePicToWeChatFriend = function(imagePath){//分享图片到微信好友
    var roomId = cc.mj.gameData.roomInfo.roomId;
    var gameId = cc.gameConfig.gameId;
    var param = {'roomId':roomId,'gameId':gameId,'shareImagePath':imagePath};
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){         
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'sharePicToWeChatFriend';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'sharePicToWeChatFriend:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
};

GameToAppHelper.sharePicToDingdingFriend = function(imagePath){//分享图片到丁丁好友
    var roomId = cc.mj.gameData.roomInfo.roomId;
    var gameId = cc.gameConfig.gameId;
    var param = {'roomId':roomId,'gameId':gameId,'shareImagePath':imagePath};
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){        
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'sharePicToDingdingFriend';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'sharePicToDingdingFriend:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
};

GameToAppHelper.getGameEnterInitData = function(){//获取游戏关键信息
    var data = null;
    // var data = {'gameData':{'clubInviteCode':"287833"}};
    // var dataList = [{'gameId':2,'uid':600014,'uToken':'600014','serverType':'local'},
    // {'gameId':2,'uid':600023,'uToken':'600023','serverType':'local'},
    // {'gameId':2,'uid':600024,'uToken':'600024','serverType':'local'},
    // {'gameId':2,'uid':600025,'uToken':'600025','serverType':'local'},
    // {'gameId':2,'uid':600026,'uToken':'600025','serverType':'local'},
    // {'gameId':2,'uid':600027,'uToken':'600025','serverType':'local'},
    // {'gameId':2,'uid':600028,'uToken':'600025','serverType':'local'},];
    // var CommonHelper = require('CommonHelper');
    // var index = CommonHelper.GetRandomNum(0,dataList.length-1);
    // data = dataList[index];
    // data = JSON.stringify(data);
    if(cc.sys.isNative){        
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'getGameEnterInitData';
            var mathodSignature = '()Ljava/lang/String;';
            data = jsb.reflection.callStaticMethod(className,mathodName,mathodSignature);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'getGameEnterInitData';
            data = jsb.reflection.callStaticMethod(className,mathodName); 
        }  
    }
    console.log(data);
    return data;
};

GameToAppHelper.backToApp = function(){
    console.log('game小窗口');
    cc.global.isSmallWindowMode = true;
    if(cc.sys.isNative){
        var tempClient = require('MjRequestSpecificClient');
        var mjSoundHelper = require('MjSoundHelper');
        tempClient.requestBusy(true);
        cc.game.setFrameRate(24);
        mjSoundHelper.stopBgMusic();
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'backToApp';
            var mathodSignature = '()V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'CommonHelper';
            var mathodName = 'backToApp';
            jsb.reflection.callStaticMethod(className,mathodName); 
        }  
    }
};

GameToAppHelper.ExitGame = function(){
    console.log('ExitGame');
    cc.audioEngine.stopAll();
    cc.game.end();
    if(cc.sys.isNative){        
        if(cc.sys.os == cc.sys.OS_ANDROID){

        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'ExitGame';
            jsb.reflection.callStaticMethod(className,mathodName); 
        }  
    }
};

GameToAppHelper.isIphoneX = function(){
    if(cc.sys.isNative){        
        if(cc.sys.os == cc.sys.OS_ANDROID){
            return false;
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'isIphoneX';
            var isIponeX = jsb.reflection.callStaticMethod(className,mathodName); 
            return isIponeX;
        }  
    }
    return false;
};

GameToAppHelper.CopyFile = function(filePath1,filePath2){
    if(cc.sys.isNative){        
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'org/cocos2dx/javascript/AppActivity';
            var mathodName = 'CopySdcardFile';
            var mathodSignature = '(Ljava/lang/String;Ljava/lang/String;)I';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,filePath1,filePath2);            
        }else if(cc.sys.os == cc.sys.OS_IOS){
        }  
    }
};


GameToAppHelper.shareCreateClubGame = function(param){//创建群房间
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'shareCreateClubGame';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'shareCreateClubGame:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
};

GameToAppHelper.goToAgentPage = function(){//跳到代理页面
    if(cc.sys.isNative){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'goToAgentPage';
            var mathodSignature = '()V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'goToAgentPage';
            jsb.reflection.callStaticMethod(className,mathodName); 
        }  
    }
};

GameToAppHelper.executeRecharge = function(goodsId,payType){//充值
    var DiamondConfig = require('DiamondConfig');
    var diamond = DiamondConfig.getDiamondById(goodsId);
    var param = {'goodsId':goodsId,'payType':payType};
    param.amount = diamond.amount;
    param.price = diamond.money; 
    param.giveAmount = diamond.giveAmount;
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'executeRecharge';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'executeRecharge:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
};

//邀请微信加入好友圈
GameToAppHelper.inviteWeChatJoinClub = function(param){
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){       
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'inviteWeChatJoinClub';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'inviteWeChatJoinClub:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
},

//邀请丁丁加入好友圈
GameToAppHelper.inviteDingdingJoinClub = function(param){
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if(cc.sys.isNative){       
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'inviteDingdingJoinClub';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,paramStr);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'AppContactHelper';
            var mathodName = 'inviteDingdingJoinClub:';
            jsb.reflection.callStaticMethod(className,mathodName,paramStr); 
        }  
    }
},

module.exports = GameToAppHelper;
