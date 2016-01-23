package org.sccp2015.burningchat

import scala.scalajs.js
import scala.scalajs.js.annotation.JSExport

@JSExport("Env")
object AppEnvironment {

  @JSExport
  val USER_COLORS = js.Array(
    "#f44336", // RED
    "#8BC34A", // LIGHT_GREEN
    "#2196F3", // BLUE
    "#FF5722", // DEEP_ORANGE
    "#4CAF50", // GREEN
    "#607D8B", // BLUE_GRAY
    "#FF9800", // ORANGE
    "#3F51B5", // INDIGO
    "#CDDC39", // LIME
    "#795548", // BROWN
    "#E91E63", // PINK
    "#03A9F4", // LIGHT_BLUE
    "#00BCD4", // CYAN
    "#9C27B0", // PURPLE
    "#009688", // TEAL
    "#FFEB3B", // YELLOW
    "#673AB7", // DEEP_PURPLE
    "#FFC107", // AMBER
    "#9E9E9E"  // GRAY
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
  val onUpdateRegistrationItemListener = new EventListener

  @JSExport
  val onLoadUserListener = new EventListener

  @JSExport
  val onAddImageListener = new EventListener

  @JSExport
  val onCreateNewGroupListener = new EventListener

  @JSExport
  val onJoinGroupListener = new EventListener

  @JSExport
  val onGroupUpdateListener = new EventListener

  @JSExport
  val onGetGroupListListener = new EventListener

  @JSExport
  val onErrorOccurredListener = new EventListener
}
