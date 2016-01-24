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
//end----------------------------------------

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
//end----------------------------------------

//get IP addresses
/*
chrome.system.network.getNetworkInterfaces(function(ipinfo){
    for(var i in ipinfo){
        console.log(ipinfo[i].name + " " + ipinfo[i].address);
    }
});
*/
//end----------------------------------------

//object sending test
/*
chrome.sockets.udp.create({}, function(createInfo) {
    chrome.sockets.udp.onReceive.addListener(function(info){
        var g = JSON.parse(buffer_to_string(info.data));
        console.log(g);
    });
	chrome.sockets.udp.bind(createInfo.socketId, your_ip, msg_port, function(result){
		chrome.sockets.udp.send(createInfo.socketId, string_to_buffer(JSON.stringify(g1)), your_ip, msg_port, function(sendInfo) {
			console.log('sent done: ' + sendInfo.resultCode);
			chrome.sockets.udp.close(createInfo.socketId, function(){});
		});
	});
});
*/
//end----------------------------------------

//constants for test
const sample_message = "This is a test message.";
const u1 = new Member('id1', 0, new RegistrationItem('John', 'sample.com'));
const u2 = new Member('id2', 1, new RegistrationItem('Bob', 'sample.com'));
const u3 = new Member('id3', 2, new RegistrationItem('Michael', 'sample.com'));
const g1 = new ChatGroup(0, 'group1', u1, [u1, u2, u3], []);
const g2 = new ChatGroup(1, 'group2', u2, [u1, u2, u3], []);
const g3 = new ChatGroup(2, 'group3', u3, [u1, u2, u3], []);
var groups = [
    {
        'id': (new Date).getTime() % Math.round((Math.random()*1000)),
        'name': 'Dog',
        'owner': {
            id: 'owner_id1',
            name: 'John Doe',
            ip_addr: '192.168.11.4',
            email: 'hoge@gmail.com',
        },
        'member_num': 10,
    },
    {
        'id': (new Date).getTime() % Math.round((Math.random()*1000)),
        'name': 'Cat',
        'owner': {
            id: 'owner_id2',
            name: 'Michael Jackson',
            ip_addr: '127.0.0.1',
            email: 'hoge@gmail.com',
        },
        'member_num': 8,
    },
    {
        'id': (new Date).getTime() % Math.round((Math.random()*1000)),
        'name': 'Rabbit',
        'owner': {
            id: 'owner_id3',
            name: 'Владимир Путин',
            ip_addr: '127.0.0.1',
            email: 'hoge@gmail.com',
        },
        'member_num': 6,
    },
    {
        'id': (new Date).getTime() % Math.round((Math.random()*1000)),
        'name': 'Rabbit',
        'owner': {
            id: 'owner_id3',
            name: 'Владимир Путин',
            ip_addr: '127.0.0.1',
            email: 'hoge@gmail.com',
        },
        'member_num': 6,
    },
    {
        'id': (new Date).getTime() % Math.round((Math.random()*1000)),
        'name': 'Rabbit',
        'owner': {
            id: 'owner_id3',
            name: 'Владимир Путин',
            ip_addr: '127.0.0.1',
            email: 'hoge@gmail.com',
        },
        'member_num': 6,
    },
    {
        'id': (new Date).getTime() % Math.round((Math.random()*1000)),
        'name': 'Rabbit',
        'owner': {
            id: 'owner_id3',
            name: 'Владимир Путин',
            ip_addr: '127.0.0.1',
            email: 'hoge@gmail.com',
        },
        'member_num': 6,
    },
    {
        'id': (new Date).getTime() % Math.round((Math.random()*1000)),
        'name': 'Rabbit',
        'owner': {
            id: 'owner_id3',
            name: 'Владимир Путин',
            ip_addr: '127.0.0.1',
            email: 'hoge@gmail.com',
        },
        'member_num': 6,
    },
    {
        'id': (new Date).getTime() % Math.round((Math.random()*1000)),
        'name': 'Rabbit',
        'owner': {
            id: 'owner_id3',
            name: 'Владимир Путин',
            ip_addr: '127.0.0.1',
            email: 'hoge@gmail.com',
        },
        'member_num': 6,
    },
];
//end----------------------------------------