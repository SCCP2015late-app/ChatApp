package org.sccp2015.burningchat

import scala.scalajs.js
import scala.scalajs.js.annotation.{JSExportAll, JSExport}

@JSExport("ChatGroup")
case class ChatGroup(_id: Int, _name: String, _owner: Owner, _memberArray: js.Array[Member], _messageArray: js.Array[Message]) {
  @JSExport
  val id = _id

  @JSExport
  val name = _name

  @JSExport
  val owner = _owner

  @JSExport
  val memberArray = _memberArray

  @JSExport
  val messageArray = _messageArray
}

@JSExport("RegistrationItem")
case class RegistrationItem(_name: String, _email: String) {
  @JSExport
  val name = _name

  @JSExport
  val email = _email
}

@JSExport("BaseUser")
class BaseUser(_id: Int, _regItem: RegistrationItem) {
  @JSExport
  val id = _id

  @JSExport
  val regItem = _regItem

  @JSExport
  val userColor: String = AppEnvironment.USER_COLORS(id % AppEnvironment.USER_COLORS.length)

  @JSExport
  def equals(baseUser: BaseUser): Boolean = this.id == baseUser.id
}

@JSExport("Member")
class Member(_member_id: Int, _member_regItem: RegistrationItem) extends BaseUser(_member_id, _member_regItem) {
  @JSExport
  val member_id = _member_id

  @JSExport
  val member_regItem = _member_regItem
}

@JSExport("Owner")
class Owner(_owner_id: Int, _owner_regItem: RegistrationItem) extends Member(_owner_id, _owner_regItem) {
  @JSExport
  val owner_id = _owner_id

  @JSExport
  val owner_regItem = _owner_regItem
}

@JSExport("Message")
case class Message(_id: Int, _member: Member, _date: String, _body: String, _image: String, _flag: Boolean) {
  @JSExport
  val id = _id

  @JSExport
  val member = _member

  @JSExport
  val date = _date

  @JSExport
  val body = _body

  @JSExport
  val image = _image

  @JSExport
  val flag = _flag
}