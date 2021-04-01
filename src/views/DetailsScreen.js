import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Linking, BackHandler } from 'react-native';
import { Button } from '@ant-design/react-native';
import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Adjust, AdjustEvent } from 'react-native-adjust';

const BaseUrl = 'https://s.nooapp.com/page';
export default class DetailsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: null,
            widths: [],
            images: [],
            imgIndex: 0,
            showImgState: false,
        }
    }

    showImg(item) {
        //获取图片地址
        let image = BaseUrl + item.url;
        //获取列表image
        let images = this.state.game.media.filter(imgItem => imgItem.type == 'image').map(imgItem2 => { return { url: BaseUrl + imgItem2.url } });
        let index = images.findIndex(indexItem => indexItem.url == image);
        this.setState({
            images: images,
            imgIndex: index,
            showImgState: true,
        })
    }

    hideImg() {
        this.setState({
            showImgState: false
        })
    }

    openUrl() {
        //https://play.google.com/store/apps/details?id=com.rummygame.app
        var adjustEvent = new AdjustEvent(this.state.game.trackEventD);
        Adjust.trackEvent(adjustEvent);
        let url = this.state.game.srcUrl;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));

    }

    componentDidMount() {
        let params = this.props.route.params;
        //自适应宽度
        let widths = params.media.map(() => {
            return 0;
        })
        widths.map((item, index) => {
            if (params.media[index].type === 'image') {
                Image.getSize(BaseUrl + params.media[index].url, (width, height) => {
                    //width 图片的宽度
                    //height 图片的高度
                    widths[index] = parseInt(width / (height / 200))
                    this.setState({
                        game: params,
                        widths: widths,
                    })
                })
            } else {
                return 0
            }
        })
        this.setState({
            game: params,
            widths: widths
        })
    }


    componentWillUnmount() {
        this.setState = () => false;
    }

    render() {
        if (this.state.game) {
            return (
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={styles.icon} source={{ uri: BaseUrl + this.state.game.icon }} />
                            <View style={{ width: 250, marginLeft: 20, justifyContent: 'center' }}>
                                <Text
                                    numberOfLines={3} style={{ fontSize: 24 }}>{this.state.game.name}
                                </Text>
                                <Text
                                    numberOfLines={1} style={{ fontSize: 16, marginTop: 10, color: '#888888' }}>{this.state.game.applied} Applied
                                </Text>
                            </View>
                        </View>
                        <ScrollView style={{ marginTop: 20 }} horizontal={true}>
                            <View style={{ flexDirection: 'row' }}>

                                {
                                    this.state.game.media.map((item, index) => {
                                        if (item.type === 'image') {
                                            return (
                                                <View key={index} style={{ marginRight: index < this.state.game.media.length - 1 ? 10 : 0 }}>
                                                    <TouchableOpacity onPress={() => this.showImg(item)}>
                                                        <Image
                                                            style={{ height: 200, width: this.state.widths[index] }}
                                                            source={{ uri: BaseUrl + item.url }}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        } else {
                                            return (
                                                <View key={index} style={{ marginRight: index < this.state.game.media.length - 1 ? 10 : 0 }}>
                                                    <Video source={{ uri: BaseUrl + item.url }}   // Can be a URL or a local file.
                                                        ref={(ref) => {
                                                            this.player = ref
                                                        }}                                      // Store reference
                                                        style={styles.backgroundVideo}
                                                        resizeMode={'contain'}
                                                        repeat={true} />
                                                </View>
                                            )
                                        }
                                    })
                                }
                            </View>
                        </ScrollView>
                        <View style={{ marginTop: 20 }}>
                            <Button style={{ backgroundColor: "#f4511e" }} onPress={() => this.openUrl()}><Text style={{ color: "#ffffff" }}>Downlaod</Text></Button>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 18, color: '#353535' }}>Details</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 16, lineHeight: 25, color: '#888888' }}>{this.state.game.details}</Text>
                        </View>
                    </View>
                    <Modal visible={this.state.showImgState} transparent={true} onRequestClose={() => { this.hideImg() }}>
                        {
                            this.state.images.length > 0 ? <ImageViewer
                                // menus={() => null}
                                saveToLocalByLongPress={false} //是否开启长按保存
                                imageUrls={this.state.images}
                                index={this.state.imgIndex} // 初始显示第几张
                                onClick={() => { this.hideImg() }}
                            /> : null
                        }
                    </Modal>
                </ScrollView>
            )
        } else {
            return null;
        }

    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        height: 200,
    },
    icon: {
        width: 75,
        height: 75,
        resizeMode: 'stretch',
        borderRadius: 18.75
    },
    backgroundVideo: {
        width: 200,
        height: 200,
    },
});