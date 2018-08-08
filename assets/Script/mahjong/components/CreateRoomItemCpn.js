var SeatCfg = require('SeatCfg');
var tempClient = require('MjRequestSpecificClient')
var DiamondConfig = require('DiamondConfig');
var CommonHelper = require('CommonHelper');
var CodeCfg = require('CodeCfg');
var RoomInfo = require('RoomInfoData');
var GameToAppHelper = require('GameToAppHelper');
var GameToPlatformHelper = require('GameToPlatformHelper');
var CreateRoomCfg = require("CreateRoomCfg");
var BackStageConfig = require('BackStageConfig');
var FanXingCfg = require('FanXingCfg');
var ProtoUtil = require('ProtoUtil');
var GoodsConfig = require('GoodsConfig');
var item = cc.Class({
    name : 'item',
    properties: {
        key : {
            default : null,
            type : cc.Toggle,
        },
        valueList : {
            default : [],
            type : cc.Toggle,
        },
        isNormal : true,//isNormal为true,则意为勾选了key才能勾选valueList,为false,则意为勾选了key才不能勾选valueList
        defaultCheckToggle : {//当valueList中有本来状态check的后被uncheck时默认check的对象
            default : null,
            type : cc.Toggle,            
        },
        id : -1,
    },
        });
cc.Class({
    extends: cc.Component,

    properties: {
        relateList : {
            default : [],
            type : item,
        },
        relateList : {
            default : [],
            type : item,
        },
        _toggleGroupCpnList : {
            default : [],
            type : cc.ToggleGroup,
        },
        groupCtrlLabel : {
            default : null,
            type : cc.Label,             
        },
        difenSlider : {
            default : null,
            type : cc.Slider,
        },
        sliderHandle : {
            default : null,
            type : cc.Node,           
        },
        juShuContainer : {
            default : null,
            type : cc.Node, 
        },
        majiangType : "",
        _shareRoomInfo : RoomInfo,
    },

    // use this for initialization
    onLoad: function () {
        this._toggleGroupCpnList = this.node.getComponentsInChildren(cc.ToggleGroup);
        if(this.difenSlider){
            this.difenSlider.node.on(cc.Node.EventType.TOUCH_END,this.onSliderChangeDone,this);
            this.sliderHandle.on(cc.Node.EventType.TOUCH_END,this.onSliderChangeDone,this);
        }
    },

    initView : function(goodsList){
        this.initJuShuData(goodsList);
        for(var i = 0 ; i < this.juShuContainer.childrenCount; ++i){
            if(i >= goodsList.length){
                break;
            }
            var richTextStr = "<size=25><color=#331900>(tag</color></size><img src='icon_roomcard'/><size=25><color=#331900>num)</color></size>"
            var goods = goodsList[i];
            var name = "jushutoggle" + (i+1);
            var isFree = goods.diamond <= 0;
            var labelContainer = this.juShuContainer.getChildByName(name).getChildByName("labelContainer");
            labelContainer.getChildByName('jushuLabel').getComponent(cc.Label).string = goods.name;
            var richText = labelContainer.getChildByName('diamondLabel').getComponent('cc.RichText');
            richText.node.getChildByName('line').active = false;
            var num = isFree ? '限时免费' : ('X' + goods.diamond); 
            var diamondSrc = isFree ? '' : 'icon_roomcard';
            richTextStr = richTextStr.replace('tag',goods.tag).replace('num',num);
            richTextStr = richTextStr.replace('icon_roomcard',diamondSrc);
            richText.string = richTextStr;
        }
    },

    initJuShuData : function(goodsList){
        CreateRoomCfg.roomCardId.valueArr = [];
        for(var i = 0 ; i < goodsList.length; ++i){
            CreateRoomCfg.roomCardId.valueArr.push(goodsList[i].goodsId);
        }
    },

    freshView : function(){
        var sameIdList = {};
        for(var i = 0 ; i < this.relateList.length; ++i){
            var relateItem = this.relateList[i];
            if(relateItem.id >= 0){
                sameIdList[relateItem.id] = sameIdList[relateItem.id] || [];
                sameIdList[relateItem.id].push(relateItem); 
                continue;
            }
            this.resolveRelateItem(relateItem);
        }
        var self = this;
        for(var relateItemId in sameIdList){
            var sameIdListItem = sameIdList[relateItemId];
            sameIdListItem.sort(function(a,b){return (self.isToggleCheck(a.key) && !self.isToggleCheck(b.key)) ? 1 : -1;})
            for(var i = 0; i < sameIdListItem.length; ++i){
                this.resolveRelateItem(sameIdListItem[i]);
            }
        }
    },

    resolveRelateItem : function(relateItem){
        var isNormal = relateItem.isNormal;
        var childEnable = false;
        if(this.isToggleCheck(relateItem.key)){
            childEnable = isNormal ? true : false;
        }else{
            childEnable = isNormal ? false : true;
        }
        for(var j = 0 ; j < relateItem.valueList.length; ++j){
            this.setToggleEnable(relateItem.valueList[j],relateItem.defaultCheckToggle,childEnable);
        }
    },

    getLocalStorageSeatCfgOpt : function(recordKey){
        var value = cc.sys.localStorage.getItem(recordKey);
        console.log("------" + value);
        value = value ? JSON.parse(value) : {};
        return value;
    },

    recordDefaultValue : function(){
        var recordKey = "seatCfgOpt" + this.majiangType + cc.mj.ownUserData.uid;
        var seatCfgOpt = this.getLocalStorageSeatCfgOpt(recordKey);
        for(var key in seatCfgOpt){
            var ParentGroup = this.getParentGroup(key);
            if(ParentGroup){
                var toggleGroup = this.findToggleGroupByName(ParentGroup);
                if(toggleGroup){
                    var toggleNode = toggleGroup.node;
                    if(CreateRoomCfg[key].type == "bool"){
                        var CheckNode = toggleNode.getChildByName(CreateRoomCfg[key].toggleArr[0])
                        var CheckToggle = CheckNode.getComponent(cc.Toggle);
                        CheckToggle.isChecked = seatCfgOpt[key];
                    }else if(CreateRoomCfg[key].type == "string" || CreateRoomCfg[key].type == "num"){
                        var checkToggleIndex = this.findCheckIndex(key,seatCfgOpt[key]);
                        if(checkToggleIndex != -1){
                            this.hideElseCheckNode(checkToggleIndex,toggleGroup,key)
                            this.checkNodeToggle(checkToggleIndex,toggleNode,key);
                        }
                    }else if(CreateRoomCfg[key].type == "arr"){
                        var itemkey = CreateRoomCfg[key].itemType.key;
                        var value = CreateRoomCfg[key].itemType.value;
                        var optionList = seatCfgOpt[key];
                        console.log(optionList);
                        this.hideAllCheckNode(toggleGroup);
                        for(var i = 0 ; i < optionList.length; ++i){
                            var optionItem = optionList[i];
                            var checkNodeName = optionItem[itemkey] + '_' + optionItem[value];
                            this.checkNodeToggleLike(checkNodeName,toggleNode);
                        }
                    }
                }else if(ParentGroup == 'tiaojie'){
                    var diFenIndex = this.findCheckIndex(key,seatCfgOpt[key]);
                    if(diFenIndex != -1 && this.difenSlider){
                        this.difenSlider.progress = CreateRoomCfg.diFen.toggleArr[diFenIndex] / 10;
                    }
                }
            }
        };
    },

    update : function(){
        this.freshView();
    },

    start : function(){
        this.recordDefaultValue();
    },

    onEnable : function(){
        this.groupCtrlLabel.node.active = (!!cc.gameConfig.groupId);
        this.groupCtrlLabel.string = SeatCfg.isSetGroupCtrNum()? ('(本局群主已设置管理分?)'.replace('?',SeatCfg.createGroupCtrNum)) : '';
        cc.global.rootNode.on("ChangeGroupCtrNum",this.changeGroupCtrlNum,this);
    },

    onDisable : function(){
        cc.global.rootNode.off("ChangeGroupCtrNum",this.changeGroupCtrlNum,this)
    },

    isToggleCheck : function(toggle){//被选中且没被禁用
        return (toggle.isChecked && toggle.interactable == true);
    },

    setToggleEnable : function(toggle,defaultCheckToggle,isEnable){
        if(isEnable == false){
            var isCheckDefaultToggle = false;
            if(toggle.isChecked == true && defaultCheckToggle != null){
                isCheckDefaultToggle = true;
            }
            toggle.isChecked = false;
            if(isCheckDefaultToggle){
                defaultCheckToggle.isChecked = true;
            }
        }
        toggle.interactable = isEnable;
    },

    findToggleGroupByName : function(name){
        for(var i = 0 ; i < this._toggleGroupCpnList.length; ++i){
            if(this._toggleGroupCpnList[i].node.name == name){
                return this._toggleGroupCpnList[i];
            }
        }
        return null;
    },

    onSliderChangeDone : function(){
        var progress = this.difenSlider.progress;
        console.log(progress);
        progress = Math.floor(progress*10 + 0.5) *0.1;
        this.difenSlider.progress = progress;
        console.log('progress:' + progress);
    },

    getSeatCfgOpt : function(){
        this.checkableOptionArr = {};
        var seatCfgOpt = {};
        for(var serverKey in CreateRoomCfg){
            var valueItem = CreateRoomCfg[serverKey];
            if(valueItem.parentGroup){
                var parentGroupCpn = this.findToggleGroupByName(valueItem.parentGroup);
                if(parentGroupCpn && valueItem.toggleArr){
                    if(valueItem.type == 'arr'){
                        for(var i = 0 ; i < parentGroupCpn.node.children.length; ++i){
                            var toggleNode = parentGroupCpn.node.children[i];
                            if(toggleNode && toggleNode.getComponent(cc.Toggle)){
                                var toggleCpn = toggleNode.getComponent(cc.Toggle);
                                
                                    var nodeName = toggleCpn.node.name;
                                    var data = nodeName.replace(valueItem.toggleArr[0],'');
                                    var itemArr = data.split('|');
                                    var item = [];
                                    for(var j = 0 ;j < itemArr.length; ++j){
                                        var keyvalue = itemArr[j].split('_');
                                        var dataitem = {};
                                        dataitem[valueItem.itemType.key] = Number(keyvalue[0]);
                                        dataitem[valueItem.itemType.value] = Number(keyvalue[1]);
                                        if(seatCfgOpt[serverKey] == undefined || seatCfgOpt[serverKey] == null){
                                            seatCfgOpt[serverKey] = [];
                                            this.checkableOptionArr[serverKey] = [];
                                        }
                                        if(toggleCpn.isChecked){
                                            seatCfgOpt[serverKey].push(dataitem);
                                        }
                                        this.checkableOptionArr[serverKey].push(keyvalue[0]);
                                    }
                                
                            }
                        }
                    }else{
                        for(var i = 0 ; i < valueItem.toggleArr.length; ++i){
                            var toggleNode = parentGroupCpn.node.getChildByName(valueItem.toggleArr[i]);
                            if(toggleNode && toggleNode.getComponent(cc.Toggle)){
                                var toggleCpn = toggleNode.getComponent(cc.Toggle);
                                if(valueItem.type == 'bool'){
                                    seatCfgOpt[serverKey] = toggleCpn.isChecked;
                                }else{
                                    if(toggleCpn.isChecked){
                                        seatCfgOpt[serverKey] = valueItem.valueArr[i];
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(seatCfgOpt[serverKey] == undefined && valueItem.default != undefined ){
                if(valueItem.type == 'arr'){
                    seatCfgOpt[serverKey] = [].concat(valueItem.default);
                }else{
                    seatCfgOpt[serverKey] = valueItem.default;
                }
            }
        }
        if(this.difenSlider){
            seatCfgOpt.diFen = CreateRoomCfg.diFen.valueArr[Math.floor(this.difenSlider.progress * 10)];
        }
        seatCfgOpt.groupCtrNum = SeatCfg.createGroupCtrNum;
        seatCfgOpt.majiangType = this.majiangType;
        return seatCfgOpt;
    },

    onClickCreateRoom : function(createRoomType){
       var seatCfgOpt = this.getSeatCfgOpt();
       var recordSeatCfgOpt = JSON.stringify(seatCfgOpt);
       var pointList = seatCfgOpt.pointList;
       var pointMode = seatCfgOpt.pointMode;
       var goods = GoodsConfig.getGoodsById(seatCfgOpt.roomCardId);
       if(!goods){
            CommonHelper.showTips("房间配置出错");
            return;
       }
       seatCfgOpt.gameNumber = goods.gameNum;
       var checkablePointList = this.checkableOptionArr.pointList || [];
       var mode = 'default';
       var score = 0;
       if(pointMode == 'xiao_hu'){
            mode = 'da_hu';
            score = 2;
            var dataitem = {};
            dataitem[CreateRoomCfg.pointList.itemType.key] = 1;
            dataitem[CreateRoomCfg.pointList.itemType.value] = 1;
            pointList.push(dataitem);
       }else if(pointMode == 'da_hu'){
            mode = 'da_hu';
            score = 1;
       }else if(pointMode == 'regular'){
            mode = 'normal';
            seatCfgOpt.pointMode = 'normal';
            score = 1;
       }
       var pointIdList = [];
       for(var i = 0 ; i < pointList.length; ++i){
            pointList[i].mode = 'normal';
            pointIdList.push(pointList[i].type);
        }
       
        for(var i = 0 ; i < checkablePointList.length; ++i){
            var isFind = (pointIdList.findIndex(function(value){return value == checkablePointList[i]}) != -1)
            var iid = Number(checkablePointList[i]);
            if(!isFind && iid ){
                var dataitem = {};
                dataitem[CreateRoomCfg.pointList.itemType.key] = iid;
                dataitem[CreateRoomCfg.pointList.itemType.value] = score;
                dataitem.mode = mode;
                pointList.push(dataitem);
                pointIdList.push(iid);
            }
 
        }
       var complementarySet = FanXingCfg.getComplementarySet(pointIdList);
       for(var i = 0 ; i < complementarySet.length; ++i){
            var dataitem = {};
            dataitem[CreateRoomCfg.pointList.itemType.key] = complementarySet[i];
            dataitem[CreateRoomCfg.pointList.itemType.value] = 0;
            dataitem.mode = 'default';
            pointList.push(dataitem);
       }
        this._shareRoomInfo = new RoomInfo();
        if(this.checkJuShuMoney(seatCfgOpt.roomCardId, createRoomType)){
            this.createRoom(seatCfgOpt,recordSeatCfgOpt,createRoomType);
            return true;
        }else{
            var contentText = CodeCfg.getCodeName(CodeCfg.SEAT_DIAMOND_NOT_ENOUGH);
            var self = this;
            CommonHelper.showTips(contentText);
            return false;
        }
    },

    createRoom : function(seatCfgOpt,recordSeatCfgOpt,createRoomType){
        console.log(JSON.stringify(seatCfgOpt));
        var recordKey = "seatCfgOpt" + this.majiangType + cc.mj.ownUserData.uid;
        cc.sys.localStorage.setItem(recordKey,recordSeatCfgOpt);
        this._shareRoomInfo.initRoomConfig(seatCfgOpt);
        switch(createRoomType){
            case 1 : 
                this._shareRoomInfo.groupId = cc.gameConfig.groupId;
            break;
            case 2 : 
                this._shareRoomInfo.clubId = cc.gameConfig.clubId;
            break;
        }
        var rules = this._shareRoomInfo.roomConfig.getRuleStr(',');
        tempClient.createRoom(rules,seatCfgOpt,createRoomType,true,this.onCreateRoom.bind(this));
    },

    onCreateRoom : function(customHttpRequest1){
        if(customHttpRequest1){
            var cbdata = JSON.parse(customHttpRequest1.xhr.responseText);
            console.log('MahjongTempClient.createRoom ' + JSON.stringify(cbdata));
            if(cbdata.code == CodeCfg.OK){      
                this.onCreateRoomSuc(ProtoUtil.decode(cbdata)); 
            }else{
                if(cbdata.code == CodeCfg.CONFIG_DATA_NOT_EQUAL){
                    CommonHelper.showMessageBox("提示",CodeCfg.getCodeName(cbdata.code) + ",\n请退出游戏重新尝试",function(){
                        GameToPlatformHelper.ExitGame();
                    },null,false);
                } else if (cbdata.code == CodeCfg.GAME_CLOSED) {
                    CommonHelper.showMessageBox("提示", CodeCfg.getCodeName(cbdata.code), function () {
                        GameToAppHelper.ExitGame()
                    }, null, false);
                } else if (cbdata.code == CodeCfg.USER_ALREADY_IN_GAME) {
                    CommonHelper.showMessageBox("提示", CodeCfg.getCodeName(cbdata.code), function () {
                        CommonHelper.backToLastScene();
                    }, null, false);
                } else{
                    CommonHelper.showTips(CodeCfg.getCodeName(cbdata.code));
                }
                
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){
                cc.global.rootNode.emit("OnEnterRoomError");
            },null,false);
        }
    },

    onCreateRoomSuc : function(cbData){
        cc.mj.roomInfo.initData(cbData);
        this._shareRoomInfo.initData(cbData);
        this.shareRoomCreate();
        var Canvas = cc.find('Canvas');
        Canvas.getComponent('LobbyScene').enterRoom();
    },

    checkJuShuMoney : function(goodsId, createRoomType){
        var isClubGame = (createRoomType == 2);
        if( !isClubGame){
            var price = GoodsConfig.getGoodsById(goodsId).diamond;
            return (cc.mj.ownUserData.roomcard >= price);
        }else{
            return true;
        }
    },

    changeGroupCtrlNum : function(){
        this.groupCtrlLabel.string = SeatCfg.isSetGroupCtrNum()? ('(本局群主已设置管理分?)'.replace('?',SeatCfg.createGroupCtrNum)) : '';
        CommonHelper.showMessageBox('提示','群管理分已被群主重置',function(){},null,false);
    },

    shareRoomCreate : function(){
        this._shareRoomInfo.initRoomCreator(cc.mj.ownUserData);
        if(this._shareRoomInfo.isGroupGame() || this._shareRoomInfo.isClubGame()){
            var shareRoomInfoStr = this._shareRoomInfo.getShareRoomInfo();
            GameToAppHelper.shareCreateClubGame(shareRoomInfoStr);
        }else{
           console.log('不是群房间不发送');
        }

    },

    hideElseCheckNode : function(checkToggleIndex,toggleGroupCpn,key){
        var toggleGroupNode = toggleGroupCpn.node;
        var CheckNodeName = CreateRoomCfg[key].toggleArr[checkToggleIndex];
        for(var i = 0 ; i< toggleGroupCpn.toggleItems.length;i++){
            var toggleCpn = toggleGroupCpn.toggleItems[i];
            if(toggleCpn.node.name != CheckNodeName){
                toggleCpn.isChecked = false;
            }
        }
    },

    hideAllCheckNode : function(toggleGroupCpn){
        var toggleGroupNode = toggleGroupCpn.node;
        for(var i = 0 ; i < toggleGroupNode.childrenCount;i++){
            var toggleCpn = toggleGroupNode.children[i].getComponent(cc.Toggle);
            if(toggleCpn){
                toggleCpn.isChecked = false;
            }
        }
    }, 

    checkNodeToggle : function(checkToggleIndex,toggleNode,key){
        var CheckNodeName = CreateRoomCfg[key].toggleArr[checkToggleIndex];
        var CheckNode = toggleNode.getChildByName(CheckNodeName);
        var CheckToggle = CheckNode.getComponent(cc.Toggle);
        CheckToggle.isChecked = true;
    },

    checkNodeToggleLike : function(CheckNodeName,toggleNode){
        for(var i = 0 ; i < toggleNode.childrenCount; ++i){
            var checkNode = toggleNode.children[i];
            var checkToggle = checkNode.getComponent(cc.Toggle);
            var nodeName = checkNode.name;
            if(checkToggle && nodeName.indexOf(CheckNodeName) > 0){
                checkToggle.isChecked = true;
            }
        }
    },

    getParentGroup : function(name){
        for(var key in CreateRoomCfg){
            if(key == name){
                return CreateRoomCfg[name].parentGroup;
            }
        }
        return null;
    },

    findCheckIndex : function(key,name){
        var index = CreateRoomCfg[key].valueArr.findIndex(function(v,i,o){
            return v == name ;
        });
        return index;
    },
});
