package expo.modules.pip

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class ExpoPipActionReceiver: BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        val action = intent?.action ?: return

        ExpoPipEventBus.dispatch(action)
    }
}