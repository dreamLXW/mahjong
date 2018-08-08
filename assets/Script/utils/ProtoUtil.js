var Proto = {}

var traverse = function (msg, f) {
    if ( ! (msg instanceof Object)) {
        return msg;
    }
    if (msg instanceof Array) {
        for (var i =0; i < msg.length; i++) {
            traverse(msg[i], f);
        }
    } else {
        for (var k in msg) {
            if (k.indexOf('_') == 0) {
                continue;
            }
            if (msg[k] instanceof Object) {
                traverse(msg[k], f);
            }
            if ( typeof(k) == "string" && isNaN(k)) {
                var s = f(k);
                var tmp = msg[k];
                delete msg[k];
                msg[s] = tmp; 
            }
        }  
    }
}

Proto.decode = function (msg) {
    traverse(msg, function (s) {
        if (s.indexOf("_") < 0) {
            return s;
        }
        var a = s.split("_");
        for (var i in a) {
            if (i > 0) {
                var str = a[i];
                a[i] = str.substring(0,1).toUpperCase() + str.substring(1);
            }
        }
        return a.join('');
    });
    return msg;
}

function isUpperCase(str) {
    return str === str.toUpperCase();
}

Proto.encode = function (msg) {
    traverse(msg, function (s) {
        var a = [];
        for (var i=0; i < s.length; i++) {
            var c = s[i];
            if (isUpperCase(c)) {
                a.push('_');
                a.push(c.toLowerCase());
            } else {
                a.push(c);
            }
        }
        return a.join('');
    });
    return msg;
}

module.exports = Proto;