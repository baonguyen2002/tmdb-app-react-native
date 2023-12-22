// App.js

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { fetchActor } from "./Database";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PersonProfileStack from "./PersonProfile";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

const FavActorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavActor"
        component={FavActorList}
        options={{ headerTitle: "Favorite Actors", headerTitleAlign: "center" }}
      />
      {/* <Stack.Screen
        name="FavActorProfile"
        component={PersonProfileStack}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};
const FavActorList = () => {
  const navigation = useNavigation();
  const [localActorList, setLocalActorList] = useState([]);
  const fetchActorsFromDatabase = async () => {
    try {
      const actorsListFromDB = await fetchActor();

      setLocalActorList(actorsListFromDB);
      console.log("fetched actor: ", actorsListFromDB);
    } catch (error) {
      console.log("Error fetching actors list:", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchActorsFromDatabase();
    }, [])
  );
  return localActorList && localActorList.length > 0 ? (
    <FlatList
      data={localActorList}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            className="flex flex-row justify-start h-40 p-px my-px rounded-md border-x-indigo-500 border-x-4 border-y-red-700 border-y-4"
            onPress={() => {
              navigation.navigate("FavActorProfile", {
                person_id: item.actorId,
                header: item.name,
                origin: "myactor",
              });
            }}
          >
            <View className="w-fit">
              {item.profileImageUrl && item.profileImageUrl.length > 0 ? (
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w185/${item.profileImageUrl}`,
                  }}
                  className="w-24 h-full mr-1 rounded-lg"
                />
              ) : (
                <Image
                  source={require("./assets/blank.png")}
                  className="w-24 h-full mr-1 rounded-lg"
                />
              )}
            </View>
            <View className="flex items-start justify-center w-[71%]  ">
              <Text className="text-lg font-bold">{item.name}</Text>
            </View>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item) => item.id}
    />
  ) : (
    <View className="flex items-center justify-center w-full h-full">
      <Text className="text-2xl font-bold text-center">
        Looks like you have not set any actor as your favorites yet. Like some
        people to see changes!
      </Text>
    </View>
  );
};

export default FavActorStack;
