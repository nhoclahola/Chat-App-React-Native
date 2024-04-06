/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    FlatList,
    ImageBackground,
    Alert,
    TouchableOpacity,
    Image,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import UIHeader from '../../components/UIHeader';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { isValidEmail, isValidPassword } from './Validation';

import { auth, firebaseDatabase, createUserWithEmailAndPassword, sendEmailVerification } from './../../firebase/firebase'

type SectionProps = {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>;
};

function Register(): React.JSX.Element {
    const [keyBoardShow, setKeyBoardShow] = useState(false)
    const [email, setEmail] = useState('abc@gmail.com')
    const [password, setPassword] = useState('Abcdef123')
    const [rePassword, setRePassword] = useState('Abcdef123')
    // State để kiểm tra có valid không
    const [errorEmail, setErrorEmail] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [errorRePassword, setErrorRePassword] = useState('')
    const isValidation = 
    email.length > 0 && password.length > 0 && rePassword.length > 0 
    && errorEmail === '' && errorPassword === '' && errorRePassword === ''
    && password === rePassword



    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => setKeyBoardShow(true))
        Keyboard.addListener('keyboardDidHide', () => setKeyBoardShow(false))
    })
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
            <ScrollView>
                <View style={styles.haveAccountWrapper}>
                    <Text style={styles.haveAccountText}>Register</Text>
                    <Image tintColor={'red'} style={styles.haveAccountImage} source={require('./img/account.png')}></Image>
                </View>
                <View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.info}>Email:</Text>
                        <TextInput value={email} onChangeText={(text) => {
                            setErrorEmail(isValidEmail(text) ? '' : 'Email is not in correct format')
                            setEmail(text)}} 
                            placeholder='example@gmail.com' placeholderTextColor={'gray'}></TextInput>
                        <View style={styles.line}></View>
                        <Text style={styles.errorNoticeText}>{errorEmail}</Text>
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.info}>Enter your password</Text>
                        <TextInput value={password} onChangeText={(text) => {
                            setErrorPassword(isValidPassword(text) ? '' : 'Password must at least 3 characters')
                            setPassword(text)}} 
                            secureTextEntry={true} placeholder='Enter your password' placeholderTextColor={'gray'}></TextInput>
                        <View style={styles.line}></View>
                        <Text style={styles.errorNoticeText}>{errorPassword}</Text>
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.info}>Re-enter your password</Text>
                        <TextInput value={rePassword} onChangeText={(text) => {
                            setErrorRePassword(isValidPassword(text) ? '' : 'Password must at least 3 characters')
                            setRePassword(text)}} 
                            secureTextEntry={true} placeholder='Re-enter your password' placeholderTextColor={'gray'}></TextInput>
                        <View style={styles.line}></View>
                        <Text style={styles.errorNoticeText}>{errorRePassword}</Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity 
                        onPress={() => createUserWithEmailAndPassword(auth, email, password).then((userCredenial) => {
                            const user = userCredenial.user
                            // sendEmailVerification(user).then(() => console.log('Email verification sent'))
                        }).catch((error) => {
                            Alert.alert(`Không thể đăng ký, error: ${error.message}`)
                        })}
                        disabled={!isValidation} style={{...styles.loginButton, backgroundColor: isValidation ? 'red' : 'gray'}}>
                        <Text style={{padding: 10, color: 'white', fontSize: 16}}>Register</Text>
                    </TouchableOpacity>
                    {/* {keyBoardShow == false && <TouchableOpacity style={{marginTop: 10}} onPress={() => Alert.alert('pressed register')}>
                        <Text style={styles.registerText}>Doesn't have account? Register Now</Text>
                    </TouchableOpacity>} */}
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
    },

    haveAccountWrapper: {
        flexDirection: 'row',
        height: 100,
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    haveAccountText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        width: '50%',
    },

    haveAccountImage: {
        width: 100,
        height: 100,
        alignSelf: 'center',
    },

    signIn: {
        flex: 30,
    },

    infoWrapper: {
        marginHorizontal: 15,
    },

    line: {
        height: 1, 
        width: '100%',
        backgroundColor: 'red',
    },

    errorNoticeText: {
        color: 'red',
        marginBottom: 10,
    },

    info: {
        color: 'red',
        fontSize: 16,
    },

    loginButton: {
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        alignSelf: 'center',
        borderRadius: 15,
        marginTop: 40,
    },

    registerText: {
        color: 'red', 
        fontSize: 12, 
        alignSelf: 'center',
        padding: 5,
    },
});

export default Register;
