import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

class ChatView extends Component {
  state = {
    messages: [],
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        bottomOffset={48.5}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

export default ChatView;
