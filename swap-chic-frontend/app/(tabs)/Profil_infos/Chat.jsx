import React from "react";
import { StyleSheet, View } from "react-native";
import { GiftedChat, Composer } from "react-native-gifted-chat";
import FontAwesome from "@expo/vector-icons/FontAwesome";

class Chat extends React.Component {
  state = {
    messages: [
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
        },
      },
    ],
  };

  onSend = (newMessages = []) => {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, newMessages),
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
          renderInputToolbar={(props) => (
            <View style={styles.inputToolbar}>
              {/* Input Text */}
              <Composer {...props} textInputStyle={styles.textInput} />
              {/* Send Button */}
              <FontAwesome
                name="send"
                size={24}
                style={styles.sendIcon}
                onPress={() => props.onSend({ text: props.text }, true)}
              />
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Couleur bleu clair
  },
  inputToolbar: {
    flexDirection: "row", // Input et bouton sur une seule ligne
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#E8E8E8",
    padding: 10,
    backgroundColor: "#FFF", // Fond blanc de la barre
  },
  textInput: {
    flex: 1, // L'input occupe tout l'espace disponible
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 25, // Coins arrondis
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#FFF", // Fond blanc
  },
  sendIcon: {
    marginLeft: 10, // Espacement entre le champ texte et le bouton
    color: "#007AFF", // Couleur bleue pour l'icône
    backgroundColor: "#FFF", // Fond blanc derrière l'icône
    borderRadius: 20, // Icône arrondie
    padding: 5,
  },
});

export default Chat;
