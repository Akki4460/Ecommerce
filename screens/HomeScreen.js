import { StyleSheet, Text, View, SafeAreaView, Platform, ScrollView, Pressable, TextInput, Image } from 'react-native'
import React from 'react'

import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import { SliderBox } from 'react-native-image-slider-box'

const HomeScreen = () => {

  const list = [
    {
      id: "0",
      image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/c/2/c2baa3aHZ-S-NAVY_1.jpg?rnd=20200526195200&tr=w-256",
      name: "Home",
    },
    {
      id: "1",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg",
      name: "Deals",
    },
    {
      id: "3",
      image:
        "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/c/2/c2baa3aHZ-S-NAVY_1.jpg?rnd=20200526195200&tr=w-256",
      name: "Mens",
    },
    {
      id: "4",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg",
      name: "Women",
    },
    {
      id: "5",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg",
      name: "Specs",
    },
    {
      id: "6",
      image: "https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg",
      name: "Fashion",
    },
  ];
  const images = [
    "https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/BB/JULY/1242x550_Header-BB-Jul23.jpg",
  ];

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 30 : 0, flex: 1, backgroundColor: "#ffffff" }}>

      <ScrollView>
        {/* Search Bar */}
        <View
          style={{
            backgroundColor: "#525CEB",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 7,
              gap: 10,
              backgroundColor: "white",
              borderRadius: 30,
              height: 38,
              flex: 1,
            }}
          >
            <Feather style={{ paddingLeft: 10 }} name="search" size={24} color="black" />
            <TextInput placeholder="Search LFT.in" />
          </Pressable>

          <Feather name="mic" size={24} color="white" />
        </View>

        {/* Location Bar */}

        <View style={{ flexDirection: "row", alignItems: "center", padding: 10, gap: 5, backgroundColor: "#617CeB" }}>
          <Entypo name="location-pin" size={24} color="white" />
          <Pressable>
            <Text style={{ color: "white" }}>Deliver to address</Text>
          </Pressable>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
        </View>



        {/* Category Section */}

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {list.map((item, index) => (
            <Pressable
              key={index}
              style={{
                margin: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{ width: 50, height: 50, resizeMode: "contain" }}
                source={{ uri: item.image }}
              />

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: "500",
                  marginTop: 5,
                }}
              >
                {item?.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

      {/* Image slider */}
        <SliderBox
            images={images}
            autoPlay
            circleLoop
            dotColor={"#13274F"}
            inactiveDotColor="#90A4AE"
            ImageComponentStyle={{ width: "100%" }}
          />

      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})