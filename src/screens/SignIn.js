import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Alert,
  Platform,
  StatusBar,
  Image,
  View,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleSignInButton from '../components/GoogleSignInButton';
import {AppImages} from '../assets';

const SignIn = ({navigation}) => {
  const [userInfo, setUserInfo] = useState(null);
  //console.log(userInfo);
  //console.log(userInfo.user.uid);

  /*
    Important Note -:
    Here we have not added an empty array [] at the end of useEffect because we
    want to run it multiple times and not only when this screen loads.
    So we dont add any [] at the end.
    If we want to run useEffect only one time when the screen loads then we add [].
  */
  useEffect(() => {
    saveUserInfoAsync();
    checkUserIsAlreadySigned();
  });

  GoogleSignin.configure({
    webClientId:
      '180285472487-rt0ivuag9rl93jr37hjldp3n98lhrhvj.apps.googleusercontent.com',
  });

  // To check wether user is already signed in or not.
  const checkUserIsAlreadySigned = async () => {
    try {
      const usrToken = await AsyncStorage.getItem('userToken');
      //console.log(usrToken);
      if (usrToken) {
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('User Not Signed In.', error);
    }
  };

  // ------- There is an Error in this functional block -------- //
  // saving user info in async storages
  const saveUserInfoAsync = async () => {
    try {
      // Storing values in Async Storage.
      // Check if the userInfo is null or not.
      // If it is null then user cannot be saved inside Async storage.
      if (userInfo != null) {
        await AsyncStorage.setItem('ID', userInfo.user.uid);
        await AsyncStorage.setItem('NAME', userInfo.user.displayName);
        await AsyncStorage.setItem('EMAIL', userInfo.user.email);
        /* Note -:
          Async storage cannot be null. It throws an error which may crash the app.
          If sometimes the user photo is not available in case due to user's
          privacy, our app might crash due to its null value as we are storing
          the user photo url in the async storage database.
          Since null values are not allowed in async storage we have to
          check before storing the value.
          So, we perform if-check, whether the photo is available or not.
        */
        if (userInfo.user.photoURL != null) {
          await AsyncStorage.setItem('PHOTO', userInfo.user.photoURL);
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // const signInWithGoogle = async () => {
  //   try {
  //     // Check if your device supports Google Play
  //     await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  //     // Get the users ID token
  //     const {idToken} = await GoogleSignin.signIn();

  //     // Create a Google credential with the token
  //     // auth is required to store user email in firebase database.
  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  //     // Sign-in the user with the credential
  //     const signed_user = auth().signInWithCredential(googleCredential);

  //     // save idToken details in AsyncStorage inside 'userToken' key.
  //     await AsyncStorage.setItem('userToken', idToken);

  //     signed_user
  //       .then(user => {
  //         console.log(user);
  //         setUserInfo(user);
  //         //navigation.navigate('Home');
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   } catch (error) {
  //     Alert.alert('Error', error);
  //   }
  // };

  const signInWithGoogleAsync = async () => {
    try {
      // check whether your mobile has Google Play Services activated.
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // creating a seperate idToken variable to store id in the form of string.
      const {idToken} = await GoogleSignin.signIn();
      // passing this value into googleCredential.
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // variable for signing with google credentials.
      const signed_user = auth().signInWithCredential(googleCredential);
      // Storing User Id in async storage. This id will be used to keep user signed in.
      await AsyncStorage.setItem('userToken', idToken);
      // if new user is signed in using google, navigate to 'Home'
      signed_user
        .then(user => {
          setUserInfo(user);
          navigation.navigate('Home');
        })
        .catch(err => {
          Alert.alert('Sign In Failed', err);
        });
    } catch (error) {
      // In case of any error
      //console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert('Sign In Calcelled', 'Please Sign In to continue.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert(
          'Sign In Failed',
          'Google Play Services is not available or outdated.',
        );
      } else {
        // in case of network error / some other error
        Alert.alert('Network Error', 'Please try again later.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={AppImages.welcomeImage} style={styles.image} />
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.seperator} />
      <Text style={styles.subTitle}>
        Manage your daily activities {'\n'} with Todo's App
      </Text>
      <View style={styles.seperator} />
      <GoogleSignInButton onPress={signInWithGoogleAsync} />
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '50%',
    width: '90%',
  },
  seperator: {
    height: '4%',
  },
  title: {
    color: '#252525',
    fontSize: 50,
    fontWeight: '800',
  },
  subTitle: {
    color: '#252525',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
