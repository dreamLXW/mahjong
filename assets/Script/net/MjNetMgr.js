var ProtoUtil = require("ProtoUtil");
var CfgCode = require("CodeCfg");
var EventName = require('EventName');
var CommonNetMgr = require('CommonNetMgr');
var CfgPair = require("PairCfg");
var CatalogHelper = require('CatalogHelper');
var SystemConfig = require('SystemConfig');
cc.Class({
    extends: cc.Component,

    properties: {  
        gate : {
            get : function(){
                return this._commonNetMgr.gate;
            }
        },
        gateUrl : {
            get : function(){
                var ip = this._commonNetMgr.gate.ip;
                var port = this._commonNetMgr.gate.port;
                var url = SystemConfig.getHttpStr() + ip;
                url += (port == "" || port == null || port == undefined) ? ("") : (":" + port);
                return url;
            }       
        },
    },

    setIsReconnnect : function(isReconnect){
        if (! this._commonNetMgr) {
            cc.log("_commonNetMgr closed");
            return
        }
        this._commonNetMgr.setIsReconnnect(isReconnect);        
    },

    close : function(isReconnect){
        if (! this._commonNetMgr) {
            cc.log("_commonNetMgr closed");
            return
        }
        if(isReconnect == false){
            this.setIsReconnnect(false);
        }
        this._commonNetMgr.close();
        this._commonNetMgr = null;        
    },

    reconnect : function(next){//next(isSuc,err);//先不实现

    },

    // 发送网络请求
    request : function (name, msg, cb) {
        if (! this._commonNetMgr) {
            cc.log("_commonNetMgr closed");
            cb();
            return
        }
        this._commonNetMgr.request(name, msg, cb)
    },

    setLoginCallBack : function(next){
        this._loginBack  = next;
    },

    roomCardLogin : function(next){
        this._commonNetMgr = null;
        var commonNetMgr = new CommonNetMgr();
        var self = this;
        if(next){
            this.setLoginCallBack(next);
        }
        var msg = {uid : cc.mj.ownUserData.uid, token : cc.mj.ownUserData.token, rid : cc.mj.roomInfo.rid};
        commonNetMgr.login("/room_card_gate",msg,function(socket,code){
            if(socket){
                self.initNetHandlers(socket);
                self._commonNetMgr = commonNetMgr;
                if(self._loginBack){
                    self._loginBack(true);
                }
            }else{
                if(self._loginBack){
                    self._loginBack(false,code);
                }
            }
        });
    },

    goldLogin : function(msg,next){
        this._commonNetMgr = null;
        var commonNetMgr = new CommonNetMgr();
        var self = this;
        if(next){
            this.setLoginCallBack(next);
        }
        commonNetMgr.login("/gold_room_gate",msg,function(socket,code){
            if(socket){
                cc.mj.roomInfo.initRoomId(commonNetMgr.gate.rid)
                self.initNetHandlers(socket);
                self._commonNetMgr = commonNetMgr;
                if(self._loginBack){
                    self._loginBack(true);
                }
            }else{
                if(self._loginBack){
                    self._loginBack(false,code);
                }
            }
        });
    },

    initNetHandlers: function (socket) {
        if (! socket) {
            // TODO:
            return;
        }
        // TODO:监听网络消息，dispatch消息
        var self = this;
        socket.on("on_seat_start", function (msg) {//牌局开始
            console.log('on_seat_start:'+JSON.stringify(msg));
            cc.global.rootNode.emit('OnSeatStart');
        });
        //摸牌，出牌，吃，碰，暗杠，明杠，补杠
        socket.on("on_seat_action", function (msg) {//
            console.log('on_seat_action:'+JSON.stringify(msg));
            if(CfgPair.CHU_PAI == msg.type){
                console.log('chupai=='+msg.card_list[0]);
            }
            if(!(cc.mj.ownUserData.uid == msg.uid && CfgPair.CHU_PAI == msg.type)){
                self.onSeatAction(ProtoUtil.decode(msg));
            }
        });

        //推送玩家可以做的打牌动作
        socket.on("on_seat_option", function (msg) {//
            console.log('on_seat_option:'+JSON.stringify(msg));
            self.onSeatOption(ProtoUtil.decode(msg));
        });

        // 结算信息，胡牌 or 黄庄
        socket.on("on_seat_single_settle", function (msg) {//
            console.log('on_seat_settle:'+JSON.stringify(msg));
            var SeatCustomEvent = require('SeatCustomEvent');
            var onSeatSettleCustom = new SeatCustomEvent();
            onSeatSettleCustom.init('on_seat_settle',JSON.stringify(msg));
            cc.mj.gameData.pushSeatEvent(onSeatSettleCustom);
        });

        //玩家进入房间
        socket.on("on_seat_enter", function (msg) {
            if(cc.mj && cc.mj.ownUserData.uid != msg.player.uid){
                console.log('on_seat_enter:'+JSON.stringify(msg));
                // cc.mj.gameData.addPlayerDataInList(msg.player);

                var SeatCustomEvent = require('SeatCustomEvent');
                var seatCustomEvent = new SeatCustomEvent();
                seatCustomEvent.init('on_seat_enter',ProtoUtil.decode(msg.player));
                cc.mj.gameData.pushSeatEvent(seatCustomEvent);
            }
        });

        //玩家退出房间
        socket.on("on_seat_exit", function (msg) {
            if(cc.mj && cc.mj.ownUserData.uid != msg.uid){
                console.log('on_seat_exit:'+JSON.stringify(msg));
                //cc.mj.gameData.removePlayerDataFromList(msg.uid);
                var SeatCustomEvent = require('SeatCustomEvent');
                var seatCustomEvent = new SeatCustomEvent();
                seatCustomEvent.init('on_seat_exit',ProtoUtil.decode(msg.uid));
                cc.mj.gameData.pushSeatEvent(seatCustomEvent);
            }
        });

        socket.on("on_player_data", function (msg) {
            if(cc.mj){
                console.log('on_player_data:'+JSON.stringify(msg));
                cc.mj.gameData.getPlayerDataMgr().onPlayerDataChange(ProtoUtil.decode(msg.player));
            }
        });

        socket.on("on_seat_send_chat", function (msg) {//
            if(cc.mj){
                console.log('on_seat_send_chat:'+JSON.stringify(msg));
                var TalkChatEvent = require('TalkChatEvent');
                var talkChatEvent = new TalkChatEvent();
                talkChatEvent.init(ProtoUtil.decode(msg));
                cc.mj.gameData.playTalkEvent(talkChatEvent);
                //cc.mj.gameData.pushTalkEvent(talkChatEvent);
            }           
        });

        socket.on("on_seat_send_voice", function (msg) {//
            console.log('on_seat_send_voice:'+JSON.stringify(msg));
            if(cc.mj && cc.mj.ownUserData.uid != msg.uid){
                var TalkVoiceEvent = require('TalkVoiceEvent');
                var talkVoiceEvent = new TalkVoiceEvent();
                talkVoiceEvent.init(ProtoUtil.decode(msg));
                cc.mj.gameData.pushTalkEvent(talkVoiceEvent);
            }  
        });

        socket.on("on_seat_comfirm_dissolve", function (msg) {//
            console.log('on_seat_comfirm_dissolve:'+JSON.stringify(msg));
            var SeatCustomEvent = require('SeatCustomEvent');
            var onSeatConfirmDissolveCustom = new SeatCustomEvent();
            onSeatConfirmDissolveCustom.init('on_seat_comfirm_dissolve',ProtoUtil.decode(msg));
            if(cc.mj.gameData.isInit()){
                cc.mj.gameData.unshiftUrgentEvent(onSeatConfirmDissolveCustom,1);
            }else{
                cc.mj.gameData.pushSeatEvent(onSeatConfirmDissolveCustom);
            }
        });

        socket.on("on_seat_comfirm_start", function (msg) {//
            console.log('on_seat_comfirm_start:'+JSON.stringify(msg));
            var SeatCustomEvent = require('SeatCustomEvent');
            var onSeatConfirmStartCustom = new SeatCustomEvent();
            onSeatConfirmStartCustom.init('on_seat_comfirm_start',ProtoUtil.decode(msg));
            cc.mj.gameData.pushSeatEvent(onSeatConfirmStartCustom);
        });

        socket.on("on_seat_dissolve", function (msg) {//房间解散，应该是指房主解散房间的推送
            console.log('on_seat_dissolve:'+JSON.stringify(msg));
            var SeatCustomEvent = require('SeatCustomEvent');
            var onSeatDissolveCustom = new SeatCustomEvent();
            onSeatDissolveCustom.init('on_seat_dissolve',null);
            cc.mj.gameData.pushSeatEvent(onSeatDissolveCustom);
        });

        socket.on("on_seat_club_disable_tick", function (msg) {//好友圈禁用的踢人广播
            cc.global.rootNode.emit(EventName.OnClubTick,ProtoUtil.decode(msg));
        });

        socket.on("on_seat_club_manager_tick", function (msg) {//好友圈踢人的广播
            cc.global.rootNode.emit(EventName.OnClubTick,ProtoUtil.decode(msg));
        });

        socket.on("on_seat_total_settle", function (msg) {//总结算推送
            console.log('on_seat_total_settle:'+JSON.stringify(msg));
            self.setIsReconnnect(false);//总结算时不再断线重连
            var SeatCustomEvent = require('SeatCustomEvent');
            var onSeatTotalSettleCustom = new SeatCustomEvent();
            onSeatTotalSettleCustom.init('on_seat_total_settle',JSON.stringify(msg));
            cc.mj.gameData.pushSeatEvent(onSeatTotalSettleCustom);
        });

        socket.on("on_seat_gen_zhuang",function(msg){//
            console.log('on_seat_gen_zhuang:'+JSON.stringify(msg));
            var SeatCustomEvent = require('SeatCustomEvent');
            var genZhuangCustom = new SeatCustomEvent();
            genZhuangCustom.init('genZhuang',null);
            cc.mj.gameData.pushSeatEvent(genZhuangCustom);
        });

        socket.on("on_game_closed",function (msg) { //游戏暂停运营通知
            cc.global.rootNode.emit(EventName.OnCloseGame,ProtoUtil.decode(msg))
        })
    },

    onSeatAction : function(msg){//
        if(cc.mj){
            var SeatActionEvent = require('SeatActionEvent');
            var seatActionEvent = new SeatActionEvent();
            seatActionEvent.init(ProtoUtil.decode(msg));
            cc.mj.gameData.pushSeatEvent(seatActionEvent);
        }
    }, 

    onSeatOption : function(msg){//
        if(cc.mj){
            var SeatOptionEvent = require('SeatOptionEvent');
            var seatOptionEvent = new SeatOptionEvent();
            seatOptionEvent.init(ProtoUtil.decode(msg));
            cc.mj.gameData.pushSeatEvent(seatOptionEvent);
        }
    },

});
