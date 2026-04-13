package expo.modules.pip.fragments

import androidx.fragment.app.Fragment


class PictureInPictureHelperFragment: Fragment() {
    private var listener:PictureInPictureHelperListener? = null

    fun setListener(listener: PictureInPictureHelperListener){
        this.listener = listener
    }

    override fun onPictureInPictureModeChanged(isInPictureInPictureMode: Boolean) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode)
        listener?.onPictureInPictureModeChange(isInPictureInPictureMode)
    }

    companion object {
        val id = "${PictureInPictureHelperFragment::class.java.simpleName}"
    }
}

interface PictureInPictureHelperListener {
     fun onPictureInPictureModeChange(isInPictureInPictureMode: Boolean)
}