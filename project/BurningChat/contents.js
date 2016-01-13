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

  const OWNER = new Member(0, PROP_00);

  const MEMBER_01 = new Member(1, PROP_01);
  const MEMBER_02 = new Member(2, PROP_02);
  const MEMBER_03 = new Member(3, PROP_03);

  const MEMBERS = [
      OWNER,
      MEMBER_01,
      MEMBER_02,
      MEMBER_03
    ];

  const YOU = new Member(2, new RegistrationItem("magro", "test@u-aizu.ac.jp"));

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

  // userがアプリの利用者自身かどうか
  var youOrNot = function(user) {

    if (YOU.equals(user)) {
      return "you";
    } else {
      return "other";
    }

  };

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

  // 仮のgroup
  var group = new ChatGroup(GROUP_ID, GROUP_NAME, OWNER, MEMBERS, MESSAGES);

  // 左側オレンジのグループ情報を表示するパネルのController
  app.controller('NavigationPanelController', function($scope, ngDialog) {
  
    $scope.you = YOU; // アプリ利用者
    $scope.youOrNot = youOrNot; // 判定関数
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

    $scope.click_ch_name = function(){
      var regitem = new RegistrationItem($scope.set_name, $scope.you.regItem.email);

      $scope.onToolNameClick();
      Env().onSetRegistrationItemListener.callAllCallback(regitem);
    };

    $scope.click_ch_email = function(){
      console.log("test");
      var regitem = new RegistrationItem($scope.you.regItem.name, $scope.set_email);

      $scope.onToolEmailClick();
      Env().onSetRegistrationItemListener.callAllCallback(regitem);
    };
  });

  // 右側の画面のController
  app.controller('MainAreaController', function($scope, ngDialog) {
    // モード（グループ選択、メッセージリスト）
    $scope.MODES = {GROUP: 'group', MESSAGE: 'message'};

    // 起動時のモード
    $scope.mode = $scope.MODES.MESSAGE;
    
    // 表示するグループのリスト
    $scope.groups = [group];

    // グループ選択時のリスナー
    $scope.onClick = function(selectedGroup) {
      ngDialog.open({template: 'groupDetailDialog',controller: ['$scope', function($scope) {
        $scope.group = selectedGroup;
      }]});
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
      var message = new Message(0, YOU, "" + new Date(), $scope.messageBody, null, false);
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
