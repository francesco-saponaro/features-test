declare module "react-native-video-controls" {
  import { Component } from "react";
  import { VideoProperties } from "react-native-video";

  export interface VideoPlayerProps extends VideoProperties {
    controlTimeout?: number;
    toggleResizeModeOnFullscreen?: boolean;
    disableBack?: boolean;
    disableVolume?: boolean;
    onEnterFullscreen?: () => void;
    onExitFullscreen?: () => void;
    customControls?: JSX.Element;
  }

  export default class VideoPlayer extends Component<VideoPlayerProps> {}
}
