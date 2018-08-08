var version = "1.0.18.19";//主版本_次版本_功能_bug
var Host = (cc.sys.platform === cc.sys.WECHAT_GAME) ? (require("WechatGameHostConfig")) : (require("DingdingHostConfig"));
var SystemoConfig = function(opt){
    this.gameIp = opt.ip;
    this.gamePort = opt.port;
    this.gameUrl = this.gameIp ;
    this.gameUrl += (this.gamePort == "") ? ("") : (":" + this.gamePort);
    this.version = version + "_" + opt.symbol;
}
var dev = new SystemoConfig(Host.dev);
var local = new SystemoConfig(Host.local);
var test = new SystemoConfig(Host.test);
var release = new SystemoConfig(Host.pro);
var all = {
    "dev" : dev,
    "local" : local,
    "test" : test,
    "pro" : release,
}
var exports = {
    mode : "test",
};


exports.bind = function () {
    var obj = all[this.mode];
    for (var key in obj) {
        this[key] = obj[key];
    }   
    return this;
}

exports.getEvnCode = function(){
    return (this.mode == "pro" ? 0 : 1);
}

exports.isReal = function(){
    return (this.mode == "pro");
}
exports.getSysConfig = function(){
    return this.bind();
}
exports.setSysConfigMode = function(newmode){
    if (all[newmode]){
        this.mode = newmode;
        this.bind();
    }else{
        // this.bind();
        console.log("非法serverMode");
    }
}
exports.getHttpStr = function(){
    if(this.gameIp.indexOf("https") === -1){
        return "http://";
    }else{
        return "https://";
    }
}

exports.setHost = function (value) {
    Host = (value === 0) ? (require("WechatGameHostConfig")) : (require("DingdingHostConfig"));
    var dev = new SystemoConfig(Host.dev);
    var local = new SystemoConfig(Host.local);
    var test = new SystemoConfig(Host.test);
    var release = new SystemoConfig(Host.pro);
    all = {
        "dev" : dev,
        "local" : local,
        "test" : test,
        "pro" : release,
    }
    this.bind();
}

exports.setIpAndPort = function (ipValue, portValue) {
    this.gameIp = ipValue;
    this.gamePort = portValue;
    this.gameUrl = this.gameIp ;
    this.gameUrl += (this.gamePort == "") ? ("") : (":" + this.gamePort);
    this.mode = "local";
}

exports.isShowTestNode = false;
module.exports = exports.bind();
