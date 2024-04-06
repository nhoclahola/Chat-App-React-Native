/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Chat from './screens/Chat/Chat'
import Messenger from './screens/Messenger/Messenger'
import Login from './screens/Login/Login'
import UITab from './tab_navigation/UITab'

AppRegistry.registerComponent(appName, () => App);
