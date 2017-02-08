/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SalesForce, OAuthSalesForce } from '../../index';

export default class ReactNativeSsoAuthenticationExample extends Component {
    render() {
        OAuthSalesForce.client_id = 'CLIENT_ID';

        return (
        <View style={styles.container}>
            <SalesForce getAuthCode={this.getAuthCode} />
        </View>
        );
    }

    getAuthCode( code ) {
        console.log( code );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ReactNativeSsoAuthenticationExample', () => ReactNativeSsoAuthenticationExample);
