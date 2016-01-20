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

  const OWNER = new Member("zero", 0, PROP_00);

  const MEMBER_01 = new Member("one", 1, PROP_01);
  const MEMBER_02 = new Member("two", 2, PROP_02);
  const MEMBER_03 = new Member("three", 3, PROP_03);

  const MEMBERS = [
      OWNER,
      MEMBER_01,
      MEMBER_02,
      MEMBER_03
    ];

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

  // BurningChatのModule
  var app = angular.module('burning', ['ngAnimate', 'ngDialog'], function($provide) {
    $provide.decorator('$window', function($delegate) {
      $delegate.history = null;
      return $delegate;
    });
  });

  // メッセージリストが更新されたときにスクロール位置を先頭に移動させない
  app.directive('keepScrollPosition', function() {
    return function(scope, el, attrs) {
      scope.$watch(
        function() { return el[0].clientHeight; },
        function(newHeight, oldHeight) {
          console.debug('Height was changed', oldHeight, newHeight);
          el[0].scrollTop = newHeight - oldHeight;
        });
    };

  });
  
  var empty_group = new ChatGroup(0, null, null, null, null);

  // 仮のgroup
  var group = new ChatGroup(GROUP_ID, GROUP_NAME, OWNER, MEMBERS, MESSAGES);
  
  Env().onGroupUpdateListener.addCallback(function(updatedGroup) {
    group = updatedGroup;
  });
  
  var group1 = new ChatGroup(1, GROUP_NAME, OWNER, MEMBERS, MESSAGES);
  var group2 = new ChatGroup(2, GROUP_NAME, OWNER, MEMBERS, MESSAGES);
  var group3 = new ChatGroup(3, GROUP_NAME, OWNER, MEMBERS, MESSAGES);
  var group4 = new ChatGroup(4, GROUP_NAME, OWNER, MEMBERS, MESSAGES);
  var group5 = new ChatGroup(5, GROUP_NAME, OWNER, MEMBERS, MESSAGES);
  var group6 = new ChatGroup(6, GROUP_NAME, OWNER, MEMBERS, MESSAGES);
  var group7 = new ChatGroup(7, GROUP_NAME, OWNER, MEMBERS, MESSAGES);
  var group8 = new ChatGroup(8, GROUP_NAME, OWNER, MEMBERS, MESSAGES);
  var group9 = new ChatGroup(9, GROUP_NAME, OWNER, MEMBERS, MESSAGES);
  var group10 = new ChatGroup(10, GROUP_NAME, OWNER, MEMBERS, MESSAGES);

  // 左側オレンジのグループ情報を表示するパネルのController
  app.controller('NavigationPanelController', function($scope, ngDialog) {
  
    $scope.you = null; // アプリ利用者
    Env().onLoadUserListener.addCallback(function(user) {
      $scope.you = user;
    });
    
    $scope.youOrNot = function(user){
      if($scope.you !== null && user.equals($scope.you)) {
        return 'you';
      } else {
        return 'other';
      }
    }; // 判定関数
    $scope.group = group; // group
    
    // ユーザ登録情報
    $scope.set_name = "";
    $scope.set_email = "";

    // 設定パネルが表示されているかどうかのフラグ
    $scope.toolsOpened = false;
    $scope.toolsNameOpened = false;
    $scope.toolsEmailOpened = false;

    // ツール開閉ボタンのクリック
    $scope.onToolClick = function() {
      if($scope.you === null) {
        return;
      }
      
      $scope.toolsOpened = !$scope.toolsOpened;
      console.log("click");
    };
//　クリック時、変更入力欄表示
    $scope.onToolNameClick = function(){
      $scope.toolsNameOpened = !$scope.toolsNameOpened;
      console.log("nameclick");
    };

    $scope.onToolEmailClick = function(){
      $scope.toolsEmailOpened = !$scope.toolsEmailOpened;
      console.log("emailclick");
    };

    $scope.click_ch_name = function(name){
      if($scope.you === null) {
        return;
      }
      
      var new_name = name;
      if(new_name === ''){ new_name = $scope.you.regItem.name; }
      var regitem = new RegistrationItem(new_name, $scope.you.regItem.email);

      $scope.onToolNameClick();
      Env().onSetRegistrationItemListener.callAllCallback(regitem);
    };

    $scope.click_ch_email = function(email){
      if($scope.you === null) {
        return;
      }
      
      var new_email = email;
      if(new_email === ''){ new_email = $scope.you.regItem.email; }
      var regitem = new RegistrationItem($scope.you.regItem.name, new_email);

      $scope.onToolEmailClick();
      Env().onSetRegistrationItemListener.callAllCallback(regitem);
    };
    
    Env().onSetRegistrationItemListener.addCallback(function(regitem){
      $scope.you = new Member($scope.you.id, $scope.you.number, regitem);
        
      console.log($scope.you.regItem);
    });
    
  });

  // 右側の画面のController
  app.controller('MainAreaController', function($scope, ngDialog) {
    // モード（グループ選択、メッセージリスト）
    $scope.MODES = {GROUP: 'group', MESSAGE: 'message', TOP: 'top', USER: 'user'};
    
    // 起動時のモード
    $scope.mode = $scope.MODES.USER;
    
    // 表示するグループのリスト
    $scope.groups = [group, group1, group2, group3, group4, group5, group6, group7, group8, group9, group10];

    $scope.you = null;
    
    // ユーザのロードができれば（既に情報があれば）モード切り替え
    Env().onLoadUserListener.addCallback(function(user) {
      $scope.you = user;
      $scope.mode = $scope.MODES.TOP;
    });
    
    // グループ選択時のリスナー
    $scope.onClick = function(selectedGroup) {
      ngDialog.open({template: 'groupDetailDialog',controller: ['$scope', function($scope) {
        $scope.group = selectedGroup;
        
        $scope.onJoinGroup = function(group) {
          console.log("Join: " + group.name + "@" + group.id);
          Env().onJoinGroupListener.callAllCallback({'group': group, 'member': $scope.you});
        };
      }]});
    };
    
    $scope.onCreateNewGroup = function(groupName) {
      console.log('onCreateNewGroup: ' + groupName);
      // TODO: generate group ID or replace after
      newGroup = new ChatGroup(1919, groupName, $scope.you, [], []);
      Env().onCreateNewGroupListener.callAllCallback(newGroup);
    };
  });

  // Messageモード時のタイムラインController
  app.controller('TimeLineController', function($scope, ngDialog) {

    // group
    $scope.group = group;

    // スタイル設定用のフォーマットにする
    $scope.toStyle = function(color) {
      return {'background-color': color};
    };

    // メッセージをクリックしたら詳細情報を表示
    Env().onClickMessageListener.addCallback(function(message) {
      $scope.lastClickMessage = message;
      ngDialog.open({template: 'messageDetailDialog',controller: ['$scope', function($scope) {
        $scope.message = message;
        $scope.group = group;
      }]});
    });

    // メッセージが内部で追加された時にタイムラインを更新
    Env().onUpdateMessageListener.addCallback(function(message) {
      $scope.group.addMessage(message);
    });

    // メッセージのクリックリスナーをそのまま環境のクリックリスナーに設定
    $scope.onClickMessageListener = Env().onClickMessageListener;
  });

  // 画面したのメッセージ入力フォームController
  app.controller('MentionForm', function($scope, ngDialog) {
    // group
    $scope.group = group;
    
    $scope.you = null;
    Env().onLoadUserListener.addCallback(function(user) {
      $scope.you = user;
    });

    // 本文
    $scope.messageBody = '';

    // 仮で送信時にタイムラインを更新
    Env().onSendMessageListener.addCallback(function(message) {
      $scope.group.addMessage(message);
      console.log("Send message: " + message.body + " from " + message.member.regItem.name);
    });

    // 送信ボタンのクリックリスナーをそのまま環境のメッセージ送信リスナーに設定
    $scope.onSend = function() {
      // 本文がからなら送信しない
      if($scope.messageBody === '') {
        return;
      }

      // メッセージを生成してコールバックを呼ぶ
      var message = new Message(0, $scope.you, "" + new Date(), $scope.messageBody, null, false);
      console.log(message);
      Env().onSendMessageListener.callAllCallback(message);
      
      // 送信したメッセージはフォームから削除
      $scope.messageBody = '';
    };

    // 画像追加ボタンのリスナー
    $scope.addImage = function() {
      console.log("addImage");
    };
  });
})();
