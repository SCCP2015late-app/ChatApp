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
}

class RegistrationItem {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class BaseUser {
  constructor(id, regItem) {
    this.id = id;
    this.regItem = regItem;
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
