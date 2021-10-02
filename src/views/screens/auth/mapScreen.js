import React from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import MapView from 'react-native-maps'

const screenHeight = Dimensions.get("screen").height
const screenWidth = Dimensions.get("screen").width

const mapScreen = async () => {

    return (
        <View style={styles.screen}>
            <MapView
                initialRegion={{
                    latitude: 3.1179567,
                    longitude: 101.67398,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                }}
                style={styles.mapView} />
        </View>
    )
}

const styles = StyleSheet.create({
    mapView: {
        height: screenHeight,
        width: screenWidth
    },
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
    
})

export default mapScreen