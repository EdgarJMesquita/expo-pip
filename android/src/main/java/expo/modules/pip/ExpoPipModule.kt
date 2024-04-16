package expo.modules.pip

import android.app.PictureInPictureParams
import android.os.Build
import android.util.Rational
import androidx.annotation.RequiresApi
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoPipModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  @RequiresApi(Build.VERSION_CODES.N)
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoPip')` in JavaScript.
    Name("ExpoPip")


    // Defines event names that the module can send to JavaScript.
    // Events("onPictureInPictureModeChanged")


    // activity.addOnPictureInPictureModeChangedListener(
            //         observer
            // )
    Function("isInPipMode"){
      if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
        return@Function appContext.currentActivity?.isInPictureInPictureMode
      } else {
        return@Function false
      }
    }

    Function("setAutoEnterEnabled"){ isAutomatic:Boolean ->
      val pictureInPictureParamsBuilder = PictureInPictureParams.Builder()
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        pictureInPictureParamsBuilder.setAutoEnterEnabled(isAutomatic)
        appContext.currentActivity?.setPictureInPictureParams(pictureInPictureParamsBuilder.build())
      }
    }

    Function("enterPipMode") { width:Int?, height:Int? ->
      if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
        val ratWidth = width ?: 200
        val ratHeight = height ?: 300

        val ratio = Rational(ratWidth, ratHeight)

        val pictureInPictureParamsBuilder = PictureInPictureParams.Builder()

        pictureInPictureParamsBuilder.setAspectRatio(ratio).build()


        appContext.currentActivity?.enterPictureInPictureMode(pictureInPictureParamsBuilder.build())

      }
    }
  }
}
