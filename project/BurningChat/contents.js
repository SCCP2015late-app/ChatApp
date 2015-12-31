"use strict";
// Code for Debug[START]
let GROUP_NAME = "mogemoge group";
let GROUP_ID = 1919;

let NAME_00 = "owner";
let NAME_01 = "poe";
let NAME_02 = "maguro";
let NAME_03 = "fupiyon";

let EMAIL_00 = "";
let EMAIL_01 = "";
let EMAIL_02 = "";
let EMAIL_03 = "";

let PROP_00 = new RegistrationItem(NAME_00, EMAIL_00);
let PROP_01 = new RegistrationItem(NAME_01, EMAIL_01);
let PROP_02 = new RegistrationItem(NAME_02, EMAIL_02);
let PROP_03 = new RegistrationItem(NAME_03, EMAIL_03);

let MEMBERS = [
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
  $scope.group = new ChatGroup(GROUP_ID, GROUP_NAME, MEMBERS);
});
