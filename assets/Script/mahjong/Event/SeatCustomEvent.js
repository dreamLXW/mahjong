cc.Class({
    extends: cc.Component,

    properties: {
        EventName : 'SeatCustomEvent',
        type : '',
        data : null,      
    },

    init : function(type,data){
        this.type = type;
        this.data = data;
    },
});
