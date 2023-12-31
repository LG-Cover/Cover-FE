import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import Swiper from 'react-native-swiper';
import Axios from 'axios';

import MenuBtn from './components/MenuBtn';
import NavigationSwiper from './components/NavigationSwiper';
import GetURL from './components/GetURL';
import ControlModal from './components/ControlModal';
import DeviceBlock from './components/DeviceBlock';

const BedroomArr = [
    {name: '전등', onoff: '꺼짐', state: '', deviceImg: 0, networkImg: 1, isActive: false},
    {name: '에어컨', onoff: '꺼짐', state: '23°C 냉방', deviceImg: 1, networkImg: 2, isActive: false},
    {name: 'TV', onoff: '꺼짐', state: 'YouTube 시청 중', deviceImg: 2, networkImg: 1, isActive: false},
    {name: '공기청정기', onoff: '켜짐', state: '공기질 좋음', deviceImg: 3, networkImg: 0, isActive: true},
    {name: '와인 셀러', onoff: '켜짐', state: '16°C', deviceImg: 4, networkImg: 0, isActive: true},
    {name: '청소기', onoff: '꺼짐', state: '충전중', deviceImg: 5, networkImg: 0, isActive: false},
    {name: '세탁기', onoff: '꺼짐', state: '오후 6시에 예약', deviceImg: 6, networkImg: 0, isActive: false},
];


const home = () => {    
    const [livingroomArr, setLivingroomArr] = useState([]);
    const [modalIsVisible, setModalisVisible] = useState(false);

    useEffect(() => {
        const getDevices = () => {
            const baseurl = GetURL();
            Axios.get(baseurl + '/home')
            .then(res => {
                setLivingroomArr(res.data);
            })
            .catch("/home : getDevices : ", error => console.log(error));
        };
    
        getDevices();
    }, []);


    const toggleDevice = (id) => {
        const baseurl = GetURL();
        Axios.post(baseurl + `/togglepower/${id}`)
        .then(res => {
            setLivingroomArr(res.data);
            console.log(res.data);
        })
        .catch("/home : toggleDevice : ", error => console.log(error));
    };

    const openControlModal = () => {
        setModalisVisible(true);
    }
    const closeControlModal = (modalState, modalSliderValue) => {
        setModalisVisible(false);
        // console.log("Modal State:", modalState);
        // console.log("Modal Slider Value:", modalSliderValue);

        const baseurl = GetURL();
        const data = {
            state: modalState,
            sliderValue: modalSliderValue
        };

        Axios.post(baseurl + '/update/1', data)
        .then(res => {
            const updatedArr = livingroomArr.map(item => {
                if (item.deviceImg === 1) {
                    return { ...item, 
                        onoff: res.data.onoff,
                        isActive: res.data.isActive,
                        state: res.data.state
                    };
                }
                return item;
            });
        
            setLivingroomArr(updatedArr);
            console.log(res.data);
        })
        .catch(error => {
            console.error("/home : closeControlModal : POST failed : ", error);
        });
    }

    return (
        <View style={styles.container}>
            <MenuBtn/>

            <ScrollView>
                <NavigationSwiper/>
                <View >
                    <Text style={styles.userHome}>송우정 홈</Text>
                </View>
                <View >
                    <Text style={styles.roomName}>거실 - COVER</Text>
                    <View style={styles.coverRoomContainer}>
                        {livingroomArr.map((item, index) => (
                            <Pressable 
                                key={item.id} 
                                onPress={() => toggleDevice(item.id)}
                                onLongPress={openControlModal}
                                style={({ pressed }) => [
                                    styles.deviceBlock, 
                                    item.isActive ? styles.activeDevice : styles.inactiveDevice,
                                    pressed ? styles.pressedItem : {}
                                ]}
                            >
                                <DeviceBlock item={item}></DeviceBlock>
                            </Pressable>

                        ))}
                        <Pressable style={({pressed}) => [{}, pressed && styles.pressedItem]}
                            onPress={() => router.push('./register/RegisterDevice')}>
                            <View key={"addDeviceBlock1"} style={[styles.deviceBlock, styles.addDeviceBlock]}>
                                <Image source={require('./../assets/images/devices/plus.png')} style={styles.plus}/>
                            </View>
                        </Pressable>
                    </View>
                </View>

                <ControlModal visible={modalIsVisible} onClose={closeControlModal}/>

                <View >
                    <Text style={styles.roomName}>안방</Text>
                    <View style={styles.coverRoomContainer}>
                        {BedroomArr.map((item, index) => (
                            <View key={index} style={[styles.deviceBlock, item.isActive ? styles.activeDevice : styles.inactiveDevice]}>
                                {/* <Image style={styles.deviceImage} source={item.deviceImg}/>
                                <Text style={styles.deviceNameText}>{item.name}</Text>
                                <Text style={styles.deviceOnOffText}>{item.onoff}</Text>
                                <Text style={styles.deviceStateText}>{item.state}</Text>
                                <Image style={styles.networkImage} source={item.networkImg} /> */}
                                <DeviceBlock item={item}></DeviceBlock>
                            </View>
                        ))}
                        <View key={"addDeviceBlock1"} style={[styles.deviceBlock, styles.addDeviceBlock]}>
                            <Image source={require('./../assets/images/devices/plus.png')} style={styles.plus}/>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 20,
    },
    userHome: {
        fontSize: 17,
        fontWeight: '700',
        marginVertical: 10
    },
    roomName: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 10,
        marginVertical: 5
    },
    coverRoomContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        width: 390,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20
    },
    deviceBlock: {
        width: 180,
        height: 100,
        borderRadius: 10, 
        backgroundColor: 'white',
        padding: 10,
        margin: 7,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset:  {width: 0, height: 4},
        borderWidth: 2,
        borderColor: 'white',
    },
    activeDevice: {
        backgroundColor: 'white'
    },
    inactiveDevice: {
        backgroundColor: 'rgb(210, 210, 210)'
    },
    deviceImage: {
        resizeMode: 'contain',
        height: 25,
        width: 'auto',
        marginLeft: -130,
        marginBottom: 5
    },
    deviceNameText: {
        position: 'absolute',
        top: 40,
        left: 10,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 4
    },
    deviceOnOffText: {
        position: 'absolute',
        top: 55,
        left: 10,
        fontSize: 12,
        fontWeight: '400',
        color: 'rgba(0, 0, 0, 0.5)',
        marginVertical: 1.5
    },
    deviceStateText: {
        position: 'absolute',
        top: 69,
        left: 10,
        fontSize: 12,
        fontWeight: '400',
        color: 'rgba(0, 0, 0, 0.5)',
        marginVertical: 1.5
    },
    networkImage: {
        // position: 'absolute',
        resizeMode: 'contain',
        height: 20,
        width: 'auto',
        // marginTop: -15,
        // marginRight: -145,
        marginTop: 30,
        marginRight: -140
    },
    addDeviceBlock: {
        opacity: 0.75,
        justifyContent: 'center',
        alignItems: 'center'
    },
    plus: {
        height: 60,
        width: 60
    },
    pressedItem: {
        opacity: 0.7
    }
});
