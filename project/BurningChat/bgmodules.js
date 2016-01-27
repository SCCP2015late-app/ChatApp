/*-- to delete all storage data --*/
//chrome.storage.local.clear();

//constants for all_users
const server_url = 'http://192.168.222.19:19810';
//const server_url = 'http://127.0.0.1:19810';
const msg_port = 22222;
const msg_req_port = 29999;
const join_port = 44444;
const join_req_port = 49999;
const ud_port = 55555;
const your_info = 'your_info';
const group_info = 'group_info';
//end----------------------------------------

//get internal IP address, and calculate other info
var msg_count = 0;
var your_ip = '0.0.0.0';
var your_id;
var your_num;
var you;
var current_group;
var exist_groups;
var owner_ip = '0.0.0.0';
var ips = [];
var reqSocketId;
var msgSocketId;
var joinSocketId;
var join_group_socket;

chrome.system.network.getNetworkInterfaces(function(ipinfo){
    your_ip = ipinfo[1].address;
    console.log("ALL: your IP: " + your_ip);
    ips.push(your_ip);
    your_id = CryptoJS.MD5(your_ip).toString().substr(-5) + (new Date).getTime().toString().substr(-5);
    your_num = parseInt(your_ip.split(".")[3]);
    you = new Member(your_id, your_num, new RegistrationItem("John Doe", "yahoo@gmail.com"));
});
//end----------------------------------------

//load stored user_information from storage
chrome.storage.local.get(your_info, function(obj){
    var stored_you = obj.your_info;
    if(stored_you == undefined){
        console.log("!!!: You are not registered !");
        return;
    }else{
        console.log("ALL: Loaded your Information:");
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
    console.log("ALL: your IPv4 address: " + your_ip);
    you = new Member(your_id, your_num, info);
    console.log("ALL: New your info: " + you);
    chrome.storage.local.set({your_info: you}, function(){});
    chrome.storage.local.get(your_info, function(obj){
        console.log("ALL: Storing completed:");
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
        if(JSON.parse(obj["target"]["response"])["message"][0] == 'S'){
            console.log("ALL: Empty group list on server");
            return;
        };
        exist_groups = JSON.parse(JSON.parse(obj["target"]["response"])["message"]);
        console.log("ALL: Get groups from server:");
        console.log(exist_groups);
        Env().onGetGroupListListener.callAllCallback(exist_groups);
    });
    r.send();
    sleep(1);
};
//end----------------------------------------

//TODO
//load group information (including whether stored on storage or not)
function loadGroupFromStorage(){
};
//end----------------------------------------

//callback function - save received group info to variable
var receiveGroupCallback = function(info){
    if(info.socketId != join_group_socket){ return; }
    console.log("ALL: received new group data");
    console.log(JSON.parse(buffer_to_string(info.data)));
    g = JSON.parse(buffer_to_string(info.data));
    var _usr = [];
    for(var i = 0; i < g.length; i++){
        var n_usr;
        var _id = g[i].id$1
        var _number = g[i].number$1;
        var _reg = new RegistrationItem(g[i].regItem$1.name$1, g[i].regItem$1.email$1);
        n_usr = new Member(_id, _number, _reg);
        _usr.push(n_usr);
    }
    current_group = new ChatGroup(current_group.id, current_group.name, current_group.owner, _usr, current_group.messageArray);
    Env().onGroupUpdateListener.callAllCallback(current_group);
};
//end----------------------------------------

//socket to receive group information
chrome.sockets.udp.create({}, function(createInfo){
    chrome.sockets.udp.onReceive.addListener(receiveGroupCallback);
    join_group_socket = createInfo.socketId;
    chrome.sockets.udp.bind(createInfo.socketId, your_ip, ud_port, function(){});
});

//callback - send join request and save group data to variables
Env().onJoinGroupListener.addCallback(function(info){
    owner_ip = info['group']['owner']['ip_addr'];
    current_group = group_JSON2scala(info['group']);
    //TODO
    //receiveGroupCallbackの実装が終わり次第削除, json2scalaはownerがおかしくなるので変更
    Env().onGroupUpdateListener.callAllCallback(group_JSON2scala(info['group']));
    //end----------
    chrome.sockets.udp.create({}, function(createInfo) {
        //chrome.sockets.udp.onReceive.addListener(receiveGroupCallback);
        chrome.sockets.udp.bind(createInfo.socketId, your_ip, join_port,
        function(result){
            chrome.sockets.udp.send(createInfo.socketId,
            string_to_buffer(JSON.stringify(info['member'])),
            owner_ip, join_req_port, function(sendInfo) {
                console.log('USR: Join request was sent: ' + sendInfo.resultCode);
                console.log("USR: You joined group, " + current_group.name);
                console.log('USR: Owner\'s IP: ' + owner_ip);
                chrome.sockets.udp.close(createInfo.socketId, function(){});
            });
        });
    });
});
//end----------------------------------------

//callback function - process join request
var receiveJoinRequestCallback = function(info){
    if(info.socketId !== joinSocketId){ return; }
    if(ips.indexOf(info.remoteAddress) == -1){
        ips.push(info.remoteAddress);
        console.log(ips);
        var recv_usr = JSON.parse(buffer_to_string(info.data));
        console.log("OWN: " + recv_usr.regItem$1.name$1 + "("+ info.remoteAddress + ") has joined");
        var new_usr = new Member(recv_usr.id$1, recv_usr.number$1, new RegistrationItem(recv_usr.regItem$1.name$1, recv_usr.regItem$1.email$1));
        current_group.addMember(new_usr);
        Env().onGroupUpdateListener.callAllCallback(current_group);
        var notify_msg = new Message(0, new Member('admin', 15, new RegistrationItem('☆ system message', 'email')), ""+ new Date(), new_usr.regItem.name + " has joined!", null, false)
        Env().onSendMessageListener.callAllCallback(notify_msg);
    } else {
        if(owner_ip == info.remoteAddress){ return; }
        console.log("OWN: " + info.remoteAddress + " has left!");
        ips.splice(ips.indexOf(info.remoteAddress), 1);
        var group_member = JSON.parse(buffer_to_string(info.data));
        var _member = new Member(group_member.id$1, group_member.number$1,new RegistrationItem(group_member.regItem$1.name$1, group_member.regItem$1.email$1));
        current_group.removeMember(_member);
        var exit_msg = new Message(0, new Member('admin', 18, new RegistrationItem('☆ system message', 'email')), ""+ new Date(), _member.regItem.name + " has left!", null, false);
        Env().onSendMessageListener.callAllCallback(exit_msg);
    }
    //send new group info to all users
    for(var i = 0; i < ips.length; i++){
        chrome.sockets.udp.send(info.socketId, string_to_buffer(JSON.stringify(current_group.memberArray$1)), ips[i], ud_port, function(){});
        console.log("OWN: new group info was sent to: " + ips[i]);
    }
};
//end----------------------------------------

//FOR OWNER - join request receiver
function activateJoinRequestReceiver(){
    chrome.sockets.udp.create({}, function(createInfo) {
        joinSocketId = createInfo.socketId;
        chrome.sockets.udp.onReceive.addListener(receiveJoinRequestCallback);
        chrome.sockets.udp.bind(createInfo.socketId, your_ip, join_req_port, function(){});
    });
};
//end----------------------------------------

//FOR OWNER - callback - create new group
Env().onCreateNewGroupListener.addCallback(function(newGroup){
    current_group = newGroup;
    owner_ip = your_ip;
    notifyGroupCreationToServer(current_group);
    sleep(2);
    Env().onGroupUpdateListener.callAllCallback(current_group);
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
        'member_num': 1,
    };
    var r = new XMLHttpRequest();
    r.open('POST', server_url + '/addNewGroup');
    r.addEventListener("load", function(info){ 
        obj['id'] = JSON.parse(info["target"]["response"])["message"];
        current_group = group_JSON2scala(obj);
        console.log("OWN: created new Group:");
        console.log(current_group);
    });
    r.send(JSON.stringify(obj));
};
//end----------------------------------------

//new member participation notification
//Env().onGroupUpdateListener.callAllCallback(updatedGroup)

//callback - add received message object, and notify 
var msgObjectreceiveCallback = function(obj){
    if(obj.socketId !== msgSocketId){ return; }
    console.log("ALL: Message received:");
    if(obj.data.byteLength === 4096) {
      Env().onErrorOccurredListener.callAllCallback({code: 'byte-size-null'});
      return;
    }
    var msg = JSON.parse(buffer_to_string(obj.data));
    var _msg = new Message(msg_count++/*msg.id$1*/, new Member(msg.member$1.id$1, msg.member$1.number$1, new RegistrationItem(msg.member$1.regItem$1.name$1, msg.member$1.regItem$1.email$1)), msg.date$1, msg.body$1, msg.image$1, msg.flag$1);
    console.log(_msg);
    current_group.addMessage(_msg);
    //Env().onGroupUpdateListener.callAllCallback(current_group);
    Env().onUpdateMessageListener.callAllCallback(current_group);
};
//end----------------------------------------

//FOR ALL USER - message receiver and register callback to listener
chrome.sockets.udp.create({}, function(createInfo){
    msgSocketId = createInfo.socketId;
    chrome.sockets.udp.onReceive.addListener(msgObjectreceiveCallback);
    
    //callback - send message_request to owner
    Env().onSendMessageListener.addCallback(function(message){
        var msg = JSON.stringify(message);
        chrome.sockets.udp.send(msgSocketId, string_to_buffer(msg), owner_ip, msg_req_port, function(result){
            console.log("ALL: Message request was sent: " + result.resultCode);
        });
    });
    //end---------- 
    chrome.sockets.udp.bind(createInfo.socketId, your_ip, msg_port, function(){});
});
//end----------------------------------------

//callback - throw message to all group users
var requestRecvCallback = function(obj){
    if(obj.socketId !== reqSocketId){ return; }
    console.log("OWN: Message broadcast request received");
    console.log(ips);
    for(var i = 0; i < ips.length; i++){
        chrome.sockets.udp.send(obj.socketId, obj.data, ips[i], msg_port, function(){});
        console.log('OWN: sent done to ' + ips[i]);
    }           
};
//end----------------------------------------

//FOR OWNER - message broadcast request receiver
chrome.sockets.udp.create({}, function(createInfo) {
    reqSocketId = createInfo.socketId;
    chrome.sockets.udp.onReceive.addListener(requestRecvCallback);
    chrome.sockets.udp.bind(createInfo.socketId, your_ip, msg_req_port, function(){});
});
//end----------------------------------------

//FOR ALL USER - exit to group
Env().onExitGroupListener.addCallback(function(info){
    if(your_ip == owner_ip){
        var r = new XMLHttpRequest();
        r.open('POST', server_url + '/deleteGroup');
        console.log("OWN: delete group: " + current_group.id$1);
        r.send(current_group.id$1);
    }
    chrome.sockets.udp.create({}, function(createInfo) {
        chrome.sockets.udp.bind(createInfo.socketId, your_ip, join_port,
        function(result){
            chrome.sockets.udp.send(createInfo.socketId,
            string_to_buffer(JSON.stringify(you)),
            owner_ip, join_req_port, function(sendInfo) {
                console.log('USR: Exit request was sent: ' + sendInfo.resultCode);
                console.log("USR: You exit group, " + current_group.name);
                current_group = new ChatGroup(0, "", you, [], []);
                Env().onGroupUpdateListener.callAllCallback(current_group);
                chrome.sockets.udp.close(createInfo.socketId, function(){});
            });
        });
    });
});
//end-----------
