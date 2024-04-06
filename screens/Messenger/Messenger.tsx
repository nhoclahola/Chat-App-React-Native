/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
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
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';

import {
	Colors,
	DebugInstructions,
	Header,
	LearnMoreLinks,
	ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import UIHeader from '../../components/UIHeader';
import MessengerItem from './MessengerItem';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseDatabase, firebaseDatabaseRef, firebaseDatabaseSet, get, onValue } from '../../firebase/firebase';
import firebase from 'firebase/compat/app';

type User = {
	user: {
		url: string,
		name: string,
		message: string,
		numberOfUnreadMessages: number,
		userId: string,
	}
}

// Định nghĩa kiểu của route.params
type SectionRouteParams = {
	user: User;
};

type SectionProps = {
	navigation: NavigationProp<any, any>
	route: RouteProp<SectionRouteParams, 'user'>;
};

function Messenger({ navigation, route }: SectionProps): React.JSX.Element {
	const { user } = route.params;
	const leftIcon = require('./img/back.png')
	const rightIcon = require('./img/menu-dots.png')

	const [typedText, setTypedText] = useState('')
	

	const [chatHistory, setChatHistory] = useState([
		// {
		// 	url: 'https://randomuser.me/portraits/men/70.jpg',
		// 	isSender: true,
		// 	showUrl: false,
		// 	messenger: 'Hello',
		// 	timestamp: 1711888114000,		//Dạng millisecond
		// },
	])

	useEffect(() => {
		const dbRef = firebaseDatabaseRef(firebaseDatabase)
		// Lấy collection users, dùng onValue để khi db có thay đổi thì sẽ thay đổi components
		onValue(firebaseDatabaseRef(firebaseDatabase, 'chats'), async (snapshot) => 
		{
			if (snapshot.exists()) 
			{
				// Lấy ra người dùng hiện tại
				await AsyncStorage.getItem('user').then((stringUser) => {
					let myUserId = JSON.parse(stringUser)['uid'];
					let snapShotObject = snapshot.val();

					// Tạo cả hai trường hợp key
					const chatKey1 = `${myUserId}-${user.userId}`
					const chatKey2 = `${user.userId}-${myUserId}`

					// // Lấy danh sách messageId từ cả hai trường hợp từ cấu trúc dữ liệu Firebase
					let messageIdList = Object.keys(snapShotObject[chatKey1] || {}).concat(Object.keys(snapShotObject[chatKey2] || {}))

					// Tạo mảng mới chứa thông tin của mỗi tin nhắn
					let updatedChatHistory = messageIdList.map((messageId) => {
						// Kiểm tra xem tin nhắn có tồn tại trong trường hợp chatKey1 hay không
						let messageData = snapShotObject[chatKey1]?.[messageId]

						// Nếu không tồn tại, thử lấy từ trường hợp chatKey2
						if (!messageData) {
							messageData = snapShotObject[chatKey2]?.[messageId]
						}

						// Trả về đối tượng tin nhắn
						return {
							url: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg',
							messageId: messageId,
							senderId: messageData.senderId,
							receiverId: messageData.receiverId,
							content: messageData.content,
							timestamp: messageData.timestamp,
							isSender: messageData.senderId === myUserId,
						};
					});

					updatedChatHistory.sort((a, b) => b.timestamp - a.timestamp)

					// Đặt chatHistory bằng danh sách các tin nhắn đã được xử lý
					setChatHistory(updatedChatHistory)
				})
				// .catch((error) => {
				// 	console.error(`Cannot get user data from AsyncStorage: ${error}`);
				// });
			}
			else 
				console.log('No data availble')
		})
			// get(firebaseDatabaseRef(firebaseDatabase, 'chats'))
			// .then(async (snapshot) => {
			// 	if (snapshot.exists()) {
			// 		// Lấy ra người dùng hiện tại
			// 		await AsyncStorage.getItem('user').then((stringUser) => {
			// 			let myUserId = JSON.parse(stringUser)['uid'];
			// 			let snapShotObject = snapshot.val();

			// 			// Lấy danh sách các messageId từ cấu trúc dữ liệu Firebase
			// 			let messageIdList = Object.keys(snapShotObject[`${myUserId}-${user.userId}`] || {});

			// 			// Tạo mảng mới chứa thông tin của mỗi tin nhắn
			// 			let updatedChatHistory = messageIdList.map((messageId) => {
			// 				let messageData = snapShotObject[`${myUserId}-${user.userId}`][messageId];
			// 				return {
			// 					messageId: messageId,
			// 					senderId: messageData.senderId,
			// 					receiverId: messageData.receiverId,
			// 					content: messageData.content,
			// 					timestamp: messageData.timestamp,
			// 					isSender: messageData.senderId === myUserId,
			// 				};
			// 			});

			// 			// Đặt chatHistory bằng danh sách các tin nhắn đã được xử lý
			// 			console.log(updatedChatHistory)
			// 			setChatHistory(updatedChatHistory);
			// 		}).catch((error) => {
			// 			console.error(`Cannot get user data from AsyncStorage: ${error}`);
			// 		});
			// 	} else {
			// 		console.log('No data available');
			// 	}
			// })
			// .catch((error) => {
			// 	console.error(`Cannot get chat data from Firebase: ${error}`);
			// });
	}, [])

	const [visibleMessages, setVisibleMessages] = useState(10); // State để lưu số lượng tin nhắn đã hiển thị

    // Function để xử lý sự kiện cuộn lên
    const handleScrollUp = () => {
        setVisibleMessages(prevVisibleMessages => prevVisibleMessages + 10);
    };

	const scrollViewRef = useRef();
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' || 'android' ? 'padding' : 'height'}>
				<UIHeader title={user.name} leftIcon={leftIcon} rightIcon={rightIcon}
					onPressLeft={() => navigation.goBack()}
					onPressRight={() => Alert.alert('Left')}

				></UIHeader>


				{/* <FlatList style={styles.flatList} data={chatHistory}
					renderItem={({ item }) => <MessengerItem onPress={() => {
						Alert.alert(`You pressed item name ${item.timestamp}`)
					}}
						item={item} key={`${item.timestamp}`} />}
				/> */}

				<FlatList
					style={styles.flatList}
					data={chatHistory.slice(0, visibleMessages)} // Chỉ hiển thị số lượng tin nhắn đã được xác định
					renderItem={({ item }) => (
						<MessengerItem
							onPress={() => {
								Alert.alert(`You pressed item name ${item.timestamp}`);
							}}
							item={item}
							key={item.timestamp}
						/>
					)}
					keyExtractor={item => item.timestamp.toString()}
					onEndReached={handleScrollUp} // Khi người dùng cuộn lên, gọi hàm để tăng số lượng tin nhắn hiển thị
					onEndReachedThreshold={0.1} // Khoảng cách từ cuối danh sách để gọi hàm onEndReached
					inverted // Đảo ngược danh sách để hiển thị tin nhắn mới nhất ở phía trên
				/>

				<View style={styles.chatInputWrapper}>
					<TextInput
						style={styles.chatInput} value={typedText} onChangeText={(typedText) => {
						setTypedText(typedText)
					}} placeholder='Enter your message' placeholderTextColor={'gray'}></TextInput>
					<TouchableOpacity onPress={async () => {
						if (typedText.trim().length == 0)	//Nếu input ko có j thì thôi
							return
						//get user id
						//"id1:id2": newMesageObject	
						// 1 gửi 2 nhận
						let stringUser = await AsyncStorage.getItem('user')		//lấy user từ lúc lưu ở Login (kiểu string)
						if (stringUser != null) {
							let myUserId = JSON.parse(stringUser)['uid']
							let yourUserId = user.userId
							// let newMessageObject = {
							// 	url: 'https://randomuser.me/portraits/men/70.jpg',
							// 	// isSender: true,
							// 	showUrl: true,
							// 	messenger: typedText,
							// 	timestamp: new Date().getTime(),
							// }
							// Keyboard.dismiss()
							// // Lưu vào firebase db
							// firebaseDatabaseSet(firebaseDatabaseRef(firebaseDatabase, `chats/${myUserId}-${yourUserId}`), newMessageObject)
							// 	.then(() => setTypedText(''))
							// 	.catch(() => Alert.alert('Không gửi được'))
							let newMessageObject = {
								senderId: myUserId,
								receiverId: yourUserId,
								content: typedText,
								timestamp: new Date().getTime(),
							};
							
							// Tạo một ID duy nhất cho tin nhắn mới sử dụng timestamp
							let messageId = String(newMessageObject.timestamp);

							// Lưu tin nhắn vào một nút mới trong cơ sở dữ liệu Firebase
							firebaseDatabaseSet(firebaseDatabaseRef(firebaseDatabase, `chats/${myUserId}-${yourUserId}/${messageId}`), newMessageObject)
							.then(() => setTypedText(''))
							.catch(() => Alert.alert('Không gửi được'));
						}
					}}>
						<Image style={styles.img} source={require('./img/send.png')} tintColor={'red'}></Image>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback >
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	unreadMessages: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginStart: 10,

	},

	flatList: {
		marginBottom: 20,
	},

	chatInputWrapper: {
		height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
	},

	chatInput: {
		paddingStart: 10,
		width: '80%',
		borderColor: 'red',
		borderWidth: 2,
		borderRadius: 20,
	},

	img: {
		width: 30,
		height: 30,
	},
});

export default Messenger;
