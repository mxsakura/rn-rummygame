import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Progress, ActivityIndicator, Provider, Toast, } from '@ant-design/react-native';
import codePush from 'react-native-code-push';
import RNFS from 'react-native-fs';
import ToastExample from './src/module/ToastExample';

const DEPLOYMENT_KEY = 'GJeYst4AmzoUCy0JsxKrj5aQknNK4ksvOXqog';

export default class Update extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0
        }
    }
    UNSAFE_componentWillMount() {
        codePush.disallowRestart();
    }
    componentDidMount() {
        if (__DEV__) {
            // 开发模式不支持热更新，跳过检查
            // this.props.navigation.replace('Home')
        } else {
            codePush.allowRestart();
            this.checkUpdate(); //开始检查更新
        }
        // 需要下载的apk 包配置
        const options = {
            fromUrl: 'http://172.16.20.114/2.apk',
            toFile: RNFS.DocumentDirectoryPath + '/2.apk',
            background: true,
            begin: (res) => {
                console.log('begin', res);
                console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            },
            progress: (res) => {
                let pro = parseInt(res.bytesWritten / res.contentLength * 100);
                if (pro !== this.state.progress) {
                    console.log(pro)
                    this.setState({
                        progress: pro,
                    });
                }
            }
        }
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                console.log('success', res);
                this.setState({
                    progress: 100,
                });
                ToastExample.show('下载完成', ToastExample.SHORT);
            }).catch(err => {
                console.log('err', err);
            });
        }
        catch (e) {
            console.log(error);
        }
    }
    checkUpdate = () => {
        codePush.checkForUpdate(DEPLOYMENT_KEY).then((update) => {
            console.log(update)
            if (!update) {
                codePush.notifyAppReady();//不要忘记  否则会回滚
                //app是最新版了
                this.props.navigation.replace('Home')
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
