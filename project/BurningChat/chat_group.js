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
