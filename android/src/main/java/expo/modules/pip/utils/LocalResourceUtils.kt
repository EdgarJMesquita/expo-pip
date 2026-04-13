package expo.modules.pip.utils

import android.content.Context


const val ACTION_ICON_PREFIX = "expo_pip_action_icon"

fun getResIdByIconName(context: Context, iconName: String): Int? {
    var resId: Int

    val packageName = context.packageName

    val baseResourceName = filenameToBasename(iconName)

    val resourceNameWithPluginPrefix = "${ACTION_ICON_PREFIX}_${baseResourceName}"

    resId = context.resources.getIdentifier(
        resourceNameWithPluginPrefix,
        "drawable",
        packageName
    )

    if(resId == 0){
        resId = context.resources.getIdentifier(
            baseResourceName,
            "drawable",
            packageName
        )
    }

//    if(resId == 0){
//        return null
//    }

    return resId
}

private fun filenameToBasename(filename: String): String {
    if (!filename.contains(".")) {
        return filename
    }

    return filename.substring(0, filename.lastIndexOf('.'))
}