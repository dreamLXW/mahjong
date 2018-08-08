var OnlineLoadData = require('OnlineLoadData');
var CommonHelper = require('CommonHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel:{
            default:null,
            type:cc.Label,
        },
        idLabel:{
            default:null,
            type:cc.Label,
        },
        majiangTypeLabel:{
            default:null,
            type:cc.Label,
        },
        ruleLabelArr : {
            default:[],
            type:cc.Label,
        },
        headSp : {
            default:null,
            type:cc.Sprite,
        },
        enterButton : {
            type : cc.Node,
            default : null,
        },
        groupTag : {
            type : cc.Node,
            default : null,           
        },
        clubTag : {
            type : cc.Node,
            default : null,           
        },
        roomCreatorNode : {
            type : cc.Node,
            default : null,   
        },
    },

    // use this for initialization
    onLoad: function () {
    },

    init : function(roomInfo,isEnter){
        this.rid = roomInfo.roomId;
        this.roomInfo = roomInfo;
        if(roomInfo.isGoldRoom()){
            this.roomCreatorNode.active = false;
        }else{
            this.roomCreatorNode.active = true;
            var playerData = roomInfo.roomCreator;
            this.nameLabel.string = playerData.getDisplayName() + '(房主)';
            this.idLabel.string = playerData.getDisplayId();
            var url = playerData.url;
            this.node.getComponent('OnlineLoadData').getSpriteByUrl(url);
        }

        this.majiangTypeLabel.string = roomInfo.roomConfig.getMahjongName() + '玩法';
        var labelStrArr = roomInfo.roomConfig.getRuleArr(' ');
        
        for(var i = 0 ; i < labelStrArr.length ; ++i){
            this.ruleLabelArr[i].node.active = !(labelStrArr[i] == '');
            this.ruleLabelArr[i].string = labelStrArr[i];
        }
        this.enterButton.active = (isEnter == true);
        this.groupTag.active = (roomInfo.isGroupGame());
        this.clubTag.active = (roomInfo.isClubGame());
    },

    onEnable : function(){
    },

    onClickEnterRoom : function(){
        cc.mj.roomInfo = this.roomInfo;
        var Canvas = cc.find('Canvas');
        Canvas.getComponent('LobbyScene').enterRoom();
        this.closeMyself();
    },

    closeMyself : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);        
    },

    update : function(){
        var bg = this.node.getChildByName('bg');
        var glass = this.node.getChildByName('glass');
        bg.anchorX = glass.anchorX;
        bg.anchorY = glass.anchorY;
        bg.width = glass.width + 90;
        bg.height = glass.height + 90;
    },

});
