package org.sccp2015.burningchat

import scala.scalajs.js
import scala.scalajs.js.annotation.JSExport

@JSExport("Env")
object AppEnvironment {

  @JSExport
  val USER_COLORS = js.Array(
    "#f44336", // RED
    "#2196F3", // BLUE
    "#4CAF50", // GREEN
    "#FF9800", // ORANGE
    "#3F51B5"  // INDIGO
  )

  @JSExport
  val onClickMessageListener = new EventListener

  @JSExport
  val onSendMessageListener = new EventListener

  @JSExport
  val onUpdateMessageListener = new EventListener

  @JSExport
  val onSetRegistrationItemListener = new EventListener

  @JSExport
  val onAddImageListener = new EventListener
}
