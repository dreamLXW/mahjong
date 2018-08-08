var Code = {
    OK                          : 200,              // 成功
    UNKNOWN                     : 400,              // 未知错误
    UNAUTHORIZED                : 401,              // 未认证
    FORBIDDEND                  : 403,              // 禁止访问
    NOT_FOUND                   : 404,              // 请求未找到

    INTERNAL_SERVER_ERROR       : 500,              // 服务器内部错误
    SERVICE_UNAVAILABLE         : 503,              // 服务不可用
    GAME_CLOSED                 : 504,              // 游戏已被屏蔽

    SEAT_ALREAY_IN_ANOTHER_ROOM : 1001,             // 已经在其他房间了
    SEAT_NOT_ENTER_ROOM         : 1002,             // 还未进入房间
    SEAT_ALREAY_FULL            : 1003,             // 房间已经满员
    SEAT_NOT_ROOM_UID           : 1004,             // 不是房主
    SEAT_NOT_WAIT_STATUS        : 1005,             // 房间不处于等待状态
    SEAT_NOT_READY_STATUS       : 1006,             // 房间不处于准备状态
    SEAT_DISSOLVE               : 1007,             // 房间已解散
    SEAT_NOT_FOUND              : 1009,             // 房间不存在
    SEAT_OVER                   : 1010,             // 房间已结束      
    SEAT_NOT_CLUB_AUTH          : 1011,             // 非好友圈成员
    SEAT_DIAMOND_NOT_ENOUGH     : 1012,             // 房卡不足
    SEAT_NOT_GAME_AUTH          : 1013,             // 没有游戏权限
    SEAT_APPLY_START_FAIL       : 1014,             // 申请开局失败
    SEAT_NOT_GROUP_AUTH         : 1015,             // 非群成员
    USER_ALREADY_IN_GAME        : 1016,             // 用户已经在游戏中

    DD_API_FAIL                 : 2010,             // 丁丁API查询出错
    CONFIG_DATA_NOT_EQUAL       : 2011,             // 房间配置不一致
    CONFIG_EXCHANGE_DIAMOND_NOT_ENOUGH: 2012,       // 兑换金币/房卡的钻石不足    
    CONFIG_EXCHANGE_FAULT       : 2013,             // 兑换失败
    EXCHANGE_CONFIG_NOT_EQUAL   : 2014,             // 兑换配置不一致
    CLUB_CREATE_LIMIT           : 3001,             // 超出创建好友圈数量限制
    CLUB_JOIN_LIMIT             : 3002,             // 超出加入好友圈数量限制
    CLUB_ALREAY_MEMBER          : 3003,             // 已经是该好友圈成员
    CLUB_NOT_AUTH               : 3004,             // 非好友圈成员
    CLUB_WAS_NOT_FOUND          : 3005,             // 找不到好友圈或好友圈被禁用
    CLUB_ALREAY_FULL            : 3006,             // 好友圈已满员
    CLUB_VIRIFY_CODE_NOT_EQUAL  : 3007,             // 验证码超时或者不一致
    CLUB_GET_VIRIFY_CODE_ERROR  : 3008,             // 获取验证码失败
    CLUB_PHONE_WAS_REGISTY      : 3009,             // 该手机已经被绑定
    CLUB_HAVE_THIS_APPLY        : 3010,             // 用户已经处于审核状态
    CLUB_NAME_UNSUPPORT         : 3011,             // 不支持的好友圈名字
    CLUB_APPLY_ALREAY_SET       : 3012,             // 该申请已被其它人处理
    CLUB_AUTH_NOT_ENOUGH        : 3013,             // 好友圈操作权限不足
    CLUB_PHONE_NOT_EQUAL        : 3014,             // 手机号码与绑定号码不一致
    CLUB_NAME_WAS_EXISTS        : 3015,             // 已存在的好友圈名称
    USER_NOT_FOUND              : 4001,             // 玩家不存在
    USER_GOLD_NOT_ENOUGH        : 4002,             // 玩家金币不足
    USER_ROOM_CARD_NOT_ENOUGH   : 4003,             // 玩家房卡不足

    codeInfoMap : {     
                        "200":{'name':'成功'},
                        "400":{'name':'未知错误'},
                        "401":{'name':'未认证'},
                        "403":{'name':'禁止访问'},
                        "404":{'name':'请求未找到'},
                        "500":{'name':'服务器内部错误'},
                        "503":{'name':'服务不可用'},
                        "504": {'name':'游戏暂停运营'},
                        "1001":{'name':'已经在其他房间了'},
                        "1002":{'name':'还未进入房间'},
                        "1003":{'name':'房间已经满员'},
                        "1004":{'name':'不是房主'},
                        "1005":{'name':'房间不处于等待状态'},
                        "1006":{'name':'房间不处于准备状态'},
                        "1007":{'name':'房间已解散'},
                        "1009":{'name':'房间不存在'},
                        "1010":{'name':'房间已结束'},
                        "1011":{'name':'非好友圈成员'},
                        "1012":{'name':'房卡不足'},
                        "1013":{'name':'没有游戏权限'},
                        "1014":{'name':'申请开局失败'},
                        "1015":{'name':'非群成员'},
                        "1016":{'name':'您正在游戏中'},
                        "2010":{'name':'丁丁内部错误'},
                        "2011":{'name':'房间配置不一致'},
                        "2012":{'name':'钻石不足'},
                        "2013":{'name':'兑换失败'},
                        "2014":{'name':'商品兑换配置不一致\n请退出游戏重新尝试'},
                        "3001":{'name':'超出创建好友圈数量限制'},
                        "3002":{'name':'超出加入好友圈数量限制'},
                        "3003":{'name':'已经是该好友圈成员'},
                        "3004":{'name':'非好友圈成员'},
                        "3005":{'name':'找不到好友圈或好友圈被禁用'},
                        "3006":{'name':'好友圈已满员'},
                        "3007":{'name':'验证码超时或者不一致'},
                        "3008":{'name':'获取验证码失败'},
                        "3009":{'name':'该手机已经被绑定'},
                        "3010":{'name':'用户已经处于审核状态'},
                        "3011":{'name':'不支持的好友圈名字'},
                        "3012":{'name':"该申请已被其它人处理"},
                        "3013":{'name':"好友圈操作权限不足"},
                        "3014":{'name':"手机号码与绑定号码不一致"},
                        "3015":{'name':"已存在的好友圈名称"},
                        "4001":{'name':'该用户不存在'},
                        "4002":{'name':"玩家金币不足"},
                        "4003":{'name':"玩家房卡不足"}
                },
};
Code.getCodeName = function(code){
    var object = Code.codeInfoMap[code];
    if(object){
        return object.name;
    }else{
        return "未知错误: "+code;
    }
    
},            

Code.isSuc = function(code){
    return (code == Code.OK);
}
module.exports = Code;