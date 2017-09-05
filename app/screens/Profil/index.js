import React, {Component} from 'react';
import {
  Content,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Icon,
  Button,
  Grid,
  Col
} from 'native-base';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import styles from './styles';

export default class Profil extends Component {

  render () {

    const placehold = 'http://placehold.it/300x300';
    const navigation = this.props.parent.props.navigation;

    return (
      <Content>

        <Content style={styles.topSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UbahFoto', {image:this.props.user.foto || placehold})}>
            <Image style={styles.image} source={{uri: this.props.user.foto || placehold}} />
          </TouchableOpacity>
          <Text style={styles.topSectionText}>{this.props.user.nama}</Text>
          <Text style={styles.topSectionText}>{this.props.user.email}</Text>
        </Content>

        <Content style={styles.centerSection}>
          <List>
            <ListItem icon first>
              <Left>
                <Icon name="place" style={styles.centerSectionText} />
              </Left>
              <Body>
              <Text style={styles.centerSectionText}>{this.props.user.alamat}</Text>
              </Body>
            </ListItem>

            <ListItem icon last>
              <Left>
                <Icon name="smartphone" style={styles.centerSectionText} />
              </Left>
              <Body>
              <Text style={styles.centerSectionText}>{this.props.user.telp}</Text>
              </Body>
            </ListItem>
          </List>
        </Content>

        <Content style={styles.bottomSection} padder>
          <Grid>
            <Col style={{paddingRight: 5}}>
              <Button
                primary
                block
                bordered
                onPress={() => this.props.parent.props.navigation.navigate('UbahProfil', {user:this.props.user})}>
                <Text>Ubah Profil</Text>
              </Button>
            </Col>

            <Col style={{paddingLeft: 5}}>
              <Button
                danger
                block
                bordered
                onPress={() => this.props.parent.props.navigation.navigate('UbahPassword', {user:this.props.user})}>
                <Text>Ubah Password</Text>
              </Button>
            </Col>
          </Grid>
        </Content>
      </Content>
    )
  }
}