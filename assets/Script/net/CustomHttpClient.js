var CryptoJS = require('CryptoJS');
var CustomHttpClient = cc.Class({
    extends: cc.Component,

    properties: {

    },

    send : function(customHttpRequest,handler){
        customHttpRequest.startTimeOutTimer(function(){
            handler(null,'网络超时');
        });
        var xhr = customHttpRequest.xhr;
        if (cc.sys.isNative){
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
        }
        var self = this;
        xhr.onreadystatechange = function() {
            self.onreadystatechange(customHttpRequest,handler);
        };                
        var timestamp = '1';
        var md5RawData = 'm5IaxZxmBwrlc2O' + timestamp + customHttpRequest._data;
        var sign = ''+CryptoJS.MD5(md5RawData);
        switch(customHttpRequest._requestType){
            case 'GET':
            {
                var newUrl = customHttpRequest._url.indexOf('?') > 0 ? (customHttpRequest._url + '&') :  (customHttpRequest._url + '?');
                newUrl += 'timestamp=' + timestamp + '&sign=' + sign;
                
                xhr.open("GET",newUrl, true);
                xhr.send();
            }
            break;
            case 'POST':
            {

                var newUrl = customHttpRequest._url.indexOf('?') > 0 ? (customHttpRequest._url + '&') :  (customHttpRequest._url + '?');
                newUrl += 'timestamp=' + timestamp + '&sign=' + sign;
                console.log("url: " + newUrl);
                xhr.open("POST",newUrl, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(customHttpRequest._data);
            }
            break;
            case 'UPLOAD':
            {
                xhr.open("POST",customHttpRequest._url, true);
                if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                    xhr.setRequestHeader('Content-Type','application/octet-stream');
                    console.log('上传的文件名为:'+customHttpRequest._fileName)
                    let data = null;
                    wx.getFileSystemManager().readFile({
                        filePath : customHttpRequest._fileName,
                        success : function (res) {
                            console.log("读取文件成功 " + res.data);
                            data = res.data;
                            xhr.send(data);
                        },
                        fail : function (res) {
                            console.log("读取文件失败 " + res.errMsg);
                        }
                    });
                } else {
                    console.log('上传地址:'+customHttpRequest._url);   
                    if (cc.sys.isNative){
                        xhr.setRequestHeader('Content-Type','application/octet-stream');
                        console.log('上传的文件名为:'+customHttpRequest._fileName)
                        var data = jsb.fileUtils.getDataFromFile(customHttpRequest._fileName);
                        xhr.send(data);
                    }else{
                        xhr.send('hahahahahhahahahahhahhahahah');                    
                    }
                }
                console.log('上传地址:'+customHttpRequest._url); 
            }
            break;
            case 'DOWNLOAD' : {
                xhr.responseType = 'arraybuffer';
                xhr.open("GET",customHttpRequest._url, true);
                xhr.send();
                console.log('下载地址:'+customHttpRequest._url); 
            }   
            break;         
        } 
                
    },

    onreadystatechange : function(customHttpRequest,handler){
        var xhr = customHttpRequest.xhr;
        if( xhr.readyState === 4 ){
            customHttpRequest.clearTimeOutTimer();
            if(customHttpRequest.isEnd == true){
                return;
            }
            customHttpRequest.isEnd = true;
            if(xhr.status >= 200 && xhr.status < 300){
                var requestType = customHttpRequest._requestType;
                if(requestType == 'DOWNLOAD'){
                    if(cc.sys.isNative && xhr.response){
                        jsb.fileUtils.writeDataToFile(new Uint8Array(xhr.response),customHttpRequest._fileName);
                        if(handler !== null && handler != undefined){
                             handler(customHttpRequest); 
                        }                         
                    }else{
                        console.log(xhr.responseText);
                    }
                }else{
                        if(handler !== null && handler != undefined){
                            handler(customHttpRequest);
                        }   
                }

            }else{
                if(handler !== null && handler != undefined){
                    handler(null,xhr.status);
                }
                
            }

        }        
    },
    
});

CustomHttpClient.instance = new CustomHttpClient();
module.exports = CustomHttpClient;
