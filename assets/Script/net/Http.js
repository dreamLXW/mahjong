var SystemConfig = require("SystemConfig");
var CustomHttpClient = require('CustomHttpClient');
var CustomHttpRequest = require('CustomHttpRequest');
cc.VERSION = 20170524;
var HTTP = cc.Class({
    extends: cc.Component,

    statics:{
        sessionId : 0,
        userId : 0,
        sendRequest : function(path,data,handler,extraUrl){
            // var str = "?";
            // for(var k in data){
            //     if(str != "?"){
            //         str += "&";
            //     }
            //     str += k + "=" + data[k];
            // }
            if(extraUrl == null){
                extraUrl = SystemConfig.gameUrl;
            }
            //+ encodeURI(str)
            var requestURL = extraUrl + path ;
            console.log(requestURL);
            var customHttpRequest = new CustomHttpRequest();
            customHttpRequest.setRequestType('POST');
            customHttpRequest.setTimeout(8000);
            customHttpRequest.setUrl(requestURL);
            customHttpRequest.setData(JSON.stringify(data));
            CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
                if(customHttpRequest1){
                    var ret = JSON.parse(customHttpRequest1.xhr.responseText);
                    handler(ret);
                }else{  
                    handler(null,'网络错误');
                }            
            }); 
        },
    },
});