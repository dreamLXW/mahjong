var Host = {};
var devOpt = {
    "ip" : "http://gamedev.ddpkcc.com",
    "port" : "9201",
    "symbol" : "dev"
};
var localOpt  = {//120.77.214.112
    "ip" : "http://120.77.214.112",
    "port" : "9201",
    "symbol" : "local-112"
};
// var localOpt  = {//120.77.214.112
//     "ip" : "http://192.168.31.149",
//     "port" : "9201",
//     "symbol" : "local-149"
// };
var testOpt  = {
    "ip" : "https://wxmjnodets.ddpkcc.com",
    "port" : "",
    "symbol" : "test"
};
var releaseOpt = {
    "ip" : "https://wxmjnodepro.ddpkcc.com",
    "port" : "",
    "symbol" : ""
};
Host.dev = devOpt;
Host.local = localOpt;
Host.test = testOpt;
Host.pro = releaseOpt;
module.exports = Host;
