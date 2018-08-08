var CommonHelper = require('CommonHelper');
var Player = require('PlayerData');
var TempClient = require('MjRequestSpecificClient');
var ProtoUtil = require('ProtoUtil');
var Code = require('CodeCfg');
var MjSoundHelper = require('MjSoundHelper');

var GameToWechatGameHelper =  {
    innerAudioContext : null,
    fileSystemManager : null,
    
    bgInnerAudioContext : null,
};

var wechatAgent = "Chvjtg168899";

var USER_INFO_BTN = 1;
var SETTING_BTN = 2;

GameToWechatGameHelper.LOGIN_FAIL = "LOGIN_FAIL";
GameToWechatGameHelper.AUTH_FAIL = "AUTH_FAIL";
GameToWechatGameHelper.UNKOWN_FAIL = "UNKOWN_FAIL";
GameToWechatGameHelper.CANCEL_SETTING = "CANCEL_SETTING";
GameToWechatGameHelper.weiChatLogin = function(weChatLoginCb){//weChatLoginCb(status,initUserData||failCode) status = true || false
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        var upLoadWeChatJscode = function(jsonCode){
            TempClient.weChatUserLogin(jsonCode,function(customHttpRequest){
                if(customHttpRequest){
                    console.log('weChatUserLogin:' + customHttpRequest.xhr.responseText);
                    var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
                    if(cbdata.code == Code.OK){    
                        var decodeData = ProtoUtil.decode(cbdata);
                        weChatLoginCb(true,decodeData)
                    }else{
                        weChatLoginCb(false,GameToWechatGameHelper.UNKOWN_FAIL);
                    }
                }else{  
                    weChatLoginCb(false,GameToWechatGameHelper.UNKOWN_FAIL);
                }
            });
        };
        var self = this;
        var weiXinLoginSuc = function(res){
            var jsCode = res.code;
            console.log("登录微信成功 jscode = " + jsCode);
            upLoadWeChatJscode(jsCode);
        };
        var weiXinLoginFail = function(){
            console.log("微信登录失败");
            weChatLoginCb(false,GameToWechatGameHelper.LOGIN_FAIL);
        }
        console.log("登录微信");
        wx.login({"success":weiXinLoginSuc,"fail":weiXinLoginFail})
    }
},

GameToWechatGameHelper.getWeiChatUserInfo = function(weChatUserInfoCb, getUserInfoTipsNode){//weChatUserInfoCb(status,res||failCode) status = true || false
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        var weiXinGetUserInfoSucCb = function(res){
            getUserInfoTipsNode.active = false;
            if (res.errMsg.indexOf('ok') > -1) {
                console.log("获取用户信息成功 = " + JSON.stringify(res));
                weChatUserInfoCb(true,res);
            }
        };

        var weiXinGetUserInfoForButton = function (res) {
            getUserInfoTipsNode.active = false;
            if (res.errMsg.indexOf('ok') > -1) {
                console.log("获取用户信息成功 = " + JSON.stringify(res));
                weChatUserInfoCb(true, res);
            } else {
                if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                    weChatUserInfoCb(false, GameToWechatGameHelper.AUTH_FAIL);
                } else {
                    weChatUserInfoCb(false, GameToWechatGameHelper.UNKOWN_FAIL);
                }
            }
        };

        var getUserInfo = function(res){
            if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                weChatUserInfoCb(false, GameToWechatGameHelper.AUTH_FAIL);
            } else {
                console.log("获取用户信息");
                var image = "loading_btn_accredit";
                var imageName = "res/raw-assets/resources/mahjong/png/" + image + ".png";
                if (cc.loader.md5Pipe) {
                    imageName = cc.loader.md5Pipe.transformURL(imageName);
                }
                var version = "2.0.1";
                var type = "image";
                var imageUrl = wxDownloader.REMOTE_SERVER_ROOT + "/" + imageName;
                var text = "";
                var buttonType = USER_INFO_BTN;
                GameToWechatGameHelper.createButtonByWechat(version, type, imageUrl, text, weiXinGetUserInfoForButton, weChatUserInfoCb, buttonType);
            }
        };

        GameToWechatGameHelper.checkWechatSession(
            function(status){
                if(status == false){
                    console.log("准备退出游戏");
                    weChatUserInfoCb(false,GameToWechatGameHelper.LOGIN_FAIL);
                }else{
                    wx.getUserInfo({"withCredentials":true,"lang":"zh_CN","success":weiXinGetUserInfoSucCb,"fail":getUserInfo})
                }
            }
        )
    }
},

GameToWechatGameHelper.checkWechatSession = function (weChatSessionCb) {//weChatSessionCb(status) status = true || false
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        console.log("检查session是否有效的接口");
        var self = this;
        wx.checkSession({
            success : function (res) {
                console.log("success code " + res.errMsg);
                weChatSessionCb(true);
            },
            fail : function (res) {
                console.log("success code " + res.errMsg);
                GameToWechatGameHelper.weiChatLogin(weChatSessionCb);
            },
        });
    }

};

GameToWechatGameHelper.getLocation = function (getLocationCb) {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        wx.getLocation({
            success : function (res) {
                getLocationCb(true,res);
            },
            fail : function (res) {
                getLocationCb(false,GameToWechatGameHelper.AUTH_FAIL);
            },
        });
    }    
},

GameToWechatGameHelper.getSetting = function (scope,getSettingCb) {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        wx.getSetting({
            "success":function(res){
                if(res.authSetting[scope] == true){
                    getSettingCb(true);
                }else{
                    getSettingCb(false);
                }
            },
            "fail":function(){
                console.log("");
            }
        })
    }    
},

GameToWechatGameHelper.getOpenSetting = function (openSettingCb) {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        var version = "2.0.7";
        var type = "image";
        var image = "loading_btn_setting";
        var imageName = "res/raw-assets/resources/mahjong/png/" + image + ".png";
        if (cc.loader.md5Pipe) {
            imageName = cc.loader.md5Pipe.transformURL(imageName);
        }
        console.log("====imageName====", imageName)
        var imageUrl = wxDownloader.REMOTE_SERVER_ROOT + "/" + imageName;
        console.log("=====imageUrl=====", imageUrl)
        var text = "点击进入设置";
        var eventSuc = function (res) {
            openSettingCb(true,res);
        };
        var buttonType = SETTING_BTN;
        GameToWechatGameHelper.createButtonByWechat(version,type,imageUrl,text,eventSuc,openSettingCb,buttonType);
    }
},

GameToWechatGameHelper.createButtonByWechat = function (version, type, imageUrl, text, eventSuc, eventFal, buttonType) {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        if(GameToWechatGameHelper.compareSdkVersion(version) >= 0){
            var buttonHeight = 49;
            var buttonWidth = 146;
            var systemInfo = wx.getSystemInfoSync();
            var screenWidth = systemInfo.screenWidth;
            var screenHeight = systemInfo.screenHeight;
            var obj = {
                type: type,
                text: text,
                image:imageUrl,
                style: {
                    left: (screenWidth - buttonWidth) * 0.5 ,
                    top: (screenHeight - buttonHeight) * 0.55,
                    width: buttonWidth,
                    height: buttonHeight,
                    lineHeight: 40,
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            };
            var userButton = null;
            if (buttonType == USER_INFO_BTN) {
                userButton = wx.createUserInfoButton(obj);
            } else {
                userButton = wx.createOpenSettingButton(obj);
            }
            userButton.show();
            userButton.onTap(function(res){
                console.log(JSON.stringify(res));
                eventSuc(res);
                userButton.destroy();
            })
        } else {
            eventFal(false,GameToWechatGameHelper.UNKOWN_FAIL);
        }
    }
},

GameToWechatGameHelper.goToAgentPage = function () {
    var self = this;
    CommonHelper.showMessageBox('提示',"请联系客服微信：" + wechatAgent + "\n(点击确定可复制客服微信)",function(){
        self.copyText(wechatAgent);
    },null,false);
},

GameToWechatGameHelper.copyText = function (str) {
    wx.setClipboardData({
        data : str,
        success : function (res) {
            CommonHelper.showTips("复制成功");
        },
        fail : function (res) {
            CommonHelper.showTips("复制失败，失败信息 " + res.errMsg);
        }
    });     
},

GameToWechatGameHelper.ExitGame = function (str) {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        wx.exitMiniProgram();
    }
},

GameToWechatGameHelper.executeRecharge = function(goodsId,payType){
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        var DiamondConfig = require('DiamondConfig');
        var AppToGameHelper = require('AppToGameHelper');
        var SystemConfig = require('SystemConfig');
        var diamond = DiamondConfig.getDiamondById(goodsId);
        var buyQuantity = diamond.amount;
        var price = diamond.money; 
        var createRechargeData = {"uid":cc.mj.ownUserData.uid,"diamond_id":goodsId,"money":price};

        var executeMiDasPay = function(order_no){
            var updateRechargeData = {"uid":cc.mj.ownUserData.uid,"order_no":order_no};

            var onUpdateRecharge = function(customHttpRequest){
                if(customHttpRequest){
                    console.log('onUpdateRecharge:' + customHttpRequest.xhr.responseText);
                    var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
                    if(cbdata.code == Code.OK){    
                        AppToGameHelper.onRechargeResponce({code:1});
                    }else{
                        CommonHelper.showMessageBox("提示","修改订单状态出错",function(){},null,false);
                    }
                }else{  
                    CommonHelper.showMessageBox("提示","修改订单状态超时，请重新尝试",function(){updateRecharge();},null,false);
                }
            }

            var updateRecharge = function(){
                console.log("updateRechargeData",JSON.stringify(updateRechargeData));
                TempClient.updateRecharge(updateRechargeData,onUpdateRecharge);
            }

            var onExecuteMiDasPaySuccess = function(){
                //updateRechargeData.status = 1;
                updateRecharge();
            }
            var onExecuteMiDasPayFail = function(res){
                // updateRechargeData.status = 2;
                // updateRecharge();
                var errCode = res.errCode;
                if(errCode != 1){//1为用户取消支付
                    CommonHelper.showTips("充值失败,请稍后尝试,code=" + res.errCode)
                }
            }

            wx.requestMidasPayment(
                {
                "mode":"game",
                "offerId":"1450014261",
                "currencyType":"CNY",
                "buyQuantity":buyQuantity,
                "env":SystemConfig.getEvnCode(),
                "platform":"android",
                "zoneId":"1",
                "success":onExecuteMiDasPaySuccess,
                "fail":onExecuteMiDasPayFail
            }
        )
        };

        var onCreateRecharge = function(customHttpRequest){
            if(customHttpRequest){
                console.log('onCreateRecharge:' + customHttpRequest.xhr.responseText);
                var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
                if(cbdata.code == Code.OK){    
                    var decodeData = ProtoUtil.decode(cbdata);
                    var order_no = decodeData.orderNo;  
                    GameToWechatGameHelper.checkWechatSession(
                        function(status){
                            if(status == false){
                                CommonHelper.showMessageBox("提示","登录出错");
                            }else{
                                executeMiDasPay(order_no);
                            }
                        }
                    )
                }else{
                    CommonHelper.showMessageBox("提示","生成订单出错",function(){},null,false);
                }
            }else{  
                CommonHelper.showMessageBox("提示","生成订单超时，请重新尝试",function(){},null,false);
            }
        }
        TempClient.createRecharge(createRechargeData,onCreateRecharge);
    }
    
},

//添加右上角分享功能按钮
GameToWechatGameHelper.addShareBtn = function () {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        wx.showShareMenu({
            withShareTicket : false,
            success : function (res) {
                console.log("showShareMenu success " + res);
                var url = GameToWechatGameHelper.getShareImageUrl();
                wx.onShareAppMessage(function(res){
                    return {
                        title: "专属胶己人的麻将！",
                        imageUrl : url,
                    };
                })
            },
            fail : function (res) {
                console.log("showShareMenu fail " + res);
            },
        });
    }
},

//分享好友群  query = "key1=test&key2=hahah"
GameToWechatGameHelper.shareAppForFriendsGroup = function () {
    var url = this.getShareImageUrl();
    wx.shareAppMessage({
        title: "专属胶己人的麻将！",
        imageUrl : url,
        success : function (res) {
            console.log("shareAppMessage success " + res.shareTickets + ", " + res.groupMsgInfos);
        },
        fail : function (res) {
            console.log("shareAppMessage fail " + res);
        },
    });
},

//邀请微信进入房间
GameToWechatGameHelper.weChatRoomInvite = function(param){
    var paramStr = JSON.stringify(param);
    var url = this.getShareImageUrl();
    let shareContent = "房间号：" + param.shareRoomInfo.roomNum + "；" + param.shareRoomInfo.title + "；" + param.shareRoomInfo.content;
    console.log(paramStr);
    wx.shareAppMessage({
        title: shareContent,
        imageUrl : url,
        query : "roomNum=" + param.shareRoomInfo.roomNum + "&content=" + param.shareRoomInfo.content + "&roomId=" + param.shareRoomInfo.roomId,
        success : function (res) {
            console.log("shareAppMessage success " + res.shareTickets + ", " + res.groupMsgInfos);
        },
        fail : function (res) {
            console.log("shareAppMessage fail " + res);
        },
    });
},
//邀请加入好友圈
GameToWechatGameHelper.weChatInviteJoinClub = function(param){
    var url = this.getShareImageUrl();
    console.log("clubNameKKK",param.clubName);
    wx.shareAppMessage({
        title:  "邀请你加入好友圈["+param.clubName+'],招财招脚!',
        imageUrl : url,
        query : "clubInviteCode=" + param.clubInviteCode,
        success : function (res) {
            console.log("shareAppMessage success");
        },
        fail : function (res) {
            console.log("shareAppMessage fail");
        },
    });
},

GameToWechatGameHelper.getShareImageUrl = function () {
    var image = "share";
    var imageName = "res/raw-assets/resources/mahjong/png/" + image + ".jpg"; 
    if(cc.loader.md5Pipe){
        imageName = cc.loader.md5Pipe.transformURL(imageName);
    }
    var url = wxDownloader.REMOTE_SERVER_ROOT + "/" + imageName;
    return url;
},

GameToWechatGameHelper.isIphoneX = function () {
    var callback = function (res) {
        var cvs = cc.find("Canvas").getComponent(cc.Canvas);
        if (res.model.indexOf("iPhone X") >= 0) {
            cc.isIphoneX = true;
        }
        var screenWidth = res.screenWidth;
        var screenHeight = res.screenHeight;
        var screenRadio = screenHeight / screenWidth;
        var designRadio = 16 / 9;
        if (screenRadio > designRadio) {
            cvs.fitHeight = false;
            cvs.fitWidth = true;
        } else if (screenRadio < designRadio) {
            cvs.fitHeight = true;
            cvs.fitWidth = false;
        }
    }
    GameToWechatGameHelper.getSystemInfo(callback);
};

GameToWechatGameHelper.getSystemInfo = function (callback) {
    wx.getSystemInfo({
        success : function (res) {
            console.log("getSystemInfo success,model = " + res.model);
            callback(res);
        },
        fail : function (res) {
            console.log("getSystemInfo fail " + res);
        },
    });
};

GameToWechatGameHelper.compareSdkVersion = function (versionB) {
    var systemInfo = wx.getSystemInfoSync(); 
    var sdkVersionA = systemInfo.SDKVersion;
    var vB = versionB.split('.');
    var vA = sdkVersionA.split('.');
    for (var i = 0; i < vA.length; ++i) {
        var a = parseInt(vA[i]);
        var b = parseInt(vB[i] || 0);
        if (a === b) {
            continue;
        }else {
            return a - b;
        }
    }
    if (vB.length > vA.length) {
        return -1;
    }else {
        return 0;
    }
};

GameToWechatGameHelper.getLaunchOptionsSync = function () {
    var launchOption = wx.getLaunchOptionsSync();
    console.log("getLaunchOptionsSync scene = " + launchOption.scene + ",query.roomId = " + launchOption.query.roomId + ",shareTicket = " + launchOption.shareTicket + ",isSticky = " + launchOption.isSticky);
    return launchOption;
},

GameToWechatGameHelper.addOnShowListener = function () {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        wx.onShow (((e) => {
            cc.global.rootNode.emit("OnShow",e);
            var bgCurTime = cc.audioEngine.getCurrentTime(MjSoundHelper.bgAudioId);
            MjSoundHelper.playingBgMusic(bgCurTime);
    }));
    }
},

GameToWechatGameHelper.addOnHideListener = function () {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        wx.onHide (((e) => {
            cc.global.rootNode.emit("OnHide",e);
            MjSoundHelper.stopBgMusic();
    }));
    }
},

GameToWechatGameHelper.getRenderTexture = function () {
    var self = this;
    var size = cc.view.getFrameSize();
    return cc.game.canvas.toTempFilePathSync({
        x: 0,
        y: 0,
        width: size.widht,
        height: size.height
    });
},

GameToWechatGameHelper.saveImage = function (failPath,saveImageCb) {
    wx.saveImageToPhotosAlbum({
        filePath: failPath,
        success: function (res) {
            var contentText = "您的图片已保存";
            CommonHelper.showMessageBox('提示',contentText,function(){},null,false);
            saveImageCb(true);
        },
        fail: function (res){
            CommonHelper.showTips("图片保存失败");
            saveImageCb(false);
        },
    });
},

GameToWechatGameHelper.getScopeWritePhotosAlbum = function () {
    var self = this;
    var scopeName = "scope.writePhotosAlbum";
    wx.authorize ({
        scope: scopeName,
        success: function (res) {
            console.log("authorize success " + res);
        },
        fail: function (res) {
            console.log("authorize fail " + res.errMsg);
            self.getScopeWritePhotosAlbumAuthFail();
        },
    });
},

GameToWechatGameHelper.getScopeWritePhotosAlbumAuthFail = function () {
    var contentText = "您需要授权小游戏获取您的相册";
    CommonHelper.showMessageBox('提示',contentText,function(){GameToWechatGameHelper.onOpenSetting();},null,true);
},

GameToWechatGameHelper.hideKeyboard = function () {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        wx.hideKeyboard({
            success : function () {
                console.log("hideKeyboard success");
            },
            fail : function () {
                console.log("hideKeyboard fail");
            },
        });
    }
},

GameToWechatGameHelper.onAudioInterruptionEvent = function () {
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        wx.onAudioInterruptionBegin(function () {
            console.log("音乐暂停开始===》");
            MjSoundHelper.stopBgMusic();
        });
        wx.onAudioInterruptionEnd(function () {
            console.log("《===音乐暂停结束");
            var bgCurTime = cc.audioEngine.getCurrentTime(MjSoundHelper.bgAudioId);
            MjSoundHelper.playingBgMusic(bgCurTime);
            console.log(" " + bgCurTime + ", " + MjSoundHelper.bgAudioId);
        });
    }
},

GameToWechatGameHelper.onOpenSetting = function ()
{
    var openSettingCb = function (status, res) {
        if (status == false) {
            CommonHelper.showMessageBox("提示", "打开设置遇到未知错误，请自行打开设置页面", function () { }, null, false);
        }
    };

    var version = "2.0.7"
    if (GameToWechatGameHelper.compareSdkVersion(version) >= 0){
        GameToWechatGameHelper.getOpenSetting(openSettingCb)
    }else{
        wx.openSetting({
            fail : function () {
                openSettingCb()
        }})
    } 
}

module.exports = GameToWechatGameHelper;

