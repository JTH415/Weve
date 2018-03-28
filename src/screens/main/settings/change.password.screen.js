import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Button, Container, Content, FieldInput, Text } from '../../../components/common';
// import {changePassword} from '../Helpers/user'
import I18n from '../../../locales';
import { backgroundColor, lightTextColor } from '../../../theme';

class ChangePasswordScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // loading: false,
      values: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      errors: {
        currentPassword: {
          isError: false,
          error: '',
        },
        newPassword: {
          isError: false,
          error: '',
        },
        confirmPassword: {
          isError: false,
          error: '',
        },
      },
    };
  }

  onFieldChange = (key, value) => {
    this.setState({
      values: {
        ...this.state.values,
        [key]: value,
      },
      errors: {
        ...this.state.errors,
        [key]: (() => {
          switch (true) {
            case !value.length:
              return {
                isError: true,
                error: I18n.t('validations.required'),
              };
            case key === 'currentPassword' && value.length < 8:
              return {
                isError: true,
                error: I18n.t('validations.password_length'),
              };
            case key === 'newPassword' && value.length < 8:
              return {
                isError: true,
                error: I18n.t('validations.password_length'),
              };
            case key === 'confirmPassword' && this.state.values.newPassword !== value:
              return {
                isError: true,
                error: I18n.t('validations.password_mismatch'),
              };
            case key === 'newPassword' && this.state.values.currentPassword === value:
              return {
                isError: true,
                error: I18n.t('validations.password_matches_old'),
              };
            default:
              return {
                isError: false,
                error: '',
              };
          }
        })(),
      },
    });
  };

  onBlur(key, value) {
    if (!value.length) {
      this.setState({
        errors: {
          ...this.state.errors,
          [key]: {
            isError: true,
            error: I18n.t('validations.required'),
          },
        },
      });
    }
  }

  // onSubmitForm(values) {
  //   const { currentPassword, newPassword, confirmPassword } = values;
  //   this.setState({ loading: true });
  //   changePassword(currentPassword, newPassword, (result) => {
  //     this.setState({ loading: false });
  //     const { error } = result;
  //     if (error) {
  //       alert(error.message);
  //     } else {
  //       Alert.alert(
  //         I18n.t('changePassword.success'),
  //         I18n.t('changePassword.success_message'),
  //         [{ text: `${I18n.t('common.ok')}` }],
  //         { cancelable: false },
  //       );
  //       this.props.navigation.goBack();
  //     }
  //   });
  // }

  render() {
    // const {
    //   handleSubmit,
    //   pristine,
    //   submitting,
    //   currentPassword,
    //   newPassword,
    //   confirmPassword,
    // } = this.props;
    // const disabled =
    //   this.state.loading ||
    //   pristine ||
    //   submitting ||
    //   !currentPassword ||
    //   !newPassword ||
    //   !confirmPassword;
    return (
      <Container id="ChangePassword.container" style={{ backgroundColor }}>
        <Content id="ChangePassword.content" padder keyboardShouldPersistTaps="always">
          <FieldInput
            name="currentPassword"
            placeholder={I18n.t('changePassword.current_password')}
            secureTextEntry
            color={lightTextColor}
            id="ChangePassword.currentPasswordInput"
            onChangeText={text => this.onFieldChange('currentPassword', text)}
            onBlur={() => this.onBlur('currentPassword', this.state.values.currentPassword)}
            isError={this.state.errors.currentPassword.isError}
            error={this.state.errors.currentPassword.error}
          />
          <FieldInput
            name="newPassword"
            placeholder={I18n.t('changePassword.new_password')}
            secureTextEntry
            color={lightTextColor}
            id="ChangePassword.newPasswordInput"
            onChangeText={text => this.onFieldChange('newPassword', text)}
            onBlur={() => this.onBlur('newPassword', this.state.values.newPassword)}
            isError={this.state.errors.newPassword.isError}
            error={this.state.errors.newPassword.error}
          />
          <FieldInput
            name="confirmPassword"
            placeholder={I18n.t('changePassword.confirm_password')}
            secureTextEntry
            color={lightTextColor}
            id="ChangePassword.confirmPasswordInput"
            onChangeText={text => this.onFieldChange('confirmPassword', text)}
            onBlur={() => this.onBlur('confirmPassword', this.state.values.newPassword)}
            isError={this.state.errors.confirmPassword.isError}
            error={this.state.errors.confirmPassword.error}
          />
          <Button
            id="ChangePassword.submitButton"
            style={{ marginTop: 10 }}
            block
            success
            // disabled={disabled}
            // onPress={handleSubmit(this.onSubmitForm.bind(this))}
            loading={this.state.loading}
          >
            {I18n.t('common.save')}
          </Button>
        </Content>
      </Container>
    );
  }
}

export default ChangePasswordScreen;
