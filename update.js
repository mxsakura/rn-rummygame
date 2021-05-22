import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Progress, ActivityIndicator, Provider, Toast, Button } from '@ant-design/react-native';
import codePush from 'react-native-code-push';
import RNFS from 'react-native-fs';
import ToastExample from './src/module/ToastExample';
import Orientation from 'react-native-orientation';

const DEPLOYMENT_KEY = 'GJeYst4AmzoUCy0JsxKrj5aQknNK4ksvOXqog';
const pagHost = 'http://172.16.20.80:10001/games/rummy/'
const pagFile = RNFS.DocumentDirectoryPath + '/game.bundle';

export default class Update extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            hotState: false,
            isShowLoading: false,
            retry: false,
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
            // ToastExample.show(pagFile, ToastExample.SHORT);
            this.gameStart();
        } else {
            codePush.allowRestart();
            this.checkUpdate(); //开始检查更新
        }
    }
    async gameStart() {
        try {
            // 获取服务器端的md5
            const md5Json = (await fetch(pagHost + 'md5.json').then((response) => response.json()));
            const serverMd5 = md5Json.md5;
            const serverVersion = md5Json.version;
            const appVersion = await ToastExample.getVersion()
            console.log(appVersion)
            console.log(serverVersion)
            if (appVersion <= serverVersion) {
                //竖屏时、锁定为横屏
                // Orientation.lockToLandscape();
                this.setState({ portrait: false });
            }
            // 判断文件是否存在
            const fileExists = await RNFS.exists(pagFile);
            // 文件存在 则获取文件的md5
            const fileMd5 = fileExists ? await RNFS.hash(RNFS.DocumentDirectoryPath + '/game.bundle', 'md5') : null;
            // 对比md5
            if (fileExists && (serverMd5 == fileMd5) && serverMd5 != null) {
                // 文件相同&&md5相同
                setTimeout(() => {
                    ToastExample.show(pagFile, ToastExample.SHORT);
                }, 1000)
            } else {
                // 否则就下载文件
                // 需要下载的apk 包配置
                const options = {
                    fromUrl: pagHost + 'game.bundle',
                    toFile: pagFile,
                    background: true,
                    progress: (res) => {
                        let pro = parseInt(res.bytesWritten / res.contentLength * 100);
                        if (pro !== this.state.progress) {
                            this.setState({
                                progress: pro,
                            });
                        }
                    }
                }
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    console.log('success', res);
                    this.setState({
                        progress: 100,
                    });
                    RNFS.hash(RNFS.DocumentDirectoryPath + '/game.bundle', 'md5')
                        .then(result => {
                            if (serverMd5 == result) {
                                setTimeout(() => {
                                    ToastExample.show(pagFile, ToastExample.SHORT);
                                }, 1000)
                            } else {

                            }
                        });
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    checkUpdate() {
        codePush.checkForUpdate(DEPLOYMENT_KEY).then((update) => {
            console.log(update)
            this.setState({
                hotState: true
            })
            if (!update) {
                codePush.notifyAppReady();//不要忘记  否则会回滚
                //app是最新版了,加载界面
                console.log('zuixin')
                this.gameStart()
            } else {
                this.syncImmediate();
            }
        }).catch(() => {
            Toast.info('connection fail')
        })
    }
    async syncImmediate() {
        await codePush.sync(
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
        );
    }
    render() {
        // if (this.state.isShowLoading) {
        if (this.state.progress) {
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
            // return null
            return (
                <Provider>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator text="loading..." size="large" />
                    </View>
                </Provider>
            )
        }
        // } else {
        //     return (
        //         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        //             <Button type="primary">Try again</Button >
        //         </View>
        //     )
        // }
    }
}
