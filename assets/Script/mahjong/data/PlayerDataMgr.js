var PlayerData = require('PlayerData');
var EventName = require('EventName');
var ProtoUtil = require('ProtoUtil');
var CommonHelper = require('CommonHelper');
cc.Class({
    name: 'PlayerDataMgr',
    properties: {
        playerDataList : {
            default : [],
            type : PlayerData,
        },
        maxNum : 4, 
    },
    
    ctor : function(){
        this.playerDataList = [];
    },

    getMaxNum : function(){
        return this.maxNum;
    },

    changeMaxNum :function(maxNum){
        this.maxNum = maxNum;
        for(var i = 0 ; i < this.playerDataList.length; ++i){
            this.playerDataList[i].initSide();
        }
    },

    getPlayerNumber : function(){
        return this.playerDataList.length;
    },

    getPlayerDataList : function(){
        return this.playerDataList;
    },

    initData : function(playerList,maxNum,isEmit){ 
        this.maxNum = maxNum ? maxNum : playerList.length; 
        
        this.initPlayerDataList(playerList,isEmit);
    },

    getSexByUid : function(uid){
        var playerData = this.getPlayerDataById(uid);
        return playerData.sex;
    },

    getPlayerDataById : function(id){
        for(var i = 0 ; i < this.playerDataList.length; ++i){
            var playerData = this.playerDataList[i];
            if(playerData.uid == id){
                return playerData;
            }
        }
        return null;scroll
    },

    getPlayerDataOfViewPos : function(myUid,viewPos){
        //var myUid = cc.mj.ownUserData.uid;
        var myPlayerData = this.getPlayerDataById(myUid);
        var direction = myPlayerData.direction;
        for(var i = 0 ; i < this.playerDataList.length; ++i){
            var fromDirection = this.playerDataList[i].direction;
            var playerDataViewPos = CommonHelper.getRelativeViewPos(direction,fromDirection,this.maxNum);
            if(playerDataViewPos == viewPos){
                return this.playerDataList[i];
            }
        }
        return null;
    },

    getPlayerDataOfSideName : function(myUid,sideName){
        var viewPos = CommonHelper.getViewPosBySideName(sideName,this.maxNum);
        return this.getPlayerDataOfViewPos(myUid,viewPos,this.maxNum);
    },

//fromUid相对于uid在哪个位置,返回1,2,3,4
    getRelativePosBetween : function(uid,fromUid){
        var direction = this.getPlayerDataById(uid).direction;
        var fromDirection = this.getPlayerDataById(fromUid).direction;
        var viewpos = CommonHelper.getRelativeViewPos(direction,fromDirection,this.maxNum);
        return viewpos;
    },

//fromUid相对于uid在哪个位置,返回myself,left,top,right
    getRelativeSideBetween : function(uid,fromUid){//只能在有牌局的时候使用
        var uidSide = this.getSideByUid(uid);
        var viewPosToSide = CommonHelper.getSideNameArr(uidSide,this.maxNum);
        var viewPos = this.getRelativePosBetween(uid,fromUid);
        return viewPosToSide[viewPos-1];
    },

//1:myself,2:right,3:top,4:left
    getViewPosByDirection : function(direction){//别人相对于自己的位置，自己的位置为1 //只能在有牌局的时候使用
        var myDireciotn = this.getMyDirection();
        var viewpos = CommonHelper.getRelativeViewPos(myDireciotn,direction,this.maxNum);
        return viewpos;
    },

    getViewPosByUid : function(uid){//别人相对于自己的位置，自己的位置为1 //只能在有牌局的时候使用
        var direction = this.getDirectionByUid(uid);
        if(direction != -1){
            return this.getViewPosByDirection(direction);
        }
        console.log('PlayerDataMgr.getViewPosByUid出错');
        return -1;
    },

    getSideByDirection : function(direction){
        var myDireciotn = this.getMyDirection();
        var viewpos = CommonHelper.getRelativeViewPos(myDireciotn,direction,this.maxNum);
        var viewPosToSide = CommonHelper.getSideNameArr("myself",this.maxNum);
        return viewPosToSide[viewpos-1];
    },

    getSideByUid : function(uid){ //只能在有牌局的时候使用
        var playerData = this.getPlayerDataById(uid);
        return playerData.side;
    },

    getDirectionByUid : function(uid){//获取玩家的东南西北方位 //只能在有牌局的时候使用
        var playerData = this.getPlayerDataById(uid);
        if(playerData){
            var direction = playerData.direction;
            return direction;
        }
        console.log('PlayerDataMgr.getDirectionByUid出错');
        return -1;
    },

    getConvertDirectionByUid : function(uid){//获取玩家的东南西北方位 //只能在有牌局的时候使用
        var direction = this.getDirectionByUid(uid);
        if(direction != -1){
            return CommonHelper.convertDirection(direction,this.maxNum);
        }else{
            return -1;
        }
    },

    getMyDirection : function(){ //只能在有牌局的时候使用
        var direction = cc.mj.ownUserData.direction;
        return direction;
    },

    initPlayerDataList : function(dataList,isEmit){//初始化玩家信息,格式是已经decode过的
        this.clearPlayerDataList(isEmit);
        for(var i = 0 ; i < dataList.length; ++i){
            var originData = dataList[i];
            this.addPlayerDataInList(originData,isEmit);
        }
    },

    changePlayerDataListData : function(dataList){
        for(var i = 0 ; i < dataList.length; ++i){
            var playerData = this.getPlayerData(dataList[i].uid);
            if(playerData){
                playerData.initData(dataList[i]);
            }else{
                console.log("PlayerDataMgr changePlayerDataListData");
            }
        }
    },

    clearPlayerDataList : function(isEmit){
        this.playerDataList = [];
        if(isEmit != false){
            this.emitPlayerNumChange();
        }
    },

    addPlayerDataInList : function(originData,isEmit){//格式是已经decode过的
        if(this.playerDataList.length >= 4){
            console.log("error ,超过四个人了");
            return;
        }
        console.log(JSON.stringify(originData));
        var playerData = new PlayerData();
        playerData.initData(originData);
        var isExist = false;
        for(var i = 0 ; i < this.playerDataList.length; ++i){
            if(this.playerDataList[i].uid == originData.uid){
                this.playerDataList[i] = playerData;
                isExist = true;
                break;
            }
        }
        if(!isExist){
            this.playerDataList.push(playerData);
            if(isEmit != false){
                this.emitPlayerNumChange();
            }
        }
        if(isEmit != false){
            playerData.emitChange();
        }
    },

    removePlayerDataFromList : function(uid){
        if(this.playerDataList.length <= 0){
             console.log("error ,没有人可以退出");
             return;
        }
        for(var i = 0 ; i < this.playerDataList.length; ++i){
             if(this.playerDataList[i].uid == uid){
                 var playerData = this.playerDataList[i];
                  this.playerDataList.splice(i,1);
                  this.emitPlayerNumChange()
                  return;
              }
         }
    },

    getPlayerData : function(uid){
        for(var i = 0 ; i < this.playerDataList.length; ++i){
            console.log('玩家uid='+this.playerDataList[i].uid);
            if(this.playerDataList[i].uid == uid){
                return this.playerDataList[i];
            }
        }
        return null;
    },

    setSeatOnline : function(uid,isOnline){
        var playerData = this.getPlayerData(uid);
        if(playerData){
            playerData.online = isOnline;
        }else{
            console.log(cc.js.getClassName(this)+' '+ 'setSeatOnline:没有找到对应的用户')
        }
    },

    setSeatReady : function(uid,isReady){
        var playerData = this.getPlayerData(uid);
        if(playerData){
            if(uid == cc.mj.ownUserData.uid){
                cc.mj.ownUserData.ready = isReady;
            }
            playerData.ready = isReady;
        }else{
            console.log(cc.js.getClassName(this)+' '+ 'setSeatReady:没有找到对应的用户')
        }
    },

    setAllSeatReady : function(isReady){
        for(var i = 0 ; i < this.playerDataList.length ; ++i){
            this.playerDataList[i].ready = isReady;
        }
    },

    emitPlayerNumChange : function(side,isLeave){//离开非掉线
        var detail = {'data':this.playerDataList};
        cc.global.rootNode.emit(EventName.OnPlayerNumChange,detail);
    },

    onPlayerDataChange : function(originData){
        var uid = originData.uid;
        var playerData = this.getPlayerData(uid);
        if(playerData){
            playerData.initDataAndEmitChange(originData);
            if(playerData.uid == cc.mj.ownUserData.uid){
                this.refresh();
            }
        }else{
            console.log("找不到uid="+originData.uid+"的用户");
        }
        
    },

    refresh : function(){
        for(var i =0 ; i < this.playerDataList.length; ++i){
            this.playerDataList[i].emitChange();
        }
    },

    getOtherUidList : function(uidList){
        var otherUidList = [];
        for(var i = 0 ; i < this.playerDataList.length ; ++i){
            var uid = this.playerDataList[i].uid;
            var isExist = false;
            for(var j = 0 ; j < uidList.length; ++j){
                if(uid == uidList[j]){
                    isExist = true;
                }
            }
            if(isExist == false){
                otherUidList.push(uid);
            }
        }
        return otherUidList;
    },

    onTalkAction : function(talkEvent){
        var uid = talkEvent.uid;
        var playerData = this.getPlayerData(uid);
        playerData.onTalkAction(talkEvent);
    },
});