import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Progress, ActivityIndicator, Provider, Toast, Modal } from '@ant-design/react-native';
import codePush from 'react-native-code-push';
import RNFS from 'react-native-fs';
import ToastExample from './src/module/ToastExample';
import Orientation from 'react-native-orientation';

const DEPLOYMENT_KEY = 'illIXQlJYBWmqVXI5sYLONTkSOpl4ksvOXqog';
// const packageHost = 'https://s.0nymzl6.com/update/'
const packageHost = 'http://172.16.20.80:10001/games/rummy/bundles/';
const packageFile = RNFS.DocumentDirectoryPath + '/game.bundle';

export default class Update extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            bundle: false,
            portrait: Orientation.getInitialOrientation() === 'PORTRAIT',//当前是否是竖屏(true),横屏(false)
        }
    }
    UNSAFE_componentWillMount() {
        codePush.disallowRestart();
    }
    componentDidMount() {
        if (__DEV__) {
            // // 开发模式不支持热更新，跳过检查
            // this.props.navigation.replace('Home')
            this.gameStart();
            // this.checkUpdate(); //开始检查更新
        } else {
            // Toast.info('production');
            codePush.allowRestart();
            this.checkUpdate(); //开始检查更新
        }
    }
    showUpdateError() {
        this.setState({
            progress: 0
        })
        Modal.alert('error', 'load fail', [{ text: 'Try again', onPress: () => this.checkUpdate() }]);
    }
    showGameError() {
        this.setState({
            progress: 0
        })
        Modal.alert('error', 'loading fail', [{ text: 'Try again', onPress: () => this.gameStart() }]);
    }
    async gameStart() {
        // 获取服务器端的md5
        const md5Json = await fetch(packageHost + 'md5.json?v=' + new Date().getTime()).then((response) => response.json()).catch(err => this.showGameError());
        // 获取json版本号
        const serverVersion = md5Json.version;
        const appVersion = await ToastExample.getVersion().catch(err => this.showGameError());
        // console.log(appVersion)
        // console.log(serverVersion)
        if (appVersion <= serverVersion) {
            // 需要下载更新包
            // 竖屏时、锁定为横屏
            Orientation.lockToLandscape();
            this.setState({ portrait: false, bundle: true });
            // this.props.navigation.replace('Home');
        } else {
            // 进入首页
            this.props.navigation.replace('Home');
            return;
        }
        // 获取设备abi
        const ABI = await ToastExample.getABI().catch(err => this.showGameError());
        // 通过abi获取对应的包名
        const bundleNmae = md5Json.abis[ABI];
        // 通过包名获取md5
        const serverMd5 = md5Json.bundles[bundleNmae].md5 + 1;
        // 判断文件是否存在
        const fileExists = await RNFS.exists(packageFile).catch(err => this.showGameError());
        // 文件存在 则获取文件的md5
        const fileMd5 = fileExists ? await RNFS.hash(packageFile, 'md5').catch(err => this.showGameError()) : null;
        // 对比md5
        if (fileExists && (serverMd5 == fileMd5) && serverMd5 != null) {
            // 文件相同&&md5相同
            setTimeout(() => {
                ToastExample.show(packageFile, ToastExample.SHORT);
            }, 100)
        } else {
            // 否则就下载文件
            // 需要下载的apk 包配置
            const options = {
                fromUrl: packageHost + bundleNmae + '?v=' + serverMd5,
                toFile: packageFile,
                background: true,
                progress: (res) => {
                    console.log(res.bytesWritten,res.contentLength)
                    let pro = parseInt(res.bytesWritten / res.contentLength * 100);
                    // console.log(pro)
                    if (pro !== this.state.progress) {
                        this.setState({
                            progress: pro,
                        });
                    }
                }
            }
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                this.setState({
                    progress: 100,
                });
                // 下载完成 检测文件完整
                RNFS.hash(packageFile, 'md5')
                    .then(result => {
                        console.log(serverMd5, result)
                        if (serverMd5 == result) {
                            ToastExample.show(packageFile, ToastExample.SHORT);
                        } else {
                            this.showGameError();
                        }
                    }).catch(err => this.showGameError());
            })
            ret.promise.catch(err => this.showGameError());
        }
    }
    checkUpdate() {
        codePush.checkForUpdate(DEPLOYMENT_KEY).then((update) => {
            console.log(update)
            if (!update) {
                codePush.notifyAppReady();//不要忘记  否则会回滚
                //app是最新版了,加载界面
                this.gameStart()
            } else {
                this.syncImmediate();
            }
        }).catch(() => {
            Toast.info('connection fail');
            this.showUpdateError();
        })
    }
    syncImmediate() {
        // 检测版本
        codePush.sync(
            {
                deploymentKey: DEPLOYMENT_KEY,
                updateDialog: false,
                mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
            },
            (status) => {
                switch (status) {
                    case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                        console.log("Checking for updates.");
                        break;
                    case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                        console.log("Downloading package.");
                        break;
                    case codePush.SyncStatus.INSTALLING_UPDATE:
                        console.log("Installing update.");
                        break;
                    case codePush.SyncStatus.UP_TO_DATE:
                        console.log("Up-to-date.");
                        break;
                    case codePush.SyncStatus.UPDATE_INSTALLED:
                        console.log("Update installed.");
                        codePush.restartApp(true);
                        break;
                }
            },
            (res) => {
                let total = (res.totalBytes / (1024 * 1024)).toFixed(2);
                let received = (res.receivedBytes / (1024 * 1024)).toFixed(2);
                let progress = parseInt((received / total) * 100);
                this.setState({ progress });
            }
        ).catch(err => this.showUpdateError());
    }
    render() {
        if (this.state.progress && this.state.bundle) {
            const { progress } = this.state;
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>
                        loading
                        {'\n'}
                    </Text>
                    <Text>
                        {progress} %
                        {'\n'}
                    </Text>
                    <View style={{ width: 200, height: 4, flexDirection: 'row' }}>
                        <Progress percent={progress} />
                    </View>
                </View>
            )

        } else {
            return (
                <Provider>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator text="loading..." size="large" />
                    </View>
                </Provider>
            )
        }
    }
}
