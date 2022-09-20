import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import RtcEngine from 'react-native-agora';
import RtmEngine from 'agora-react-native-rtm';
import { REACT_APP_APP_ID } from '@env';

import { PermissionUtils } from './src/utils/permission';
import { Calls } from './src/components/calls/components';
import { Rooms } from './src/components/rooms/component';

const App = () => {
  const [isMounted, setIsMounted] = useState(false);

  const [channelName, setChannelName] = useState('');

  const [inCall, setInCall] = useState(false);

  const [inLobby, setInLobby] = useState(false);

  const [rooms, setRooms] = useState<Record<string, string | number>>({});

  const [roomInput, setRoomInput] = useState('');

  const [seniors, setSeniors] = useState<string[]>([]);

  const [peerIds, setPeerIds] = useState<number[]>([]);

  const rtcEngine = useRef<RtcEngine>();

  const rtmEngine = useRef<RtmEngine>();

  const username = `${new Date().getTime()}`;

  async function joinCall(channelId: string) {
    setChannelName(channelId);

    const members = await rtmEngine.current
      ?.getMembers(channelId)
      .catch(e => console.log(e));

    if (members && members?.length >= 4) return Alert.alert('The channel ');

    await rtcEngine.current?.joinChannel(undefined, channelId, null, 0);

    await rtmEngine.current?.joinChannel(channelId).catch(e => console.log(e));

    if (members?.length === 1) {
      await rtmEngine.current
        ?.sendMessage(
          'lobby',
          {
            text: channelId + ':' + 1,
          },
          {},
        )
        .catch(e => console.log(e));
    }

    setInLobby(false);

    setSeniors(members ? members.map(m => m.userId) : []);
  }

  async function endCall() {
    if (seniors.length < 2) {
      await rtmEngine.current
        ?.sendMessage(
          'lobby',
          {
            text: channelName + ':' + peerIds.length,
          },
          {},
        )
        .catch(e => console.log(e));
    }

    await rtcEngine.current?.leaveChannel();

    setPeerIds([]);

    setInCall(false);

    setInLobby(true);

    setSeniors([]);

    setChannelName('');

    setRoomInput('');
  }

  const initRTC = useCallback(
    async function () {
      rtcEngine.current = await RtcEngine.create(REACT_APP_APP_ID);

      await rtcEngine.current?.enableVideo();

      rtcEngine.current?.addListener('Error', err => {
        console.log('Error', err);
      });

      rtcEngine.current?.addListener('UserJoined', uid => {
        // Get current peer IDs
        // If new user
        if (peerIds.indexOf(uid) === -1) {
          if (inCall && seniors.length < 2) {
            rtmEngine.current?.sendMessage(
              'lobby',
              {
                text: channelName + ':' + (peerIds.length + 2),
              },
              {},
            );
          }

          setPeerIds(prevState => [...prevState, uid]);
        }
      });

      rtcEngine.current?.addListener('UserOffline', uid =>
        setPeerIds(prevState => prevState.filter(id => id !== uid)),
      );

      rtcEngine.current?.addListener(
        'JoinChannelSuccess',
        (channel, uid, elapsed) => {
          console.log('JoinChannelSuccess', channel, uid, elapsed);

          setInCall(true);
        },
      );
    },
    [channelName, inCall, peerIds, seniors.length],
  );

  const initRTM = useCallback(
    async function () {
      rtmEngine.current = new RtmEngine();

      rtmEngine.current?.on('error', evt => {
        console.log(evt);
      });

      rtmEngine.current?.on('channelMessageReceived', evt => {
        const { text } = evt;

        const data = text.split(':');

        setRooms(prevState => ({ ...prevState, [data[0]]: data[1] }));
      });

      rtmEngine.current?.on('messageReceived', evt => {
        const { text } = evt;

        const data = text.split(':');

        setRooms(prevState => ({ ...prevState, [data[0]]: data[1] }));
      });

      rtmEngine.current?.on('channelMemberJoined', evt => {
        const { channelId, uid } = evt;

        if (inCall && channelId === 'lobby' && seniors.length < 2) {
          rtmEngine.current
            ?.sendMessageToPeerV2(
              uid,
              {
                text: channelName + ':' + (peerIds.length + 1),
              },
              {},
            )
            .catch(e => console.log(e));
        }
      });

      rtmEngine.current?.on('channelMemberLeft', evt => {
        const { channelId, uid } = evt;

        if (channelName === channelId) {
          setSeniors(prevState => prevState.filter(id => id !== uid));

          setRooms(prevState => ({
            ...prevState,
            [channelName]: peerIds.length,
          }));

          if (inCall && seniors.length < 2) {
            rtmEngine.current
              ?.sendMessage(
                channelName,
                {
                  text: channelName + ':' + (peerIds.length + 1),
                },
                {},
              )
              .catch(e => console.log(e));
          }
        }
      });

      await rtmEngine.current
        ?.createInstance(REACT_APP_APP_ID)
        .catch(e => console.log(e));

      await rtmEngine.current?.loginV2(username).catch(e => console.log(e));

      await rtmEngine.current?.joinChannel('lobby').catch(e => console.log(e));

      setInLobby(true);
    },
    [channelName, inCall, peerIds.length, seniors.length, username],
  );

  useEffect(() => {
    PermissionUtils.requestCameraAndAudioPermission();
  }, []);

  useEffect(() => {
    if (isMounted) return;

    setIsMounted(true);

    initRTC();

    initRTM();
  }, [initRTC, initRTM, isMounted]);

  return (
    <SafeAreaView style={styles.STAppView}>
      <View style={styles.STSpacer}>
        <Text style={styles.STRoleText}>
          {inCall ? `You're in ${channelName}` : 'Join/Create a room'}
        </Text>
      </View>

      {inLobby ? (
        <Rooms
          rooms={rooms}
          roomInput={roomInput}
          joinCall={joinCall}
          onChangeRoomText={setRoomInput}
        />
      ) : inCall ? (
        <Calls channelName={channelName} peerIds={peerIds} endCall={endCall} />
      ) : (
        <Text style={styles.STWaitText}>Please wait, joining room...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  STAppView: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  STSpacer: {
    width: '100%',
    padding: '2%',
    marginBottom: 32,
    backgroundColor: '#38373A',
    color: '#fbfbfb',
  },
  STRoleText: {
    textAlign: 'center',
    color: '#fbfbfb',
    fontSize: 18,
  },
  STWaitText: {
    marginTop: 50,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default App;
