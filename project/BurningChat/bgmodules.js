//to delete all storage data
//chrome.storage.local.clear();

//get internal IP address, and calculate other info
var your_ip;
var your_id;
var your_num;
chrome.system.network.getNetworkInterfaces(function(ipinfo){
    your_ip = ipinfo[1].address;
    your_id = CryptoJS.MD5(your_ip) + (new Date).getTime();
    your_num = parseInt(your_ip.split(".")[3]);
    var you = new Member(your_id, your_num, new RegistrationItem("John Doe", "yahoo@gmail.com"));
});

const msg_port = 22222;
const req_port = 33333;
const your_info = 'your_info';
const group_info = 'group_info';
const sample_message = "This is a test message.";

chrome.storage.local.get(your_info, function(obj){
    var stored_you = obj.your_info;
    if(stored_you == undefined){
        console.log("! You are not registered !");
        return;
    }else{
        console.log("Loaded your Information:");
        console.log(stored_you);
        
        const id = stored_you.id$1;
        const num = stored_you.number$1;
        const name = stored_you.regItem$1.name$1;
        const email = stored_you.regItem$1.email$1;
        you = new Member(id, num, new RegistrationItem(name, email));
        //Env().onLoadUserListener.callAllCallback(you);
    }
});

//
Env().onSetRegistrationItemListener.addCallback(function(info){
    console.log("your IPv4 address: " + your_ip);
    you = new Member(your_id, your_num, info);
    console.log("New your info: " + you);
    chrome.storage.local.set({your_info: you}, function(){});
    chrome.storage.local.get(your_info, function(obj){
        console.log("Storing completed:");
        console.log(obj.your_info);
    });
    Env().onLoadUserListener.callAllCallback(you);
  }
);


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