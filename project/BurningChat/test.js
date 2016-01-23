//storing
/*
const hoge = {
    "id": 10,
    "name": "tintin",
}

chrome.storage.local.set(
　　{'test': hoge},
　　function(){
　　　console.log("saved");
　　}
);

chrome.storage.local.get('test', function(obj){
　　console.log(obj['test']);
　}
);
*/

//udp sending / receiving
/*
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
*/

//get IP addresses
/*
chrome.system.network.getNetworkInterfaces(function(ipinfo){
    for(var i in ipinfo){
        console.log(ipinfo[i].name + " " + ipinfo[i].address);
    }
});
*/