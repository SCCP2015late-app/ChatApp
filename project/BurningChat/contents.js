(function(){
  var modeChange;
  var modes;
  var app_mode;

  // BurningChatのModule
  var app = angular.module('burning', ['ngAnimate', 'ngDialog', 'luegg.directives'], function($provide) {
    $provide.decorator('$window', function($delegate) {
      $delegate.history = null;
      return $delegate;
    });
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
        console.log('scope.you === null');
        return;
      }

      $scope.toolsOpened = !$scope.toolsOpened;
      console.log("click: " + $scope.toolsOpened);
    };

    $scope.shouldShowGroupExitButton = function() {
      return app_mode == modes.MESSAGE;
    };

    $scope.onClickGroupExitButton = function() {
      console.log('onClickGroupExitButton(' + $scope.group.name + ');');
      Env().onExitGroupListener.callAllCallback($scope.group);
      getGroupList();
      modeChange(modes.TOP);
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

    Env().onAddMemberListener.addCallback(function(){
    });

//user_name is changed on setting panel, except the case that name is blank
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
//end----------------------------------------

//user_email is changed on setting panel, except the case that email is blank
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
//end----------------------------------------

//replace you by new_you
Env().onUpdateRegistrationItemListener.addCallback(function(new_you){
    console.log("renewed : " + new_you.regItem.name + " " + new_you.regItem.email);
    you = new_you;
});
//end----------------------------------------

  // 右側の画面のController
  app.controller('MainAreaController', function($scope, ngDialog) {
    // モード（グループ選択、メッセージリスト）
    $scope.MODES = {MESSAGE: 'message', TOP: 'top', USER: 'user', LOAD_GROUP: 'load_group'};

    modeChange = function(mode) {
      $scope.mode = mode;
      app_mode = mode;
    };

    modes = $scope.MODES;

    // 起動時のモード
    modeChange(modes.USER);

    // 表示するグループのリスト
    $scope.groups = [];

    Env().onGetGroupListListener.addCallback(function(groups){
      $scope.$apply(function(){
        $scope.groups = groups;
      });
    });

    Env().onGroupUpdateListener.addCallback(function(updatedGroup) {
        if($scope.mode != modes.MESSAGE){
            modeChange(modes.MESSAGE);
        }
    });

    $scope.you = null;

    var getYou = function(){ return $scope.you; };

    // ユーザのロードができれば（既に情報があれば）モード切り替え
    Env().onLoadUserListener.addCallback(function(user) {

      $scope.you = user;
      if(app_mode === modes.USER) {
        modeChange(modes.TOP);
      }
    });

    // グループ選択時のリスナー
    $scope.onClick = function(selectedGroup) {
      ngDialog.open({template: 'groupDetailDialog',controller: ['$scope', function($scope) {
        $scope.group = selectedGroup;
        $scope.you = getYou();
        $scope.onJoinGroup = function(group, you) {
          console.log("Join: " + group.name + "@" + group.id);
          console.log(group);
          Env().onJoinGroupListener.callAllCallback({'group': group, 'member': you});
//close Group Dialog
          ngDialog.close($scope.groupDetailDialog);
        };
      }]});
    };

    $scope.newGroupName = '';

    $scope.onCreateNewGroup = function(groupName) {
      if(groupName.length < 1) {
        console.log('Rejected: The length of new group is 0.');
        return;
      }

      console.log('onCreateNewGroup: ' + groupName);
      $scope.you = getYou();
      newGroup = new ChatGroup(0, groupName, $scope.you, [], []);
      Env().onCreateNewGroupListener.callAllCallback(newGroup);
      modeChange(modes.MESSAGE);
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
        $scope.group = $scope.group;
      }]});
    });

    // メッセージが内部で追加された時にタイムラインを更新
    Env().onUpdateMessageListener.addCallback(function(message) {
        console.log("ALL: internal message_list updated");
        $scope.$apply(function(){
          $scope.group.addMessage(message);
        });
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
    $scope.imageBinaryString = '';
    $scope.buttonStyle = {};
    
    Env().onAddImageListener.addCallback(function(imageBinaryString) {
      $scope.imageBinaryString = imageBinaryString;
    });

    // 仮で送信時にタイムラインを更新
    /*
    Env().onUpdateMessageListener.addCallback(function(message) {
      console.log("Send message: " + message.body + " from " + message.member.regItem.name);
    });
    */

    // 送信ボタンのクリックリスナーをそのまま環境のメッセージ送信リスナーに設定
    $scope.onSend = function() {
      // 本文がからなら送信しない
      if($scope.messageBody === '') {
        return;
      }

      var image = null;
      
      if($scope.imageBinaryString !== '') {
        image = "data:image/*;base64," + base64encode($scope.imageBinaryString);
      }
      
      $scope.imageBinaryString = '';
  
      // メッセージを生成してコールバックを呼ぶ
      var message = new Message(0, $scope.you, "" + new Date(), $scope.messageBody, image, image !== null);
      console.log("ALL: New message was created: " + $scope.messageBody);
      Env().onSendMessageListener.callAllCallback(message);
      
      // image
      //Env().onUpdateMessageListener.callAllCallback(message);

      // 送信したメッセージはフォームから削除
      $scope.messageBody = '';
      $scope.buttonStyle = {};
    };

    // 画像追加ボタンのリスナー
    $scope.addImage = function() {
      console.log("addImage");
      var accepts = [{
        mimeTypes: ['image/*']
      }];
      chrome.fileSystem.chooseEntry({type: 'openFile', accepts: accepts}, function(theEntry) {
        if (!theEntry) {
          output.textContent = 'No file selected.';
          return;
        }
        // use local storage to retain access to this file
        console.log(theEntry);
        theEntry.file(function(file){
          var reader = new FileReader();
          
          reader.onloadend = function(e){
            var binary = reader.result;
            
            $scope.imageBinaryString = binary;
            $scope.$apply(function() {
              $scope.buttonStyle = {
               'background-image': 'url(data:image/*;base64,' + base64encode($scope.imageBinaryString) + ')',
                'background-size': 'cover'
              };
            });
            
          };
          
          reader.readAsBinaryString(file);
        }, function(e){
          console.log(e);
        });
      });
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

      console.log("Registration: " + regitem);
      getGroupList();
      activateJoinRequestReceiver();
      Env().onSetRegistrationItemListener.callAllCallback(regitem);
      modeChange(modes.TOP);
    };

    $scope.logIn = function(){
       getGroupList();
       activateJoinRequestReceiver();
       Env().onLoadUserListener.callAllCallback(you);
       console.log("ALL: Successfully logged in as: " + $scope.you.regItem.name);
    };

  });
})();
