var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket; 

var proto = {};
proto.dispatch = function (data, sz) {
    var TYPE = {
        "q" : "REQUEST",
        "s" : "RESPONSE",
    }
    var msg = data;
    if (typeof(msg) == "string") {
        msg = JSON.parse(data);
    }
    var type = TYPE[msg.t];
    if (!type) {
        return "UNKNOWN"
    }
    if (type == "RESPONSE") {
        return {type : type, session : msg.s, args : msg.d}
    }
    var session = msg.s
    var name = msg.n
    var args = msg.d
    if (!session) {
        return {type : type, name : name, args : args}
    }
    var response = function (s) {
        var msg = {
            t : "s",
            s : session,
            d : s,
        }
        return JSON.stringify(msg);
    }
    //console.log("type="+type+"name="+name+"args="+args)
    return {type : type, name : name, args : args, response : response}
}

proto.hostRequest = function (name, msg, session) {
    var req = {
        t : "q",
        s : session,
        n : name, 
        d : msg,
    }
    return JSON.stringify(req);
}

var Socket = cc.Class({
    extends: cc.Component,
    properties : {
        session : 1,
        callbacks : {
            default : {},
        },
        onMessages : [],
        status : "",
        url : "",
        state : {
            get : function () {
                if (this.ws) {
                    return this.ws.readState;
                }
                return "";
            }
        }
    },

    on : function (name, callback) {
        this.onMessages.push({name : name, callback : callback});
    },

    emit : function () {
        var name = arguments[0];
        var args = [];
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        this.onMessages.forEach(function (item) {
            if (name != item.name) {
                return;
            }
            item.callback.apply(null, args);
        });
    },

    close : function(){
        if(this.ws){
            this.ws.close();
            this.ws = null;
        }
        
    },

    connect : function (url) {
        var self = this;
        this.url = url;
        var ws = new WebSocket(url)
        ws.binaryType = "arraybuffer";
        ws.onopen = function () {
            self.emit("onopen");
        }
        ws.onmessage = function (event) {
            self.emit("onmessage", event);
            var data = event.data;
            var args = self.dispatch(data, data.length);
            console.log(args);
            var type = args.type;
            if (type == "REQUEST") {
                self.emit(args.name, args.args);
            } else if (type == "RESPONSE") {
                var session = args.session;
                var callback = self.callbacks[session];
                self.callbacks[session] = null;
                callback(args.args);
            }
        }
        ws.onclose = function () {
            self.emit("onclose");
            this.status = "close";
            this.close();
        }
        ws.onerror = function (err) {
            self.emit("onerror", err);
            cc.log("WebSocket url " + url + " err " + err);
        }
        this.ws = ws;
    },

    request : function (name, msg, callback) {
        console.log("Socket request " + name + " msg " + JSON.stringify(msg));
        var session = this.session++;
        this.callbacks[session] = callback;
        msg = msg || {};
        var data = this.hostRequest(name, msg, session);
        this.ws.send(data);
    },

    dispatch : function (data, sz) {
        // var binary = new Uint8Array(data);
        // var arr = [];
        // for (var i = 0; i < binary.length; i++) {
        //     var char = String.fromCharCode(binary[i]);
        //     arr.push(char);
        // }
        // data = arr.join('');
        //console.log(data);
         var uint8Array = new Uint8Array(data);
         var data = this.Utf8ArrayToStr(uint8Array);
        //var data = new TextDecoder("utf-8").decode(binary);
        sz = data.length;
        // console.log(data);
        // console.log(sz);
        return proto.dispatch(data, sz);
    },

    hostRequest : function (name, msg, session) {
        return proto.hostRequest(name, msg, session);
    },

    Utf8ArrayToStr : function(array) {
        var out, i, len, c;
        var char2, char3,char4;

        out = "";
        len = array.length;
        i = 0;
        while(i < len) {
            c = array[i++];
        //     switch(c >> 4)
        //     { 
        //     case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // // 0xxxxxxx
        //         out += String.fromCharCode(c);
        //         break;
        //     case 12: case 13:
        // // 110x xxxx   10xx xxxx
        //         char2 = array[i++];
        //         out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        //         break;
        //     case 14:
        //     // 1110 xxxx  10xx xxxx  10xx xxxx
        //         char2 = array[i++];
        //         char3 = array[i++];
        //         out += String.fromCharCode(((c & 0x0F) << 12) |
        //                ((char2 & 0x3F) << 6) |
        //                ((char3 & 0x3F) << 0));
        //     break;
        //     }
            var pre = (c >> 3);
            if(pre >=0 && pre <= 15){// 0xxxxxxx
                out += String.fromCharCode(c);
            }else if(pre >=24 && pre <= 27){// 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            }else if(pre >= 28 && pre <= 29){// 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
            }else if(pre == 30){//1111 0xxx  10xx xxxx  10xx xxxx 10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                char4 = array[i++];
                out += String.fromCodePoint(
                        ((c & 0x07) << 15) |
                       ((char2 & 0x3F) << 12) |
                       ((char3 & 0x3F) << 6) |
                       ((char4 & 0x3F) << 0));              
            }
        }

    return out;
    },
})  