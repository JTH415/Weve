import React, { Component } from 'react';
import { Platform, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import I18n from '../../locales';

class ChatView extends Component {
  onSend(messages = []) {
    const { authUser, room } = this.props;
    const recipient = authUser.isProvider ? room.user._id : room.provider._id;

    const messageBody = {
      sender: authUser._id,
      recipient,
      body: messages[0].text,
    };

    this.props.onMessageSend(messageBody);
  }

  getInputOptions = () => {
    const { authUser, room } = this.props;
    const recipient = authUser.isProvider ? room.user._id : room.provider._id;

    let options = {};

    if (authUser.blockedUsers.includes(recipient)) {
      return {
        editable: false,
        placeholder: 'To send message unblock user'
      };
    }
  }

  transformMessages = (messages) => {
    const { room, authUser } = this.props;
    const transformedMessages = messages.map(({ _id, sender, body, createdAt }) => {
      let senderUser;

      if (authUser._id === sender) {
        senderUser = authUser;
      } else {
        senderUser = authUser.isProvider ? room.user : room.provider;
      }

      return {
        _id,
        text: body,
        createdAt,
        user: {
          _id: senderUser._id,
          name: `${senderUser.firstName} ${senderUser.lastName || ''}`,
          avatar: senderUser.profileImageURL,
        },
      };
    });

    return transformedMessages.reverse();
  }

  render() {
    const { _id, firstName, profileImageURL } = this.props.authUser;
    const textMessageInputProps = this.getInputOptions();
    return (
      <GiftedChat
        textInputProps={textMessageInputProps}
        messages={this.transformMessages(this.props.messages)}
        bottomOffset={Platform.OS === 'ios' ? 48.5 : 0}
        placeholder={I18n.t('chat.type_a_message')}
        onSend={messages => this.onSend(messages)}
        user={{ _id, name: firstName, avatar: profileImageURL }}
      />
    );
  }
}

export default ChatView;
