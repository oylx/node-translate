"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
var https = __importStar(require("https"));
var querystring = __importStar(require("querystring"));
var private_1 = require("./private");
var md5 = require("md5");
var errorMap = {
    52003: "用户认证失败",
    54001: "签名错误",
    54004: "账户余额不足",
};
var translate = function (word) {
    var salt = Math.random();
    var sign = md5(private_1.appId + word + salt + private_1.appSecret);
    var from, to;
    if (/[a-zA-Z]/.test(word[0])) {
        // 英译为中
        from = "en";
        to = "zh";
    }
    else {
        // 中译为英
        from = "zh";
        to = "en";
    }
    var query = querystring.stringify({
        q: word,
        appid: private_1.appId,
        salt: salt,
        sign: sign,
        from: from,
        to: to,
    });
    var options = {
        hostname: "api.fanyi.baidu.com",
        port: 443,
        path: "/api/trans/vip/translate?" + query,
        mthod: "GET",
    };
    var request = https.request(options, function (response) {
        var chunks = [];
        response.on("data", function (chunk) {
            chunks.push(chunk);
        });
        response.on("end", function () {
            var string = Buffer.concat(chunks).toString();
            var object = JSON.parse(string);
            if (object.error_code) {
                console.error(errorMap[object.error_code] || object.error_msg);
                process.exit(2);
            }
            else {
                object.trans_result.map(function (obj) {
                    console.log(obj.dst);
                });
                process.exit(0);
            }
        });
    });
    request.on("error", function (e) {
        console.error(e);
    });
    request.end();
};
exports.translate = translate;
