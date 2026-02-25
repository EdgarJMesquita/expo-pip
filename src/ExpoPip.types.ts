export type PipModeChangeEvent = {
  isInPipMode: boolean;
};

export type PipActionPressedEvent = {
  action: string;
};

export type ExpoPipModuleEvents = {
  onPipModeChange: (event: PipModeChangeEvent) => void;
  onPipActionPressed: (event: PipActionPressedEvent) => void;
};

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

  /**
   * Defines the actions available in the PiP window, such as play/pause buttons.
   * The system may limit the number of actions shown based on device capabilities.
   */
  actions?: PipAction[];
};

export type PipAction = {
  /**
   * The name of the icon to display for this action. This should correspond to a valid app resources.
   */
  iconName: string;
  /**
   * The unique identifier for this action, which will be sent back in the `onPipActionPressed` event when the user presses it. This should be a string that can be used to identify the action in your event handler.
   */
  action: string;
  /**
   * An optional title for the action, which may be displayed by the system alongside the icon to provide more context about what the action does. This is especially useful for accessibility purposes, as it allows screen readers to describe the action to users with visual impairments.
   */
  title?: string;
  /**
   * An optional description for the action, which may be used by the system to provide additional context about the action's purpose. This can be helpful for accessibility and for providing more information to users about what the action does when they interact with it in the PiP window.
   */
  description?: string;
};
