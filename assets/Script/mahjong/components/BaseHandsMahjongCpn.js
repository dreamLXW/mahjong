cc.Class({
    extends: cc.Component,

    properties: {
        side : 'null',
        mj_s : {
            default : null,
            type : cc.Node,
        },
        mj_catch : {
            default : null,
            type : cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.mj_s = this.node.getChildByName('mjs');
        this.mj_catch = this.node.getChildByName('mj_catch');
    },

    initSide:function(side){
        this.side = side;
    },

    hideAllCards : function(){
    },

    isHavaLastCard : function(number){
        return (number % 3 == 2);
    },

        //isHavaLast是否有最后一张牌
    //mahjongDataArr前面排好序，最后一张牌可能是刚摸的牌
    showHandsByData : function(mahjongDataArr){//直接显示
        var copyMahjongDataArr = [].concat(mahjongDataArr);
        var isHaveLast = this.isHavaLastCard(copyMahjongDataArr.length);
        var mjsNum = copyMahjongDataArr.length;
        var lastNum = null;
        if(isHaveLast){//如果有最后一张牌
            mjsNum -= 1;
            lastNum = copyMahjongDataArr[copyMahjongDataArr.length-1];
            copyMahjongDataArr.pop();
        }
        //倒序
        copyMahjongDataArr.reverse();
        //显示牌
        for(var i = 0 ; i < this.mj_s.childrenCount; ++i){
            var index = i + 1;
            var myMahjongNode = this.mj_s.getChildByName('mj_bg'+index).children[0];
            var commonMahjongCpn = myMahjongNode.getComponent('CommonMjCardCpn');
            var myMjCardCpn = myMahjongNode.getComponent('MyMjCardCpn');
            if(i < mjsNum){
               commonMahjongCpn.setVisible(true);
               commonMahjongCpn.setMahjongData(copyMahjongDataArr[i]);
               if(myMjCardCpn){
                    myMjCardCpn.setMahjongData(copyMahjongDataArr[i]);
               }    
            }else{
               commonMahjongCpn.setVisible(false);
            }                      
        }
        this.mj_catch.children[0].active = isHaveLast;
        if(isHaveLast){
            var commonMahjongCpn = this.mj_catch.children[0].getComponent('CommonMjCardCpn');
            var myMjCardCpn = this.mj_catch.children[0].getComponent('MyMjCardCpn');
            commonMahjongCpn.setMahjongData(lastNum);
            if(myMjCardCpn){
                myMjCardCpn.setMahjongData(lastNum);
            }     
        }
    },

    showHandsByNumber:function(totalNum){//是否有最后一张牌
        var mjsNum = totalNum;
        var isHaveLast = this.isHavaLastCard(totalNum);
        if(isHaveLast){
            mjsNum -= 1;
        }
        this.mj_catch.children[0].active = isHaveLast;
        for(var i = 0 ; i < this.mj_s.childrenCount; ++i){
            var index = i + 1;
            if(i < mjsNum){
                this.mj_s.getChildByName('mj_bg'+index).active = true;
            }else{
                this.mj_s.getChildByName('mj_bg'+index).active = false;
            }           
        }
    },

    setGuiPaiComplete : function(guiData){
        for(var i = 0 ; i < this.mj_s.childrenCount; ++i){
            var index = i + 1;
            var commonMahjongCpn = this.mj_s.getChildByName('mj_bg'+index).children[0].getComponent('CommonMjCardCpn');
            commonMahjongCpn.setGuiData(guiData);
        }
        var commonMahjongCpn = this.mj_catch.children[0].getComponent('CommonMjCardCpn');
        commonMahjongCpn.setGuiData(guiData);
    },

    onChuPaiAction: function(data,cardList,handsCardNum){

    },

    onMoPaiAction : function(cardList,handsCardNum){
    }
});
