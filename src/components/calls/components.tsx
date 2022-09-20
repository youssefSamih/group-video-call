import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  RtcRemoteView,
  RtcLocalView,
  VideoRenderMode,
} from 'react-native-agora';

type Props = {
  channelName: string;
  peerIds: number[];

  endCall: () => Promise<void>;
};

export const Calls: React.FC<Props> = ({ channelName, peerIds, endCall }) => {
  return (
    <View style={styles.STCalls}>
      <ScrollView>
        <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
          <RtcLocalView.SurfaceView
            style={styles.STCallVideo}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
          />

          <RtcLocalView.SurfaceView
            style={styles.STCallVideo}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
          />

          {peerIds.map((key, idx) => {
            return (
              <RtcRemoteView.SurfaceView
                channelId={channelName}
                renderMode={VideoRenderMode.Hidden}
                key={idx}
                uid={key}
                style={styles.STCallVideo}
              />
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity onPress={endCall} style={styles.STButtonLeaveRoom}>
        <Text style={styles.STButtonTextLeaveRoom}>Leave Room</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  STCalls: {
    flex: 1,
    alignContent: 'center',
    marginHorizontal: 24,
  },
  STCallVideo: {
    width: Dimensions.get('screen').width / 2.4,
    height: 190,
    margin: 3,
  },
  STButtonLeaveRoom: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#38373A',
    marginBottom: 16,
  },
  STButtonTextLeaveRoom: {
    color: '#fff',
    textAlign: 'center',
  },
});
