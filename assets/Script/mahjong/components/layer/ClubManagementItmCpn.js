var TimeHelper = require('TimeHelper');
cc.Class({
    extends: cc.Component,
    properties: {
        time : {
            type    : cc.Label,
            default : null,
        },
        textContent:{
            type    : cc.RichText,
            default : null,
        }
    },
    fresh : function(manageRecordList){
        this.time.string = TimeHelper.getFormatTime(manageRecordList.createdAt * 1000,"%Y-%M-%D %h:%m");
        var userType = manageRecordList.adminType;
        var doType   = manageRecordList.type;
        var managerName = manageRecordList.adminNickname;
        var applyUserName = manageRecordList.userNickname;
        var manager="";
        var actionType="";
        var clubType="加入好友圈"
        var managerUser="";
        switch(userType){
            case 2 :
                manager="管理员";
            break;
            case 3 : 
                manager="经理";
            break;
        }
        managerUser=manager+manageRecordList.adminNickname;
        if(doType===1){
            actionType  =   "同意";
        }else if(doType===2){
            actionType  =   "拒绝";
        }else if(doType===3){
            actionType  =   "将";
            clubType    =   "踢出好友圈";
        }
        this.textContent.string="<color=#603913>"+manager+"</c><color=#a0410d>"+managerName+"</color><color=#603913>"+actionType+"玩家</c><color=#a0410d>"+applyUserName+"</color><color=#603913>"+clubType+"</c>";
     },
    updateItem : function(index,itemId,data){
        this.itemID = itemId;
        this.node.active = !!data;
        if(data){
            this.fresh(data);
        }
    },
});
