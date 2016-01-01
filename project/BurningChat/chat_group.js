"use strict";
class ChatGroup {
  constructor(id, name, owner, memberArray) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.memberArray = memberArray;
  }
  
  getName() {
    return this.name;
  }
  
  getMemberArray() {
    return this.memberArray;
  }
}

class RegistrationItem {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  getName() {
    return this.name;
  }
  
  getEmail() {
    return this.email;
  }
}

class BaseUser {
  constructor(id, regItem) {
    this.id = id;
    this.regItem = regItem;
  }
  
  static equals(userA, userB) {
    return userA.getId() == userB.getId();
  }
  
  getId() {
    return this.id;
  }
  
  getRegItem() {
    return this.regItem;
  }
}

class Participant extends BaseUser {
  constructor(id, regItem) {
    super(id, regItem);
  }
  
  isOwner() {
    return false;
  }
}

class Owner extends Participant {
  constructor(id, regItem) {
    super(id, regItem);
  }
  
  isOwner() {
    return true;
  }
}

class Message {
  constructor(id, user, date, body, image, flag) {
    this.id = id;
    this.user = user;
    this.date = date;
    this.image = image;
    this.body = body;
    this.flag = flag;
  }
  
  getId() {
    return this.id;
  }
  
  getUser() {
    return this.user;
  }
  
  getDate() {
    return this.date;
  }
  
  getBody() {
    return this.body;
  }
  
  getImage() {
    return this.image;
  }
  
  getFlag() {
    return this.flag;
  }
}
