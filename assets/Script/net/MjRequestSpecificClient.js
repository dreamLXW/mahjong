var ProtoUtil = require("ProtoUtil");
var PairCfg = require('PairCfg');
var Code = require('CodeCfg');
var CommonHelper = require('CommonHelper');
var CustomHttpRequest = require('CustomHttpRequest');
var CustomHttpClient = require('CustomHttpClient');
var HttpTaskMgr = require('HttpTaskMgr');
var SystemConfig = require('SystemConfig');
var RoomInfoData = require('RoomInfoData');
var GameToAppHelper = require("GameToAppHelper");

var MahjongTempClient =  {
};
var canClick = true;
MahjongTempClient.checkNetrMgr = function(){
    if(!cc.mj.netMgr){
        console.log(cc.js.getClassName(this) +' ' + 'havent init mj.netMgr');
        return false;
    }
    return true;
},

MahjongTempClient.createRecharge = function(data,cb){
    cc.global.loading.show();
    var gameUrl = SystemConfig.gameUrl;
    var url = gameUrl+'/wechat_user/create_recharge';
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setData(JSON.stringify(data));
    customHttpRequest.setUrl(url);
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.updateRecharge = function(data,cb){
    var gameUrl = SystemConfig.gameUrl;
    var url = gameUrl+'/wechat_user/update_recharge';
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setData(JSON.stringify(data));
    customHttpRequest.setUrl(url);
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cb(customHttpRequest1);
    });
},

MahjongTempClient.weChatUserLogin = function(js_code,cb){
    var gameUrl = SystemConfig.gameUrl;
    var url = gameUrl+'/wechat_user/login';
    var data = {'js_code':js_code};
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setData(JSON.stringify(data));
    customHttpRequest.setUrl(url);
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cb(customHttpRequest1);
    });
},

MahjongTempClient.weChatUserUploadUserInfo = function(data,cb){
    var gameUrl = SystemConfig.gameUrl;
    var url = gameUrl+'/wechat_user/upload_user_info';
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setData(JSON.stringify(data));
    customHttpRequest.setUrl(url);
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cb(customHttpRequest1);
    });
},

MahjongTempClient.weChatUploadLocation = function(data,cb){
    var gameUrl = SystemConfig.gameUrl;
    var url = gameUrl+'/wechat_user/upload_location';
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setData(JSON.stringify(data));
    console.log("111111" + JSON.stringify(data));
    customHttpRequest.setUrl(url);
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cb(customHttpRequest1);
    });
},

MahjongTempClient.getConfig = function(cb){
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var type = (cc.sys.os == cc.sys.OS_ANDROID ? 2 : 1);
    var url = gameUrl+'/config/get_config?uid='+uid+'&type='+type;
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('GET');
    customHttpRequest.setUrl(url);
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.createRoom = function(rules,config,createRoomType,isNeedLoading,cb){
    var GoodsConfig = require('GoodsConfig');
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var clubId = cc.gameConfig.clubId;
    var groupId = cc.gameConfig.groupId;
    var type = (cc.sys.os == cc.sys.OS_ANDROID ? 2 : 1);
    var roomCard = GoodsConfig.getGoodsById(config.roomCardId).getRawOpt();
    var url = gameUrl+'/game/create_room';
    var data = {'uid':uid,'config':config,'type':type,"roomCard":roomCard,"rules":rules};
    switch(createRoomType){
        case 1 : 
            data.groupId = groupId;
        break;
        case 2 : 
            data.clubId = clubId;
        break;
    }
    console.log('url:'+url+"   data:"+JSON.stringify(ProtoUtil.encode(data)));
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setData(JSON.stringify(data));
    customHttpRequest.setUrl(url);
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.getMyVipRecord = function(start,length,isNeedLoading,cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var url = gameUrl+'/game/user_history_settle_list';
    console.log('url:'+url);
    var data = {'uid':uid,'start':start,'length':length};
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.getMyVipRecord ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                cb(ProtoUtil.decode(cbdata)); 
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    });
},

MahjongTempClient.getClubRecord = function(uid,clubId,start,length,isNeedLoading,cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var url = gameUrl+'/club/settles';
    console.log('url:'+url);
    var data = {'uid':uid,'start':start,'length':length,"club_id":clubId};
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.getClubRecord ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                cb(ProtoUtil.decode(cbdata)); 
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    });
},

MahjongTempClient.setApplyClub = function(data,isNeedLoading,cb){
    if(!canClick){
        return ;
    }
    canClick = false ;
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var url = gameUrl+'/club/user_confirm';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    var that = this;
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        canClick = true ;
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.getMyClubList ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){ 
                cb();
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    });
},
MahjongTempClient.setClubApplyManage = function(data,isNeedLoading,cb){
    if(!canClick){
        return;
    }
    canClick = false;
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var url = gameUrl+'/club/set_apply_club';
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    console.log('url:'+url + "   data:"+JSON.stringify(data));
    var self = this;
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        canClick=true;
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.setClubApplyManage ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                cb();
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    });
},

//好友圈成员个人战绩
MahjongTempClient.getClubUserRecord = function(data,isNeedLoading,cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var url = gameUrl+'/club/user_settles';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(ProtoUtil.encode(data)));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.getClubUserRecord ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                cb(ProtoUtil.decode(cbdata)); 
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    });
},

////这里的时间戳精确到秒
MahjongTempClient.getClubManagerDiamondRecord = function(clubId,startTime,endTime,isNeedLoading,cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var url = gameUrl+'/club/consumption';
    console.log('url:'+url);
    startTime = parseInt(startTime/1000);
    endTime = parseInt(endTime/1000);
    var data = {'uid':uid,'start_time':startTime,'end_time':endTime,"club_id":clubId};
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.getClubManagerDiamondRecord ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                cb(ProtoUtil.decode(cbdata)); 
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    });
},

//好友圈可加入房间列表
MahjongTempClient.getClubRoomList = function(clubId,isNeedLoading,cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var url = gameUrl+'/club/rooms';
    console.log('url:'+url);
    var data = {'uid':uid,'club_id':clubId};
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

//我的好友圈列表
MahjongTempClient.getMyClubList = function(isNeedLoading,cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var url = gameUrl+'/club/list';
    console.log('url:'+url);
    var data = {'uid':uid};
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.getMyClubList ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                cb(ProtoUtil.decode(cbdata)); 
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    });
},

MahjongTempClient.getMyClubApplyRecord = function(data,isNeedLoading,cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var url = gameUrl+'/club/get_user_apply';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.getMyClubApplyRecord ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                cb(ProtoUtil.decode(cbdata)); 
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    });
},

MahjongTempClient.getClubApplyRecord = function(data,isNeedLoading,cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var url = gameUrl+'/club/get_apply_club';
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    console.log("AAAABBBBBCCCDDD",data);
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.getClubApplyRecord ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                cb(ProtoUtil.decode(cbdata)); 
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    });
},

MahjongTempClient.getManagementRecord = function(data,isNeedLoading,cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var url = gameUrl+'/club/get_club_logs';
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    console.log("getManagementRecord",data);
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.getManagementRecord' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                cb(ProtoUtil.decode(cbdata)); 
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    });
},

MahjongTempClient.getUserInfo = function(isNeedLoading,cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var data = {'uid':uid};
    var url = gameUrl+'/game/user_info';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.getRoomInfo = function(roomId,roomNo,isNeedLoading,cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var url = gameUrl+'/game/room_info';
    var data = {'uid':uid};
    roomId ? (data.rid = roomId) : (data.room_num = roomNo);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.getRoomInfo ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                var decodeData = ProtoUtil.decode(cbdata);
                var roomInfo = decodeData.roomInfo;
                var roomInfoData = new RoomInfoData(roomInfo);
                roomInfoData.initData(roomInfo);
                if(roomInfoData.isGameStatusDissolve()){
                    CommonHelper.showTips(Code.getCodeName(Code.SEAT_DISSOLVE));
                }else if(roomInfoData.isGameStatusOver()){
                    CommonHelper.showTips(Code.getCodeName(Code.SEAT_OVER));
                }else{
                    cb(roomInfoData);
                }
                 
            } else if (cbdata.code == Code.GAME_CLOSED) {
                CommonHelper.showMessageBox("提示", Code.getCodeName(cbdata.code), function () {
                    GameToAppHelper.ExitGame()
                }, null, false);
            } else if (cbdata.code == Code.USER_ALREADY_IN_GAME) {
                CommonHelper.showMessageBox("提示", Code.getCodeName(cbdata.code), function () {
                    CommonHelper.backToLastScene();
                }, null, false);
            } else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    });
},

MahjongTempClient.getGoldLobbyOnlineNumber = function(cb){
    //var cbdata = {"player_number_list":[{"id":1,"number":199},{"id":2,"number":200},{"id":3,"number":199}]};
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var url = gameUrl+'/wechat_user/fast_match_player_number';
    var data = {'uid':uid};
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('getGoldLobbyOnlineNumber' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){      
                cb(ProtoUtil.decode(cbdata));
            } else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }
    });
},

MahjongTempClient.enterRoom = function(rid,cb,isNeedLoading){
    if(!this.checkNetrMgr()){
        return false;
    }
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var name = 'seat_enter';
    var msg = {"rid": Number(rid)};
    var requestcb = function(cbdata){
        cc.global.loading.hide();
        if(cbdata){
            console.log('MahjongTempClient.enterRoom ' + JSON.stringify(cbdata));
            cb(ProtoUtil.decode(cbdata));
        }
    };
    cc.mj.netMgr.request(name,msg,requestcb);
},

MahjongTempClient.syncGameData = function(rid,cb,isNeedLoading){
    MahjongTempClient.enterRoom(rid,cb,isNeedLoading);
},

MahjongTempClient.CommonUidrequestExitRoom = function(cb,isNeedLoading){
    if(!this.checkNetrMgr()){
        return false;
    }
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }

    var requestcb = function(cbdata){
        MahjongTempClient.defaultCbFunc(cbdata);
        if(cbdata && cbdata.code == Code.OK){
            cb();
        }
    };

    var name = 'seat_exit';
    cc.mj.netMgr.request(name,null,requestcb);   
},

MahjongTempClient.requestStart = function(isNeedLoading){
    if(!this.checkNetrMgr()){
        return false;
    }
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var requestcb = function(cbdata){
        cc.global.loading.hide();
        if(cbdata && cbdata.code != Code.OK){
            CommonHelper.showTips(Code.getCodeName(cbdata.code));
        }
    };
    var name = 'seat_apply_start';
    cc.mj.netMgr.request(name,null,requestcb);   
},

MahjongTempClient.RoomUidRequestDissove = function(isNeedLoading){
    if(!this.checkNetrMgr()){
        return false;
    }
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var requestcb = function(cbdata){
        cc.global.loading.hide();
        if(cbdata && cbdata.code != Code.OK){
            CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
        }
    };
    var name = 'seat_dissolve';
    cc.mj.netMgr.request(name,null,requestcb);   
},

MahjongTempClient.CommonUidRequestDissove = function(){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_apply_dissolve';
    cc.mj.netMgr.request(name,null,MahjongTempClient.defaultCbFunc);   
},

MahjongTempClient.CommonUidConfirmDissove = function(isAdmit){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_comfirm_dissolve';
    var msg = {'comfirm':isAdmit};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);   
},

MahjongTempClient.CommonUidConfirmStart = function(isAdmit){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_comfirm_start';
    var msg = {'comfirm':isAdmit};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);   
},

MahjongTempClient.requestPeng = function(){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_action';
    var msg = {"type": PairCfg.PENG};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);     
},

MahjongTempClient.requestGang = function(type,card){
    if(type == PairCfg.AN_GANG){
        MahjongTempClient.requestAnGang(card);
    }else if(type == PairCfg.MING_GANG){
        MahjongTempClient.requestMingGang();
    }else if(type == PairCfg.BU_GANG){
        MahjongTempClient.requestBuGang(card);
    }else{
        console.log('非法参数');
    }
}

MahjongTempClient.requestAnGang = function(card){//暗杠
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_action';
    var cardList = [card];
    var msg = {"type": PairCfg.AN_GANG,"card_list":cardList};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);      
},

MahjongTempClient.requestMingGang = function(){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_action';
    var msg = {"type": PairCfg.MING_GANG};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);  
},

MahjongTempClient.requestBuGang = function(card){//补杠
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_action';
    var cardList = [card];
    var msg = {"type": PairCfg.BU_GANG,"card_list":cardList};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc); 
},

MahjongTempClient.requestHu = function(type){
    if(type == PairCfg.CHI_HU){
        MahjongTempClient.requestChiHu();
    }else if(type == PairCfg.MO_HU){
        MahjongTempClient.requestZiMoHu();
    }else if(type == PairCfg.QIANG_GANG_HU){
        MahjongTempClient.requestQiangGangHu();
    }else{
        console.log('非法参数');
    }
}

MahjongTempClient.requestChiHu = function(){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_action';
    var msg = {"type": PairCfg.CHI_HU};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);  
},

MahjongTempClient.requestZiMoHu = function(){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_action';
    var msg = {"type": PairCfg.MO_HU};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);
},

MahjongTempClient.requestQiangGangHu = function(){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_action';
    var msg = {"type": PairCfg.QIANG_GANG_HU};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);
},

MahjongTempClient.requestGuo = function(){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_action';
    var msg = {"type": PairCfg.QI_PAI};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);
},

MahjongTempClient.requestChu = function(card){//出牌
    if(!this.checkNetrMgr()){
        return false;
    }
    console.log('chupai='+card);
    var name = 'seat_action';
    var cardList = [card];
    var msg = {"type": PairCfg.CHU_PAI,"card_list":cardList};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);
},

MahjongTempClient.requestChi = function(card,isNeedLoading){
},

MahjongTempClient.requestBusy = function(isBusy){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_busy';
    var msg = {"busy": isBusy};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);
},

MahjongTempClient.requestContinueGame = function(cb){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_ready';
    cc.mj.netMgr.request(name,'',cb);    
},

MahjongTempClient.requestSettleInfoByRoundIdWithHttp = function(rid,round,cb,isNeedLoading,isInHttpTast){//短链接获取单局结算
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var token = cc.mj.ownUserData.token;
    var url = gameUrl+'/seat_history/seat_single_settle';
    var data = {'uid':uid,'rid':rid,'round':round,'token':token};
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    var httpRequestCb = function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.requestSettleInfoByRoundIdInHttpTask ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){       
                cb(ProtoUtil.decode(cbdata));

            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showTips("获取单局结算信息失败");
        }
    }
    if(isInHttpTast){
        var isRerequestIdFail = true;
        HttpTaskMgr.instance.addTask(customHttpRequest,function(customHttpRequest1){
            httpRequestCb(customHttpRequest1);
        },isRerequestIdFail); 
    }else{
        CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
            httpRequestCb(customHttpRequest1);
        }); 
    }
},

MahjongTempClient.requestPlaybackWithHttp = function(rid,round,cb,isNeedLoading){//短链接获取回放信息
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var token = cc.mj.ownUserData.token;
    var url = gameUrl+'/seat_history/seat_single_playback';
    var data = {'uid':uid,'rid':rid,'round':round,'token':token};
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    var httpRequestCb = function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.requestPlaybackWithHttp ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){       
                cb(ProtoUtil.decode(cbdata));

            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    }
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        httpRequestCb(customHttpRequest1);
    });
},

MahjongTempClient.requestTotalSettleInfoWithHttp= function(rid,cb,isNeedLoading,isInHttpTast){//短链接获取总结算
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var token = cc.mj.ownUserData.token;
    var url = gameUrl+'/seat_history/seat_total_settle?uid='+uid+'&rid='+rid+'&token='+token;
    console.log('url:'+url);
    var data = {'uid':uid,'rid':rid,'token':token};
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    var httpRequestCb = function(customHttpRequest1){
        cc.global.loading.hide();
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.requestTotalSettleInfoWithHttp ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){
                cb(ProtoUtil.decode(cbdata));
            }else{
                CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
            }
        }else{  
            CommonHelper.showTips("获取总结算信息失败");
        }
    }
    if(isInHttpTast){
        var isRerequestIdFail = true;
        HttpTaskMgr.instance.addTask(customHttpRequest,function(customHttpRequest1){
            httpRequestCb(customHttpRequest1);
        },isRerequestIdFail); 
    }else{
        CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
            httpRequestCb(customHttpRequest1);
        }); 
    }

},

MahjongTempClient.defaultCbFunc = function(cbdata){
    cc.global.loading.hide();
    if(cbdata && cbdata.code != Code.OK){
        console.log(cbdata);
        CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
    }
},

MahjongTempClient.seatSendChat = function(type,content){
    if(!this.checkNetrMgr()){
        return false;
    }
    var name = 'seat_send_chat';
    var msg = {"type": type,'content':content};
    cc.mj.netMgr.request(name,msg,MahjongTempClient.defaultCbFunc);
},

/**
 * add by Fandeyu
 */
MahjongTempClient.getVirifyCode = function (telephone, isNeedLoading, cb) {
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var data = {'telephone':telephone};
    var url = gameUrl+'/club/get_virify_code';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.createClub = function (clubName, telephone, code, isNeedLoading, cb) {
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var data = {'name':clubName,'uid':uid,'telephone':telephone,'code':code};
    var url = gameUrl+'/club/create_club';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.getClubInfo = function (inviteCode, isNeedLoading, cb) {
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var type = (cc.sys.os == cc.sys.OS_ANDROID ? 2 : 1);
    var url = gameUrl+'/club/get_club_info?invite_code='+inviteCode;
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('GET');
    customHttpRequest.setUrl(url);
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.quitClub = function (clubId, isNeedLoading, cb) {
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var data = {'uid':uid,'club_id':clubId};
    var url = gameUrl+'/club/quit_club';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.inviteOrJoinClub = function(uid, clubId, fromUid, type, isNeedLoading, cb){
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var data = null;
    if (fromUid) {
        data = {'uid':uid,'club_id':clubId,'from_uid':fromUid,"type":type};
    } else {
        data = {'uid':uid,'club_id':clubId,"type":type};
    }
    var url = gameUrl+'/club/apply_club';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.getMemberList = function (clubId, isNeedLoading, cb) {
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var uid = cc.mj.ownUserData.uid;
    var data = {'uid':uid,'club_id':clubId};
    var url = gameUrl+'/club/get_member_list';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.getClubNoCheckMsgData = function () {
    var NoCheckMessageData = require('NoCheckMessageData');
    var gameUrl = SystemConfig.gameUrl;
    var data = {'uid':cc.mj.ownUserData.uid};
    var url = gameUrl+'/club/message_remind';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.getClubNoCheckMsgData ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){       
                NoCheckMessageData.init(ProtoUtil.decode(cbdata));
                NoCheckMessageData.emitChange();
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }
    });
},

MahjongTempClient.changeAdmin = function (clubId, managerId, uid, type, isNeedLoading, cb) {
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var data = {'club_id':clubId,'manager_id':managerId,'uid':uid,'type':type};
    var url = gameUrl+'/club/update_admin';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.tickClub = function (uid, clubId, tickId, isNeedLoading, cb) {
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var data = {'uid':uid,'club_id':clubId,'tick_id':tickId};
    var url = gameUrl+'/club/tick_club';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

MahjongTempClient.getTranspose = function (itemData, isNeedLoading, cb) {
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var data = { 'exchange': ProtoUtil.encode(itemData.getRawOpt()),'uid':cc.mj.ownUserData.uid};
    var url = gameUrl+'/wechat_user/set_exchange';
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('POST');
    customHttpRequest.setUrl(url);
    customHttpRequest.setData(JSON.stringify(data));
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1, itemData);
    });
},

MahjongTempClient.getBoardInfo = function (popUp, isNeedLoading, cb) {
    if(isNeedLoading && cc.global.loading){
        cc.global.loading.show();
    }
    var gameUrl = SystemConfig.gameUrl;
    var data = {'pop_up':popUp};
    var url = gameUrl+'/config/notices' + (popUp?"?pop_up=" + popUp:"");
    console.log('url:'+url);
    var customHttpRequest = new CustomHttpRequest();
    customHttpRequest.setRequestType('GET');
    customHttpRequest.setUrl(url);
    CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        cc.global.loading.hide();
        cb(customHttpRequest1);
    });
},

module.exports = MahjongTempClient;