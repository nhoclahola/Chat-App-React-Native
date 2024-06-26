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
} from 'react-native';

import {
	Colors,
	DebugInstructions,
	Header,
	LearnMoreLinks,
	ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import UIHeader from '../../components/UIHeader';
import ChatItem from './ChatItem';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import { 
    auth, 
    firebaseDatabase, 
    onAuthStateChanged, 
    firebaseDatabaseRef,
    firebaseDatabaseSet,
    createUserWithEmailAndPassword,
	child,
	get,
	onValue,
} from './../../firebase/firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';


type SectionProps = {
    navigation: NavigationProp<any, any>
	route: RouteProp<any, any>;
  };

function Chat({navigation} : SectionProps): React.JSX.Element {
    const leftIcon = require('./img/back.png')
    const rightIcon = require('./img/search.png')
	const trash = require('./img/trash.png')

	// Kiểu dữ liệu cho user
	type User = {
		url: string;
		name: string;
		message: string,
		email: string;
		userId: string;
		numberOfUnreadMessages: number;
	};

	const [users, setUsers] = useState<User[]>([
		// {
		// 	url: 'https://randomuser.me/portraits/men/70.jpg',
		// 	name: 'Johnny',
		// 	message: 'Hello',	//Message gần nhất
		// 	numberOfUnreadMessages: 2
		// },
	])

	useEffect(() => {
		const dbRef = firebaseDatabaseRef(firebaseDatabase)
		// Lấy collection users, dùng onValue để khi db có thay đổi thì sẽ thay đổi components
		onValue(firebaseDatabaseRef(firebaseDatabase, 'users'), async (snapshot) => {
			if (snapshot.exists()) {
				let stringUser = await AsyncStorage.getItem('user')		//lấy user từ lúc lưu ở Login (kiểu string)
				let myUserId = JSON.parse(stringUser)['uid']
				let snapShotObject = snapshot.val()
				// console.log(snapShotObject)
				setUsers(Object.keys(snapShotObject).filter((eachKey) => eachKey != myUserId)	// render người dùng không phải bản thân
					.map((eachKey: any) => {
					let eachObject = snapShotObject[eachKey]
					return {
						url: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg',		//Mặc định
						name: eachObject['email'],
						message: '',
						email: eachObject['email'],
						userId: eachKey,
						numberOfUnreadMessages: 0,
					}
				}))
			}
			else {
				console.log('No data availble')
			}
		})
		// get(child(dbRef, 'users')).then((snapshot) => {
		// 	if (snapshot.exists()) {
		// 		let value = snapshot.val()
		// 		console.log(value)
		// 		setUsers(Object.values(value).map((eachObject: any) => {
		// 			return {
		// 				url: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg',		//Mặc định
		// 				name: eachObject['email'],
		// 				message: '',
		// 				email: eachObject['email'],
		// 				uid: eachObject['uid'],
		// 				numberOfUnreadMessages: 0,
		// 			}
		// 		}))
		// 	}
		// 	else {
		// 		console.log('No data availble')
		// 	}
		// }).catch((error) => {
		// 	console.error(`Cannot get users from Firebase: ${error}`)
		// })
	}, [])		//array dependency (rỗng để chỉ chạy 1 lần)
	// Nghĩa là không có gì thay đổi thì sẽ ko chạy lại

	return (
        <View>
            <UIHeader title='Chat' leftIcon={leftIcon} rightIcon={rightIcon}
			onPressLeft={() => Alert.alert('Left')}
			onPressRight={() => Alert.alert('Left')}

			></UIHeader>
			{/* <Image style={{width: 50, height: 50}} source={{uri: 'https://randomuser.me/portraits/men/60.jpg'}}></Image> */}
            <View style={styles.unreadMessages}>
				<Text style={{color: 'black', fontSize: 14}}>6 unread messages</Text>
				<TouchableOpacity style={{padding: 15}} onPress={() => Alert.alert('You pressed delete')}>
                	<ImageBackground style={{width: 16, height: 16,}} source={trash}></ImageBackground>
            	</TouchableOpacity>
			</View>
			{/* <FlatList style={styles.flatList} data={users}
			renderItem={({item}) => <ChatItem onPress={() => {
				navigation.navigate('Messenger', {user: item})		// Cái user: item là để truyền prop cho route của Messenger
			}}
			user = {item} key = {item.name}/>}	
			keyExtractor={item => item.name}
			/> */}
			<ScrollView>
				{users.map((user) => {
					return <ChatItem onPress={() => {
						navigation.navigate('Messenger', {user: user})		// Cái user: item là để truyền prop cho route của Messenger
					}}
					user = {user} key = {user.name}/>
				})}
			</ScrollView>
        </View>
	);
}

const styles = StyleSheet.create({
	unreadMessages: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
        marginStart: 10,

	},

	flatList: {
		// backgroundColor: 'red'
	}
});

export default Chat;
