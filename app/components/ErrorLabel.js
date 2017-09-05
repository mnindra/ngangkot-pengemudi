import React, {Component} from 'react';
import {
    Content,
    Text
} from 'native-base';
import { StyleSheet } from 'react-native';

export default class ErrorLabel extends Component {

    render () {
        return (
          <Content style={styles.Content}>
              <Text style={styles.Text}>{this.props.error}</Text>
          </Content>
        );
    }
}

const styles = StyleSheet.create({
   Content: {
       margin: 0,
       paddingTop: 5,
       paddingBottom: 0,
       paddingRight: 0,
       paddingLeft: 15
   },
   Text: {
       color: '#ff4336'
   }
});