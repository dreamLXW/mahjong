var SeatCfg = require('SeatCfg');
var tempClient = require('MjRequestSpecificClient')
var CommonHelper = require('CommonHelper');
var CodeCfg = require('CodeCfg');
var RoomInfo = require('RoomInfoData');
var GameToAppHelper = require('GameToAppHelper');
var GoodsConfig = require('GoodsConfig');
cc.Class({
    extends: cc.Component,
    properties: {
        groupTitleNode : {
            default : null,
            type : cc.Node,  
        },
        clubTitleNode : {
            default : null,
            type : cc.Node,  
        },
        titleNode : {
            default : null,
            type : cc.Node, 
        },
        scrollView : {
            type : cc.ScrollView,
            default : null,
        },
        createRoomItem : {
            default : [],
            type : cc.Prefab,
        },
        contentContainer : {
            default : null,
            type : cc.Node, 
        },
        toggleList : {
            type : cc.Toggle,
            default : [],
        },
        createRoomFreeNode : {
            default : null,
            type : cc.Node,
        },
        createRoomNormalNode : {
            default : null,
            type : cc.Node,
        },
        curIndex : 0,
    },

    // use this for initialization
    onLoad: function () {
        var recordTypeKey = "createRoomType" + cc.mj.ownUserData.uid;
        var index = cc.sys.localStorage.getItem(recordTypeKey);
        this.curIndex = (index && Number(index) > 0) ? Number(index) : 0;
        this.checkToggleIndex(this.curIndex);
        console.log(this.curIndex);
    },

    init : function(isFromClub){
        this.isFromClub = isFromClub;
    },

    onEnable : function(){
        var createRoomTypeArr = [false,false,false];
        var isCreatePersonalRoom = (!cc.gameConfig.groupId && !this.isFromClub);
        var isCreateGroupRoom = (!!cc.gameConfig.groupId && !this.isFromClub);
        var isCreateClubRoom = (!!cc.gameConfig.clubId && this.isFromClub);
        this.titleNode.active = isCreatePersonalRoom;
        this.groupTitleNode.active = isCreateGroupRoom;
        this.clubTitleNode.active = isCreateClubRoom;
        createRoomTypeArr[0] = isCreatePersonalRoom;
        createRoomTypeArr[1] = isCreateGroupRoom;
        createRoomTypeArr[2] = isCreateClubRoom;
        this.createRoomType = 0;
        for(var i = 0 ; i < createRoomTypeArr.length; ++i){
            if(createRoomTypeArr[i] == true){
                this.createRoomType = i;
                break;
            }
        }
        this.freshView();
    },

    onClickMahjongTypeToggle : function(target,data){
        this.curIndex = data;
        this.freshView();
    },

    freshView : function(){
        this.scrollView.scrollToTop(0);
        console.log(this.curIndex);
        var createRoomItemPrefab = this.createRoomItem[this.curIndex];
        var createRoomItemNode = this.contentContainer.getChildByName(createRoomItemPrefab.name);
        this.hideAnotherCreateRoomNode(createRoomItemPrefab.name);
        if(!createRoomItemNode){
            var createRoomItemNode = cc.instantiate(createRoomItemPrefab);
            this.contentContainer.addChild(createRoomItemNode);
        }
        createRoomItemNode.active = true;
        var roomTypeToType = {"0":1,"1":3,"2":2};
        var goodsPrice = GoodsConfig.getGoodsListByType(roomTypeToType[this.createRoomType]);
        var isAllFree = GoodsConfig.isTypeAllFree(roomTypeToType[this.createRoomType]);
        this.createRoomFreeNode.active = isAllFree;
        this.createRoomNormalNode.active = !isAllFree;
        createRoomItemNode.getComponent('CreateRoomItemCpn').initView(goodsPrice);
        
    },

    hideAnotherCreateRoomNode : function(childName){
        for(var i = 0 ; i < this.contentContainer.childrenCount; ++i){
            if(this.contentContainer.children[i].name != childName){
                this.contentContainer.children[i].active = false;
            }
        }
    },

    getActiveContentInContainer : function(){
        for(var i = 0 ; i < this.contentContainer.childrenCount; ++i){
            var child = this.contentContainer.children[i];
            if(child.active == true && child.getComponent('CreateRoomItemCpn') != null){
                return child;
            }
        }
        return null;
    },

    onClickBtnConfirm : function(){
        var child = this.getActiveContentInContainer();
        var createRoomItemCpn = child.getComponent('CreateRoomItemCpn');
        var isSuc = createRoomItemCpn.onClickCreateRoom(this.createRoomType);
        if(isSuc){
            console.log('hahhahaha');
            var recordTypeKey = "createRoomType" + cc.mj.ownUserData.uid;
            cc.sys.localStorage.setItem(recordTypeKey,this.curIndex);
        }
        this.closeMyself();
    },

    closeMyself : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);        
    },

    checkToggleIndex : function(index){
        for(var i = 0 ; i < this.toggleList.length; ++i){
            if(i == index){
                this.toggleList[i].isChecked = true;
            }else{
                this.toggleList[i].isChecked = false;
            }
        }
    },

});

