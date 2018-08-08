var FanXingCfg =  {
    '1':{'id':1,'name':'平胡'},
    '2':{'id':2,'name':'碰碰胡'},
    '3':{'id':3,'name':'混一色'},
    '4':{'id':4,'name':'清一色'},
    '5':{'id':5,'name':'小七对'},
    '6':{'id':6,'name':'豪华七对'},
    '7':{'id':7,'name':'双豪华七对'},
    '8':{'id':8,'name':'三豪华七对'},
    '9':{'id':9,'name':'小三元'},
    '10':{'id':10,'name':'小四喜'},
    '11':{'id':11,'name':'十八罗汉'},
    '12':{'id':12,'name':'大三元'},
    '13':{'id':13,'name':'大四喜'},
    '14':{'id':14,'name':'十三幺'},
    '15':{'id':15,'name':'字一色'},
    '16':{'id':16,'name':'清幺九'},
    '17':{'id':17,'name':'门清'},
    '18':{'id':18,'name':'混幺九'},
    '19':{'id':19,'name':'一条龙'},
};

FanXingCfg.getComplementarySet = function(arr){
    var complementarySet = [];
    for(var id in FanXingCfg){
        var isFind = (arr.findIndex(function(value){return value == id}) != -1)
        var iid = Number(id);
        if(!isFind && iid ){
            complementarySet.push(iid);
        }
    }    
    return complementarySet;
};
module.exports = FanXingCfg;