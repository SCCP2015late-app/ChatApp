package org.sccp2015.burningchat

import scala.scalajs.js.annotation.JSExport

abstract class EventListener[T] {
  type Callback = (T => Unit)

  var callbackArray: Array[Callback] = new Array[Callback](0)

  def addClickListener(callback: Callback): Unit = {
    this.callbackArray = this.callbackArray :+ callback
  }

  def callAllCallback(obj: T): Unit = {
    for(callback <- this.callbackArray) {
      callback(obj)
    }
  }
}

@JSExport("OnClickMessageListener")
class OnClickMessageListener extends EventListener[Message]

@JSExport("OnClickSendingButtonListener")
class OnClickSendingButtonListener extends EventListener[Message]
