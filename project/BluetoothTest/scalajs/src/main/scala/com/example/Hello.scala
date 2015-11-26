package com.example

import com.greencatsoft.angularjs.core.Scope
import com.greencatsoft.angularjs.{inject, Controller, Angular}

import scala.scalajs.js
import scala.scalajs.js.annotation.JSExport

object Hello extends JSExport {
  val module = Angular.module("app")

  val helloController = module.controller("HelloController")

  trait HelloScope extends Scope {
    var id: String = js.native
    var names: js.Array[String] = js.Array("hoge", "fuga", "maguro")

    var delete: js.Function = js.native
  }

  object HelloController extends Controller[HelloScope] {
    @inject
    override def scope: HelloScope = _

    def delete(): Unit ={

    }

    override def initialize(): Unit = {
      super.initialize()
      scope.delete = () => delete()
    }
  }

  @JSExport
  def main(args: Array[String]): Unit = {

    println("Hello, world!")
  }
}
