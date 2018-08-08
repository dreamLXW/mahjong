var SystemConfig = require('SystemConfig');
var CustomHttpRequest = require('CustomHttpRequest');
var CustomHttpClient = require('CustomHttpClient');
var tempClient = require('MjRequestSpecificClient');
var Code = require('CodeCfg');
var CommonHelper = require('CommonHelper');
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
        managerName : {
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
        this.canClick = true;
        this.applyRecordList = applyRecordList;
        var clubName = applyRecordList.clubName;
        var nowclubNum  = applyRecordList.clubNumber;
        var maxClubNumber = applyRecordList.clubMaxNumber;
        this.userName.string = clubName + "(" + nowclubNum +"/"+maxClubNumber+")";
        this.userID.string  = "ID: "+applyRecordList.clubId
        this.managerName.string = "经理: "+applyRecordList.clubManager;
        var status = this.applyRecordList.type; //1申请 2邀请
        var MyType = this.applyRecordList.status;
        this.hideAllStatusFlag();
        if (status==2){
            this.agreeButton.node.active   = true;
            this.refuceButton.node.active  = true;
        }else{
            switch(MyType){
                case 0 :
                this.isExa.node.active = true;
                break;
                case 1 :
                this.hadAgreed.node.active=true;
                break;
                case 2:
                    this.hadRefuced.node.active=true
                break;
            }
        }
    },
    hideAllStatusFlag : function(){
        this.agreeButton.node.active   = false;
        this.refuceButton.node.active  = false;
        this.hadAgreed.node.active  = false;
        this.hadRefuced.node.active = false;
        this.isExa.node.active      = false;
    },
    onClickAgreeButton : function(){
        this.requestChangeClubApply(true);
    },
    onClickRefuseButton : function(){  
        this.requestChangeClubApply(false);
    },
    requestChangeClubApply :function(isAdmit){
        // if(!this.canClick){
        //     return;
        // }
        // this.canClick=false;
        // var gameUrl = SystemConfig.gameUrl;
        // var id = this.applyRecordList.id;
        // var url = gameUrl+'/club/user_confirm';
        // var status = isAdmit ? 1 : 2;
        // console.log('url:'+url);
        // var data = {'id':id,"status":status};
        // var customHttpRequest = new CustomHttpRequest();
        // customHttpRequest.setRequestType('POST');
        // customHttpRequest.setUrl(url);
        // customHttpRequest.setData(JSON.stringify(data));
        // var that = this;
        // cc.global.loading.show();
        // CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
        //     cc.global.loading.hide();
        //     this.canClick=true;
        //     if(customHttpRequest1){
        //         var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
        //         console.log('MahjongTempClient.getMyClubList ' + JSON.stringify(cbdata));
        //         if(cbdata.code == Code.OK){ 
        //             that.freshClubApplyRecord();
        //         }else{
        //             CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){},null,false);
        //         }
        //     }else{  
        //         CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        //     }
        // });
        var status = isAdmit ? 1 : 2;
        var data = {'id':this.applyRecordList.id,"status":status};
        tempClient.setApplyClub(data,true,this.freshClubApplyRecord.bind(this));
    },
    updateItem : function(index,itemId,data){
        this.itemID = itemId;
        this.node.active = !!data;
        if(data){
            this.fresh(data);
        }
    },
    freshClubApplyRecord : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var userClubLayer = ModalLayerMgr.getTop('UserClubLayer');
        var userClubApplyRecor = userClubLayer.getComponent("UserClubLayerCpn");
        userClubApplyRecor.requestMyClubApplyRecord();
    },
});
