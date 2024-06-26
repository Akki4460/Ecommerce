import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Image
} from "react-native";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import axios from "axios";
import ProductItem from "../components/ProductItem";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";

import jwt_decode from "jwt-decode";
import { IpType } from "../IpContext";




const HomeScreen = () => {

  const list = [
    {
      id: "0",
      image: "https://miro.medium.com/v2/resize:fit:1400/1*r6PVg6Cb9XkHZlE1UBL3QQ.png",
      name: "Home",
    },
    {
      id: "1",
      image: "https://static.vecteezy.com/system/resources/previews/012/714/985/original/best-deal-banner-label-icon-flat-design-illustration-on-white-background-vector.jpg",
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
        "https://m.media-amazon.com/images/I/71kyay3ojSL._SX569_.jpg",
      name: "Women",
    },
    {
      id: "5",
      image:
        "https://m.media-amazon.com/images/I/61+8uIokx8L._SX679_.jpg",
      name: "Specs",
    },
    {
      id: "6",
      image: "https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg",
      name: "Fashion",
    },
  ];
  const images = [
    "https://m.media-amazon.com/images/S/aplus-media-library-service-media/acdecf1c-ff68-4275-91e1-a93f9a0a2c57.__CR0,0,970,600_PT0_SX970_V1___.jpg",
    require("../assets/post1.png"),
    "https://m.media-amazon.com/images/S/aplus-media-library-service-media/378e5317-5222-4dfa-9142-127617831646.__CR0,0,970,600_PT0_SX970_V1___.jpg",
  ];
  const deals = [
    {
      id: "20",
      title: "SELLORIA Brand Boy's Combo Pack of with Black Sunglass with Black Baseball Cap",
      oldPrice: 600,
      price: 1900,
      image:
        "https://m.media-amazon.com/images/I/41PeyJvD7UL._SX679_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/41XZPj6tXcL._SX679_.jpg",
        "https://m.media-amazon.com/images//61uaJPLIdML._SX679_.jpg",
        "https://m.media-amazon.com/images/I/510YZx4v3wL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61J6s1tkwpL._SX679_.jpg",
      ],
      color: "Black",
      size: "Adjustable",
    },
    {
      id: "30",
      title:
        "RodZen Couple Men's & Women's Cotton Oversized Cow Printed T-Shirts (Pack of 2)",
      oldPrice: 74000,
      price: 26000,
      image:
        "https://m.media-amazon.com/images/I/719ot6KBCcL._SX679_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/719ot6KBCcL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/719ot6KBCcL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/719ot6KBCcL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/719ot6KBCcL._SX679_.jpg"
      ],
      color: "Cloud Navy",
      size: "8 GB RAM 128GB Storage",
    },
    {
      id: "40",
      title:
        "BLINKIN Cotton Pyjamas for Women Combo Pack of 2 with Side Pockets",
      oldPrice: 16000,
      price: 14000,
      image:
        "https://m.media-amazon.com/images/I/61plSRE0psL._SX679_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/61plSRE0psL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61plSRE0psL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61plSRE0psL._SX679_.jpg"
      ],
      color: "Icy Silver",
      size: "6 GB RAM 64GB Storage",
    },
    {
      id: "40",
      title:
        "realme narzo N55 (Prime Blue, 4GB+64GB) 33W Segment Fastest Charging | Super High-res 64MP Primary AI Camera",
      oldPrice: 12999,
      price: 10999,
      image:
        "https://m.media-amazon.com/images/I/61gdeZOVcyL._SY741_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/61gdeZOVcyL._SY741_.jpg",
        "https://m.media-amazon.com/images/I/61gdeZOVcyL._SY741_.jpg",
        "https://m.media-amazon.com/images/I/61gdeZOVcyL._SY741_.jpg",
      ],
    },
  ];
  const offers = [
    {
      id: "0",
      title:
        "Oppo Enco Air3 Pro True Wireless in Ear Earbuds with Industry First Composite Bamboo Fiber, 49dB ANC, 30H Playtime, 47ms Ultra Low Latency,Fast Charge,BT 5.3 (Green)",
      offer: "72% off",
      oldPrice: 7500,
      price: 4500,
      image:
        "https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg",
      ],
      color: "Green",
      size: "Normal",
    },
    {
      id: "1",
      title:
        "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg",
      ],
      color: "black",
      size: "Normal",
    },
    {
      id: "2",
      title: "Aishwariya System On Ear Wireless On Ear Bluetooth Headphones",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://m.media-amazon.com/images/I/41t7Wa+kxPL._AC_SY400_.jpg",
      carouselImages: ["https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg"],
      color: "black",
      size: "Normal",
    },
    {
      id: "3",
      title:
        "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
      offer: "40%",
      oldPrice: 24999,
      price: 19999,
      image: "https://m.media-amazon.com/images/I/71k3gOik46L._AC_SY400_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg",
        "https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg",
      ],
      color: "Norway Blue",
      size: "8GB RAM, 128GB Storage",
    },
  ];

  const {ip,setIp} = useContext(IpType)

  const [modalVisible, setModalVisible] = useState(false);
  const { userId, setUserId } = useContext(UserType);
  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState("");
  console.log(selectedAddress)

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("men's clothing");

  const [items, setItems] = useState([
    { label: "Men's clothing", value: "men's clothing" },
    { label: "jewelery", value: "jewelery" },
    // { label: "electronics", value: "electronics" },
    { label: "women's clothing", value: "women's clothing" },
  ]);
  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);

  // For redux state.storecart.cartRedcucercart
  const cart = useSelector((state) => state.cart.cart);

  console.log(cart);

  const navigation = useNavigation();

  // getting api from fetch store api
  const [products, setProducts] = useState([])


  useEffect(() => {
    // Fetching data from fakeproduct api
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products")
        setProducts(response.data);

      } catch (err) {
        console.log("error message", err)
      }
    }

    fetchData();
  }, []);

  // If user id exists then only fetch addresses
  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://${ip}:8000/addresses/${userId}`
      );
      const { addresses } = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };


  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      // const decodedToken = jwt_decode(token);
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId)
    }

    fetchUser();
  }, []);


  // console.log("address", addresses);


  return (
    <>
      <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 0 : 0, flex: 1, backgroundColor: "#ffffff" }}>

        <ScrollView>
          {/* Search Bar */}
          <View
            style={{
              backgroundColor: "#a767ff",
              // backgroundColor: "#ff1d58",
              paddingTop: 20,
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

            <Feather name="mic" size={24} color="black" />
          </View>

          {/* Location Bar */}

          <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ flexDirection: "row", alignItems: "center", padding: 10, gap: 5, backgroundColor: "#e2b2ff" }}>
            <Entypo name="location-pin" size={24} color="#ff1d58" />
            <Pressable>
              {selectedAddress ? (
                <Text>
                  Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                  Add a Address
                </Text>
              )}
              {/* <Text style={{ color: "black" }}>Deliver to address</Text> */}
            </Pressable>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </Pressable>



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
                {/* <View style={{borderRadius:50, borderColor:'#a767ff', padding:2, borderWidth:1 }}> */}

                <Image
                  style={{ width: 50, height: 50, borderRadius: 50, resizeMode: "contain" }}
                  source={{ uri: item.image }}
                />
                {/* </View> */}

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

          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            Trending Deals of the week
          </Text>
          {/* Trending deals product */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {deals.map((item, index) => (
              <Pressable
                key={index}

                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })
                }
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 180, height: 180, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />
              </Pressable>
            ))}
          </View>
          {/* Border */}
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />


          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            Today's Deals
          </Text>

          {/* Todays deals cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {offers.map((item, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })
                }
                style={{
                  marginVertical: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ width: 120, height: 120, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />

                <View
                  style={{
                    backgroundColor: "#E31837",
                    paddingVertical: 5,
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    Upto {item?.offer}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />


          {/*  Dropdown picker for categories to choose */}


          <View
            style={{
              marginHorizontal: 10,
              marginTop: 20,
              width: "45%",
              marginBottom: open ? 50 : 15,
            }}
          >

            <DropDownPicker
              style={{
                borderColor: "#B7B7B7",
                height: 30,
                marginBottom: open ? 120 : 15,
              }}
              open={open}
              value={category} //genderValue
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder="choose category"
              placeholderStyle={styles.placeholderStyles}
              onOpen={onGenderOpen}
              // onChangeValue={onChange}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          {/* Products from fakestore api */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
            {products
              ?.filter((item) => item.category === category)
              .map((item, index) => (
                <ProductItem item={item} key={index} />
              ))}
          </View>

        </ScrollView>
      </SafeAreaView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 400 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Choose your Location
            </Text>

            <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
              Select a delivery location to see product availabilty and delivery
              options
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* already added addresses */}
            {addresses?.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedAddress(item)}
                style={{
                  width: 140,
                  height: 140,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 3,
                  marginRight: 15,
                  marginTop: 10,
                  backgroundColor: selectedAddress === item ? "#FBCEB1" : "white"
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                    {item?.name}
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.houseNo},{item?.landmark}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.street}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  India
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address");
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0066b2",
                  fontWeight: "500",
                }}
              >
                Add an Address or pick-up point
              </Text>
            </Pressable>
          </ScrollView>

          <View style={{ flexDirection: "column", gap: 7, marginBottom: 30 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="location-pin" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Enter an Indian pincode
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="locate-sharp" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Use My Currect location
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <AntDesign name="earth" size={22} color="#0066b2" />

              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Deliver outside India
              </Text>
            </View>
          </View>



        </ModalContent>

      </BottomModal>
    </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})