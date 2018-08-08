cc.Class({
    extends: cc.Component,

    properties: {
        _requestType : 'GET',
        _fileName : '',
        xhr : null,
        _url : '',
        _timeOut : 10000,
        isEnd : false,
        _data : '',
    },

    init : function(){
        if(!this.xhr){
            this.xhr = cc.loader.getXMLHttpRequest(); 
            this.xhr.timeout = this._timeOut;
            this.xhr.onload = function () {
                cc.log('customhttprequest onload');
            }
            this.xhr.onloadend = function () {
                cc.log('customhttprequest onloadend');
            }
    
            this.xhr.onloadstart = function () {
                cc.log('customhttprequest onloadstart');
            }
    
            this.xhr.onabort = function () {
                cc.log('customhttprequest onabort');
            }
            var self = this;
            this.xhr.onerror = function () {
                cc.log('customhttprequest onerror');
                if(self.isEnd == false){
                    self.isEnd = true;
                    self.xhr.abort();
                    if(self._timeOutOrErrorCb){
                        self._timeOutOrErrorCb();
                    }
                }
            }
        }
    },

    setRequestType : function(requestType){
        this.init();
        this._requestType = requestType;
    },

    setUrl : function(url){
        this.init();
        this._url = url;
    },

    setFile : function(fileName){
        this.init();
        this._fileName = fileName;
    },

    setData : function(data){
        this._data = data;
    },

    setTimeout : function(timeOut){
        this.init();
        this._timeOut = timeOut;
        this.xhr.timeout = timeOut;
    },

    startTimeOutTimer : function(timeOutCb){
        var interval = 1;
        var repeat = 0;
        var delay = Math.ceil( Number(this._timeOut) / 1000 ) ;
        var pause = false;
        this._timeOutOrErrorCb = timeOutCb;
        cc.director.getScheduler().schedule(this.timeOutCB,this, interval,repeat,delay,pause);
    },

    timeOutCB : function(){
        console.log('CustomHttpRequest 超时');
        if(this.isEnd == false){
            this.isEnd = true;
            this.xhr.abort();
            this._timeOutOrErrorCb();
        }
    },

    clearTimeOutTimer : function(){
        cc.director.getScheduler().unschedule(this.timeOutCB,this);
    }
});
