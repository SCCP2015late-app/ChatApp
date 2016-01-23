//test code
/*
getLocalIP (function(ips) {
    return ips[ips.length - 1];
});
var hash = CryptoJS.MD5("Message");

*/
//get internal IP address

const LOCALHOST = '127.0.0.1';
const msg_port = 22222;
const req_port = 33333;
const sample_message = "This is a test message.";

var getLocalIP = function(callback) {
    var ips = [];

    var RTCPeerConnection = window.RTCPeerConnection ||
        window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    var pc = new RTCPeerConnection({
        iceServers: []
    });
    pc.createDataChannel('');

    pc.onicecandidate = function (e) {
        if (!e.candidate) {
            pc.close();
            return ips[ips.length -1];
            //callback(ips);
            //return;
        }
        var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
        if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
            ips.push(ip);
    };
    pc.createOffer(function (sdp) {
        pc.setLocalDescription(sdp);
    }, function onerror() {
    });
};

chrome.system.network.getNetworkInterfaces(function(ipinfo){
    var add = [];
    var name = [];
    for(var i in ipinfo){
        console.log(ipinfo[i].name + " " + ipinfo[i].address);
    }
});

var receiveCallback = function(info){
    console.log(info.socketId + " : " + buffer_to_string(info.data));
};

chrome.sockets.udp.create({}, function(createInfo) {
    chrome.sockets.udp.onReceive.addListener(receiveCallback);
	chrome.sockets.udp.bind(createInfo.socketId, LOCALHOST, msg_port, function(result){
		chrome.sockets.udp.send(createInfo.socketId, string_to_buffer(sample_message), LOCALHOST, msg_port, function(sendInfo) {
			console.log('sent done: ' + sendInfo.resultCode);
			chrome.sockets.udp.close(createInfo.socketId, function(){});
		});
	});
});


/* global onUpdateMessageListener */
function msgBroadcastRequest(message){//massageを受け取ってjsonにしてownerになげる
    var msg = {
        　"u_id": message.id,
        　"u_name": message.member.regItem.name,
        　"date": Date.now(),
        　"body": message.body,
        　"image": null, //画像が添付されているかどうか
        　"flag": false,
    };

    if(message.image==null){
        json_text = JSON.stringify(msg);
        msgBroadcast(json_text); //オーナーに送信処理
    } else {
        msg["flag"] = true;
        msg["image"] = base64encode(message.image);
        var json_text = JSON.stringify(msg);
        msgBroadcast(json_text); //オーナーに送信処理
        //pictBroadcastRequest(pict);
    }

}

function msgObjectRecv(){
    if(obj.isMessage == true){
        storeMessage(obj);
        //TODO
        onUpdateMessageListener();
    }
}

function updateMsgList(msg){
    var message = msg["body"];
    Env().onUpdateMessageListener.addCallback(message);
}

function sendGroupInfo(){
    var group_info = jsonizeGroupInfo();
    sendTo(dest_IP, group_info);
}

function sendMsgList(){
    var msg_list = jsonizeMessages();
    sendTo(dest_IP, msg_list);
}

function requestRecv(){

}


function msgBroadcast(){
    sendToAll(obj);
}

//TODO least priority
function pictBroadcast(){
    sendToAll(obj);
}

function modifyUserInfo(){
    //ユーザ情報の変更
    //reg itemをもとにuser informationのJSONを変更してファイルに書き込む
    //Listenerを叩いてフロントに変更を伝える
}

function initializeGroup(){
    //ストレージからとってきたデータを使ってグループを初期化する
}

function jsonizeMessages(){
    var ret = [];
    for(var i = 0; i < group.messageArray.length; i++){
        var buf = {
            "u_id": group.messageArray[i].id,
            "u_name": group.messageArray[i].member.regItem.name,
            "date": group.messageArray[i].date,
            "body": group.messageArray[i].body,
            "pict_flag": group.messageArray[i].flag,
            "pict_name": group.messageArray[i].image
        };
        ret.push(buf);
    }
    return ret;
}

function jsonizeMembers(){
    var ret = [];
    for(var i = 0; i < group.memberArray.length; i++){
        var buf = {
            "u_id": group.memberArray[i].id,
            "u_name": group.memberArray[i].regItem.name,
            "e-mail": group.memberArray[i].regItem.email
        };
        ret.push(buf);
    }
    return ret;
}

function jsonizeGroupInfo(){
    var messages = jsonizeMessages();
    var members = jsonizeMembers();
    var g_info = JSON.stringify({
        "g_id": group.id,
        "owner_id": group.owner.id,
        "user_list": members,
        "msg_list": messages
    }, null, "    ");
   return g_info;
}