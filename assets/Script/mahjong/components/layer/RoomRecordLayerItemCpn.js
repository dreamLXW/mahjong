var HuTypeCfg = require('HuTypeCfg');
var tempClient = require('MjRequestSpecificClient');
var CommonHelper = require('CommonHelper');
var ProtoUtil = require("ProtoUtil");
var PlaybackGameData = require('PlaybackGameData');
var TimeHelper = require('TimeHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        indexLabel : {
            default : null,
            type : cc.Label,
        },

        timeLabel : {
            default : null,
            type : cc.Label,
        },

        huScoreLabelArr : {
            type : cc.Node,
            default : [],
        },  
        playbackBtn : {
            type : cc.Node,
            default : null,            
        },

        singleSettleBtn : {
            type : cc.Node,
            default : null,  
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    onClickBtnCheckDetail : function(){
        var round = this._round;
        var isNeedLoading = true;
        var isInHttpTast = false;
        tempClient.requestSettleInfoByRoundIdWithHttp(this.rid,round,this.onRequestSingleSettleInfo.bind(this),isNeedLoading,isInHttpTast);
    },

    onClickBtnPlayback : function(){
        var round = this._round;
        tempClient.requestPlaybackWithHttp(this.rid,round,this.onRequestPlayback.bind(this),true); 
        // var data = {"playback_init":{"seat":{"number":1,"player_card_list":[{"mai_ma_card_list":[{"card":27,"type":2}],"uid":1,"fa_ma_card_list":{},"jiang_ma_card_list":{},"hand_card_list":[3,3,3,2,2,2,7,7,7,7,24,24,24,32]},{"mai_ma_card_list":[{"card":19,"type":2}],"uid":2,"fa_ma_card_list":{},"jiang_ma_card_list":{},"hand_card_list":[1,3,28,28,28,29,29,29,30,30,31,31,32]},{"mai_ma_card_list":[{"card":10,"type":0}],"uid":3,"fa_ma_card_list":{},"jiang_ma_card_list":[{"card":33,"type":0},{"card":1,"type":0},{"card":26,"type":0},{"card":28,"type":0},{"card":17,"type":0},{"card":27,"type":0},{"card":27,"type":0},{"card":5,"type":0}],"hand_card_list":[13,12,11,5,6,32,32,33,33,33,34,34,34]},{"mai_ma_card_list":[{"card":20,"type":0}],"uid":4,"fa_ma_card_list":{},"jiang_ma_card_list":{},"hand_card_list":[10,11,12,13,14,15,16,17,18,21,22,24,27]}],"createtime":1508398318,"card_list":[30,14,12,16,26,31,18,25,19,23,10,11,30,12,25,17,17,15,20,13,16,21,4,10,6,27,20,17,6,5,28,5,19,9,20,14,8,5,8,25,27,19,4,26,31,33,13,15,14,1,26,27,22,34,8,25,23,23,10,2,1,9,8,20,19,23,1,22,29,9,18,22,21,18,16,15,11,4,4,6,9,21,26],"gui_pai":32,"bid":1,"round":1,"next_uid":1,"settle":{"type":1,"hu":{"mai_ma_bill_list":[{"number":1,"uid":3,"score":5,"ma_pai_uid":1,"fromuid":1},{"number":1,"uid":3,"score":5,"ma_pai_uid":2,"fromuid":2}],"hu_bill_list":[{"di_fen":1,"type":6,"score":5,"hu_score":5,"gang_bao_quan_bao":false,"shi_bei_bu_ji_fen":false,"point_list":[{"score":1,"type":1}],"jiang_ma_number":0,"lian_zhuang":false,"uid":3,"fromuid":1,"card":2,"feng_ding":5,"hu_type_double":10,"lian_zhuang_double":1,"xiao_hu":false}]},"gang_bill_list":{},"gen_zhuang_bill_list":{},"score_list":[{"uid":1,"score":-10,"add_score":-10},{"uid":2,"score":-5,"add_score":-5},{"uid":3,"score":15,"add_score":15},{"uid":4,"score":0,"add_score":0}]}},"player_list":[{"nickname":"Ddd","score":0,"busy":false,"ding_no":"1","ip":"192.168.31.225","uid":1,"online":true,"sex":1,"position":1,"longitude":"115.3564328779","latitude":"32.5838470847","icon":"http:\/\/192.168.31.225:8201\/dist\/static\/1.jpg","ready":true},{"nickname":"Ddd","score":0,"busy":false,"ding_no":"2","ip":"192.168.31.225","uid":2,"online":true,"sex":1,"position":2,"longitude":"115.3564328779","latitude":"32.5838470847","icon":"http:\/\/192.168.31.225:8201\/dist\/static\/2.jpg","ready":true},{"nickname":"Ddd","score":0,"busy":false,"ding_no":"3","ip":"192.168.31.225","uid":3,"online":true,"sex":1,"position":3,"longitude":"115.3564328779","latitude":"32.5838470847","icon":"http:\/\/192.168.31.225:8201\/dist\/static\/3.jpg","ready":true},{"nickname":"Ddd","score":0,"busy":false,"ding_no":"4","ip":"192.168.31.225","uid":4,"online":true,"sex":1,"position":4,"longitude":"115.3564328779","latitude":"32.5838470847","icon":"http:\/\/192.168.31.225:8201\/dist\/static\/4.jpg","ready":true}],"room_info":{"roomuid":1,"config":{"wu_gui_jia_bei":false,"gen_zhuang":false,"gang_bao_quan_bao":true,"shi_bei_bu_ji_fen":false,"jiang_ma_number":8,"lian_zhuang":true,"xiao_hu":false,"di_fen":1,"si_gui_hu_pai":false,"ji_hu":false,"men_qing":false,"fa_ma_number":0,"gui_pai":"zhong","mai_ma_number":1,"chi_hu":true,"liu_ju_suan_gang":true,"hupai":"chi_hu","game_number":8,"player_type":"normal","feng_ding":5,"gui_shuang_bei":false,"ma_gen_gang":false},"rid":1000006,"status":"start","room_num":"078175","room_creator":{"nickname":"Ddd","score":0,"busy":false,"ding_no":"1","ip":"192.168.31.225","uid":1,"online":true,"sex":1,"position":1,"longitude":"115.3564328779","latitude":"32.5838470847","icon":"http:\/\/192.168.31.225:8201\/dist\/static\/1.jpg","ready":true},"club_id":0}},"playback_option_action_list":[{"vote_option_list":[{"uid":1,"action":{"uid":1,"type":8,"card_list":[2]},"option_list":[{"uid":1,"type":8},{"type":5,"card_list":[7],"uid":1}]}]},{"action":{"number":2,"uid":1,"type":8,"card_list":[2]}},{"vote_option_list":[{"uid":2,"action":{"uid":2,"type":6},"option_list":[{"type":11,"card_list":[2],"uid":2}]},{"uid":3,"action":{"uid":3,"type":11,"card_list":[2]},"option_list":[{"type":11,"card_list":[2],"uid":3}]}]},{"action":{"number":3,"type":11,"uid_list":[3],"hu_uid_list":[3],"card_list":[2],"fromuid":1}}],"code":200};
        // this.onRequestPlayback(ProtoUtil.decode(data));      
    },

    onRequestPlayback : function(decodeMsg){
        cc.mj.gameData = new PlaybackGameData();
        var SeatCustomEvent = require('SeatCustomEvent');
        var seatCustomEvent = new SeatCustomEvent();
        seatCustomEvent.init('GameDataInitEvent',decodeMsg);
        cc.mj.gameData.pushSeatEvent(seatCustomEvent);

        this.showPlaybackLayer();
    },

    showPlaybackLayer : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        if(ModalLayerMgr){
            ModalLayerMgr.showTop('PlayBackLayer');       
        } 
    },

    onRequestSingleSettleInfo : function(decodeMsg){
        var SeatSettleEvent = require('SeatSettleEvent');        
        var seatSettleEvent = new SeatSettleEvent();
        seatSettleEvent.init(decodeMsg);
        var seatCustomEvent = seatSettleEvent.getSingleSettleCustomEvent();

        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var Node = ModalLayerMgr.getTop('SingleResultLayer');
        var NodeCpn = Node.getComponent('SingleResultLayerCpn');
        NodeCpn.init(seatCustomEvent.data);
        ModalLayerMgr.showTop('SingleResultLayer');  
    },

    init : function(round,createTime,playerScoreList){
        this._round = round;
        this.indexLabel.string = round;
        this.timeLabel.string = TimeHelper.getFormatTime(createTime*1000,"%M-%D  %h:%m");
        this.initHuScoreLabelArr(playerScoreList);
    },

    initRid : function(rid){
        this.rid = rid;
    },

    initHuScoreLabelArr : function(playerScoreList){
        for(var i = 0 ; i < this.huScoreLabelArr.length ; ++i){
            var item = this.huScoreLabelArr[i];
            if(i >= playerScoreList.length){
                item.active = false;
            }else{
                item.active = true;
                var type = playerScoreList[i].type;
                var huType = playerScoreList[i].huType;
                item.getChildByName('hutypelabel').getComponent(cc.Label).string = this.getHuTypeStr(type,huType);
                item.getChildByName('scorelabel').getComponent(cc.Label).string = playerScoreList[i].totalScore;
            }
        }
    },

    getHuTypeStr : function(type,huType){////type:1=胡牌,2=黄庄
        huType = (type == 2)? HuTypeCfg.HUANGZHUANG : huType;
        if(huType == 0 || huType == HuTypeCfg.HUANGZHUANG){
            return '未胡牌';
        }else{
            var iHuType = Number(huType);
            var absHuType = Math.abs(iHuType);
            var realType = HuTypeCfg.huTypeMap[absHuType];
            if(absHuType == iHuType){
                return HuTypeCfg.huTypeIntroArr[realType].name;
            }else{
                return HuTypeCfg.huTypeIntroArr[realType].name1;
            }
        }
    },

    setPlaybackBtnVisible : function(isVisible){
        this.playbackBtn.active = isVisible;
    },

    setSingleSettleBtnVisible : function(isVisible){
        this.singleSettleBtn.active = isVisible;
    },
});
