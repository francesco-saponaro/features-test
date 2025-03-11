import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { CastButton, useRemoteMediaClient } from "react-native-google-cast";
import * as FileSystem from "expo-file-system";
import { Picker } from "@react-native-picker/picker";
import { useVideoPlayer, VideoView } from "expo-video";

const VIDEO_URLS = {
  low: "https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4",
  medium: "https://www.youtube.com/watch?v=HbfWU7_o4cU", // Fake example
  high: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4", // Fake example
};

const FILE_NAME = "BigBuckBunny.mp4";
const FILE_PATH = `${FileSystem.documentDirectory}${FILE_NAME}`;

export default function HomeScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [selectedResolution, setSelectedResolution] =
    useState<keyof typeof VIDEO_URLS>("low");
  const [isDownloading, setIsDownloading] = useState(false);
  console.log(selectedResolution, "selectedResolution");
  console.log(videoUri, "videoUri");

  // Chromecast connection - Automatically loads media when connected
  const client = useRemoteMediaClient();
  if (client) {
    client.loadMedia({
      mediaInfo: {
        contentUrl: VIDEO_URLS[selectedResolution],
        contentType: "video/mp4",
      },
      // startTime: 10, // seconds
    });
  }

  // Check if the video is already downloaded
  useEffect(() => {
    const checkFile = async () => {
      const fileInfo = await FileSystem.getInfoAsync(FILE_PATH);
      if (fileInfo.exists) {
        setVideoUri(FILE_PATH);
      } else {
        setVideoUri(VIDEO_URLS[selectedResolution]);
      }
    };
    checkFile();
  }, [selectedResolution]);

  // Function to download video to file system
  const downloadVideo = async () => {
    try {
      setIsDownloading(true);
      const { uri } = await FileSystem.downloadAsync(
        VIDEO_URLS[selectedResolution],
        FILE_PATH
      );
      setVideoUri(uri);
      Alert.alert("Download Complete", "You can now watch offline!");
    } catch (error) {
      Alert.alert("Download Failed", "Please try again.");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Changes video resolution
  const changeResolution = (resolution: keyof typeof VIDEO_URLS) => {
    setSelectedResolution(resolution);
    setVideoUri(VIDEO_URLS[resolution]);
  };

  // Video player instance
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.staysActiveInBackground = true;
    player.timeUpdateEventInterval = 1; // 1 second
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chromecast Streaming</Text>

      <CastButton
        style={{ width: 24, height: 24, tintColor: "black", marginBottom: 20 }}
      />

      {videoUri ? (
        <View>
          <VideoView
            player={player}
            style={{
              width: Dimensions.get("window").width,
              height: (Dimensions.get("window").width * 9) / 16,
            }}
            allowsFullscreen
            allowsPictureInPicture
            startsPictureInPictureAutomatically
          />
          {/* Overlay Cast Button */}
          {/* <View style={{ position: "absolute", top: 10, right: 10 }}>
            <CastButton style={{ width: 24, height: 24, tintColor: "black" }} />
          </View> */}
        </View>
      ) : null}

      <View>
        <Picker
          selectedValue={selectedResolution}
          onValueChange={(itemValue) => changeResolution(itemValue)}
          style={[styles.picker, { backgroundColor: "rgba(255,255,255,0.8)" }]}
        >
          <Picker.Item label="Low" value="low" />
          <Picker.Item label="Medium" value="medium" />
          <Picker.Item label="High" value="high" />
        </Picker>
      </View>

      {/* Download Button */}
      {!videoUri?.includes("file://") && (
        <TouchableOpacity
          style={styles.button}
          onPress={downloadVideo}
          disabled={isDownloading}
        >
          <Text style={styles.buttonText}>
            {isDownloading ? "Downloading..." : "Download Video"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  video: {
    width: "90%",
    height: 250,
    backgroundColor: "black",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
});
