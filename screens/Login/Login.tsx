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
import { NavigationProp, RouteProp, StackActions } from '@react-navigation/native';
import { isValidEmail, isValidPassword } from './Validation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    auth, 
    firebaseDatabase, 
    onAuthStateChanged, 
    firebaseDatabaseRef,
    firebaseDatabaseSet,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword 
} from './../../firebase/firebase'


type SectionProps = {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>;
};

function Login({navigation} : SectionProps): React.JSX.Element {
    const [keyBoardShow, setKeyBoardShow] = useState(false)
    const [email, setEmail] = useState('nhoclahola@gmail.com')
    const [password, setPassword] = useState('Abcdef123')
    // State để kiểm tra có valid không
    const [errorEmail, setErrorEmail] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const isValidation = email.length > 0 && password.length > 0 && errorEmail === '' && errorPassword === ''



    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => setKeyBoardShow(true))
        Keyboard.addListener('keyboardDidHide', () => setKeyBoardShow(false))

        onAuthStateChanged(auth, (user) => {
            if (user) {
                //sign in
                const userId = user.uid
                // console.log(userId)
                //Lưu dữ liệu vào khi đăng nhập (Vào csdl)
                const NodeRSA = require('node-rsa');

                // Tạo cặp khóa với độ dài 2048 bits
                const key = new NodeRSA({ b: 2048 });

                // Lấy khóa công khai và khóa riêng tư dưới dạng chuỗi
                const publicKey = key.exportKey('public');
                const privateKey = key.exportKey('private');
                let currentUser = {
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    publicKey: publicKey,
                    privateKey: privateKey,
                }
                firebaseDatabaseSet(firebaseDatabaseRef(firebaseDatabase, `users/${userId}`), currentUser)
                //save user to local storage (react-native-async-storage/async-storage)
                AsyncStorage.setItem('user', JSON.stringify(currentUser))   //Lưu user dưới dạng string

                navigation.navigate('UITab')
            }
            else {
                //sign out
                // navigation.dispatch(StackActions.popToTop)      //Pop stack
            }
        })
    }, [])
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
            <ScrollView>
                <View style={styles.haveAccountWrapper}>
                    <Text style={styles.haveAccountText}>Already have an account?</Text>
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
                </View>
                <View>
                    <TouchableOpacity onPress={() => signInWithEmailAndPassword(auth, email, password).then((userCredenial) => {
                        const user = userCredenial.user
                        }).catch((error) => {
                            Alert.alert(`Sai, error: ${error.message}`)
                        })}
                        disabled={!isValidation} style={{...styles.loginButton, backgroundColor: isValidation ? 'red' : 'gray'}}>
                        <Text style={{padding: 10, color: 'white', fontSize: 16}}>Login</Text>
                    </TouchableOpacity>
                    {keyBoardShow == false && <TouchableOpacity style={{marginTop: 10}} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.registerText}>Doesn't have account? Register Now</Text>
                    </TouchableOpacity>}
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
    },

    haveAccountWrapper: {
        flex: 20,
        flexDirection: 'row',
        height: 200,
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

export default Login;
