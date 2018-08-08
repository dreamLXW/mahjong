cc.Class({
    extends: cc.Component,

    properties: {
        autoDisapearMsgPrefab : {
            type : cc.Prefab,
            default : null,
        },
        delayTime : 1,
        disapearTime : 2,
        maxInstance : 10,
        instanceArr : {
            default : [],
            type : cc.Node,
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    showDisapearMessage : function(text,delayTime,disapearTime){
        var autoDisMes = this.getDisapearMessage();
        if(!autoDisMes.parent){
            this.node.addChild(autoDisMes);
        }
        var autoDisMesCpn = autoDisMes.getComponent('AutoDisapearMessage');
        autoDisMesCpn.init(delayTime,disapearTime);
        autoDisMesCpn.run(text);
    },

    getDisapearMessage : function(){
        var instance = null;
        if( this.instanceArr.length > 0 ){
            instance = this.instanceArr[0];
        }else{
            instance = cc.instantiate(this.autoDisapearMsgPrefab);
            this.instanceArr.push(instance); 
        }
        return instance;
    },
//废弃，需求有变，只需要重用一个就行了
    // getDisapearMessage : function(){
    //     for(var i = 0 ; i < this.instanceArr.length ; ++i){
    //         if(this.instanceArr[i].isUse == false){
    //             return this.instanceArr[i];
    //         }
    //     }
    // },

    // createSomeInstance : function(){
    //     for(var i = 0 ; i < this.maxInstance; ++i){
    //         var instance = cc.instantiate(this.autoDisapearMsgPrefab);
    //         instance.isUse = false;
    //         this.instanceArr.push(instance);
    //     }
    // },
});
