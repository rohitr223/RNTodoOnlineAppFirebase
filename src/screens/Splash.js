import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {MotiView} from 'moti';
import Icon from 'react-native-vector-icons/Ionicons';

const Splash = ({navigation}) => {
  // navigate to home after 4 seconds.
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('SignIn');
    }, 3000);
  });

  return (
    <SafeAreaView style={styles.container}>
      <MotiView
        from={{translateY: -200}}
        animate={{translateY: 0}}
        transition={{
          delay: 500,
        }}>
        <Icon name="book-outline" color="#fff" size={100} />
      </MotiView>
      <View style={styles.seperator} />
      <MotiView
        from={{opacity: 0, scale: 0.3}}
        animate={{opacity: 1, scale: 1}}
        transition={{
          type: 'timing',
          duration: 2000,
          scale: {
            type: 'spring',
            delay: 100,
          },
        }}>
        <Text style={styles.title}>ULTIMATE TODO'S APP</Text>
      </MotiView>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6527BE',
  },
  seperator: {
    height: '3%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
