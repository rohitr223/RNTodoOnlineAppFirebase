import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {AppImages} from '../assets';

const GoogleSignInButton = ({onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.googleButton}
      onPress={onPress}>
      <Image source={AppImages.googleIcon} style={styles.googleIcon} />
      <Text style={styles.btnText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;

const styles = StyleSheet.create({
  googleButton: {
    width: '90%',
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    backgroundColor: '#0C134F',
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
  },
  googleIcon: {
    height: 40,
    width: 40,
  },
  btnText: {
    flex: 1,
    color: '#EFEFEF',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
