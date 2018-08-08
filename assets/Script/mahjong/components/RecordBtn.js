var CatalogHelper = require('CatalogHelper');
var CommonHelper = require('CommonHelper');
var GameToWechatGameHelper = require('GameToWechatGameHelper')

cc.Class({
    extends: cc.Component,

    properties: {
        maxRecordSecond : 60,
        recordStartEvent : {
            type : cc.Component.EventHandler,
            default : null,
        },
        recordMoveEvent : {
            type : cc.Component.EventHandler,
            default : null,
        },
        recordEndEvent : {
            type : cc.Component.EventHandler,
            default : null,
        },
        clickArea : {
            type : cc.Node,
            default: null,
        },
        _isCanStart : false,
        MOVE_UP : 'up',
        MOVE_DOWN : 'down',
        _moveType : '',
        _startTime : -1,
        _endTime : -1,
        _fileName : '',
        recordDeletegate : null,
        _isRecording : false,
        touchStatus : false,

        recorderManager : null,
    },

    setRecordDeletegate : function(deletegate){
        this.recordDeletegate = deletegate;
    },

    onLoad: function () {
        //var canvas = cc.find('Canvas');
        this.addTouchListener();
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.onRecorderStatusForWechat();
        }
    },

    onDestroy : function(){
        //var canvas = cc.find('Canvas');
        this.removeTouchListener();
    },

    addTouchListener : function(){
        this.clickArea.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.clickArea.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.clickArea.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.clickArea.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
    },

    removeTouchListener : function(){
        this.clickArea.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.clickArea.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.clickArea.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.clickArea.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
    },

    isContain : function(touch){
        var rect = this.node.getBoundingBox();
        var pos = this.node.parent.convertTouchToNodeSpaceAR(touch);
        return rect.contains(pos);
    },

    isCanStart : function(touch){
        var isCanStart = this.recordDeletegate ? this.recordDeletegate.isCanStart() : true;
        return (this.isContain(touch) && isCanStart && this._isRecording == false && this.touchStatus);
    },

    getScopeRecord : function () {
        var self = this;
        var scopeName = "scope.record";
        wx.authorize ({
            scope: scopeName,
            success: function (res) {
                console.log("authorize success");
            },
            fail: function (res) {
                var contentText = "您需要授权小游戏访问你的录音功能";
                CommonHelper.showMessageBox('提示', contentText, function () { GameToWechatGameHelper.onOpenSetting();},null,true);
            },
        });
    },

    onTouchStart : function(touch){
        this.touchStatus = true;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            var self = this;
            wx.getSetting({
                success: function (res) {
                    if (res.authSetting['scope.record'] == true) {
                        self.checkIsCanStart(touch);
                    } else {
                        self.getScopeRecord();
                    }
                },
            });
        } else {
            this.checkIsCanStart(touch);
        }
    },

    checkIsCanStart : function (touch) {
        this._isCanStart = this.isCanStart(touch);
        if(this._isCanStart == false){
            console.log(this._isCanStart);
            return;
        }else{
            //开始录制
            this._isCanStart = this.startRecord();
            if(this._isCanStart && this.recordStartEvent){     
                this.recordStartEvent.emit();
            }
        }
    },

    onTouchMove : function(touch){
        if(this._isCanStart == false){
            return;
        }else{
            if(this.recordMoveEvent){
                var pos = this.node.parent.convertTouchToNodeSpaceAR(touch); 
                var tempMoveType = (pos.y > this.node.y)?this.MOVE_UP : this.MOVE_DOWN;
                if(tempMoveType != this._moveType){
                    this._moveType = tempMoveType;
                    this.recordMoveEvent.emit([this._moveType]);
                }
            }            
        }
    },

    onTouchEnd : function(touch){
        console.log("------------onTouchEnd");
        this.touchStatus = false;
        if(this._isCanStart == false){
            return;
        }else{
            this._isCanStart = false
            console.log("-------------onTouchEnd this._isCanStart == true");
            var second = this.tryToStopRecord();
        }
    },

    onTouchCancel : function(touch){
        this.onTouchEnd(touch);
    },

    startRecord : function(){
        this._startTime = new Date().getTime();
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.startRecordForWechat();
            return true;
        } else if(cc.sys.isNative) {
            var tempIsCanStart = this.startRecordForNative();
            return tempIsCanStart;
        }
        return true;
    },
    
    startRecordForWechat : function () {
        console.log('开始录音');
        var self = this;
        if (this.recorderManager == null) {
            this.recorderManager = wx.getRecorderManager();
        }
        this._isRecording = true;
        this.recorderManager.start({
            sampleRate: 8000,//采样率
            numberOfChannels: 1,//录音通道数 1/2
            encodeBitRate: 16000,//编码码率
            format: "mp3",//音频格式 mp3/aac
            frameSize: 0,//指定帧大小，单位 KB
            duration : 60000,
            success : function (res) {
                console.log("getRecorderManager success " + res);
            },
            fail : function (res) {
                console.log("getRecorderManager fail" + res);
            }
        });
    },

    startRecordForNative : function () {
        this._fileName = this.getNewFileName();
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var className = 'org/cocos2dx/javascript/RecordAndPlayHelper';
            var mathodName = 'startRecord';
            var mathodSignature = '(Ljava/lang/String;)Z';
            var param = this._fileName;
            var isCanStart = jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,param);
            console.log('andoird 录音返回'+isCanStart);
            this._isRecording = true;
            return isCanStart;
        }else if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'RecordAndPlayHelper';
            var mathodName = 'startRecord:';
            var arg1 = this._fileName;
            jsb.reflection.callStaticMethod(className,mathodName,arg1); 
            this._isRecording = true;
            return true;
        }  
    },

    tryToStopRecord : function(){
        this._endTime = new Date().getTime();
        var deltaTime = this.getCurRecordTime(); 
        if(deltaTime < 1){
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                this.node.runAction(cc.sequence(cc.delayTime(0.3),cc.callFunc(this.stopRecordForWechat,this)));
            } else {
                this.node.runAction(cc.sequence(cc.delayTime(0.3),cc.callFunc(this.stopRecord,this)));
                if(this.recordEndEvent){
                    this.recordEndEvent.emit([this._fileName,0,this._moveType]);
                } 
            }
        }else{
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                this.stopRecordForWechat();
            } else {
                var second = this.stopRecord();
                if(this.recordEndEvent){
                    this.recordEndEvent.emit([this._fileName,second,this._moveType]);
                } 
            }
        }
    },

    stopRecord : function(){
        console.log('停止录音');
        if(cc.sys.isNative){
            var deltaTime = this.getCurRecordTime();
            if(cc.sys.os == cc.sys.OS_ANDROID){
                var className = 'org/cocos2dx/javascript/RecordAndPlayHelper';
                var mathodName = 'stopRecord';
                var mathodSignature = '()V';
                jsb.reflection.callStaticMethod(className,mathodName,mathodSignature);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                var className = 'RecordAndPlayHelper';
                var mathodName = 'stopRecord';
                jsb.reflection.callStaticMethod(className,mathodName);
                this._fileName = deltaTime < 1 ? "" : this.convertToAmr(this._fileName);
            }
            this._isRecording = false;
            return deltaTime; 
        }
        return 0; 
    },

    stopRecordForWechat : function () {
        console.log('结束录音');
        if (this.recorderManager == null) {
            this.recorderManager = wx.getRecorderManager();
        }
        this.recorderManager.stop();
    },

    convertToAmr : function(fileName){
        if(cc.sys.os == cc.sys.OS_IOS){
            var className = 'RecordAndPlayHelper';
            var mathodName = 'convertWAV:toAMR:';
            var arg1 = fileName;
            var arg2 = fileName.replace('.wav','.amr');
            jsb.reflection.callStaticMethod(className,mathodName,arg1,arg2);
            return arg2;             
        }
    },

    getNewFileName : function(){
        var time = new Date().getTime();
        var path = '';
        if(cc.sys.os == cc.sys.OS_ANDROID){
            path = CatalogHelper.getRecordCatalog()+time+'.amr';
        }else if(cc.sys.os == cc.sys.OS_IOS){
            path = CatalogHelper.getRecordCatalog()+time+'.wav';
        }        
        console.log(path);
        return path;
    },

    getCurRecordTime : function(){
        var time = this._endTime - this._startTime;
        console.log(time/1000);
        var floorSecond = Math.floor((time/1000));
        var ceilSecond = Math.ceil((time/1000));
        
        return (floorSecond >= 1 ? ceilSecond : floorSecond);
    },

    onRecordFilePathCallback : function (isSuccess, filePath) {
        var deltaTime = 0;
        this._fileName = "";
        if (isSuccess) {
            deltaTime = this.getCurRecordTime();
            if (filePath != "") {
                this._fileName = filePath;
            }
        }
        if(this.recordEndEvent){
            this.recordEndEvent.emit([this._fileName,(deltaTime < 1)?0:deltaTime,this._moveType]);
        }
        this._isRecording = false;
    },

    //监听录音状态
    onRecorderStatusForWechat : function () {
        var self = this;
        if (this.recorderManager == null) {
            this.recorderManager = wx.getRecorderManager();
        }
        var isSuccess = false;
        var isFilePath = "";
        this.recorderManager.onStart((() => {
            console.log("监听录音开始 ");
        }).bind(this));
        this.recorderManager.onStop(((e) => {
            console.log("监听录音结束 " + e);
            if (e.tempFilePath) {
                isSuccess = true;
                isFilePath = e.tempFilePath;
                wx.getFileSystemManager().getFileInfo({"filePath":isFilePath,"success":function(res){console.log("录音字节数="+res.size)}})
            }
            self.onRecordFilePathCallback(isSuccess, isFilePath);
        }).bind(this));
        this.recorderManager.onError(((e) => {
            console.log("监听录音出错 " + e);
            self.onRecordFilePathCallback(isSuccess, isFilePath);
        }).bind(this));
        this.recorderManager.onPause(((e) => {
            console.log("监听录音暂停 " + e);
        }).bind(this));
    },
});
