// App.js
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import PersonImageList from "./PersonImageList";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import OtherCreditsTabs from "./OtherCredits";
const Stack = createStackNavigator();

const PersonProfileStack = ({ route }) => {
  const { person_id, origin, header } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="PersonProfile"
        component={PersonProfile}
        initialParams={{ person_id: person_id, origin: origin }}
        options={{ headerTitle: header }}
      />
      <Stack.Screen
        name="PersonImageList"
        component={PersonImageList}
        initialParams={{ person_id: person_id }}
        options={{ headerTitle: "More Images" }}
      />
      <Stack.Screen
        name="OtherMovieCredits"
        component={OtherCreditsTabs}
        options={{ headerTitle: "Other Movies" }}
      />
      <Stack.Screen
        name="OtherShowsCredits"
        component={OtherCreditsTabs}
        options={{ headerTitle: "Other Shows" }}
      />
    </Stack.Navigator>
  );
};
const PersonProfile = ({ route }) => {
  const [personDetail, setPersonDetail] = useState("");
  const { person_id, origin } = route.params;
  const [showFullText, setShowFullText] = useState(false);
  const toggleReadMore = () => {
    setShowFullText(!showFullText);
  };
  const navigation = useNavigation();

  const truncatedText = (text) => {
    return text.slice(0, 200);
  };
  const displayText = (text) => {
    return showFullText ? text : truncatedText(text);
  };
  useEffect(() => {
    console.log(person_id, origin);
    fetchPersonDetail();
  }, []);
  const fetchPersonDetail = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/person/${person_id}?api_key=841da308423b4b64ea4d57d052583683`
      )
      .then((response) => {
        setPersonDetail(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <ScrollView className="px-4">
      {personDetail.profile_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original/${personDetail.profile_path}`,
          }}
          className="self-center w-full h-[455] rounded-lg mt-4"
        />
      ) : (
        <Image
          source={require("./assets/blank_avatar.jpg")}
          className="self-center w-full h-[455] rounded-lg mt-4"
        />
      )}
      {personDetail.name ? (
        <Text className="mt-4 text-3xl font-bold text-center">
          {personDetail.name}
        </Text>
      ) : null}
      {personDetail.birthday ? (
        <Text className="text-base italic text-sky-600">
          <Text className="text-lg font-semibold text-black">Born: </Text>
          {personDetail.birthday}
        </Text>
      ) : null}
      {personDetail.deathday ? (
        <Text className="text-base italic text-sky-600">
          <Text className="text-lg font-semibold text-black">Died: </Text>
          {personDetail.deathday}
        </Text>
      ) : null}
      {personDetail.place_of_birth ? (
        <Text className="text-base italic text-sky-600">
          <Text className="text-lg font-semibold text-black">
            Place of birth:{" "}
          </Text>
          {personDetail.place_of_birth}
        </Text>
      ) : null}
      {personDetail.gender ? (
        <Text className="text-base italic text-sky-600">
          <Text className="text-lg font-semibold text-black">Gender: </Text>
          {personDetail.gender === 1
            ? "Female"
            : personDetail.gender === 2
            ? "Male"
            : "Non-binary"}
        </Text>
      ) : null}
      {personDetail.biography ? (
        <>
          <Text className="text-lg font-semibold">Biography:</Text>
          <Text className="text-base">
            {displayText(personDetail.biography)}
          </Text>
          {personDetail.biography.length > 200 && (
            <TouchableOpacity
              onPress={() => {
                toggleReadMore();
              }}
              className="self-center w-24 border-2 border-teal-500 rounded-xl"
            >
              <Text className="text-center">
                {showFullText ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : null}
      {personDetail.popularity ? (
        <Text className="text-base italic text-sky-600">
          <Text className="text-lg font-semibold text-black">Popularity: </Text>
          {personDetail.popularity}
        </Text>
      ) : null}
      {personDetail.also_known_as && personDetail.also_known_as.length > 0 ? (
        <>
          <Text className="text-lg font-semibold">Also known as: </Text>
          {personDetail.also_known_as.map((item) => (
            <View key={item} style={{ width: "100%", paddingHorizontal: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: "300" }}>{item}</Text>
            </View>
          ))}
        </>
      ) : null}
      <Text className="text-2xl font-extrabold">See more:</Text>
      <View className="flex flex-row items-center justify-evenly">
        <TouchableOpacity
          className="w-[30%] h-24 border-2 border-orange-600"
          onPress={() => {
            navigation.navigate("PersonImageList");
          }}
        >
          <Text>More Images</Text>
        </TouchableOpacity>
        {/* {origin.includes("search") ? (
          <>
            <TouchableOpacity
              className="w-[30%] h-24 border-2 border-orange-600"
              onPress={() => {
                navigation.navigate("OtherMovieCredits", {
                  id: id,
                  origin: "moviesearch",
                  type: "movies",
                });
              }}
            >
              <Text>Other Movies</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[30%] h-24 border-2 border-orange-600"
              onPress={() => {
                navigation.navigate("OtherShowsCredits", {
                  id: id,
                  origin: "tvsearch",
                  type: "tv",
                });
              }}
            >
              <Text>Other Shows</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {origin.includes("movie") ? (
              <TouchableOpacity
                className="w-[30%] h-24 border-2 border-orange-600"
                onPress={() => {
                  navigation.navigate("OtherMovieCredits", {
                    id: id,
                    origin: origin,
                    type: "movies",
                  });
                }}
              >
                <Text>Other Movies</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="w-[30%] h-24 border-2 border-orange-600"
                onPress={() => {
                  navigation.navigate("OtherShowsCredits", {
                    id: id,
                    origin: origin,
                    type: "tv",
                  });
                }}
              >
                <Text>Other Shows</Text>
              </TouchableOpacity>
            )}
          </>
        )} */}

        {origin === "tvmain" ? null : (
          <TouchableOpacity
            className="w-[30%] h-24 border-2 border-orange-600"
            onPress={() => {
              navigation.navigate("OtherMovieCredits", {
                id: person_id,
                origin: origin.includes("search")
                  ? "moviesearch"
                  : origin.includes("my")
                  ? "moviemy"
                  : origin.includes("discover")
                  ? "moviediscover"
                  : origin,
                type: "movies",
              });
            }}
          >
            <Text>Other Movies</Text>
          </TouchableOpacity>
        )}
        {origin === "moviemain" ? null : (
          <TouchableOpacity
            className="w-[30%] h-24 border-2 border-orange-600"
            onPress={() => {
              navigation.navigate("OtherShowsCredits", {
                id: person_id,
                origin: origin.includes("search")
                  ? "tvsearch"
                  : origin.includes("my")
                  ? "tvmy"
                  : origin.includes("discover")
                  ? "tvdiscover"
                  : origin,
                type: "tv",
              });
            }}
          >
            <Text>Other Shows</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default PersonProfileStack;