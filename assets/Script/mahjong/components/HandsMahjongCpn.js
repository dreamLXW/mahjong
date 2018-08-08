//存放手牌容器的组件
var EventName = require('EventName');
var CommonHelper = require('CommonHelper');
var BaseHandsMahjongCpn = require('BaseHandsMahjongCpn');
cc.Class({
    extends: BaseHandsMahjongCpn,

    properties: {
        _watingChuPaiNode : null,
        _isActioning : false,//是否正在执行动画，如果是则不可点击
    },

    // use this for initialization
    onLoad: function () {
        this._super();
    },

    initMyselfMahjongs : function(){
        if(this.side == 'myself'){
            var MyMjCardCpn = this.mj_catch.children[0].getComponent('MyMjCardCpn');
            MyMjCardCpn.initHandsMahjongCpn(this);
            for(var i = 0 ; i < this.mj_s.childrenCount; ++i){//ui节点命名下标从1开始
                var index = i + 1;
                 var MyMjCardCpn = this.mj_s.getChildByName('mj_bg'+index).getChildByName('mymahjong').getComponent('MyMjCardCpn');
                 MyMjCardCpn.initHandsMahjongCpn(this);
            }
        }
    },

    initSide:function(side){
        this._super(side);
        this.initMyselfMahjongs();
    },

    hideAllCards : function(){
        console.log(cc.js.getClassName(this) + '  ' + 'hideAllCards' );
        //mj_catch只有一个孩子
        if(this.side == 'myself'){
            this.mj_catch.children[0].getComponent('CommonMjCardCpn').setVisible(false); 
        }else{
            this.mj_catch.children[0].active = false;
        }
        
        for(var i = 0 ; i < this.mj_s.childrenCount; ++i){//ui节点命名下标从1开始
            var index = i + 1;
            if(this.side == 'myself'){
                this.mj_s.getChildByName('mj_bg'+index).getChildByName('mymahjong').getComponent('CommonMjCardCpn').setVisible(false); 
            }else{
                this.mj_s.getChildByName('mj_bg'+index).active = false;       
            }
        }
    },

    getVisibleNodeByMahjongData : function(mahjongData){
        console.log('getVisibleNodeByMahjongData:' + mahjongData);
        if(this.side == 'myself'){
            for(var i = 0 ; i < this.mj_s.childrenCount; ++i){
                var index = i + 1;
                var myMahjongNode = this.mj_s.getChildByName('mj_bg'+index).getChildByName('mymahjong');
                var commonMahjongCpn = myMahjongNode.getComponent('CommonMjCardCpn');
                console.log('commonMahjongCpn.isVisible():'+commonMahjongCpn.isVisible());
                console.log('commonMahjongCpn.getMahjongData():'+commonMahjongCpn.getMahjongData());
                if(commonMahjongCpn.isVisible() && (commonMahjongCpn.getMahjongData() == mahjongData)){
                    return myMahjongNode;
                }else{
                    continue;
                }                 
            }
        }
        var myMahjongNode = this.mj_catch.children[0];
        var commonMahjongCpn = myMahjongNode.getComponent('CommonMjCardCpn'); 
        if(commonMahjongCpn.isVisible() && (commonMahjongCpn.getMahjongData() == mahjongData)){
            return myMahjongNode;
        }
    },

    setGuiPaiComplete : function(guiData){
        if(this.side == 'myself' ){
            this._super(guiData);
        }
    },

    Lock : function(){
        if(this.side == 'myself'){
            for(var i = 0 ; i < this.mj_s.childrenCount; ++i){
                var index = i + 1;
                var myMahjongCpn = this.mj_s.getChildByName('mj_bg'+index).getChildByName('mymahjong').getComponent('MyMjCardCpn');
                myMahjongCpn.LockChuPai();
            }
            var myMahjongCpn = this.mj_catch.children[0].getComponent('MyMjCardCpn');
            myMahjongCpn.LockChuPai();
        }
    },

    unLock : function(){
        if(this.side == 'myself'){
            for(var i = 0 ; i < this.mj_s.childrenCount; ++i){
                var index = i + 1;
                var myMahjongCpn = this.mj_s.getChildByName('mj_bg'+index).getChildByName('mymahjong').getComponent('MyMjCardCpn');
                myMahjongCpn.unLockChuPai();
            }
            var myMahjongCpn = this.mj_catch.children[0].getComponent('MyMjCardCpn');
            myMahjongCpn.unLockChuPai();
        }
    },

    clearStateExcept : function(node){
        if(this.side == 'myself'){
            for(var i = 0 ; i < this.mj_s.childrenCount; ++i){
                var index = i + 1;
                var myMahjongNode = this.mj_s.getChildByName('mj_bg'+index).getChildByName('mymahjong');
                if(myMahjongNode != node){
                    var myMahjongCpn = myMahjongNode.getComponent('MyMjCardCpn');
                    myMahjongCpn.clearState();
                }
 
            }
            var catchMahjongNode = this.mj_catch.children[0];
            if(catchMahjongNode != node){
                var myMahjongCpn = catchMahjongNode.getComponent('MyMjCardCpn');
                myMahjongCpn.clearState();
            }
        }
    },

    setWaitChuPaiNode : function(node){
        this._watingChuPaiNode = node;
    },

    onChuPaiAction: function(data,cardList,handsCardNum){
        if(this.side == 'myself'){
            var waitChu = this._watingChuPaiNode;
            
            if(!waitChu ){//没有在等待出牌的牌
                console.log('error:没有在等待出牌的牌');
                return;
            }else{
                waitChu.active = false;
                
            }
            var waitChuCpn = waitChu.getComponent('MyMjCardCpn');
            waitChuCpn.BackToOrigin(false);
            this.onChuPaiSortAction(data,cardList,handsCardNum);
            this._watingChuPaiNode = null;
        }else{
            this.showHandsByNumber(handsCardNum);
        }
    },

    onChuPaiSortAction : function(data,cardList,handsCardNum){
        var originHandsCardNum = handsCardNum + 1;
        if(this.side == 'myself'){
            var waitChu = this._watingChuPaiNode;
            var waitChuCpn = waitChu.getComponent('MyMjCardCpn');
            var catchNode = this.mj_catch.children[0];
            var catchData = catchNode.getComponent('MyMjCardCpn').getMahjongData();
            if(waitChu && waitChu.parent != this.mj_catch  ){
                if(this.isHavaLastCard(originHandsCardNum)){
                    this.showHandsByData(cardList);
                    var actionNode = this.getVisibleNodeByMahjongData(catchData);
                    var actionNodeCpn = actionNode.getComponent('MyMjCardCpn');
                    var fromPos = actionNode.parent.convertToNodeSpaceAR(catchNode.parent.convertToWorldSpace(cc.p(0,0)));
                    actionNodeCpn.chuPaiBackToOringin(fromPos);
                }else{
                    this.showHandsByData(cardList);
                }
                this.setGuiPaiComplete(cc.mj.gameData.seatData.guiPai);
            }

        }
    },

    onMoPaiAction : function(cardList,handsCardNum){
        if(this.side == 'myself'){
            this.showHandsByData(cardList);
            //this.mj_catch.children[0].getComponent('MyMjCardCpn').chuPai();
        }else{
            this.showHandsByNumber(handsCardNum);
        }     
        this.setGuiPaiComplete(cc.mj.gameData.seatData.guiPai);
        CommonHelper.emitActionCompelete();
    },

    getMyMjCardCpnWithTouch : function(touch){
        var worldPos = touch.getLocation();
        for(var i = 0 ; i < this.mj_s.childrenCount; ++i){
            var index = i + 1;
            var myMahjongNode = this.mj_s.getChildByName('mj_bg'+index).getChildByName('mymahjong');
            var myMahjongCpn = myMahjongNode.getComponent('MyMjCardCpn');
            var commonMahjongCpn = myMahjongNode.getComponent('CommonMjCardCpn');
            if(commonMahjongCpn.isVisible() && myMahjongCpn != this.controlMjCardCpn && myMahjongCpn.isContansPos(worldPos)){
                return myMahjongCpn;
            }
        }
        var catchMahjongNode = this.mj_catch.children[0];
        var myMahjongCpn = catchMahjongNode.getComponent('MyMjCardCpn');
        var commonMahjongCpn = catchMahjongNode.getComponent('CommonMjCardCpn');
        if(commonMahjongCpn.isVisible() && myMahjongCpn != this.controlMjCardCpn && myMahjongCpn.isContansPos(worldPos)){
            return myMahjongCpn;
        }       
    },

    onTouchStart : function(touch){
        if(this.side != 'myself' || this._isActioning){
            return;
        }
        var mjMjCardCpn = this.getMyMjCardCpnWithTouch(touch);
        if(mjMjCardCpn){
            this.controlMjCardCpn = mjMjCardCpn;
            mjMjCardCpn.onTouchStart(touch);
        }else{
            this.clearStateExcept(null);
        }
    },

    onTouchMove : function(touch){
        if(this.side != 'myself' || this._isActioning){
            return;
        }
        var touchMjCardCpn = this.getMyMjCardCpnWithTouch(touch);
        if(touchMjCardCpn){
            this.controlMjCardCpn = touchMjCardCpn;
            this.controlMjCardCpn.onTouchStart(touch);
        }else{
            if(this.controlMjCardCpn){
                this.controlMjCardCpn.onTouchMove(touch);
            }else{
                this.clearStateExcept(null);
            }
        }
    },

    onTouchEnd : function(touch){
        if(this.side != 'myself' || this._isActioning){

        }else{
            if(this.controlMjCardCpn){
                this.controlMjCardCpn.onTouchEnd(touch);
            }
        }

        this.controlMjCardCpn = null;
    },

    onTouchCancel : function(touch){
        if(this.side == 'myself' && this._isActioning == false){
            if(this.controlMjCardCpn){
                this.controlMjCardCpn.onTouchCancel(touch);
            }
            
        }
        this.controlMjCardCpn = null;
    },

    setHandsMahjongOnTop : function(myMjCardCpn){
        if(this.side == 'myself'){
            for(var i = 0 ; i < this.mj_s.childrenCount; ++i){
                var index = i + 1;
                var myMahjongNode = this.mj_s.getChildByName('mj_bg'+index).getChildByName('mymahjong');
                var myMahjongCpn = myMahjongNode.getComponent('MyMjCardCpn');
                
                myMahjongCpn.setZOrder((myMahjongCpn == myMjCardCpn ? 15 : 0));
            }
            var catchMahjongNode = this.mj_catch.children[0];
            var myMahjongCpn = catchMahjongNode.getComponent('MyMjCardCpn');
            myMahjongCpn.setZOrder((myMahjongCpn == myMjCardCpn ? 15 : 0));
        }
    }
});
