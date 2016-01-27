package org.sccp2015.burningchat

import scala.annotation.meta.field
import scala.scalajs.js
import scala.scalajs.js.annotation.JSExport

@JSExport("ChatGroup")
case class ChatGroup(@(JSExport @field) id: Int, @(JSExport @field) name: String, @(JSExport @field) owner: Member,
                     @(JSExport @field) var memberArray: js.Array[Member],  @(JSExport @field) var messageArray: js.Array[Message]) {

  @JSExport
  def addMessage(message: Message): Unit = {
    messageArray = messageArray :+ message
  }

  @JSExport
  def addMember(member: Member): Unit = {
    memberArray = memberArray :+ member
  }

  @JSExport
  def removeMember(member: Member): Unit = {
    memberArray = memberArray.filter(_.equals(member))
  }
}

@JSExport("RegistrationItem")
case class RegistrationItem(@(JSExport @field) name: String, @(JSExport @field) email: String)

@JSExport("Member")
case class Member(@(JSExport @field) id: String, @(JSExport @field) number: Int, @(JSExport @field) regItem: RegistrationItem) {

  @JSExport
  val userColor: String = AppEnvironment.USER_COLORS(number % AppEnvironment.USER_COLORS.length)

  @JSExport
  def equals(member: Member): Boolean = this.id == member.id
}

@JSExport("Message")
case class Message(@(JSExport @field) id: Int, @(JSExport @field) member: Member, @(JSExport @field) date: String,
                   @(JSExport @field) body: String, @(JSExport @field) image: String, @(JSExport @field) flag: Boolean)