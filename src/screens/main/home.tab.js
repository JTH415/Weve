import React, { Component } from 'react';
import { Image, FlatList, Platform, TouchableOpacity, Text, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Content } from 'native-base';

import I18n from '../../locales';
import images from '../../images';
import { primaryFont, backgroundColor } from '../../theme';

const categories = [
  {
    route: 'Venue',
    title: I18n.t('categories.venue'),
    imageSource: images.venue,
  },
  {
    route: 'Artist',
    title: I18n.t('categories.artist'),
    imageSource: images.artist,
  },
  {
    route: 'Photo',
    title: I18n.t('categories.photo'),
    imageSource: images.photo,
  },
  {
    route: 'Video',
    title: I18n.t('categories.video'),
    imageSource: images.video,
  },
  {
    route: 'Entertainment',
    title: I18n.t('categories.entertainment'),
    imageSource: images.ent,
  },
  {
    route: 'MakeUp',
    title: I18n.t('categories.makeup'),
    imageSource: images.make_up,
  },
  {
    route: 'Costume',
    title: I18n.t('categories.costume'),
    imageSource: images.costume,
  },
  {
    route: 'Decoration',
    title: I18n.t('categories.decoration'),
    imageSource: images.decoration,
  },
  {
    route: 'Cake',
    title: I18n.t('categories.cake'),
    imageSource: images.cake,
  },
];

const items = [];
for (let i = 0; i <= categories.length; i += 3) {
  items.push(categories.slice(i, i + 3));
}

const renderItem = ({ item }) => (
  <View
    style={{
      marginBottom: 10,
      flex: 1,
      flexDirection: 'row',
      justifyContent: item.length === 3 ? 'space-around' : 'flex-start',
    }}
  >
    {item.map(category => (
      <TouchableOpacity
        style={{ width: '33%', alignItems: 'center' }}
        onPress={this.onPress}
        key={category.title}
      >
        <Image source={category.imageSource} style={{ width: 80, height: 80 }} />
        <Text style={{ textAlign: 'center', ...primaryFont, color: 'black' }}>
          {category.title}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

class HomeTab extends Component {
  componentDidMount() {
    if (Platform.OS === 'ios') {
      SplashScreen.hide();
    }
  }

  onCategoryPress = (screen) => {
    this.props.navigator.push({
      screen: [`wevedo.${screen}`],
      navigatorStyle: {},
    });
  };

  render() {
    return (
      <Content style={{ flex: 1, backgroundColor }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, minHeight: 150 }}>
          <Image
            source={images.category_hero}
            style={{
              flex: 1,
              width: null,
              height: null,
            }}
            resizeMode="cover"
          />
        </View>
        <View style={{ marginTop: 14 }}>
          <FlatList
            numColumns={1}
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Content>
    );
  }
}

export default HomeTab;