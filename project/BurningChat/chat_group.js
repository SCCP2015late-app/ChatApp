"use strict";

/* チャットグループ
  id: String - グループのID
  name: String - グループ名
  owner: Owner - オーナーユーザー
  memberArray: Member[] - 参加しているメンバーの配列
*/
class ChatGroup {
  constructor(id, name, owner, memberArray) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.memberArray = memberArray;
  }
  
  // getter
  getName() { return this.name; }
  getMemberArray() { return this.memberArray; }
}

/* ユーザの登録情報
  name: String - ユーザ名
  email: String - Eメールアドレス
*/
class RegistrationItem {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  // getter
  getName() { return this.name; }
  getEmail() { return this.email; }
}

/* 全ユーザのベースクラス
  id: String - ユーザID
  regItem: RegistrationItem - 登録情報
*/
class BaseUser {
  constructor(id, regItem) {
    this.id = id;
    this.regItem = regItem;
  }
  
  static equals(userA, userB) {
    return userA.getId() == userB.getId();
  }
  
  // getter
  getId() { return this.id; }
  getRegItem() { return this.regItem; }
}

/* グループ参加者
  id: String - ユーザID
  regItem: RegistrationItem - 登録情報
*/
class Member extends BaseUser {
  constructor(id, regItem) {
    super(id, regItem);
  }
  
  isOwner() { return false; }
}

/* グループのオーナー
  id: String - ユーザID
  regItem: RegistrationItem - 登録情報
*/
class Owner extends Member {
  constructor(id, regItem) {
    super(id, regItem);
  }
  
  isOwner() { return true; }
}

/* チャットメッセージ
  id: String - メッセージID
  user: Participant - 送信者
  date: Date - 送信日時
  body: String - 本文
  image: Image - 添付画像
  flag: Boolean - 既読フラグ
*/
class Message {
  constructor(id, user, date, body, image, flag) {
    this.id = id;
    this.user = user;
    this.date = date;
    this.image = image;
    this.body = body;
    this.flag = flag;
  }
  
  // getter
  getId() { return this.id; }
  getUser() { return this.user; }
  getDate() { return this.date; }
  getBody() { return this.body; }
  getImage() { return this.image; }
  getFlag() { return this.flag; }
}
