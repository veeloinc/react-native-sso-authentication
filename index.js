'use strict';
import  React,{ Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  ToastAndroid
} from 'react-native';

import ToolbarAndroid from 'ToolbarAndroid';

import Facebook from './Facebook';
import Google from './Google';
import SalesForce from './SalesForce';
import Navbar from './Navbar';
import Server, {key as Key, facebook as OAuthFacebook, google as OAuthGoogle, salesforce as OAuthSalesForce} from './Server';
import Style from './Style';

export {Facebook, Google,SalesForce, Server, Key, OAuthFacebook, OAuthGoogle,OAuthSalesForce, Style};

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scene: undefined
    };
  }

  render() {
    let main
    if (this.state.scene === 'salesforce') {
	main = this.renderSalesforce()
    } else if (this.state.scene === 'facebook') {
	main = this.renderFacebook()
    } else if (this.state.scene === 'google') {
	main = this.renderGoogle()
    } else {
        main = this.renderScene()
    }
    return (
      <View style={{flex:1,flexDirection:'column'}}>
        <View>
          <Navbar title={`Single Sign On`} onRefresh={() => this.setState({scene: undefined})} />
        </View>
        <View style={{flex:1}}>
	    {main}
        </View>
      </View>
    );
  }

  renderScene() {
    return (
      <View>

        <TouchableHighlight
          style={[styles.button, styles.buttonFacebook]}
          underlayColor={'#4163a8'}
          onPress={() => this.setState({scene: 'facebook'})}>
          <Text style={styles.buttonText}>{`Sign In with Facebook`}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.button, styles.buttonGoogle]}
          underlayColor={'#fc473a'}
          onPress={() => this.setState({scene: 'google'})}>
          <Text style={styles.buttonText}>{`Sign In with Google`}</Text>
        <TouchableHighlight
          style={[styles.button, styles.buttonFacebook]}
          underlayColor={'#4163a8'}
          onPress={() => this.setState({scene: 'salesforce'})}>
          <Text style={styles.buttonText}>{`SalesForce login`}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderSalesForce() {
    return <SalesForce />
  }

  renderFacebook() {
    return <Facebook />;
  }

  renderGoogle() {
    return <Google />;
  }
}

const styles = StyleSheet.create({
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
  button: {
    height: 50,
    alignSelf: 'stretch',
    justifyContent: 'center',
    margin: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  buttonFacebook: {
    backgroundColor: '#3A5795',
  },
  buttonGoogle: {
    backgroundColor: '#EA4335',
  },
  toolbarContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  toolbar: {
    height: 100,
    backgroundColor: '#00796B',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginRight: 34
  },
  title: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    fontSize: 30,
    color: '#ffffff'
  }
});
