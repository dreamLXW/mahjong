var CommonHelper = require('CommonHelper');
var TimeHelper = require('TimeHelper');

cc.Class({
    extends: cc.Component,

    properties: {
        levelArr : {
            default : [],
            type : cc.Node
        },
        userNameTxt : {
            default : null,
            type : cc.Label
        },
        searchTabTxt : {
            default : null,
            type : cc.Label
        },
        curMemberData : null,
        myData : null,
        adminCount : 0,
    },

    onLoad () {

    },

    setData : function (memberData, myData, adminCount, sortType) {
        this.curMemberData = memberData;
        this.myData = myData;
        this.adminCount = adminCount;
        var nickName = memberData.nickName;
        this.userNameTxt.string = nickName;
        if (this.userNameTxt.string.length > 6) { 
            nickName = nickName.slice(0,6);
            nickName += "..";
            this.userNameTxt.string = nickName;
        }
        this.levelArr[(memberData.type - 1)].active = true;
        this.loadHeadSp(this, memberData.upfile);

        var dayStrArr = ["今天", "昨天", "前天", "两天前", "无记录"];
        if (sortType == 1) {
            var str = dayStrArr[4];
            if (memberData.lastPlayTime) {
                str = dayStrArr[3];
                var betweenDay = TimeHelper.getDeltaDayBetween(new Date(), memberData.lastPlayTime * 1000);
                if (betweenDay < 3) {
                    str = dayStrArr[betweenDay];
                }
            }
            this.setSearchTabNodeActive(str);
        } else if (sortType == 2) {
            var str = "7日牌局:" + memberData.sevenDayCount;
            this.setSearchTabNodeActive(str);
        }
    },

    setSearchTabNodeActive : function (str) {
        this.searchTabTxt.node.active = true;
        this.searchTabTxt.string = str;
    },

    loadHeadSp : function(target,url){
        this.node.getComponent('OnlineLoadData').getSpriteByUrl(url);
    },

    onClickCheckDetailMessage : function () {
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var createClubNode = ModalLayerMgr.getTop('MemberDetailLayer');
        var createClubNodeCpn = createClubNode.getComponent('MemberDetailLayerCpn');
        createClubNodeCpn.init(true);
        createClubNodeCpn.setData(this.curMemberData, this.myData, this.adminCount);
        ModalLayerMgr.showTop('MemberDetailLayer');
    },
});
