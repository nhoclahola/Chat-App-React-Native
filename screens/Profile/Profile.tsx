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

import { auth, firebaseDatabase, firebaseDatabaseRef, firebaseDatabaseSet } from '../../firebase/firebase'
import { NavigationProp, RouteProp, StackActions } from '@react-navigation/native';

type SectionProps = {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>;
};

function Profile({navigation} : SectionProps): React.JSX.Element {
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <Image style={styles.img} source={{uri: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg'}}></Image>
                <View style={styles.infoWrapper}>
                    <Text style={styles.infoName}>UID:</Text>
                    <Text style={styles.info}>{auth.currentUser?.uid}</Text>
                </View>
                <View style={styles.infoWrapper}>
                    <Text style={styles.infoName}>Password:</Text>
                    <Text style={styles.info}>{auth.currentUser?.email}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.signOut} onPress={() => {
                    auth.signOut()
                    navigation.dispatch(StackActions.popToTop)      //Pop stack

                }}>
                <Text style={{color: 'white'}}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginTop: 10,
        flex: 1,
    },

    body: {
        flex: 1,
    },

    img: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        borderRadius: 80,
    },

    infoWrapper: {
        flexDirection: 'row',
        marginTop: 10,
    },

    infoName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },

    info: {
        marginHorizontal: 5,
        color: 'black',
    },

    signOut: {
        backgroundColor: 'gray',
        width: 80,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        marginBottom: 10,
    },
})

export default Profile;