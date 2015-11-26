enablePlugins(ScalaJSPlugin)

skip in packageJSDependencies := false

name := "ScalaJs"

version := "1.0"

scalaVersion := "2.11.4"

libraryDependencies += "org.scala-js" %%% "scalajs-dom" % "0.8.0"

libraryDependencies += "be.doeraene" %%% "scalajs-jquery" % "0.8.0"

libraryDependencies += "com.greencatsoft" %%% "scalajs-angular" % "0.6"
resolvers += Resolver.sonatypeRepo("snapshots")