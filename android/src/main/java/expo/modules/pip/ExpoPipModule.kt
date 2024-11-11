package expo.modules.pip

import android.app.PictureInPictureParams
import android.graphics.Rect
import android.os.Build
import android.util.Log
import android.util.Rational
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

const val moduleName = "ExpoPip"

class ExpoPipModule : Module() {
    override fun definition() = ModuleDefinition {

        Name(moduleName)

        Events("onPictureInPictureModeChanged")

        Function<Boolean>("isInPipMode", this@ExpoPipModule::isInPipMode)

        Function("setPictureInPictureParams", this@ExpoPipModule::setPictureInPictureParams)

        Function("enterPipMode", this@ExpoPipModule::enterPipMode)

        OnActivityEntersForeground(this@ExpoPipModule::sendPictureInPictureModeChanged)

        OnActivityEntersBackground(this@ExpoPipModule::sendPictureInPictureModeChanged)
    }

    private fun buildPictureInPictureParams(options: ParamsRecord): PictureInPictureParams? {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val pictureInPictureParamsBuilder = PictureInPictureParams.Builder()

            options.width?.let { width ->
                options.height?.let { height ->
                    val ratio = Rational(width, height)
                    pictureInPictureParamsBuilder.setAspectRatio(ratio)
                }
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                options.title?.let(pictureInPictureParamsBuilder::setTitle)
                options.subtitle?.let(pictureInPictureParamsBuilder::setSubtitle)
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                options.seamlessResizeEnabled?.let(pictureInPictureParamsBuilder::setSeamlessResizeEnabled)
                options.autoEnterEnabled?.let(pictureInPictureParamsBuilder::setAutoEnterEnabled)
            }

            options.sourceRectHint?.let {
                val rect = Rect(it.left,it.top, it.right,it.bottom)
                Log.d("ExpoPip", rect.toString())
                pictureInPictureParamsBuilder.setSourceRectHint(rect)
            }

            return pictureInPictureParamsBuilder.build()
        }
        return null
    }

    private fun setPictureInPictureParams(options: ParamsRecord) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val pictureInPictureParamsBuilder = buildPictureInPictureParams(options)

            pictureInPictureParamsBuilder?.let {
                appContext.currentActivity?.setPictureInPictureParams(it)
            }
        }
    }

    private fun sendPictureInPictureModeChanged() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val isInPictureInPictureMode =
                appContext.currentActivity?.isInPictureInPictureMode ?: false
            this@ExpoPipModule.sendEvent(
                "onPictureInPictureModeChanged",
                bundleOf("isInPictureInPictureMode" to isInPictureInPictureMode)
            )
        }
    }

    private fun enterPipMode(options: ParamsRecord) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            val pictureInPictureParams = buildPictureInPictureParams(options)

            pictureInPictureParams?.let {
                appContext.currentActivity?.enterPictureInPictureMode(it)
            }

        }
    }

    private fun isInPipMode(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            appContext.currentActivity?.isInPictureInPictureMode == true
        } else {
            false
        }
    }
}