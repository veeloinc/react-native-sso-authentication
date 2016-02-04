'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
  WebView,
  ToastAndroid,
  TouchableHighlight,
  Image,
  AsyncStorage
} from 'react-native';

import api, {key, google} from './Server';
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
    return (
      <WebView
        url={([google.oauth_dialog,'?scope=email profile&redirect_uri=',google.redirect_uri,'&response_type=code&client_id=',google.client_id]).join('')}
        javaScriptEnabledAndroid={true}
        automaticallyAdjustContentInsets={false}
        scalesPageToFit={true}
        onNavigationStateChange={this.onNavigationStateChange.bind(this)}
      />
    );
  }

  renderResponse() {
    let profile = JSON.parse(this.state.response);

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={{uri: profile.picture}} />
        <Text style={styles.welcome}>{profile.name}</Text>
        <TouchableHighlight style={[styles.button, (this.state.loading ? styles.buttonDisabled : styles.buttonActive)]} underlayColor={stylesheet.buttonDisabled.backgroundColor} onPress={() => this.onLogout()}>
          <Text style={styles.buttonText}>{this.state.loading ? 'Please Wait . . .' : 'Logout'}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  fetchToken() {
    if (this.state.token) return null;

    api.google.token(this.state.code)
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
        console.log(error);
        ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.LONG);
      })
      .done();

    return null;
  }

  fetchProfile() {
    if (this.state.response) return null;

    api.google.profile(this.state.token)
      .then((response) => {
        console.log(response);
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
        console.log(error);
        ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.LONG);
      })
      .done();

    return null;
  }

  onNavigationStateChange(navState) {
    if ((/code=/g).test(String(navState.url))) {
      this.setState({
        code: String(navState.url).replace(([google.redirect_uri,'?code=']).join(''),'')
      });
    }
  }

  onLogout() {
    if (this.state.loading) {
      ToastAndroid.show('Please Wait . . .', ToastAndroid.SHORT);
      return null;
    }

    this.setState({loading: true});

    api.google.logout(this.state.token)
      .then((response) => {
        console.log(response);
        if (!response.ok) throw Error(response.statusText || response._bodyText);

        this.setState({
          code: undefined,
          token: undefined,
          response: undefined
        });

        this.removeResponse().done();
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.LONG);
      })
      .done(() => {
        this.setState({loading: false});
      });

    return null;
  }

  async saveResponse() {
    try {
      await AsyncStorage.setItem(key.google, JSON.stringify(this.state.response));
    } catch (error) {
      ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.LONG);
    }
  }

  async removeResponse() {
    try {
      await AsyncStorage.removeItem(key.google);
      ToastAndroid.show('Logout successfully!', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.LONG);
    }
  }
}

const styles = StyleSheet.create(stylesheet);
