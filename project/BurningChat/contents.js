(function(){
  
  // Code for Debug[START]
  const GROUP_NAME = "mogemoge group";
  const GROUP_ID = 1919;
  
  const NAME_00 = "owner";
  const NAME_01 = "poe";
  const NAME_02 = "maguro";
  const NAME_03 = "fupiyon";
  
  const EMAIL_00 = "";
  const EMAIL_01 = "";
  const EMAIL_02 = "";
  const EMAIL_03 = "";
  
  const PROP_00 = new RegistrationItem(NAME_00, EMAIL_00);
  const PROP_01 = new RegistrationItem(NAME_01, EMAIL_01);
  const PROP_02 = new RegistrationItem(NAME_02, EMAIL_02);
  const PROP_03 = new RegistrationItem(NAME_03, EMAIL_03);
  
  const OWNER = new Owner(0, PROP_00);
  const MEMBER_01 = new Member(1, PROP_01);
  const MEMBER_02 = new Member(2, PROP_02);
  const MEMBER_03 = new Member(3, PROP_03);
  
  const MEMBERS = [
      OWNER,
      MEMBER_01,
      MEMBER_02,
      MEMBER_03
    ];
    
  const YOU = new Member(2, new RegistrationItem("magro", ""));
  
  const MESSAGES = [
      new Message(0, OWNER, "", "purieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", null, false),
      new Message(1, MEMBER_01, "", "purieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", null, false),
      new Message(2, MEMBER_02, "", "purieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", null, false),
      new Message(3, OWNER, "", "purieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", null, false),
      new Message(4, MEMBER_03, "", "purieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", null, false),
      new Message(5, OWNER, "", "purieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", null, false),
      new Message(6, OWNER, "", "purieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", null, false),
      new Message(7, OWNER, "", "purieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", null, false),
      new Message(8, OWNER, "", "purieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", null, false)
    ];
  // Code for Debug[END]
  
  console.log("poepoe");
  
  var youOrNot = function(user) {
    
    if (YOU.equals(user)) {
      return "you";
    } else {
      return "other";
    }
    
  };
  
  var app = angular.module('burning', ['ngAnimate', 'ngDialog'], function($provide) {
    $provide.decorator('$window', function($delegate) {
      $delegate.history = null;
      return $delegate;
    });
  });
  
  var group = new ChatGroup(GROUP_ID, GROUP_NAME, OWNER, MEMBERS, MESSAGES);
  
  app.controller('NavigationPanelController', function($scope, ngDialog) {
    
    console.log(ngDialog);
    
    $scope.you = YOU;
    $scope.youOrNot = youOrNot;
    $scope.group = group;
    
    $scope.toolsOpened = false;
    
    $scope.onToolClick = function() {
      $scope.toolsOpened = !$scope.toolsOpened;
      console.log("click");
    };
  });
  
  app.controller('TimeLineController', function($scope, ngDialog) {
    
    $scope.group = group;
    
    $scope.toStyle = function(color) {
      return {'background-color': color};
    };
    
    Env().onClickMessageListener.addCallback(function(message) {
      console.log("hello");
      $scope.lastClickMessage = message;
      ngDialog.open({template: 'messageDetailDialog',controller: ['$scope', function($scope) {
        $scope.message = message;
        $scope.group = group;
      }]});
    });
    
    $scope.onClickMessageListener = Env().onClickMessageListener;
  });
  
})();
