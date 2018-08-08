cc.Class({
    extends: cc.Component,

    properties: {
        roomItemPrefab : {
            type : cc.Prefab,
            default : null,
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    updateItem : function(index,itemId,data){
        this.itemID = itemId;
        if(!data){
            data = [];
        }
        this.node.active = data.length > 0;
        for( i = 0 ; i < data.length; ++i){
            var roomView = this.node.children[i];
            if(!roomView){
                roomView = cc.instantiate(this.roomItemPrefab);
                this.node.addChild(roomView);
            }
            roomView.active = true;
            var clubRoomViewCpn = roomView.getComponent("ClubRoomViewCpn");
            clubRoomViewCpn.init(data[i]);
        }
        for( ; i < this.node.childrenCount; ++i){
            this.node.children[i].active = false;
        }
    },
});
