/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ToastExample from './src/module/ToastExample';
ToastExample.splashHide();
AppRegistry.registerComponent(appName, () => App);
