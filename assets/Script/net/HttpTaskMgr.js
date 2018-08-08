var CustomHttpRequest = require('CustomHttpRequest');
var CustomHttpClient = require('CustomHttpClient');
var HttpTask = function(customHttpRequest,requestCb,isRerequestIdFail){
    this.customHttpRequest = customHttpRequest;
    this.requestCb = requestCb;
    this.isRerequestIdFail = isRerequestIdFail ? true : false;
    this.reRequstNum = 0 ;
    this.resetId = 0 ;
};
var HttpTaskMgr = cc.Class({
    extends: cc.Component,

    properties: {
        taskList : {
            type : HttpTask,
            default : [],
        },
        isRequesting : false,
        resetId : 0,
    },
    
    addTask : function(customHttpRequest,requestCb,isRerequestIdFail){
        var newHttpTask = new HttpTask(customHttpRequest,requestCb,isRerequestIdFail);
        newHttpTask.resetId = this.resetId;
        this.taskList.push(newHttpTask);
    },

    reset : function(){
        this.taskList = [];
        this.isRequesting = false;
        this.resetId = (this.resetId > 10000) ? 0 : (this.resetId + 1);
    },

    playing : function(){
        if(this.isRequesting == true || this.taskList.length <= 0){
            return;
        }else{
            this.isRequesting = true;
            var httpTask = this.taskList[0];
            CustomHttpClient.instance.send(httpTask.customHttpRequest,function(customHttpRequest1){  
                if(this.resetId == httpTask.resetId){
                    this.isRequesting = false;
                    httpTask.requestCb(customHttpRequest1);
                    if(httpTask.isRerequestIdFail == true && customHttpRequest1 == null){
                        httpTask.reRequstNum ++;
                        console.log("重新请求次数= "+httpTask.reRequstNum);
                    }else{
                        console.log('成功完成一个http任务');
                        this.taskList.shift();
                    }
                }else{
                    console.log("resetId="+httpTask.resetId+"已经失效");
                }
            }.bind(this));
        }
    },
});

HttpTaskMgr.instance = new HttpTaskMgr();
module.exports = HttpTaskMgr;