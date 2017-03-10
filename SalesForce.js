'use strict';
import React, { Component, PropTypes } from 'react';
import  {
  StyleSheet,
  Text,
  View,
  WebView,
  ToastAndroid,
  AsyncStorage,
  Image,
  TouchableHighlight
} from 'react-native';

import api, {key, salesforce} from './Server';
import stylesheet from './Style';

export default class extends Component {
  
  static propTypes = {
    getAuthCode: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.oauthSuccess = false

    this.state = {
          code: undefined,
         token: undefined,
      response: undefined,
       loading: false
    };
  }

  render() {
    return this.renderScene();
  }

  renderScene() {
    return (
      <WebView
        source={{uri:`${salesforce.oauth_dialog}?client_id=${salesforce.client_id}&redirect_uri=${salesforce.redirect_uri}&response_type=code`,headers:{'Content-Type': 'application/x-www-form-urlencoded'}}}
        javaScriptEnabledAndroid={true}
        automaticallyAdjustContentInsets={false}
        scalesPageToFit={true}
        startInLoadingState={true}
        onNavigationStateChange={this.onNavigationStateChange.bind(this)}
        onLoad={this.props.onLoad}
      />

    );
  }

  onNavigationStateChange(navState) {
    if (!this.oauthSuccess) {
        if ((/code=/g).test(String(navState.url))) {
            let code = String(navState.url).replace(`${salesforce.redirect_uri}?code=`, '');
            this.props.getAuthCode(code);
            this.setState({
                code: code
            });
            this.oauthSuccess = true
        }
    }
  }

  onLogout() {
    if (this.state.loading) {
      ToastAndroid.show(`Please Wait . . .`, ToastAndroid.SHORT);
      return null;
    }

    this.setState({loading: true});

    api.salesforce.logout(this.state.token)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText || response._bodyText);

        this.setState({
          code: undefined,
          token: undefined,
          response: undefined
        });

        this.removeResponse().done();
      })
      .catch((error) => {
        this.onError(error);
      })
      .done(() => {
        this.setState({loading: false});
      });

    return null;
  }

  onError(argument) {
    console.log(argument);
    ToastAndroid.show(String(argument).replace('Error: ',''), ToastAndroid.LONG);
  }

  async saveResponse() {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(this.state.response));
    } catch (error) {
      this.onError(error);
    }
  }

  async removeResponse() {
    try {
      await AsyncStorage.removeItem(key);
      ToastAndroid.show(`Logout successfully!`, ToastAndroid.SHORT);
    } catch (error) {
      this.onError(error);
    }
  }
}

const styles = StyleSheet.create(stylesheet);
