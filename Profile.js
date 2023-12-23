import React, { useContext, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { Context } from "./Context";
import { useState } from "react";
import Loading from "./Loading";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FavoriteRatingWatchList from "./FavoriteRatingWatchList";
import SettingsTabs from "./Setting";
import FavActorStack from "./FavActorList";
import PersonProfileStack from "./PersonProfile";
import ShowDetails from "./ShowDetails";
import MovieDetail from "./MovieDetail";
const Stack = createStackNavigator();
const Profile = () => {
  const navigation = useNavigation();
  const {
    sessionId,
    accountDetail,
    setAccountDetail,
    setSessionId,
    setApproved,
    setRequestToken,
  } = useContext(Context);

  const [avatarPath, setAvatarPath] = useState("");

  const fetchAccountInfo = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/account?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`
      )
      .then((response) => {
        //console.log("account: ", response.data);
        //console.log(response.data.avatar.tmdb.avatar_path);
        setAccountDetail(response.data);
        setAvatarPath(response.data.avatar.tmdb.avatar_path);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchAccountInfo();
  }, []);
  return accountDetail ? (
    <ScrollView>
      {avatarPath ? (
        <Image
          className="self-center w-40 h-40 mt-4 rounded-full"
          source={{
            uri: `https://image.tmdb.org/t/p/w185${avatarPath}`,
          }}
        />
      ) : (
        <Image
          className="self-center w-40 h-40 mt-4 rounded-full "
          source={require("./assets/blank_avatar.jpg")}
        />
      )}
      {accountDetail.name ? (
        <Text className="mt-4 text-3xl font-extrabold text-center">
          {accountDetail.name}
        </Text>
      ) : (
        <Text className="mt-4 text-3xl font-extrabold text-center">
          {accountDetail.username}
        </Text>
      )}
      {/* <View className="p-4 bg-blue-500 w-[50%] self-end">
        <View className="w-20 h-20 -ml-10 bg-red-500 rounded-full"></View>
      </View> */}

      {/* <View className="w-60 h-60 perspective-1000">
        <View className="w-full h-full origin-bottom-left transform skew-y-12 bg-red-900"></View>
      </View> */}

      <View className="items-center w-full">
        <TouchableOpacity
          className="items-center justify-center w-4/5 h-20 my-4 border-4 rounded-full bg-cyan-600"
          onPress={() => {
            navigation.navigate("FavoriteRatingWatchList", {
              listType: "favorite",
              title: "My Favorites",
              id: accountDetail.id,
              sessionId: sessionId,
            });
          }}
        >
          <Text className="text-lg font-semibold text-white">
            Favorites Movies and Shows
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center justify-center w-4/5 h-20 mb-4 border-4 rounded-full bg-cyan-600"
          onPress={() => {
            navigation.navigate("FavActorList");
          }}
        >
          <Text className="text-lg font-semibold text-white">
            Favorite Actors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center justify-center w-4/5 h-20 mb-4 border-4 rounded-full bg-cyan-600"
          onPress={() => {
            navigation.navigate("FavoriteRatingWatchList", {
              listType: "rated",
              title: "My Rated",
              id: accountDetail.id,
              sessionId: sessionId,
            });
          }}
        >
          <Text className="text-lg font-semibold text-white">Ratings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center justify-center w-4/5 h-20 mb-4 border-4 rounded-full bg-cyan-600"
          onPress={() => {
            navigation.navigate("FavoriteRatingWatchList", {
              listType: "watchlist",
              title: "My Watchlist",
              id: accountDetail.id,
              sessionId: sessionId,
            });
          }}
        >
          <Text className="text-lg font-semibold text-white">Watchlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center justify-center w-4/5 h-20 mb-4 border-4 rounded-full bg-cyan-600"
          onPress={() => {
            navigation.navigate("Settings");
          }}
        >
          <Text className="text-lg font-semibold text-white">Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center justify-center w-4/5 h-20 mb-4 bg-red-600 border-4 rounded-full"
          onPress={() => {
            setSessionId(null);
            setApproved(false);
            // setRequestToken(null);
            axios
              .delete(
                `https://api.themoviedb.org/3/authentication/session?api_key=841da308423b4b64ea4d57d052583683&&session_id=${sessionId}`
              )
              .then((response) => {
                console.log(
                  "delete session success, logging out:",
                  response.data
                );
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        >
          <Text className="text-lg font-semibold text-white">Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  ) : (
    <Loading />
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="FavActorList"
        component={FavActorStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FavActorProfile"
        component={PersonProfileStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FavoriteRatingWatchList"
        component={FavoriteRatingWatchList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyMovieDetails"
        component={MovieDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyTvDetails"
        component={ShowDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsTabs}
        options={{
          headerTitleAlign: "center",
          headerTitle: "Set your preferences",
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
