package org.sccp2015.burningchat

import scala.scalajs.js
import scala.scalajs.js.annotation.{JSExportAll, JSExport}

@JSExport("EventListener")
class EventListener[T] {

  @JSExport
  var callbackArray: Array[js.Function1[js.Any, js.Any]] = new Array[js.Function1[js.Any, js.Any]](0)

  @JSExport
  def addCallback(callback: js.Function1[js.Any, js.Any]): Unit = {
    this.callbackArray = this.callbackArray :+ callback
  }

  @JSExport
  def callAllCallback(obj: js.Any): Unit = {
    for(callback <- this.callbackArray) {
      callback(obj)
    }
  }
}

@JSExport("OnClickMessageListener")
class OnClickMessageListener extends EventListener[Message]

@JSExport("OnClickSendingButtonListener")
class OnClickSendingButtonListener extends EventListener[Message]
