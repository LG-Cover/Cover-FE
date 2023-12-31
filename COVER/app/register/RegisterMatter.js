import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Link, useRouter, useLocalSearchParams, Stack } from 'expo-router';
import Axios from 'axios';

import GetURL from './../components/GetURL';

function RegisterMatter () {
    const router = useRouter();

    const addDevice = () => {
        const baseurl = GetURL();
        Axios.post(baseurl + `/registerdevice/0`)
        .then(res => {
            while (router.canGoBack()) {
                router.back();
            }
            router.replace('/Home');
        })
        .catch(error => console.log(error));
    }
    

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{headerShown: false}}
            />

            <View style={styles.headerContainer}>
                <View style={styles.goBackBtnContainer}>
                    <Pressable onPress={() => router.back()} style={({pressed}) => [{}, pressed && styles.pressedItem]}>
                        <Text style={styles.goBackBtnText}>{'<'}</Text>
                    </Pressable>
                </View>
            </View>

            <View style={deviceBlock.container}>
                <Text style={deviceBlock.title}>전등</Text>
                <View style={deviceBlock.textContainer}>
                    <Text style={deviceBlock.text}>인식된 제품이 맞나요?</Text>
                    <Text style={deviceBlock.text}>제품을 추가할까요?</Text>
                </View>
                
                <View><Image source={require('./../../assets/images/devices/light.png')} style={deviceBlock.img}/></View>
                <Pressable onPress={addDevice} style={({pressed}) => [deviceBlock.btn, pressed && styles.pressedItem]}><Text style={deviceBlock.btnText}>추가하기</Text></Pressable>
            </View>

            
        </View>
        
    )
}

export default RegisterMatter;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 20,
    },
    headerContainer: {
        width: '100%',
        height: 100,
        position: 'relative'
    },
    goBackBtnContainer: {
        position: 'absolute',
        top: 40,
        left: 0,
    },
    goBackBtnText: {
        fontSize: 20,
        lineHeight: 32,
        transform: [{scaleY: 1.6}],
    },
    pressedItem: {
        opacity: 0.7
    }
    
});

const deviceBlock = StyleSheet.create({
    container: {
        width: '100%',
        height: 700,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: 'rgb(58, 117, 230)',
        marginBottom: 20
    },
    textContainer: {
        marginTop: 15,
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10
    },
    modelContainer: {
        marginTop: 15,
        alignItems: 'center'
    },
    modelText: {
        fontSize: 12,
        fontWeight: '400'
    },
    img: {
        height: 400,
        resizeMode: 'contain',
    },
    btn: {
        width: 130,
        height: 30,
        backgroundColor: 'rgba(58, 117, 230, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15
    },
    btnText: {
        fontSize: 16,
        fontWeight: '400',
        color: 'white'
    }

})