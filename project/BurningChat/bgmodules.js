/*-- to delete all storage data --*/
//chrome.storage.local.clear();

//constants for all_users
const server_url = 'http://192.168.222.19:19810';
const msg_port = 22222;
const msg_req_port = 29999;
const join_port = 44444;
const join_req_port = 49999;
const ud_port = 55555; //to update message list
const your_info = 'your_info';
const group_info = 'group_info';
//end----------------------------------------

//get internal IP address, and calculate other info
var your_ip;
var your_id;
var your_num;
var you;
var current_group;
var exist_groups;
var owner_ip;
var ips
chrome.system.network.getNetworkInterfaces(function(ipinfo){
    your_ip = ipinfo[1].address;
    your_id = CryptoJS.MD5(your_ip) + (new Date).getTime();
    your_num = parseInt(your_ip.split(".")[3]);
    you = new Member(your_id, your_num, new RegistrationItem("John Doe", "yahoo@gmail.com"));
});
//end----------------------------------------

//load stored user_information from storage
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
    }
});
//end----------------------------------------

//callback - create new_user and store it
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
//end----------------------------------------

//anonymous function to get group_list from server
function getGroupList(){
    var r = new XMLHttpRequest();
    r.open('GET', server_url + '/groupList');
    r.addEventListener("load", function(obj){
        exist_groups = JSON.parse(JSON.parse(obj["target"]["response"])["message"]);
        console.log("Get groups from server:");
        console.log(exist_groups);
        Env().onGetGroupListListener.callAllCallback(exist_groups);
    });
    r.send();
};
//end----------------------------------------

//TODO load group information (including whether stored on storage or not)
function loadGroupFromStorage(){
    
};
//end----------------------------------------

//TODO callback function - save received group info to variable
var receiveGroupCallback = function(info){
};
//end----------------------------------------

//callback - send join request and save group data to variables
Env().onJoinGroupListener.addCallback(function(info){
    owner_ip = info['group']['owner']['ip_addr'];

    console.log("joining group");
    console.log(group_JSON2scala(info['group']));
    
    Env().onGroupUpdateListener.callAllCallback(group_JSON2scala(info['group']));
    chrome.sockets.udp.create({}, function(createInfo) {
        chrome.sockets.udp.onReceive.addListener(receiveGroupCallback);
        chrome.sockets.udp.bind(createInfo.socketId, your_ip, join_port,
        function(result){
            chrome.sockets.udp.send(createInfo.socketId,
            string_to_buffer(JSON.stringify(info['member'])),
            owner_ip, join_req_port, function(sendInfo) {
                console.log('Join request was sent: ' + sendInfo.resultCode);
                console.log('Owner\'s IP: ' + owner_ip);
                chrome.sockets.udp.close(createInfo.socketId, function(){});
            });
        });
    });
});
//end----------------------------------------

//TODO callback function - process join request
var receiveJoinRequestCallback = function(info){  
    console.log("success");
};
//end----------------------------------------

//FOR OWNER - join request receiver
function activateJoinRequestReceiver(){
    chrome.sockets.udp.create({}, function(createInfo) {
        chrome.sockets.udp.onReceive.addListener(receiveJoinRequestCallback);
        chrome.sockets.udp.bind(createInfo.socketId, your_ip, join_req_port, function(){});
    });
};
//end----------------------------------------

//FOR OWNER - callback - create new group
Env().onCreateNewGroupListener.addCallback(function(newGroup){
    current_group = newGroup;
    console.log("Created new group: " + current_group.name + " by " + current_group.owner.regItem.name);
    notifyGroupCreationToServer(current_group);
    Env().onGroupUpdateListener.callAllCallback(newGroup);
});
//end----------------------------------------

//FOR OWNER - function to notify new_group_createion to server
function notifyGroupCreationToServer(newGroup){
    var obj = {
        'id': newGroup.id,
        'name': newGroup.name,
        'owner': {
            id: newGroup.owner.id,
            name: newGroup.owner.regItem.name,
            ip_addr: your_ip,
            email: newGroup.owner.regItem.email,
        },
        'member_num': 10,
    };
    var r = new XMLHttpRequest();
    r.open('POST', server_url + '/addNewGroup');
    r.addEventListener("load", function(){ console.log("New group_info was uploaded to server"); });
    r.send(JSON.stringify(obj));
};
//end----------------------------------------

//new member participation notification
//Env().onGroupUpdateListener.callAllCallback(updatedGroup)

/* global onUpdateMessageListener */
//massageを受け取ってjsonにしてownerになげる
Env().onSendMessageListener.addCallback(function(message){
    var msg = {
        　"u_id": message.id,
        　"u_name": message.member.regItem.name,
        　"date": Date.now(),
        　"body": message.body,
        　"image": null, 
        　"flag": false,//画像添付の判別
    };

    if(message.flag==false){
        json_text = JSON.stringify(msg);
        chrome.sockets.udp.create({}, function(createInfo) {
         chrome.sockets.udp.bind(createInfo.socketId, your_ip, msg_req_port, function(result){
          chrome.sockets.udp.send(createInfo.socketId, string_to_buffer(json_text), your_ip, msg_req_port, function(){
            chrome.sockets.udp.close(createInfo.socketId, function(){})
          })
         })
        });
        
    } else {
        msg["flag"] = true;
        msg["image"] = "data:image/*;base64," + base64encode(message.image);
        var json_text = JSON.stringify(msg);
        //オーナーに送信処理
        chrome.sockets.udp.create({}, function(createInfo) {
         chrome.sockets.udp.bind(createInfo.socketId, your_ip, msg_req_port, function(result){
          chrome.sockets.udp.send(createInfo.socketId, string_to_buffer(json_text), owner_ip, msg_req_port,function(){
            chrome.sockets.udp.close(createInfo.socketId, function(){})
          })
         });
        });
    }
});


function msgObjectRecv(){
    var msgObjectreceiveCallback = function(obj){
        console.log(obj.socketId + " : " + buffer_to_string(obj.data));
        var msgobj = JSON.parse(buffer_to_string(obj.data));
           var message = msgobj["body"];
           Env().onUpdateMessageListener.addCallback(message);
           current_group.addMessage(message);
        }

    chrome.sockets.udp.create({}, function(createInfo) {
        chrome.sockets.udp.onReceive.addListener(msgObjectreceiveCallback);
	       chrome.sockets.udp.bind(createInfo.socketId, your_ip, msg_port, function(result){
	       });
    });
    onUpdateMessageListener();
}

/*function updateMsgList(msg){
    var message = msg["body"];
    Env().onUpdateMessageListener.addCallback(message);
}*/

function sendGroupInfo(){
    var group_info = jsonizeGroupInfo();
    sendTo(dest_IP, group_info);
}

function sendMsgList(){
    var msg_list = jsonizeMessages();
    sendTo(dest_IP, msg_list);
}

function requestRecv(){
    var requestRecvCallback = function(obj){
        var msg = JSON.parse(buffer_to_string(obj.data));
        //objはudp通信で受け取ったデータ(obj.dataで中身を取り出す)
        console.log(obj.data);
        for(var prop in ips){
            chrome.sockets.udp.create({}, function(createInfo) {
                chrome.sockets.udp.bind(createInfo.socketId, your_ip, msg_port, function(){
                    chrome.sockets.udp.send(createInfo.socketId, string_to_buffer(JSON.stringify(msg)), ips[prop], msg_port, function(sendInfo) {
                        console.log('sent done: ' + sendInfo.resultCode);
                        chrome.sockets.udp.close(createInfo.socketId, function(){});
                    });
                });
            });
        }           
    };
    chrome.sockets.udp.create({}, function(createInfo) {
        //chrome.socketsに監視してもらうcallbackの追加
        chrome.sockets.udp.onReceive.addListener(requestRecvCallback);
            //socketのbind
            chrome.sockets.udp.bind(createInfo.socketId, your_ip, msg_req_port, function(){
            });
    });
}

function modifyUserInfo(){
    //ユーザ情報の変更
    //reg itemをもとにuser informationのJSONを変更してファイルに書き込む
    //Listenerを叩いてフロントに変更を伝える
}

function initializeGroup(){
    //ストレージからとってきたデータを使ってグループを初期化する
}