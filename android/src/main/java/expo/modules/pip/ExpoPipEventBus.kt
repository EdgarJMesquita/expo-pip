package expo.modules.pip

object ExpoPipEventBus {
    var module: ExpoPipModule? = null

    fun dispatch(action:String){
        module?.sendPipActionEvent(action)
    }
}