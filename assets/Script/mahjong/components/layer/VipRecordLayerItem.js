var CommonHelper = require('CommonHelper');
var tempClient = require('MjRequestSpecificClient');
var TimeHelper = require('TimeHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        indexLabel : {
            default : null,
            type : cc.Label,
        },
        roomNoLabel : {
            default : null,
            type : cc.Label,
        },
        userNode : {
            default : [],
            type : cc.Node,
        },
        timeLabel : {
            default : null,
            type : cc.Label,
        },
        diamondLabel : {
            default : null,
            type : cc.Label,
        },
        _rid : -1,
    },

    // use this for initialization
    onLoad: function () {

    },

    init : function(){
        this.node.on('click',this.onButtonClick,this);
    },

    fresh : function(data,index){
        this.node.active = !(data == null);

        if(data){
            this.indexLabel.string = index + 1;
            this.roomNoLabel.string = data.roomNum + '号房间';
            this.timeLabel.string = TimeHelper.getFormatTime(data.createtime * 1000,"%Y-%M-%D %h:%m");
            this.diamondLabel.node.active = (data.diamond != undefined);
            this.diamondLabel.string = ": "+(data.diamond * (-1));
            const userNum = 4;
            for(var i = 0 ; i < this.userNode.length; ++i){
                if(i >= data.playerSettleList.length){
                    this.userNode[i].active = false;
                }else{
                    this.userNode[i].active = true;
                    var displayId = (cc.sys.platform === cc.sys.WECHAT_GAME ? data.playerSettleList[i].uid : data.playerSettleList[i].dingNo);
                    this.userNode[i].getChildByName('idLabel').getComponent(cc.Label).string = '('+ displayId + ')';
                    this.userNode[i].getChildByName('scoreLabel').getComponent(cc.Label).string = data.playerSettleList[i].score;
                    this.userNode[i].getChildByName('nameLabel').getComponent(cc.Label).string = data.playerSettleList[i].nickname;
                    this.userNode[i].getChildByName('scoreLabel').color = Number(data.playerSettleList[i].score) < 0 ? cc.color("#9E0B0F") : cc.color("#0054A6");
                    this.userNode[i].getChildByName('icon_ower').active = (data.playerSettleList[i].uid == data.roomuid);
                    
                }
            }
            this._rid = data.rid;
        }
    },

    onButtonClick : function(){
        tempClient.requestTotalSettleInfoWithHttp(this._rid,this.onHttpRequestTotalSettleInfo.bind(this),true,false);
    },

    onHttpRequestTotalSettleInfo : function(decodeMsg){
        var SeatTotalSettleEvent = require('SeatTotalSettleEvent');        
        var seatTotalSettleEvent = new SeatTotalSettleEvent();
        seatTotalSettleEvent.init(decodeMsg);
        
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        if(ModalLayerMgr){
            var Node = ModalLayerMgr.getTop('RoomRecordLayer');
            var NodeCpn = Node.getComponent('RoomRecordLayerCpn');
            var isCanPlayback = true;
            NodeCpn.init(seatTotalSettleEvent,isCanPlayback);
            ModalLayerMgr.showTop('RoomRecordLayer');          
        }   
    }
});
