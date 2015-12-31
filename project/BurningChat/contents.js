// Code for Debug[START]
var GROUP_NAME = "mogemoge group";

var NAME_00 = "owner";
var NAME_01 = "poe";
var NAME_02 = "maguro";
var NAME_03 = "fupiyon";

var EMAIL_00 = "";
var EMAIL_01 = "";
var EMAIL_02 = "";
var EMAIL_03 = "";

var PROP_00 = new RegistrationItem(NAME_00, EMAIL_00);
var PROP_01 = new RegistrationItem(NAME_01, EMAIL_01);
var PROP_02 = new RegistrationItem(NAME_02, EMAIL_02);
var PROP_03 = new RegistrationItem(NAME_03, EMAIL_03);

var members = [
    new Owner(0, PROP_00, GROUP_NAME),
    new Participant(1, PROP_01, GROUP_NAME),
    new Participant(2, PROP_02, GROUP_NAME),
    new Participant(3, PROP_03, GROUP_NAME)
  ];
// Code for Debug[END]

var app = angular.module('burning', [], function($provide) {
      $provide.decorator('$window', function($delegate) {
      $delegate.history = null;
    return $delegate;
  });
});

app.controller('NavigationPanelController', function($scope) {
  $scope.group = new ChatGroup(1919, "mogemoge group", members);
});
