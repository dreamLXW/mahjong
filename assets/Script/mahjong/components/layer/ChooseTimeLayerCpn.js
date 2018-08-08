var CommonHelper = require('CommonHelper');
var TimeHelper = require('TimeHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        startDayScrollView : {
            type : cc.ScrollView,
            default : null,
        },
        startHourScrollView : {
            type : cc.ScrollView,
            default : null,
        },
        startMinuteScrollView : {
            type : cc.ScrollView,
            default : null,
        },
        endDayScrollView : {
            type : cc.ScrollView,
            default : null,
        },
        endHourScrollView : {
            type : cc.ScrollView,
            default : null,
        },
        endMinuteScrollView : {
            type : cc.ScrollView,
            default : null,
        },
        scrollViewArr : {
            type : cc.ScrollView,
            default : [],
        },
        curSrollNum : 0,
    },

    // use this for initialization
    onLoad: function () {

    },

    init : function(start,end){
        this.selectStartTime = start;
        this.selectEndTime = end;
        console.log("init : startTime" +  this.selectStartTime);
        console.log("init : endTime" +  this.selectEndTime);
    },

    addScrollListener : function(){
        for(var i = 0 ; i < this.scrollViewArr.length; ++i){
            this.scrollViewArr[i].node.on('scroll-began',this.onSrollBegan,this);
            this.scrollViewArr[i].node.on('scroll-ended',this.onSrollEnd,this);
            this.scrollViewArr[i].node.on('touch-up',this.onSrollViewTouchUp,this);
        }
    },

    removeScrollListener : function(){
        for(var i = 0 ; i < this.scrollViewArr.length; ++i){
            this.scrollViewArr[i].node.off('scroll-began',this.onSrollBegan,this);
            this.scrollViewArr[i].node.off('scroll-ended',this.onSrollEnd,this);
        }   
    },

    onSrollViewTouchUp : function(){
        if(this.curSrollNum <= 0){
            this.curSrollNum = 0;
            this.recordSelectTime();
            this.freshView();
            console.log("没有触摸的手指并且没有在滚动");
        }
    },

    onSrollBegan : function(){
        this.curSrollNum ++ ;
    },

    onSrollEnd : function(){
        this.curSrollNum -- ;
        if(this.curSrollNum <= 0){
            this.curSrollNum = 0;
            this.recordSelectTime();
            this.freshView();
            console.log("所有的都停止了滚动");
        }
    },

    onEnable : function(){
        this.curSrollNum = 0;
        this.addScrollListener();
        this.freshView();
    },

    onDisable : function(){
        this.curSrollNum = 0;
        this.removeScrollListener();
    },

    starSearch : function(){
        console.log("选择的开始的时间为="+TimeHelper.getFormatTime(this.selectStartTime,"%Y-%M-%D %h:%m"));
        console.log("选择的结束的时间为="+TimeHelper.getFormatTime(this.selectEndTime,"%Y-%M-%D %h:%m"));
        var curTime = new Date().getTime();
        if(this.selectEndTime > curTime || this.selectStartTime > curTime || this.selectEndTime < this.selectStartTime ){
            CommonHelper.showTips("错误的查询时间范围");
            return;
        }else{
            var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
            var clubTerminalNode = ModalLayerMgr.getTop('ClubTerminal');
            var clubTerminalNodeCpn = clubTerminalNode.getComponent('ClubTerminalCpn');
            clubTerminalNodeCpn.requestClubManagerDiamondRecord(this.selectStartTime,this.selectEndTime,clubTerminalNodeCpn.freshView.bind(clubTerminalNodeCpn))
            this.closeMyself();
        }
    },

    closeMyself : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);
    },

    onClickBtnSearch : function(){
        this.recordSelectTime();
        this.freshView();
        if(this.isSelectCurTime()){
            this.selectEndTime = new Date().getTime();
        }
        this.starSearch();
    },
//ui为--、23、00、01.....     --、59、00、01
    recordSelectTime : function(){
        var scrollIndexArr = [0,0,0,0,0,0];
        var oneIndexPic = 80;
        for(var i = 0 ; i < this.scrollViewArr.length; ++i){
            var scrollView = this.scrollViewArr[i];
            var contentPos = Math.abs(scrollView.getContentPosition().y);
            var index = parseInt(Math.round(contentPos / oneIndexPic));
            scrollIndexArr[i] = index;
        }
        var curDate = new Date();
        var startDate = new Date();
        var endDate = new Date();
        var startDeltaDay = scrollIndexArr[0] - 2;
        var startHour = scrollIndexArr[1];
        var startMinute = scrollIndexArr[2];
        var endDeltaDay = scrollIndexArr[3] - 2;
        var endHour = scrollIndexArr[4];
        var endMinute = scrollIndexArr[5];  

        startDate.setDate(startDate.getDate() + startDeltaDay);
        startDate.setHours(startHour);
        startDate.setMinutes(startMinute);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);

        endDate.setDate(endDate.getDate() + endDeltaDay);
        endDate.setHours(endHour);
        endDate.setMinutes(endMinute);
        endDate.setSeconds(0);
        endDate.setMilliseconds(0);

        console.log("recordSelectStartTime="+TimeHelper.getFormatTime(startDate.getTime(),"%Y-%M-%D %h:%m"));
        console.log("recordSelectEndTime="+TimeHelper.getFormatTime(endDate.getTime(),"%Y-%M-%D %h:%m"));
        this.selectStartTime = startDate.getTime();
        this.selectEndTime = endDate.getTime();
    },

    freshView : function(){
        console.log("freshView start = " + this.selectStartTime);

        var startDate = new Date(this.selectStartTime);
        var endDate = new Date(this.selectEndTime);
        var curDate = new Date();
        var endDeltaDay = TimeHelper.getDeltaDayBetween(this.selectEndTime,curDate.getTime());
        var startDeltaDay = TimeHelper.getDeltaDayBetween(this.selectStartTime,curDate.getTime());
        if(Math.abs(endDeltaDay)>2 || Math.abs(startDeltaDay)>2){
            console.log("计算相差天数出错了");
            return;
        }
        //差值为0就是今天或当前，差值为-1就是昨天
        var startHour = startDate.getHours();
        var startMin = startDate.getMinutes();
        var endHour = endDate.getHours();
        var endMin = endDate.getMinutes();
        //加1是因为ui前面还有个 "--"
        var scrollIndexArr = [startDeltaDay + 3,(startHour+1),(startMin+1),endDeltaDay + 3,(endHour+1),(endMin+1)];
        var oneIndexPic = 80;
        for(var i = 0 ; i < this.scrollViewArr.length; ++i){
            var scrollView = this.scrollViewArr[i];
            var contentPos = (scrollIndexArr[i] - 1) * oneIndexPic ;
            console.log("contentPos:" + contentPos);
            scrollView.setContentPosition(cc.p(0,contentPos));
        }
    },

    isSelectCurTime : function(){
        var oneIndexPic = 80;
        var contentPos = Math.abs(this.endDayScrollView.getContentPosition().y);
        var index = parseInt(Math.round(contentPos / oneIndexPic));
        return (index == 3);
    },
});
