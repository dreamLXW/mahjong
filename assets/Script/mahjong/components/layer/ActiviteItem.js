cc.Class({
    extends: cc.Component,

    properties: {
        normalLabel : {
            default : null,
            type : cc.Label,
        },
        checkMarkLabel : {
            default : null,
            type : cc.Label,
        },
        data : null,
        parent : null,
    },

    onLoad : function () {

    },

    initData : function (data, parent) {
        this.data = data;
        this.parent = parent;
        this.initTitle(data.title);
    },

    initTitle : function (title) {
        this.normalLabel.string = title;
        this.checkMarkLabel.string = title;
    },

    onClickMark : function () {
        this.parent.loadHeadSp(this.parent, this.data.content);
    },
});
