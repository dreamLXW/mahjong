var CompleteStatus = 'complete';
var DecodeStatus = 'decode';
var RawStatus = 'raw';
var ErrorStatus = 'error';
var CustomHttpClient = require('CustomHttpClient');
var CustomHttpRequest = require('CustomHttpRequest');
var CatalogHelper = require('CatalogHelper');
var GameToWechatGameHelper = require("GameToWechatGameHelper");
cc.Class({
    extends: cc.Component,

    properties: {
        EventName : 'TalkVoiceEvent',
        uid : -1,
        playerData : {
            default : null,
        },
        status : -1,
    },

    init : function(opt){
        this.uid = opt.uid;
        this.second = opt.second;
        this.url = opt.url;
        this.status = RawStatus;
        this.downLoadFile();
    },

    isComplete : function(){
        return (this.status == CompleteStatus);
    },

    getFilePath : function(){
        if(cc.sys.isNative){
            var index = this.url.lastIndexOf('=');
            var filePath = this.url.slice(index+1,this.url.length);
            filePath += '.amr';

            filePath = CatalogHelper.getDownloadCatalog() + filePath;
            return filePath;     
        }
        return '';
    },

    getPlayableFilePath : function(){
        var downloadFilePath = this.getFilePath();
        if(cc.sys.os == cc.sys.OS_IOS){
            downloadFilePath = downloadFilePath.replace('.amr','.wav');
        }
        return downloadFilePath;
    },

    downLoadFile : function(){
        console.log(this.url);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.downLoadFileByWechat();
        } else {
            this.downLoadFileByNormal();
        }
    },

    downLoadFileByWechat : function () {
        var self = this;
        wx.downloadFile({
            url : self.url,
            success : function (res) {
                console.log("downLoadFileByWechat success " + res.tempFilePath);
                self.status = CompleteStatus;
                self.url = res.tempFilePath;
            },
            fail : function (res) {
                console.log("downLoadFileByWechat fail " + res.errMsg);
                self.status = ErrorStatus;
            }
        });
    },

    downLoadFileByNormal : function () {
        var self = this;
        var filePath = this.getFilePath();
        console.log('下载后的路径为:'+filePath);
        var customHttpRequest = new CustomHttpRequest();
        customHttpRequest.setRequestType('DOWNLOAD');
        customHttpRequest.setTimeout(10000);
        customHttpRequest.setUrl(this.url);
        customHttpRequest.setFile(filePath); 
        CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
            if(customHttpRequest1){
                self.status = DecodeStatus;
                self.decodeFile();
            }else{  
                console.log('网络出错');
                self.status = ErrorStatus;
            }            
        }.bind(this)); 
    },

    decodeFile : function(){
        if(cc.sys.isNative){
            if(cc.sys.os == cc.sys.OS_ANDROID){
                this.status = CompleteStatus;
            }else if(cc.sys.os == cc.sys.OS_IOS){
                var downLoadPath = this.getFilePath();
                var playableFile = this.getPlayableFilePath();
                var className = 'RecordAndPlayHelper';
                var mathodName = 'convertAMR:toWAV:';
                var arg1 = downLoadPath;
                var arg2 = playableFile;
                jsb.reflection.callStaticMethod(className,mathodName,arg1,arg2);
                this.status = CompleteStatus;
            }
            console.log('decodeFile后status='+this.status);             
        }else{
            this.status = CompleteStatus;
            console.log('非原生平台不能播放录音');
        }        
    },
    
});
