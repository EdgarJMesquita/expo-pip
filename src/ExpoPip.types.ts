export type SourceRectHint = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type PictureInPictureParams = {
  /**
   * Specifies the width for the PiP window.
   * Defines the aspect ratio together with `height`.
   * Remains fixed regardless of device rotation.
   */
  width?: number | null;

  /**
   * Specifies the height for the PiP window.
   * Defines the aspect ratio together with `width`.
   */
  height?: number | null;

  /**
   * Optional title for the PiP window, displayed by the system
   * to indicate the PiP content.
   */
  title?: string | null;

  /**
   * Optional subtitle for the PiP window, shown alongside the title
   * to give more details about the PiP content.
   */
  subtitle?: string | null;

  /**
   * Enables seamless resizing of the PiP window in PiP mode.
   * Suitable for video content. If set to `false`, transitions are used
   * to manage artifacts during resize. Defaults to `true`.
   */
  seamlessResizeEnabled?: boolean | null;

  /**
   * Allows the system to automatically enter PiP mode without
   * needing an explicit call to enter PiP.
   * Defaults to `false`.
   */
  autoEnterEnabled?: boolean | null;

  /**
   * Defines the window-coordinate bounds for an activity transitioning
   * to PiP. These coordinates (left, top, right, bottom) represent the
   * visible screen area in PiP mode. Matching the `width` and `height`
   * aspect ratio is recommended for smooth transitions.
   */
  sourceRectHint?: SourceRectHint;
};

/**
 * @deprecated use `PictureInPictureParams`
 */
export type AspectRatioProps = {
  width: number;
  height: number;
};
