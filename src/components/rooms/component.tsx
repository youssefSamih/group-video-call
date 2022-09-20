import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type Props = {
  rooms: Record<string, string | number>;
  roomInput: string;

  joinCall: (channelName: string) => Promise<void>;
  onChangeRoomText: (text: string) => void;
};

export const Rooms: React.FC<Props> = ({
  rooms,
  roomInput,
  joinCall,
  onChangeRoomText,
}) => {
  return (
    <View style={styles.STRooms}>
      <Text style={styles.STRoomsHeading}>Room List</Text>

      <ScrollView>
        {Object.keys(rooms).map((name, idx) => {
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => joinCall(name)}
              style={styles.STRoomsBtn}>
              <Text>
                <Text style={styles.STRoomHead}>{name}</Text>

                <Text style={styles.STusersCountText}>
                  {' (' + rooms[name] + ' users)'}
                </Text>
              </Text>
            </TouchableOpacity>
          );
        })}

        <Text>
          {Object.keys(rooms).length === 0
            ? 'No active rooms, please create new room'
            : undefined}
        </Text>
      </ScrollView>

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={Platform.select({ ios: 150, android: 0 })}>
        <TextInput
          value={roomInput}
          onChangeText={onChangeRoomText}
          style={styles.STRoomInput}
          placeholder="Enter Room Name"
        />

        <TouchableOpacity
          onPress={async () => {
            roomInput ? await joinCall(roomInput) : null;
          }}
          style={styles.STButtonSubmitRoom}>
          <Text style={styles.STButtonSubmitRoomText}>Create Room</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  STRooms: {
    flex: 1,
    alignContent: 'center',
    marginHorizontal: 24,
  },
  STRoomsHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  STRoomsBtn: {
    padding: 8,
    marginBottom: 4,
    backgroundColor: '#38373A',
  },
  STRoomHead: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  STusersCountText: {
    color: '#fff',
  },
  STRoomInput: {
    height: 40,
    borderColor: '#38373A',
    borderWidth: 1.5,
    width: '100%',
    alignSelf: 'center',
    padding: 10,
    marginBottom: 10,
    color: '#000',
  },
  STButtonSubmitRoom: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#38373A',
    marginBottom: 16,
  },
  STButtonSubmitRoomText: {
    color: '#fff',
    textAlign: 'center',
  },
});
