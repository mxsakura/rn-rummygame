import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import {
    Provider,
    Progress,
    ActivityIndicator,
    Toast,
    Modal,
} from '@ant-design/react-native';
import codePush from 'react-native-code-push';
import RNFS from 'react-native-fs';
import ToastExample from './src/module/ToastExample';
import Orientation from 'react-native-orientation';

const DEPLOYMENT_KEY = 'Vi2p76wjuFJ5OnsgkAQ7rSJuVyoz4ksvOXqog';
const packageHost_PRO = 'https://s.xz86qfn.com/update/bundles/';
const packageHost_DEV = 'http://172.16.20.80:10001/games/rummy/bundles/';
const packageFile = RNFS.DocumentDirectoryPath + '/game.bundle';

const windowWidth = Dimensions.get('window').width;
const countryCodes = ['HK', 'KH', 'MM', 'CN', 'IN', 'SG'];

export default class Update extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
        };
    }
    UNSAFE_componentWillMount() {
        codePush.disallowRestart();
    }
    componentDidMount() {
        ToastExample.splashHide();
        if (__DEV__) {
            // // 开发模式不支持热更新，跳过检查
            // this.props.navigation.replace('Home')
            this.gameStart(packageHost_DEV);
        } else {
            // Toast.info('production');
            codePush.allowRestart();
            this.checkUpdate(); //开始检查更新
        }
    }
    showUpdateError() {
        this.setState({
            progress: 0,
        });
        Modal.alert('error', 'load fail', [
            { text: 'Try again', onPress: () => this.checkUpdate() },
        ]);
    }
    showGameError() {
        this.setState({
            progress: 0,
        });
        Modal.alert('error', 'loading fail', [
            { text: 'Try again', onPress: () => this.gameStart() },
        ]);
    }
    async gameStart(packageHost) {
        const countryCode = await fetch('http://ip-api.com/json?fields=countryCode')
            .then(response => response.json())
            .then(res => res.countryCode);
        if (countryCodes.indexOf(countryCode) < 0) {
            this.props.navigation.replace('Home');
            return;
        }
        // 获取服务器端的md5
        const md5Json = await fetch(packageHost + 'md5.json?v=' + new Date().getTime()).then(response => response.json()).catch(err => this.showGameError());
        // 获取json版本号
        const serverVersion = md5Json.version;
        const appVersion = await ToastExample.getVersion().catch(err => this.showGameError());
        if (appVersion > serverVersion) {
            // 进入首页
            this.props.navigation.replace('Home');
            return;
        }
        // 获取设备abi
        const ABI = await ToastExample.getABI().catch(err => this.showGameError());
        // 通过abi获取对应的包名
        const bundleNmae = md5Json.abis[ABI];
        // 通过包名获取md5
        const serverMd5 = md5Json.bundles[bundleNmae].md5;
        // 判断文件是否存在
        const fileExists = await RNFS.exists(packageFile).catch(err =>
            this.showGameError(),
        );
        // 文件存在 则获取文件的md5
        const fileMd5 = fileExists
            ? await RNFS.hash(packageFile, 'md5').catch(err => this.showGameError())
            : null;
        console.log(`remote bundle info : ${bundleNmae} ${serverMd5}`);
        console.log(`local bundle info : ${packageFile} ${fileMd5}`);
        // 对比md5
        if (fileExists && serverMd5 == fileMd5 && serverMd5 != null) {
            // 文件相同&&md5相同
            ToastExample.show(packageFile, ToastExample.SHORT);
        } else {
            // 否则就下载文件
            // 需要下载的apk 包配置
            const options = {
                fromUrl: packageHost + bundleNmae + '?v=' + serverMd5,
                toFile: packageFile,
                background: true,
                progress: res => {
                    let total = (res.contentLength / (1024 * 1024)).toFixed(2);
                    let received = (res.bytesWritten / (1024 * 1024)).toFixed(2);
                    let progress = parseInt((received / total) * 100);
                    this.setState({
                        progress: progress,
                    });
                },
            };
            await RNFS.downloadFile(options).promise.catch(err =>
                this.showGameError(),
            );
            this.setState({ progress: 100 });
            // 下载完成 检测文件完整
            RNFS.hash(packageFile, 'md5')
                .then(result => {
                    console.log(serverMd5, result);
                    if (serverMd5 == result) {
                        ToastExample.show(packageFile, ToastExample.SHORT);
                    } else {
                        this.showGameError();
                    }
                })
                .catch(err => this.showGameError());
        }
    }
    checkUpdate() {
        codePush
            .checkForUpdate(DEPLOYMENT_KEY)
            .then(update => {
                console.log(update);
                if (!update) {
                    codePush.notifyAppReady(); //不要忘记  否则会回滚
                    //app是最新版了,加载界面
                    this.gameStart(packageHost_PRO);
                } else {
                    this.syncImmediate();
                }
            })
            .catch(() => {
                Toast.info('connection fail');
                this.showUpdateError();
            });
    }
    syncImmediate() {
        // 检测版本
        codePush
            .sync(
                {
                    deploymentKey: DEPLOYMENT_KEY,
                    updateDialog: false,
                    mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
                },
                status => {
                    switch (status) {
                        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                            console.log('Checking for updates.');
                            break;
                        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                            console.log('Downloading package.');
                            break;
                        case codePush.SyncStatus.INSTALLING_UPDATE:
                            console.log('Installing update.');
                            break;
                        case codePush.SyncStatus.UP_TO_DATE:
                            console.log('Up-to-date.');
                            break;
                        case codePush.SyncStatus.UPDATE_INSTALLED:
                            console.log('Update installed.');
                            codePush.restartApp(true);
                            break;
                    }
                },
                res => {
                    let total = (res.totalBytes / (1024 * 1024)).toFixed(2);
                    let received = (res.receivedBytes / (1024 * 1024)).toFixed(2);
                    let progress = parseInt((received / total) * 100);
                    // this.setState({ progress });
                },
            )
            .catch(err => this.showUpdateError());
    }
    render() {
        if (this.state.progress) {
            const { progress } = this.state;
            return (
                <Provider>
                    <View
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>
                            loading
              {'\n'}
                        </Text>
                        <Text>
                            {progress} %{'\n'}
                        </Text>
                        {/* <View style={{ width: windowWidth * 0.6, height: 4 }}>
                        <Progress percent={progress} unfilled={false} />
                    </View> */}
                    </View>
                </Provider>
            );
        } else {
            return (
                <Provider>
                    <View
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator text="loading..." size="large" />
                    </View>
                </Provider>
            );
        }
    }
}
