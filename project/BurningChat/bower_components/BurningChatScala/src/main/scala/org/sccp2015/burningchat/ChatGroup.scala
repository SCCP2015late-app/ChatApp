package org.sccp2015.burningchat

import scala.annotation.meta.field
import scala.scalajs.js
import scala.scalajs.js.annotation.JSExport

@JSExport("ChatGroup")
case class ChatGroup(@(JSExport @field) id: Int, @(JSExport @field) name: String, @(JSExport @field) owner: Owner,
                     @(JSExport @field) var memberArray: js.Array[Member],  @(JSExport @field) var messageArray: js.Array[Message]) {

  @JSExport
  def addMessage(message: Message): Unit = {
    messageArray = messageArray :+ message
  }
}

@JSExport("RegistrationItem")
case class RegistrationItem(@(JSExport @field) name: String, @(JSExport @field) email: String)

@JSExport("BaseUser")
class BaseUser(@(JSExport @field) id: Int, @(JSExport @field) regItem: RegistrationItem) {
  @JSExport
  val userColor: String = AppEnvironment.USER_COLORS(id % AppEnvironment.USER_COLORS.length)

  @JSExport
  def equals(baseUser: BaseUser): Boolean = this.id == baseUser.id
}

@JSExport("Member")
class Member(@(JSExport @field) member_id: Int, @(JSExport @field) member_regItem: RegistrationItem)
  extends BaseUser(member_id, member_regItem)

@JSExport("Owner")
class Owner(@(JSExport @field) owner_id: Int, @(JSExport @field) owner_regItem: RegistrationItem)
  extends Member(owner_id, owner_regItem)

@JSExport("Message")
case class Message(@(JSExport @field) id: Int, @(JSExport @field) member: Member, @(JSExport @field) date: String,
                   @(JSExport @field) body: String, @(JSExport @field) image: String, @(JSExport @field) flag: Boolean)