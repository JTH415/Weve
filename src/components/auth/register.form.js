/* eslint-disable global-require, max-len */
import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { CheckBox, Left, Icon, Picker } from 'native-base';
import { Alert, ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import CountryPicker from 'react-native-country-picker-modal';
import { contrastColor, primaryFont } from '../../theme';
import { Button, Container, FieldInput, Text } from '../../components/common';
import SignupImageForm from './signupImage.form';
import Eula from './EULA';
import countries from '../../countryLib/countries';
import countryLib from '../../countryLib';

import APIs from '../../api';

const { Item } = Picker;

const { AuthApi, CategoryApi } = APIs;
const categoryApi = new CategoryApi();
const api = new AuthApi();

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.onRegionSelect = this.onRegionSelect.bind(this);
    const userLocaleCountryCode = DeviceInfo.getDeviceCountry();
    const countryCode = countries.includes(userLocaleCountryCode) ? userLocaleCountryCode : 'GB';
    const regionName = countryLib[`${countryCode}`].provinces[0];
    this.state = {
      step: 1,
      values: {
        fullName: '',
        password: '',
        confirmPassword: '',
        category: null,
        image: null,
        countryCode,
        regionName,
      },
      errors: {
        fullName: {
          isError: false,
          error: '',
        },
        password: {
          isError: false,
          error: '',
        },
        confirmPassword: {
          isError: false,
          error: '',
        },
      },
      categories: [],
      loading: false,
      isProvider: false,
      isModalVisible: false,
    };
  }

  async componentWillMount() {
    try {
      const categories = await categoryApi.fetchCategoriesList();
      this.setState({
        categories,
        values: {
          ...this.state.values,
          category: categories[0], // Predefine 'Venue category'
        },
      });
    } catch ({ message }) {
      alert(message);
    }
    const url = 'http://api.ipstack.com/check?access_key=e1a9033da20c96cf61c52598eb00cfb9&format=1';
    await fetch(url)
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          values: {
            ...this.state.values,
            countryCode: countries.includes(responseJson.country_code)
              ? responseJson.country_code
              : countries.includes(DeviceInfo.getDeviceCountry())
                ? DeviceInfo.getDeviceCountry()
                : 'GB',
            regionName: responseJson.region_name,
            // regionName: countryLib[`${this.state.values.countryCode}`].provinces.find(item => (item.substr(0, 2) === responseJson.region_name.substr(0, 2) ? item : null)),
          },
        });
      });
    this.setState({
      values: {
        ...this.state.values,
        regionName: countryLib[`${this.state.values.countryCode}`].provinces.find(item =>
          (item.substr(0, 2) === this.state.values.regionName.substr(0, 2)
            ? item
            : null)),
      },
    });
  }

  onCheckboxPress = () => {
    this.setState({
      isProvider: !this.state.isProvider,
    });
  };

  onContinuePress = () => {
    this.setState({
      step: 2,
    });
  };

  onCategorySelect = (category) => {
    this.setState({
      values: {
        ...this.state.values,
        category,
      },
    });
  };

  onRegionSelect(region) {
    this.setState({
      values: {
        ...this.state.values,
        regionName: region,
      },
    });
  }

  onImageSelect = (image) => {
    this.setState({
      values: {
        ...this.state.values,
        image,
      },
    });
  };

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
            case key === 'password' && value.length < 8:
              return {
                isError: true,
                error: I18n.t('validations.password_length'),
              };
            case key === 'confirmPassword' && this.state.values.password !== value:
              return {
                isError: true,
                error: I18n.t('validations.password_mismatch'),
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

  handleSubmit = async () => {
    this.setState({
      loading: false,
      isModalVisible: !this.state.isModalVisible,
    });
  };

  handleDecline = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
    setTimeout(() => {
      Alert.alert(`${I18n.t('eula.error')}`, `${I18n.t('eula.error_message')}`, [
        { text: `${I18n.t('common.ok')}` },
      ]);
    }, 800);
  };

  localiseCategory = name => I18n.t(`categories.${name}`);

  handleAccept = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    const { password, fullName, countryCode, regionName } = this.state.values;
    const arrFN = fullName.split(' ').map(a => a.charAt(0).toUpperCase() + a.substr(1));
    const capitalFullName = arrFN.join(' ');

    if (this.state.isProvider) {
      const { image, category } = this.state.values;
      this.props.onProviderFormSubmit(password, capitalFullName, image, category, countryCode, regionName);
    } else {
      this.props.onFormSubmit(password, capitalFullName, countryCode, regionName);
    }
  };

  renderSignUp = () => {
    const { password, confirmPassword } = this.state.values;
    const disabled =
      this.props.isLoading ||
      this.state.loading ||
      !password ||
      !confirmPassword ||
      (this.state.step === 2 && !this.state.values.image);

    const ucFirst = s => (s.substr(0, 1).toLowerCase() + s.substr(1)).replace(' ', '');

    return (
      <ScrollView id="SignUp.content" contentContainerStyle={{ justifyContent: 'space-between' }}>
        <View id="Signup.backButtonAndTitleWrapper" style={styles.header}>
          <Button
            id="Signup.backButton"
            style={{ flex: 1 }}
            transparent
            onPress={this.props.onBackPress}
          >
            <Icon style={{ color: 'white', fontSize: 40 }} name="ios-arrow-back" />
          </Button>
          <Text
            id="Signup.titleText"
            style={{ color: contrastColor, fontSize: 25, flex: 1.6, ...primaryFont }}
          >
            {I18n.t('logIn.sign_up')}
          </Text>
        </View>

        <View
          id="Signup.formWrapper"
          style={{ flex: 3, justifyContent: 'flex-start', marginTop: 30 }}
        >
          <View style={styles.formWrapper}>
            {this.state.step === 1 && (
              <View>
                <FieldInput
                  name="fullName"
                  color={contrastColor}
                  placeholder={I18n.t('common.fullName')}
                  errorColor={contrastColor}
                  onChangeText={text => this.onFieldChange('fullName', text)}
                  onBlur={() => this.onBlur('fullName', this.state.values.fullName)}
                  id="SignUp.fullNameInput"
                  autoCapitalize="words"
                  isError={this.state.errors.fullName.isError}
                  error={this.state.errors.fullName.error}
                />
                <FieldInput
                  color={contrastColor}
                  name="password"
                  placeholder={I18n.t('common.password')}
                  errorColor={contrastColor}
                  secureTextEntry
                  onChangeText={text => this.onFieldChange('password', text)}
                  onBlur={() => this.onBlur('password', this.state.values.password)}
                  id="SignUp.passwordInput"
                  isError={this.state.errors.password.isError}
                  error={this.state.errors.password.error}
                />
                <FieldInput
                  color={contrastColor}
                  name="confirmPassword"
                  placeholder={I18n.t('logIn.confirm_password')}
                  errorColor={contrastColor}
                  secureTextEntry
                  onChangeText={text => this.onFieldChange('confirmPassword', text)}
                  onBlur={() => this.onBlur('confirmPassword', this.state.values.confirmPassword)}
                  id="SignUp.confirmPasswordInput"
                  isError={this.state.errors.confirmPassword.isError}
                  error={this.state.errors.confirmPassword.error}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    marginTop: 10,
                    marginBottom: 30,
                    alignItems: 'center',
                    borderColor: 'white',
                    borderBottomWidth: 1,
                  }}
                >
                  <Text style={{ flex: 3, color: 'white' }}>{`${I18n.t('editProfile.country')} / ${I18n.t('editProfile.region')}`}</Text>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <CountryPicker
                      onChange={(value) => {
                        this.setState({
                          values: {
                            ...this.state.values,
                          countryCode: value.cca2,
                          },
                        });
                      }}
                      cca2={this.state.values.countryCode}
                      excludeCountries={['AD', 'AQ', 'BV', 'VG', 'CW', 'XK', 'ME', 'PS', 'BL', 'MF', 'RS', 'SX', 'TC', 'UM', 'VI', 'VA', 'AX']}
                      translation={I18n.t('editProfile.countryLang')}
                      closeable
                    />
                  </View>
                  <Picker
                    mode="dropdown"
                    style={{ color: 'white', flex: 3, alignItems: 'flex-end' }}
                    placeholder={I18n.t('logIn.select_category')}
                    selectedValue={this.state.values.regionName}
                    onValueChange={this.onRegionSelect}
                    placeholderTextColor="white"
                    placeholderStyle={{ color: 'white' }}
                    textStyle={{ color: 'white' }}
                  >
                    {countryLib[`${this.state.values.countryCode}`].provinces.map(item =>
                      <Picker.Item label={item} value={item} key={item} />)}
                  </Picker>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <CheckBox
                    checked={this.state.isProvider}
                    onPress={this.onCheckboxPress}
                    color="#f3c200"
                  />
                  <Left>
                    <Text style={styles.checkBoxText}>{I18n.t('logIn.advertiser')}</Text>
                  </Left>
                </View>
              </View>
            )}

            {this.state.isProvider &&
              this.state.step === 1 && (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.categoryText}>{I18n.t('common.category')}</Text>
                  <Picker
                    mode="dropdown"
                    style={{ color: 'white', flex: 1 }}
                    placeholder={I18n.t('logIn.select_category')}
                    selectedValue={this.state.values.category}
                    onValueChange={this.onCategorySelect}
                    placeholderTextColor="white"
                    placeholderStyle={{ color: 'white' }}
                    textStyle={{ color: 'white' }}
                  >
                    {this.state.categories.map(item => (
                      <Item
                        key={item._id}
                        label={this.localiseCategory(ucFirst(item.name))}
                        value={item}
                      />
                    ))}
                  </Picker>
                </View>
              )}

            {this.state.isProvider &&
              this.state.step === 1 && (
                <View style={{ alignItems: 'center', borderTopColor: 'white', borderTopWidth: 1 }}>
                  <Text note style={{ color: 'white', margin: 10, marginBottom: 0 }}>
                    {I18n.t('logIn.account_activation')}
                  </Text>
                </View>
              )}

            {this.state.isProvider &&
              this.state.step === 2 && <SignupImageForm key="imf" onImageSelect={this.onImageSelect} />}
            
            <Button
              id="Signup.submitButton"
              block
              style={styles.registerButton}
              onPress={
                this.state.isProvider && this.state.step === 1
                  ? this.onContinuePress
                  : this.handleSubmit
              }
              spinner={this.props.isLoading || this.state.loading}
              disabled={disabled}
            >
              <Text style={styles.registerButtonText}>
                {this.state.isProvider && this.state.step === 1
                  ? I18n.t('common.continue')
                  : I18n.t('logIn.sign_up')}
              </Text>
            </Button>

            <Eula
              isModalVisible={this.state.isModalVisible}
              handleDecline={this.handleDecline}
              handleAccept={this.handleAccept}
              id="Signup.EULA"
            />
          </View>
        </View>
      </ScrollView>
    );
  };

  render() {
    return (
      <Container id="SignUp.container" style={{ backgroundColor: 'red' }}>
        <ImageBackground
          id="SignUp.bg-image"
          resizeMode="cover"
          style={styles.background}
          source={require('../../images/loginBackground.png')}
        >
          {this.renderSignUp()}
        </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: null,
    width: null,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    top: 20,
    flexDirection: 'row',
  },
  registerButton: {
    marginTop: 10,
    backgroundColor: '#f3c200',
  },
  registerButtonText: {
    color: 'red',
  },
  checkBoxText: {
    color: 'white',
    marginLeft: 20,
  },
  categoryText: {
    color: 'white',
    marginTop: 15,
    marginRight: 100,
  },
  formWrapper: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'column',
  },
});

export default SignupForm;