import React, {FC, useEffect, useRef, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {COLORS, FONTS, GOOGLE_API_KEY, icons, SIZES} from '../constants';

const OrderDelivery: FC<{route: any; navigation: any}> = ({
  route,
  navigation,
}): JSX.Element => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [streetName, setStreetName] = useState<string>('');
  const [fromLoc, setFromLoc] = useState<any>(null);
  const [toLoc, setToLoc] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const [duration, setDuration] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [angle, setAngle] = useState<number>(0);

  const mapViewRef = useRef<any>(null);

  useEffect(() => {
    let {restaurant, currentLocation} = route.params;

    let streetName = currentLocation.streetName;
    let toLoc = currentLocation.gps;
    let fromLoc = restaurant.location;

    let mapRegion = {
      latitude: (fromLoc.latitude + toLoc.latitude) / 2,
      longitude: (fromLoc.longitude + toLoc.longitude) / 2,
      latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
      longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2,
    };

    setRestaurant(restaurant);
    setStreetName(streetName);
    setFromLoc(fromLoc);
    setToLoc(toLoc);
    setRegion(mapRegion);
  }, []);

  const zoomIn = () => {
    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    };

    setRegion(newRegion);

    mapViewRef.current.animateToRegion(newRegion, 400);
  };
  const zoomOut = () => {
    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    };

    setRegion(newRegion);

    mapViewRef.current.animateToRegion(newRegion, 400);
  };

  const calculateAngle = coordinates => {
    let startLat = coordinates[0]['latitude'];
    let startLng = coordinates[0]['longitude'];
    let endLat = coordinates[1]['latitude'];
    let endLng = coordinates[1]['longitude'];

    let dx = endLat - startLat;
    let dy = endLng - startLng;

    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const RenderMap = (): JSX.Element => {
    const destinationMarker = (): JSX.Element => {
      return (
        <Marker coordinate={toLoc}>
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: COLORS.white,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
            }}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: COLORS.primary,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={icons.pin}
                style={{width: 20, height: 20, tintColor: COLORS.white}}
              />
            </View>
          </View>
        </Marker>
      );
    };

    const carMarker = (): JSX.Element => {
      return (
        <Marker
          coordinate={fromLoc}
          anchor={{x: 0.5, y: 0.5}}
          flat={true}
          rotation={angle}>
          <Image source={icons.car} style={{width: 40, height: 40}} />
        </Marker>
      );
    };

    return (
      <View style={{flex: 1}}>
        <MapView
          style={{flex: 1}}
          initialRegion={region}
          ref={mapViewRef}
          provider={PROVIDER_GOOGLE}>
          <MapViewDirections
            origin={toLoc}
            destination={fromLoc}
            apikey={GOOGLE_API_KEY}
            strokeWidth={5}
            strokeColor={COLORS.primary}
            optimizeWaypoints={true}
            onReady={res => {
              setDuration(res.duration);

              if (!isReady) {
                mapViewRef.current.fitToCoordinates(res.coordinates, {
                  edgePadding: {
                    right: SIZES.width / 20,
                    left: SIZES.width / 20,
                    bottom: SIZES.height / 4,
                    top: SIZES.height / 8,
                  },
                });

                let newLoc: any = {
                  latitude: res.coordinates[0]['latitude'],
                  longitude: res.coordinates[0]['longitude'],
                };

                if (res.coordinates.length >= 2) {
                  let angle: any = calculateAngle(res.coordinates);
                  setAngle(angle);
                }

                setFromLoc(newLoc);
                setIsReady(true);
              }
            }}
          />

          {destinationMarker()}
          {carMarker()}
        </MapView>
      </View>
    );
  };

  const RenderDestinationHeader = (): JSX.Element => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 50,
          width: SIZES.width,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding,
            paddingHorizontal: SIZES.padding * 2,
            backgroundColor: COLORS.white,
            borderRadius: SIZES.radius,
            alignItems: 'center',
          }}>
          <Image
            source={icons.red_pin}
            style={{width: 30, height: 30, marginRight: SIZES.padding}}
          />

          <View style={{flex: 1}}>
            <Text style={{...FONTS.body3}}>{streetName}</Text>
          </View>

          <Text style={{...FONTS.body3}}>{Math.ceil(duration)} min</Text>
        </View>
      </View>
    );
  };

  const RenderDeliveryInfo = (): JSX.Element => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          width: SIZES.width,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: SIZES.width * 0.9,
            paddingHorizontal: SIZES.padding * 2,
            paddingVertical: SIZES.padding * 3,
            backgroundColor: COLORS.white,
            borderRadius: SIZES.radius,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={restaurant?.courier.avatar}
              style={{width: 50, height: 50, borderRadius: 25}}
            />

            <View style={{flex: 1, marginLeft: SIZES.padding}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{...FONTS.h4}}>{restaurant?.courier.name}</Text>

                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={icons.star}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: COLORS.primary,
                      marginRight: SIZES.padding,
                    }}
                  />
                  <Text style={{...FONTS.body3}}>{restaurant?.rating}</Text>
                </View>
              </View>

              <Text style={{color: COLORS.darkgray, ...FONTS.body4}}>
                {restaurant?.name}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: SIZES.padding * 2,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{
                flex: 1,
                height: 50,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                marginRight: 10,
              }}>
              <Text style={{...FONTS.h4, color: COLORS.white}}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                flex: 1,
                height: 50,
                backgroundColor: COLORS.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Text style={{...FONTS.h4, color: COLORS.white}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const RenderZoomButtons = (): JSX.Element => {
    return (
      <View
        style={{
          position: 'absolute',
          right: SIZES.padding * 2,
          bottom: SIZES.height * 0.35,
          width: 60,
          height: 130,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => zoomIn()}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{...FONTS.body1}}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => zoomOut()}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{...FONTS.body1}}>-</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {RenderMap()}
      {RenderDestinationHeader()}
      {RenderDeliveryInfo()}
      {RenderZoomButtons()}
    </View>
  );
};

export default OrderDelivery;
