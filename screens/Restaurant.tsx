import React, {FC, useEffect, useState} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, FONTS, icons, SIZES} from '../constants';

const Restaurant: FC<{route: any; navigation: any}> = ({route, navigation}) => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [orderedItem, setOrderedItem] = useState<any>([]);

  useEffect(() => {
    let {item, currentLocation} = route.params;
    setRestaurant(item);
    setCurrentLocation(currentLocation);
  });

  let scrollX: any = new Animated.Value(0);

  const editOrder = (action: string, menuId: number, price: number) => {
    let orderList: any[] = orderedItem.slice();
    let item: any[] = orderList.filter(i => i.menuId === menuId);

    if (action === '+') {
      if (item.length > 0) {
        let newQty: number = item[0].qty + 1;
        item[0].qty = newQty;
        item[0].total = price * newQty;
      } else {
        const newItem = {
          menuId: menuId,
          qty: 1,
          price: price,
          total: price,
        };
        orderList.push(newItem);
      }
      setOrderedItem(orderList);
    } else {
      if (item.length > 0) {
        if (item[0]?.qty > 0) {
          let newQty = item[0].qty - 1;
          item[0].qty = newQty;
          item[0].total = price * newQty;
        }
      }
      setOrderedItem(orderList);
    }
  };

  const getOrderQty = (menuId: number) => {
    let orderItem: any[] = orderedItem.filter(i => i.menuId === menuId);
    if (orderItem.length > 0) {
      return orderItem[0].qty;
    } else {
      return 0;
    }
  };

  const getBasketItemCount = () => {
    let itemCount = orderedItem.reduce(
      (a: number, b: any) => a + (b.qty || 0),
      0,
    );

    return itemCount;
  };

  const getBasketTotalPrice = () => {
    let totalPrice = orderedItem.reduce((a, b) => a + (b.total || 0), 0);
    return totalPrice.toFixed(2);
  };

  const RenderHeader = (): JSX.Element => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 50,
        }}>
        <TouchableOpacity
          style={{
            width: 50,
            justifyContent: 'center',
            paddingLeft: SIZES.padding * 2,
          }}
          onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              width: '70%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.lightGray3,
              borderRadius: SIZES.radius,
            }}>
            <Text style={{...FONTS.h3}}>{currentLocation?.streetName}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            width: 50,
            justifyContent: 'center',
            paddingRight: SIZES.padding * 2,
          }}>
          <Image
            source={icons.list}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const RenderFoodItem = (): JSX.Element => {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToAlignment="center"
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          {useNativeDriver: false},
        )}>
        {restaurant?.menu.map((item: any, index: number) => {
          return (
            <View key={`menu-${index}`} style={{alignItems: 'center'}}>
              <View style={{height: SIZES.height * 0.35}}>
                <Image
                  source={item.photo}
                  resizeMode="cover"
                  style={{width: SIZES.width, height: '100%'}}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: -20,
                    width: SIZES.width,
                    height: 50,
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => editOrder('-', item.menuId, item.price)}
                    style={{
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottomLeftRadius: 25,
                      borderTopLeftRadius: 25,
                      backgroundColor: COLORS.white,
                    }}>
                    <Text style={{...FONTS.body1}}>-</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.white,
                    }}>
                    <Text style={{...FONTS.h2}}>
                      {getOrderQty(item.menuId)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => editOrder('+', item.menuId, item.price)}
                    style={{
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottomRightRadius: 25,
                      borderTopRightRadius: 25,
                      backgroundColor: COLORS.white,
                    }}>
                    <Text style={{...FONTS.body1}}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  marginTop: 15,
                  alignItems: 'center',
                  width: SIZES.width,
                  paddingHorizontal: SIZES.padding * 2,
                }}>
                <Text
                  style={{
                    marginVertical: 10,
                    textAlign: 'center',
                    ...FONTS.h2,
                  }}>
                  {item.name} - {item.price.toFixed(2)}
                </Text>
                <Text style={{...FONTS.body3}}>{item.description}</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.fire}
                    style={{width: 20, height: 20, marginRight: 10}}
                  />
                  <Text style={{...FONTS.body3, color: COLORS.darkgray}}>
                    {item.calories.toFixed(2)} cal
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
    );
  };

  const RenderDots = (): JSX.Element => {
    const dotPosition = Animated.divide(scrollX, SIZES.width);

    return (
      <View style={{height: 30}}>
        <View
          style={{
            flexDirection: 'row',
            height: SIZES.padding,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {restaurant?.menu.map((item: any, index: number) => {
            const dotOpacity = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            const dotSize = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
              extrapolate: 'clamp',
            });
            const dotColor = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={`dot-${index}`}
                style={{
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: dotColor,
                  borderRadius: SIZES.radius,
                  marginHorizontal: 6,
                  opacity: dotOpacity,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const RenderOrder = (): JSX.Element => {
    return (
      <View>
        {RenderDots()}
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: SIZES.padding * 3,
              paddingVertical: SIZES.padding * 2,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.lightGray2,
            }}>
            <Text style={{...FONTS.h3}}>
              {getBasketItemCount()} Item in cart
            </Text>
            <Text style={{...FONTS.h3}}>$ {getBasketTotalPrice()}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: SIZES.padding * 3,
              paddingVertical: SIZES.padding * 2,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={icons.pin}
                style={{width: 20, height: 20, tintColor: COLORS.darkgray}}
              />
              <Text style={{...FONTS.h4, marginLeft: SIZES.padding}}>
                Location
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Image
                source={icons.master_card}
                style={{width: 20, height: 20, tintColor: COLORS.darkgray}}
              />
              <Text style={{...FONTS.h4, marginLeft: SIZES.padding}}>8888</Text>
            </View>
          </View>

          <View
            style={{
              padding: SIZES.padding * 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('OrderDelivery', {
                  restaurant,
                  currentLocation,
                })
              }
              style={{
                backgroundColor: COLORS.primary,
                width: SIZES.width * 0.9,
                borderRadius: SIZES.radius,
                padding: SIZES.padding,
                alignItems: 'center',
              }}>
              <Text style={{color: COLORS.white, ...FONTS.h2}}>Order</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isIphoneX() && (
          <View
            style={{
              backgroundColor: COLORS.white,
              position: 'absolute',
              bottom: -30,
              width: SIZES.width,
              height: 30,
            }}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {RenderHeader()}
      {RenderFoodItem()}
      {RenderOrder()}
    </SafeAreaView>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
  },
});
