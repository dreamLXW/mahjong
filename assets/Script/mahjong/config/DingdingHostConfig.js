var Host = {};
var devOpt = {
    "ip" : "http://mjgatedev.ddpkcc.com",
    "port" : "8201",
    "symbol" : "dev"
};
var localOpt  = {
    "ip" : "http://120.77.214.112",
    "port" : "8201",
    "symbol" : "local-112"
};
// var localOpt  = {
//     "ip" : "http://192.168.31.149",
//     "port" : "8201",
//     "symbol" : "local-149"
// };
var testOpt  = {
    "ip" : "http://mjgatetest.ddpkcc.com",
    "port" : "8201",
    "symbol" : "test"
};
var releaseOpt = {
    "ip" : "http://mjgate.ddpkcc.com",
    "port" : "8201",
    "symbol" : ""
};
Host.dev = devOpt;
Host.local = localOpt;
Host.test = testOpt;
Host.pro = releaseOpt;
module.exports = Host;
