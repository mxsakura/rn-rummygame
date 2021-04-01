import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Progress, ActivityIndicator, Provider, Toast, } from '@ant-design/react-native';
import codePush from 'react-native-code-push';
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
            this.props.navigation.replace('Home')
        } else {
            codePush.allowRestart();
            this.checkUpdate(); //开始检查更新
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
                        UPDATE
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
