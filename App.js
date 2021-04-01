import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Adjust, AdjustConfig} from 'react-native-adjust';

//
import Update from './update';
import HomeScreen from './src/views/HomeScreen';
import DetailsScreen from './src/views/DetailsScreen';

const Stack = createStackNavigator();

class App extends Component {
  constructor(props) {
    super(props);
    const adjustConfig = new AdjustConfig(
      'k1ocmqx4zke8',
      AdjustConfig.EnvironmentSandbox,
    );
    Adjust.create(adjustConfig);
  }

  componentWillUnmount() {
    Adjust.componentWillUnmount();
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Update"
            component={Update}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Home',
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#ffffff',
            }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{
              title: 'Detais',
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#ffffff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
