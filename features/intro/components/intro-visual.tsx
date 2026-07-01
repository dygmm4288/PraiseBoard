import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import type { VideoViewProps } from "expo-video";

const INTRO_VIDEO = require("../../../assets/videos/intro.mp4");

type Props = {
  currentIndex: number;
};

type ExpoVideoModule = {
  VideoView: React.ComponentType<VideoViewProps>;
  useVideoPlayer: typeof import("expo-video").useVideoPlayer;
};

const getExpoVideoModule = (): ExpoVideoModule | null => {
  try {
    return require("expo-video") as ExpoVideoModule;
  } catch {
    return null;
  }
};

const IntroVideo = ({ video }: { video: ExpoVideoModule }) => {
  const player = video.useVideoPlayer(INTRO_VIDEO, (player) => {
    player.loop = true;
    player.muted = true;
  });
  const VideoView = video.VideoView;

  useEffect(() => {
    player.play();
  }, [player]);

  return (
    <VideoView
      player={player}
      nativeControls={false}
      contentFit="cover"
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      style={StyleSheet.absoluteFill}
    />
  );
};

const IntroVisual = (_props: Props) => {
  const video = getExpoVideoModule();

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      {video ? <IntroVideo video={video} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#000000",
  },
});

export default IntroVisual;
