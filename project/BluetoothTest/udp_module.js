var app = angular.module('message', [], function($provide) {
      $provide.decorator('$window', function($delegate) {
      $delegate.history = null;
    return $delegate;
  });
});

var string_to_buffer = function(src) {
  return (new Uint16Array([].map.call(src, function(c) {
    return c.charCodeAt(0);
  }))).buffer;
};

var buffer_to_string = function(buf) {
  return String.fromCharCode.apply("", new Uint16Array(buf));
};

app.controller('UdpConnectionController', function($scope) {
  
  $scope.onSend = function() {
    console.log('POPOPOPOPO');
    
    if($scope.newMessage == null) {
      console.log('newMessage is null.');
      $scope.newMessage = "";
    }
    
    console.log('Send: ' + $scope.newMessage);
    
    var bind_address = '127.0.0.1';
    var bind_port = 22222;
    var server_address = '127.0.0.1';
    var server_port = 33333;
    var data = string_to_buffer($scope.newMessage);
    chrome.sockets.udp.create({}, function(createInfo) {
      chrome.sockets.udp.bind(createInfo.socketId, bind_address, bind_port, function(result){
        chrome.sockets.udp.send(createInfo.socketId, data, server_address, server_port, function(sendInfo) {
          console.log('poe: ' + sendInfo.resultCode);
          chrome.sockets.udp.close(createInfo.socketId, function(){});
        });
      });
    });
  };
  
  $scope.messageRepo = {};
  var size = 0;
  
  var receiveCallback = function(info){
    $scope.messageRepo[size] = {socketId: info.socketId, data: buffer_to_string(info.data)};
    size = size + 1;
    console.log(info.socketId + " : " + buffer_to_string(info.data));
  };

  $scope.interfaces = {};

  var networkInterfacesCallback = function(interfaces) {
    $scope.interfaces = interfaces;
  };
  
  chrome.sockets.udp.onReceive.addListener(receiveCallback);
  
  chrome.system.network.getNetworkInterfaces(networkInterfacesCallback);
});

