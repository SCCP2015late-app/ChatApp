//test code
/*
getLocalIP (function(ips) {
    return ips[ips.length - 1];
});
var hash = CryptoJS.MD5("Message");

*/
//get internal IP address
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

//ArrayBuffer String converetr
var string_to_buffer = function(src) {
    return (new Uint16Array([].map.call(src, function(c) {
        return c.charCodeAt(0);
    }))).buffer;
};

var buffer_to_string = function(buf) {
    return String.fromCharCode.apply("", new Uint16Array(buf));
};


//test code for udp packet sending and receiving
var bind_address = '127.0.0.1';
var bind_port = 22222;
var add = bind_address/* = getLocalIP (function(ips) { return ips[ips.length - 1]; })*/;
var m = "This is a test message.";

chrome.system.network.getNetworkInterfaces(function(ipinfo){
    var add = [];
    var name = [];
    for(var i in ipinfo){
//        name.push(ipinfo[ipinfo.length - 1].name);
//        add.push(ipinfo[ipinfo.length - 1].address);
        console.log(ipinfo[i].name + " " + ipinfo[i].address);
    }
});

var receiveCallback = function(info){
    console.log(info.socketId + " : " + buffer_to_string(info.data));
};

var data = string_to_buffer(m);
chrome.sockets.udp.create({}, function(createInfo) {
    chrome.sockets.udp.onReceive.addListener(receiveCallback);
	chrome.sockets.udp.bind(createInfo.socketId, add, bind_port, function(result){
		chrome.sockets.udp.send(createInfo.socketId, data, add/*bind_address*/, bind_port, function(sendInfo) {
			console.log('poe: ' + sendInfo.resultCode);
			chrome.sockets.udp.close(createInfo.socketId, function(){});
		});
	});
});
//end---


/* global onUpdateMessageListener */
function msgBroadcastRequest(message){//massageを受け取ってjsonにしてownerになげる
    var msg = {
        　"u_id": message.member.id,
        　"u_name": message.member.regItem.name,
        　"date": Date.now(),
        　"body": message.body,
        　"pict_flag": false, //画像が添付されているかどうか
        　"pict_name": null,
    };

    if(message.image==null){
        json_text = JSON.stringify(msg);
        msgBroadcast(json_text);
    } else {
        msg["pict_flag"] = true;
        var extension = getExtension(message.image);//拡張子のみを取得
        extension.toLowerCase();//拡張子を小文字に変換
        msg["pict_name"] = message.id.toString();
        var pict = {
            "name": msg["pict_name"],
            "data": message.image,
        };

        var json_text = JSON.stringify(msg);
        msgBroadcast(json_text);
        pictBroadcastRequest(pict);
    }

}

function getExtension(fileName) {
    var ret;
    if (!fileName) {
        return ret;
    }
    var fileTypes = fileName.split(".");
    var len = fileTypes.length;
    if (len === 0) {
        return ret;
    }
    ret = fileTypes[len - 1];
    return ret;
}

//TODO least priority
function pictBroadcastRequest(pict){
    pict["data"] = base64encode();//バイナリを読みこませる
    var json_pict = JSON.stringify(pict);
    pictBroadcast(json_pict);
}

function msgObjectRecv(){
    if(obj.isMessage == true){
        storeMessage(obj);
        //TODO
        onUpdateMessageListener();
    }
}

//TODO least priority
function pictObjectRecv(){
    if(obj.isPicture == true){
        savePict(obj);
    }
}

function updateMsgList(msg){
    var message = msg["body"];
    Env().onUpdateMessageListener.addCallback(message);
}
//TODO least priority
function savePict(filename, encodedPict){
    chrome.storage.sync.set({'filename':base64decode(encodedPict)},function(){
        console.log("This is callback");
    });
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

// BASE64 (RFC2045) Encode/Decode for string in JavaScript
// Version 1.2 Apr. 8 2004 written by MIZUTANI Tociyuki
// Copyright 2003-2004 MIZUTANI Tociyuki
//
// This code is free software; you can redistribute it and/or
// modify it under the terms of the GNU Library General Public
// License as published by the Free Software Foundation; either
// version 2 of the License, or (at your option) any later version.
//
// usage:
// base64 = base64encode(string)  Encode a string.
// string = base64decode(base64)  Decode a base64 string.
//
// caution:
// 1) Wide characters like japanese kanji are not supported. Use only in Latin-1.

var base64list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function base64encode(s) {
    var t = '', p = -6, a = 0, i = 0, v = 0, c;

    while ( (i < s.length) || (p > -6) ) {
        if ( p < 0 ) {
            if ( i < s.length ) {
                c = s.charCodeAt(i++);
                v += 8;
            } else {
                c = 0;
            }
            a = ((a&255)<<8)|(c&255);
            p += 8;
        }
        t += base64list.charAt( ( v > 0 )? (a>>p)&63 : 64 )
            p -= 6;
        v -= 6;
    }
    return t;
}

function base64decode(s) {
    var t = '', p = -8, a = 0, c, d;

    for( var i = 0; i < s.length; i++ ) {
        if ( ( c = base64list.indexOf(s.charAt(i)) ) < 0 )
            continue;
        a = (a<<6)|(c&63);
        if ( ( p += 6 ) >= 0 ) {
            d = (a>>p)&255;
            if ( c != 64 )
                t += String.fromCharCode(d);
            a &= 63;
            p -= 8;
        }
    }
    return t;
}