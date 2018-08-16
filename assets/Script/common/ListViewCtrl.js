cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: { // item template to instantiate other items
            default: null,
            type: cc.Prefab
        },
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        spawnCount: 0, // how many items we actually spawn
        totalCount: 0, // how many items we need for the whole list
        spacing: 0, // space between each item
        bufferZone: 0, // when item is away from bufferZone, we relocate it
        itemCpnName : "",
        itemHeight : 0,
    },

    // use this for initialization
    onLoad: function () {
        this.originScrollViewHeight = this.scrollView.node.height;
        console.log("初始高度:" + this.originScrollViewHeight);
    	this.content = this.scrollView.content;
        this.items = []; // array to store spawned items
    	this.initialize();
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0; // use this variable to detect if we are scrolling up or down
        this.scrollView.node.on("bounce-top",function(){
            console.log("bounce-top");
        });
        this.scrollView.node.on("bounce-bottom",function(){
            console.log("bounce-bottom");
        });
    },

    initialize: function () {
    	for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
            let item = cc.instantiate(this.itemTemplate);
            if(this.itemHeight == 0){
                this.itemHeight = item.height;
            }

            this.items.push(item);
        }
        this.resetContentChilren();
    },

    resetContentChilren : function(){
        this.content.removeAllChildren();
        for(var i = 0 ;i < this.items.length; ++i){
            var item = this.items[i];
            item.setPosition(0, -this.itemHeight * ((1 - item.anchorY) + i) - this.spacing * (i + 1));
    		item.getComponent(this.itemCpnName).updateItem(i, i);
            this.content.addChild(item);
        }
        this.content.height = this.totalCount * (this.itemHeight + this.spacing) + this.spacing;
        this.changeScrollViewHeight();
    },

    getPositionInView: function (item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    update: function(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.scrollView.content.y < this.lastContentPosY; // scrolling direction
        let offset = (this.itemHeight + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // if away from buffer zone and not reaching top of content
                if (viewPos.y < -buffer && items[i].y + offset < 0) {
                    items[i].setPositionY(items[i].y + offset );
                    let item = items[i].getComponent(this.itemCpnName);
                    let itemId = item.itemID - items.length; // update item id
                    item.updateItem(i, itemId,this.data[itemId]);
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    items[i].setPositionY(items[i].y - offset );
                    let item = items[i].getComponent(this.itemCpnName);
                    let itemId = item.itemID + items.length;
                    item.updateItem(i, itemId,this.data[itemId]);
                }
            }
        }
        // update lastContentPosY
        this.lastContentPosY = this.scrollView.content.y;
    },

    addItem: function() {
        this.content.height = (this.totalCount + 1) * (this.itemHeight + this.spacing) + this.spacing; // get total content height
        this.totalCount = this.totalCount + 1;
        this.changeScrollViewHeight();
    },

    removeItem: function() {
        if (this.totalCount - 1 < 30) {
            cc.error("can't remove item less than 30!");
            return;
        }

        this.content.height = (this.totalCount - 1) * (this.itemHeight + this.spacing) + this.spacing; // get total content height
        this.totalCount = this.totalCount - 1;
        this.changeScrollViewHeight();
    },

    scrollToFixedPosition: function () {
        this.scrollView.scrollToOffset(cc.p(0, 0), 2);
    },

    reset : function(){
        this.resetContentChilren();
        this.lastContentPosY = 0;
        this.scrollView.content.y = 0;
        this.scrollToFixedPosition();
    },

    setData : function(data){
        this.data = data;
        let items = this.items;
        for (let i = 0; i < items.length; ++i) {
            let item = items[i].getComponent(this.itemCpnName);
            let itemId = item.itemID
            item.updateItem(i, itemId,this.data[itemId]);
        }
        this.content.height = this.data.length * (this.itemHeight + this.spacing) + this.spacing;
        this.changeScrollViewHeight();
    },

    changeScrollViewHeight : function(){
        var scrollViewHeight = this.content.height >= this.originScrollViewHeight ? this.originScrollViewHeight : this.content.height - 1;
        this.scrollView.node.height = scrollViewHeight;
        console.log("现在scrollView高度="+scrollViewHeight);
    }
});
