package expo.modules.pip

import android.app.PictureInPictureParams
import android.os.Build
import android.util.Rational
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoPipModule : Module() {
  override fun definition() = ModuleDefinition {

    Name("ExpoPip")

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
