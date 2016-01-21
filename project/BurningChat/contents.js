(function(){
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

    $scope.group = null; // group
    Env().onGroupUpdateListener.addCallback(function(updatedGroup) {
      $scope.group = updatedGroup;
    });

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

  });

  var modeChange;
  var modes;

  // 右側の画面のController
  app.controller('MainAreaController', function($scope, ngDialog) {
    // モード（グループ選択、メッセージリスト）
    $scope.MODES = {GROUP: 'group', MESSAGE: 'message', TOP: 'top', USER: 'user', LOAD_GROUP: 'load_group'};

    // 起動時のモード
    $scope.mode = $scope.MODES.USER;
    
    modes = $scope.MODES;

    modeChange = function(mode) {
      $scope.mode = mode;
    };

    // 表示するグループのリスト
    $scope.groups = [];

    Env().onGetGroupListListener.addCallback(function(groups){
      $scope.groups = groups;
    });

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
    $scope.group = null;
    Env().onGroupUpdateListener.addCallback(function(updatedGroup) {
      $scope.group = updatedGroup;
    });

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
    $scope.group = null;
    Env().onGroupUpdateListener.addCallback(function(updatedGroup) {
      $scope.group = updatedGroup;
    });

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
//初期登録画面フォームのcontoroller
  app.controller('NewUserController',function($scope, ngDialog) {
    //group
    $scope.reg_name = "";
    $scope.reg_email = "";

    $scope.Reg_fill = false;

    //本文
    $scope.FillorNotFill = function(name, email){
      console.log("Fillfill");
      if(name.length !== 0 && email.length !== 0)
        $scope.Reg_fill = true;
      else $scope.Reg_fill = false;
    };
//コールバック
    $scope.click_Reg_Icon = function(name, email){
      var regitem = new RegistrationItem(name, email);
  
      Env().onSetRegistrationItemListener.callAllCallback(regitem);
      
      modeChange(modes.TOP);
    };
  });
})();
