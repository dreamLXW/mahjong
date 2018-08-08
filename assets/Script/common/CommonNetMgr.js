var ProtoUtil = require("ProtoUtil");
var CfgCode = require("CodeCfg");
var EventName = require('EventName');
var Socket = require('Socket');
cc.Class({
    extends: cc.Component,

    properties: {
        gate : null,
        _connectTime : 0,
        _heatbeat : 5,//从服务端获取
        maxConnectTime : 2,
        reconnectSecond : 0,
        maxReconnectSecond : 15,
        isReconnect : true,
        _isRecieveHeartBeart : true,
    },

    setIsReconnnect : function(isReconnect){
        this.isReconnect = isReconnect;
    },

    getSocket : function(){
        return this.socket;
    },
    
    initData: function () {
        this.uid = cc.mj.ownUserData.uid;
        this.token = cc.mj.ownUserData.token;
        this.rid = cc.mj.roomInfo.roomId;
        console.log(cc.js.getClassName(this) + " uid: " + this.uid+" token: " + this.token );
    },

    close : function(){
        if (! this.socket) {
            return
        }        
        this.socket.close();
        this.socket = null;
        this.stopHeatBeat();
        this.stopCheckServerHeartBeat();
    },

    reconnect : function(){  
        if(!this.isReconnect){
            console.log("不重连");
            return;
        }
        this.setIsReconnnect(false);
        cc.global.rootNode.emit('RequestReconnect');
    },

    startCheckServerHeartBeat : function(){
        var interval = this.getServerHeartBeatTimeOutSecond();
        console.log('开始检测服务端心跳包，时间'+interval+'秒');
        cc.director.getScheduler().schedule(this.onTimeToCheckServerHeartBeat,this, interval,cc.macro.REPEAT_FOREVER,0,false);
    },

    stopCheckServerHeartBeat : function(){
        console.log('停止检测服务端心跳包');
        cc.director.getScheduler().unschedule(this.onTimeToCheckServerHeartBeat,this);        
    },

    onTimeToCheckServerHeartBeat : function(){
        if(this._isRecieveHeartBeart){
            this._isRecieveHeartBeart = false;
            console.log('收到过心跳包');
        }else{//没收到
            console.log('没收到服务器心跳包');
            this.close();
        }
    },

    getServerHeartBeatTimeOutSecond : function(){
        return Number(this._heatbeat * 2);
    },

    startHeartBeat : function(){
        var self = this;
        this.heatBeatCallBack = function(){
            var msg = {};
            console.log('发送心跳');
            self.request("user_heartbeat",msg,function(){});
        };
        cc.director.getScheduler().unschedule(this.heatBeatCallBack,this); 
        var interval = this._heatbeat;
        cc.director.getScheduler().schedule(this.heatBeatCallBack,this, interval,cc.macro.REPEAT_FOREVER,0,false);
    },

    stopHeatBeat : function(){
        cc.director.getScheduler().unschedule(this.heatBeatCallBack,this);
    },

     // 发送网络请求
    request : function (name, msg, cb) {
        if (! this.socket) {
            cc.log("socket closed");
            cb();
            return
        }
        this.socket.request(name, msg, cb)
    },

    onError : function (err) {
        cc.log("connect error %s" , JSON.stringify(err));
    },

    onClose : function () {
        cc.log("connect close");
        this.stopHeatBeat();
        this.stopCheckServerHeartBeat();
        this.socket = null;
        this.reconnect(); 
    },

    onServerHeartBeat : function () {
        cc.log("onServerHeartBeat");
        this._isRecieveHeartBeart = true;
    },

    login: function (gatePostfix, msg, next) {//next(socket,err)
        this.initData();
        var self = this;
        var socket = new Socket();
        var onOpen = function () {
            cc.log("connect success");
            var authMsg = {uid : self.uid, token : self.token, rid : self.rid};
            socket.request("user_auth", authMsg, function (ret) {
                cc.log("user_auth ret %s", JSON.stringify(ret));
                if (ret.code != CfgCode.OK  || !ret.player) {
                    return next(null, ret.code);
                }             
                self.socket = socket;
                self.reconnectSecond = 0;
                self._heatbeat = ret.heartbeat;
                if (ret.player) {
                    var opt = ProtoUtil.decode(ret.player);
                    cc.mj.ownUserData.initData(opt);
                }
                next(socket);
                self.startHeartBeat();
                self.startCheckServerHeartBeat();
            })
        }
        socket.on("onopen", onOpen);
        socket.on("onclose", self.onClose.bind(self));
        socket.on("onerror", self.onError.bind(self));

        var http = require("Http");

        http.sendRequest(gatePostfix, msg, function (ret,status) {
            if(ret != null){
                if(CfgCode.isSuc(ret.code)){
                    self.gate = ret;
                    console.log("gate = " + JSON.stringify(self.gate));
                    self.rid = self.gate.rid ? self.gate.rid : self.rid;
                    socket.on("server_heartbeat", self.onServerHeartBeat.bind(self));
                    socket.connect(self.gate.ws);
                }else{
                    return next(null, ret.code);
                }
            }else{
                console.log(status);
                self.reconnect();
            }
        });
    },

});
