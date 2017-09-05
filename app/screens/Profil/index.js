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
import {Image, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import StarRating from 'react-native-star-rating';

export default class Profil extends Component {

  hitungRating() {
    let rating = 0;
    let ratingCount = 0;
    for(let index in this.props.user.testimoni) {
      rating += this.props.user.testimoni[index].rating;
      ratingCount++;
    }
    rating = rating / ratingCount;
    return rating;
  }

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

          <Content style={styles.ratingContent}>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={this.hitungRating()}
              starColor={'#FFEB3B'}
              emptyStarColor={'#fff'}
              starSize={20}
            />
          </Content>

          <View style={styles.buttonContainer}>
            <Button
              light
              transparent
              onPress={() => this.props.parent.props.navigation.navigate('LihatAngkutan', {angkutan: this.props.user.angkutan, pengemudi: this.props.user})}>
              <Icon name="directions-car"></Icon>
            </Button>

            <Button
              light
              transparent
              onPress={() => this.props.parent.props.navigation.navigate('LihatTestimoni', {pengemudi: this.props.user})}>
              <Icon name="rate-review"></Icon>
            </Button>
          </View>

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