
var SystemConfig = require('SystemConfig');
var CustomHttpRequest = require('CustomHttpRequest');
var CustomHttpClient = require('CustomHttpClient');
var tempClient = require('MjRequestSpecificClient');
var Code = require('CodeCfg');
var TimeHelper = require('TimeHelper')
cc.Class({
    extends: cc.Component,
    properties: {
        userName : {
            type : cc.Label,
            default : null,
        },
        userID : {
            type : cc.Label,
            default : null,
        },
        timeLabel : {
            type : cc.Label,
            default : null,
        },
        agreeButton :{
            type :  cc.Sprite,
            default :   null,  
        },
        refuceButton : {
            type :  cc.Sprite,
            default :   null,  
        },
        hadAgreed:{
            type :  cc.Label,
            default :   null,

        },
        hadRefuced : {
            type : cc.Label,
            default : null,
        },
        isExa : {
            type:cc.Label,
            default : null,
        }
    },
    fresh : function(applyRecordList){
        this.canClick=true;
        this.applyRecordList = applyRecordList;
        this.userName.string = applyRecordList.userNickname ;
        this.userID.string  = "ID:"+applyRecordList.userId;
        this.timeLabel.string = TimeHelper.getFormatTime(applyRecordList.createdAt * 1000,"%Y-%M-%D\n%h:%m");
        var status = applyRecordList.status;//状态 0审核中 1已同意 2已拒绝
        this.hideAllStatusFlag();
        switch(status){
            case 0 :
                this.agreeButton.node.active   = true;
                this.refuceButton.node.active  = true;
            break;
            case 1 : 
                this.hadAgreed.node.active  = true;
            break;
            case 2:
                this.hadRefuced.node.active = true;
            break;
        }
    },

    hideAllStatusFlag : function(){
        this.agreeButton.node.active   = false;
        this.refuceButton.node.active  = false;
        this.hadAgreed.node.active  = false;
        this.hadRefuced.node.active = false;
    },
    onClickAgreeButton : function(){
        this.requestChangeClubApply(true);
        // this.applyRecordList.type = 3; //同意
        // this.flushList(this.applyRecordList);
    },
    onClickRefuseButton : function(){
        this.requestChangeClubApply(false);
        // this.applyRecordList.type = 4;//拒绝
        // this.flushList(this.applyRecordList);
    },

    requestChangeClubApply : function(isAdmit){
        // if(!this.canClick){
        //     return;
        // }
        // this.canClick = false;
        // var gameUrl = SystemConfig.gameUrl;
        // var id = this.applyRecordList.id;
        // var url = gameUrl+'/club/set_apply_club';
        // var uid = cc.mj.ownUserData.uid;
        // var status = isAdmit ? 1 : 2;
        // var data = {'id':id,"status":status,"uid":uid};
        // var customHttpRequest = new CustomHttpRequest();
        // customHttpRequest.setRequestType('POST');
        // customHttpRequest.setUrl(url);
        // customHttpRequest.setData(JSON.stringify(data));
        // console.log('url:'+url + "   data:"+JSON.stringify(data));
        // var self = this;
        // cc.global.loading.show();
        // CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        //     cc.global.loading.hide();
        //     this.canClick=true;
        //     if(customHttpRequest1){
        //         var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
        //         console.log('MahjongTempClient.getMyClubList ' + JSON.stringify(cbdata));
        //         if(cbdata.code == Code.OK){      
        //             self.applyRecordList.status= isAdmit ? 1 : 2;
        //             self.fresh(self.applyRecordList);
        //             cc.global.rootNode.emit("FreshMemberLayer");//刷新好友圈成员列表
        //         }else{
        //             CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
        //         }
        //     }else{  
        //         CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        //     }
        // });
        var id = this.applyRecordList.id;
        var uid = cc.mj.ownUserData.uid;
        var self = this;
        var status = isAdmit ? 1 : 2;
        var data= {'id':id,"status":status,"uid":uid}
        //tempClient.setClubApplyManage(data,true,this.onchangeApplyItem.bind(this));
        tempClient.setClubApplyManage(data,true,function(){
            self.applyRecordList.status= isAdmit ? 1 : 2;
            self.fresh(self.applyRecordList);
            cc.global.rootNode.emit("FreshMemberLayer");//刷新好友圈成员列表
        });
    },

    updateItem : function(index,itemId,data){
        this.itemID = itemId;
        this.node.active = !!data;
        if(data){
            this.fresh(data);
        }
    },
});
