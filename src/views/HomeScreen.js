import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Carousel, Button, Flex, WhiteSpace, WingBlank } from '@ant-design/react-native';
import { Adjust, AdjustEvent } from 'react-native-adjust';

const BaseUrl = 'https://s.nooapp.com/page';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      responseJson: null,
    }
  }
  onHorizontalSelectedIndexChange(index) {
    /* tslint:disable: no-console */
    // console.log('horizontal change to', index);
  }
  onRouteHandle(item) {
    var adjustEvent = new AdjustEvent(item.trackEvent);
    Adjust.trackEvent(adjustEvent);
    // console.log(item.trackEvent,'跟踪成功')
    this.props.navigation.navigate('Details', item)
  }
  componentDidMount() {
    const _this = this;    //先存一下this，以防使用箭头函数this会指向我们不希望它所指向的对象。
    fetch(BaseUrl + '/app.json', {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        _this.setState({
          isLoaded: true,
          responseJson: responseJson
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    this.setState = () => false;
  }

  render() {
    if (this.state.isLoaded) {
      return (
        <ScrollView>
          <View>
            <Carousel
              style={styles.wrapper}
              dotActiveStyle={{ backgroundColor: '#ffffff' }}
              autoplay
              infinite
              afterChange={this.onHorizontalSelectedIndexChange}
            >
              {
                this.state.responseJson.banner.map((item, index) =>
                  <Image
                    key={index}
                    style={styles.bannerImage}
                    source={{ uri: BaseUrl + item.image }}
                  />
                )
              }
            </Carousel>
          </View>
          {/* <WingBlank style={{ margin: 5,marginTop:30 }}>
            <Flex>
              {
                this.state.responseJson.games.slice(0, 3).map((item, index) =>
                  <Flex.Item style={{ paddingLeft: 4, paddingRight: 4 }}>
                    <View
                      style={{ alignItems: 'center' }}
                      key={item.id}>
                      <View>
                        <Image
                          style={styles.icon}
                          source={{ uri: BaseUrl + item.icon }}
                        />
                      </View>
                      <View><Text numberOfLines={1}>{item.name}</Text></View>
                    </View>
                  </Flex.Item>
                )
              }
            </Flex>
          </WingBlank> */}
          <View style={{ margin: 20 }}><Text style={{ fontSize: 20 }}>GAMES</Text></View>
          <View>
            {
              this.state.responseJson.games.map((item, index) =>
                <TouchableOpacity key={index} onPress={() => this.onRouteHandle(item)}>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 30 }}
                  >
                    <Image style={styles.icon} source={{ uri: BaseUrl + item.icon }} />
                    <View style={{ width: 250, marginLeft: 20, justifyContent: 'center' }}>
                      <Text
                        numberOfLines={1} style={{ fontSize: 16, lineHeight: 75 }}>{item.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }
          </View>
        </ScrollView>
      )
    } else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    height: 200,
  },
  bannerImage: {
    height: 200,
    resizeMode: 'stretch'
  },
  icon: {
    width: 75,
    height: 75,
    resizeMode: 'stretch',
    borderRadius: 18.75
  }
});