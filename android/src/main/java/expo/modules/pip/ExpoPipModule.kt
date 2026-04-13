package expo.modules.pip

import android.annotation.SuppressLint
import android.app.PendingIntent
import android.app.PictureInPictureParams
import android.app.RemoteAction
import android.content.Intent
import android.graphics.Rect
import android.graphics.drawable.Icon
import android.os.Build
import android.util.Rational
import androidx.core.os.bundleOf
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.pip.fragments.PictureInPictureHelperFragment
import expo.modules.pip.fragments.PictureInPictureHelperListener
import expo.modules.pip.records.ActionRecord
import expo.modules.pip.records.ParamsRecord

const val moduleName = "ExpoPip"

class ExpoPipModule : Module(), PictureInPictureHelperListener {
    override fun definition() = ModuleDefinition {

        Name(moduleName)

        Events("onPipModeChange", "onPipActionPressed")

        Function<Boolean>("isInPipMode", this@ExpoPipModule::isInPipMode)

        Function("setPictureInPictureParams", this@ExpoPipModule::setPictureInPictureParams)

        Function("enterPipMode", this@ExpoPipModule::enterPipMode)

        Function(
            "getMaxNumPictureInPictureActions",
            this@ExpoPipModule::getMaxNumPictureInPictureActions
        )

        OnCreate(this@ExpoPipModule::onCreate)

        OnDestroy(this@ExpoPipModule::onDestroy)
    }

    private fun buildActions(actions: List<ActionRecord>): List<RemoteAction> {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return emptyList()
        }

        val remoteActions = mutableListOf<RemoteAction>()

        actions.forEach { action ->
            if (!action.iconName.isNullOrEmpty() && !action.action.isNullOrEmpty()) {
                val iconNameWithPrefix = "${ACTION_ICON_PREFIX}_${action.iconName}"
                getIconFromResourceByName(iconNameWithPrefix)?.let { icon ->
                    val remoteAction = RemoteAction(
                        icon,
                        action.title,
                        action.description,
                        createPipActionIntent(action.action!!)
                    )
                    remoteActions.add(remoteAction)
                }
            }
        }

        return remoteActions
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

            if (options.actions.isNotEmpty()) {
                pictureInPictureParamsBuilder.setActions(buildActions(options.actions))
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
                val rect = Rect(it.left, it.top, it.right, it.bottom)
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

    private fun getMaxNumPictureInPictureActions(): Int? {
        var maxNumPictureInPictureActions: Int? = null
        appContext.currentActivity?.let { activity ->
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                maxNumPictureInPictureActions = activity.maxNumPictureInPictureActions
            }
        }

        return maxNumPictureInPictureActions
    }

    private fun createPipActionIntent(actionName: String): PendingIntent {
        val intent = Intent(appContext.reactContext, ExpoPipActionReceiver::class.java).apply {
            action = actionName
        }
        val pendingIntent = PendingIntent.getBroadcast(
            appContext.reactContext,
            actionName.hashCode(),
            intent,
            PendingIntent.FLAG_IMMUTABLE
        )

        return pendingIntent
    }

    @SuppressLint("DiscouragedApi")
    private fun getIconFromResourceByName(resourceName: String): Icon? {
        var icon: Icon? = null

        appContext.reactContext?.let { context ->
            val resId = context.resources.getIdentifier(
                resourceName,
                "drawable",
                context.packageName
            )

            icon = Icon.createWithResource(context, resId)
        }

        return icon
    }

    private fun onCreate() {
        ExpoPipEventBus.module = this

        attachFragment()
    }

    private fun onDestroy() {
        ExpoPipEventBus.module = null

        detachFragment()
    }

    override fun onPictureInPictureModeChange(isInPictureInPictureMode: Boolean) {
        this@ExpoPipModule.sendEvent(
            "onPipModeChange",
            bundleOf("isInPipMode" to isInPictureInPictureMode)
        )
    }

    fun sendPipActionEvent(action: String) {
        this@ExpoPipModule.sendEvent(
            "onPipActionPressed",
            bundleOf("action" to action)
        )
    }

    fun attachFragment(){
        (appContext.currentActivity as? FragmentActivity)?.let { activity ->
            val fragment = PictureInPictureHelperFragment()
            fragment.setListener(this)
            activity.supportFragmentManager
                .beginTransaction()
                .add(fragment, PictureInPictureHelperFragment.id)
                .commit()
        }
    }

    fun detachFragment(){
        (appContext.currentActivity as? FragmentActivity)?.let { activity ->
            val fragment = activity.supportFragmentManager
                .findFragmentByTag(PictureInPictureHelperFragment.id)

            fragment?.let { fragment ->
                activity.supportFragmentManager
                    .beginTransaction()
                    .remove(fragment)
                    .commitAllowingStateLoss()
            }
        }
    }

    companion object {
        private const val ACTION_ICON_PREFIX = "expo_pip_action_icon"
    }
}