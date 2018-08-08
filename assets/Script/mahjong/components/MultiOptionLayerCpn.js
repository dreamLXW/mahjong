var CommonHelper = require('CommonHelper');
var PairCfg = require('PairCfg');
cc.Class({
    extends: cc.Component,

    properties: {
        chooseOptionHandPrefab : {
            type : cc.Prefab,
            default : null,
        }
    },

    setChooseOptionHandPrefab : function(prefab){
        this.chooseOptionHandPrefab = prefab
    },

    // use this for initialization
    onLoad: function () {
        // var chooseHandContainer = this.node.getChildByName('chooseHandContainer');
        // chooseHandContainer.active = false;
        this.clear();
    },

    setOptionNodeNameConfig : function(optionNameConfig){
        this.multiOptionNodeMap = {};
        for(var key in optionNameConfig){
            var name = optionNameConfig[key];
            var optionNode = this.node.getChildByName(name);
            if(optionNode){
                this.multiOptionNodeMap[key] = optionNode;
            }
        }
    },

    onMultiSeatOptionChange : function(multiSeatOptionEvent){
        var posList = [];
        for(var sideName in this.multiOptionNodeMap){
            var optionNode = this.multiOptionNodeMap[sideName];
            var OptionCpn = optionNode.getComponent('OptionCpn');
            var commonMjCardCpn = optionNode.getChildByName('mj_bg').getComponent('CommonMjCardCpn');
            if(!commonMjCardCpn){
                commonMjCardCpn = optionNode.getChildByName('mj_bg').addComponent('CommonMjCardCpn');
            }
            var playerData = cc.mj.gameData.playerDataMgr.getPlayerDataOfSideName(cc.mj.ownUserData.uid,sideName);
            if(playerData){
                var uid = playerData.uid;
                var seatOptionEvent = multiSeatOptionEvent.getOptionEventByUid(uid);
                if(seatOptionEvent){
                    OptionCpn.setVisible(true);
                    OptionCpn.onSeatOptionChange(seatOptionEvent);
    
                    var choiceOption = seatOptionEvent.getChoiceOption();
                    var card = choiceOption.getCard();
                    console.log('onMultiSeatOptionChange'+card);
                    if(card <= 0){
                        commonMjCardCpn.setVisible(false);
                    }else{
                        commonMjCardCpn.setVisible(true);
                        commonMjCardCpn.setMahjongData(card);
                    }
                    
                    var choiceOptionBtn = OptionCpn.getOptionBtnNode(choiceOption.type);
                    console.log('选择了:'+PairCfg.name(choiceOption.type));
                    if(choiceOptionBtn){
                        var choiceOptionBtnWorldPos = choiceOptionBtn.node.convertToWorldSpaceAR(cc.p(0,0));
                        posList.push(choiceOptionBtnWorldPos);
                    }
                }else{
                    OptionCpn.setVisible(false);
                }
            }else{
                OptionCpn.setVisible(false);
            }

        }
        this.playChooseOptionAnimation(posList);
    },

    playChooseOptionAnimation : function(posList){
        var chooseHandContainer = this.node.getChildByName('chooseHandContainer');
        for(var i = 0 ; i < posList.length; ++i){
            var chooseOptionHand = cc.instantiate(this.chooseOptionHandPrefab);
            var animation = chooseOptionHand.getComponent(cc.Animation);
            var nodePos = chooseHandContainer.convertToNodeSpaceAR(posList[i]);
            chooseHandContainer.addChild(chooseOptionHand);
            chooseOptionHand.position = nodePos;

            if(i == 0 ){
                animation.on('finished',this.onPlayChooseOptionAniComplete,this);
            }
            animation.play();
        }
    },

    onPlayChooseOptionAniComplete : function(){
        console.log('动作完毕');
        CommonHelper.emitActionCompelete();
        this.setVisible(false);
    },

    setVisible : function(isVisible){
        this.node.active = isVisible;
        this.clear();
    },

    clear : function(){
        var chooseHandContainer = this.node.getChildByName('chooseHandContainer');
        for(var i = 0 ; i < chooseHandContainer.childrenCount; ++i){
            var chooseOptionHand = chooseHandContainer.children[i];
            var animation = chooseOptionHand.getComponent(cc.Animation);
            if(animation){
                animation.stop();
            }
        }
        chooseHandContainer.removeAllChildren();
    },
});
