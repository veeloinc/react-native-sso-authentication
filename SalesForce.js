'use strict';
import React, { Component } from 'react';
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
  constructor(props) {
    super(props);

    this.state = {
          code: undefined,
         token: undefined,
      response: undefined,
       loading: false
    };
  }

  render() {

    if (this.state.response) return this.renderResponse();
    if (this.state.token) return this.fetchProfile();
    if (this.state.code) return this.fetchToken();

    return this.renderScene();
  }

  renderScene() {
    //console.log(" URI " + ${salesforce.oauth_dialog}?client_id=${salesforce.client_id}&redirect_uri=${salesforce.redirect_uri}&response_type=code)

    return (
      <WebView
        source={{uri:`${salesforce.oauth_dialog}?client_id=${salesforce.client_id}&redirect_uri=${salesforce.redirect_uri}&response_type=code`,headers:{'Content-Type': 'application/x-www-form-urlencoded'}}}
        javaScriptEnabledAndroid={true}
        automaticallyAdjustContentInsets={false}
        scalesPageToFit={true}
        startInLoadingState={true}
        onNavigationStateChange={this.onNavigationStateChange.bind(this)}
      />

    );
  }

  renderResponse() {
    console.log("--- get response ---" + this.state.response)
    let profile = JSON.parse(this.state.response);

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={{uri: profile.picture}} />
        <Text style={styles.welcome}>{profile.name}</Text>
        <TouchableHighlight
          style={[styles.button, (this.state.loading ? styles.buttonDisabled : styles.buttonActive)]}
          underlayColor={stylesheet.buttonDisabled.backgroundColor}
          onPress={() => this.onLogout()}>
          <Text style={styles.buttonText}>{this.state.loading ? `Please Wait . . .` : `Logout`}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  fetchToken() {
    console.log("--- get token ---" + this.state.token + "-" + this.state.code )
    if (this.state.token) return null;

    api.salesforce.token(this.state.code)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText || response._bodyText);
        return response.json()
      })
      .then((responseData) => {
        if (responseData && responseData.access_token) {
          this.setState({
            token: responseData.access_token
          });
        }
      })
      .catch((error) => {
        this.onError(error);
      })
      .done();

    return null;
  }

  fetchProfile() {
    console.log("--- get profile ---" + this.state.token + "-" + this.state.response )
    if (this.state.response) return null;

    api.salesforce.profile(this.state.token)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText || response._bodyText);
        return response.json()
      })
      .then((responseData) => {
        this.setState({
          response: JSON.stringify(responseData)
        });
        this.saveResponse().done();
      })
      .catch((error) => {
        this.onError(error);
      })
      .done();

    return null;
  }

  onNavigationStateChange(navState) {
    console.log(navState.url)
    if ((/code=/g).test(String(navState.url))) {
      this.setState({
        code: String(navState.url).replace(`${salesforce.redirect_uri}?code=`,'')
      });
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
