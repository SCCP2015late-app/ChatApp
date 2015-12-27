// // Angular Module

// var G_NONE_DEVICE = {address: "None", name: "None"};

// var gBluetoothDevices = {};

// var gSelectedDevice = G_NONE_DEVICE;

var app = angular.module('index', [], function($provide) {
      $provide.decorator('$window', function($delegate) {
      $delegate.history = null;
    return $delegate;
  });
});

// app.controller('HelloController', function($scope) {
//   $scope.greets = [
//     {message: "hellordvhbjnknjbhvgcfdx"},
//     {message: "heytgvhbjnkmlkjhgvf"}
//   ];
  
//   addGreet = function() {
//     var len = $scope.greets.length;
//     $scope.greets[len] = {message: "hello"};
//   };
  
//   $scope.onClick = function() {
//     $scope.greets[0].message = "ぺやんぐ";
//     addGreet();
//   };
  
// });

// app.controller('BluetoothSelectController', function($scope) {  

//   // initialize.
//   $scope.selectedDevice = gSelectedDevice;

//   // 既知のBluetoothデバイスのリストを更新する。
//   updateDevices = function() {
//     $scope.devices = gBluetoothDevices;
//     console.log("BluetoothSelectController: updateDevices");
//   };

//   // 接続するBluetoothデバイスを選択する
//   selectDevice = function(address) {
//     $scope.selectedDevice = gBluetoothDevices[address];
//     gSelectedDevice = $scope.selectedDevice;
//     console.log($scope.selectedDevice.name);
//   };
  
//   $scope.updateScannedDevices = function() {
//     updateDevices();
//     console.log("BluetoothSelectController: updateScannedDevices");
//   };

//   $scope.onSelectDevice = function(address) {
//     console.log("BluetoothSelectController: onSelectDevice");
//     selectDevice(address);
//   };
// });

// app.controller('BluetoothConnectionController', function($scope) {
//   $scope.targetDevice = gSelectedDevice;

//   $scope.send = function() {
//     // Bluetooth socket...
//     var uuid = '180D';

//     var onConnectedCallback = function() {
//       if(chrome.runtime.lastError) {
//         console.log("Connection failed: " + chrome.runtime.lastError.message);
//       } else {
//         console.log("Connection succeed!");
//       }
//     };

//     chrome.bluetoothSocket.create(function(createInfo) {
//       chrome.bluetoothSocket.connect(createInfo.socketId, $scope.targetDevice.address, uuid, onConnectedCallback);
//     });
//   };

// });

var string_to_buffer = function(src) {
  return (new Uint8Array([].map.call(src, function(c) {
    return c.charCodeAt(0);
  }))).buffer;
};

app.controller('UdpConnectionController', function($scope) {
  $scope.onSend = function() {
    console.log('POPOPOPOPO');
    var bind_address = '127.0.0.1';
    var bind_port = 22222;
    var server_address = '127.0.0.1';
    var server_port = 33333;
    var data = string_to_buffer("hogehoge");
    chrome.sockets.udp.create({}, function(createInfo) {
      chrome.sockets.udp.bind(createInfo.socketId, bind_address, bind_port, function(result){
        chrome.sockets.udp.send(createInfo.socketId, data, server_address, server_port, function(sendInfo) {
          console.log('poe: ' + sendInfo.resultCode);
          chrome.sockets.udp.close(createInfo.socketId, function(){});
        });
      });
    });
  };
});

// var updateDeviceName = function(device) {
//   console.log("update device name: " + device.name);
//   gBluetoothDevices[device.address] = {address: device.address, name: device.name};
// };
// var removeDeviceName = function(device) {
//   console.log("delete device name: " + device.name);
//   delete gBluetoothDevices[device.address];
// };

// chrome.bluetooth.onDeviceAdded.addListener(updateDeviceName);
// chrome.bluetooth.onDeviceChanged.addListener(updateDeviceName);
// chrome.bluetooth.onDeviceRemoved.addListener(removeDeviceName);

// chrome.bluetooth.getDevices(function(devices) {
//   for (var i = 0; i < devices.length; i++) {
//     updateDeviceName(devices[i]);
//   }
// });

// // Now begin the discovery process.
// chrome.bluetooth.startDiscovery(function() {
//   console.log("start discovery.");
//   // Stop discovery after 30 seconds.
//   setTimeout(function() {
//     chrome.bluetooth.stopDiscovery(function() {
//       console.log("stop discovery.");
//     });
//   }, 30000);
// });

