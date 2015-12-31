"use strict";
class ChatGroup {
  constructor(id, name, memberArray) {
    this.id = id;
    this.name = name;
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
  
  getId() {
    return this.id;
  }
  
  getRegItem() {
    return this.regItem;
  }
}

class Participant extends BaseUser {
  constructor(id, regItem, group) {
    super(id, regItem);
    this.group = group;
  }
}

class Owner extends Participant {
  constructor(id, regItem, group) {
    super(id, regItem, group);
  }
}
