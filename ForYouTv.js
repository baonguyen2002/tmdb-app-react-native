import React, {
  Component,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import ForYouTvSeeMore from "./ForYouTvSeeMore";
import {
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { fetchFavTvGenre, fetchActor } from "./Database";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Badge } from "@rneui/themed";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
const ForYouTvStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ForYouTvTab"
        component={ForYouTab}
        options={{ headerTitle: "For You", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="ForYouTvSeeMore"
        component={ForYouTvSeeMore}
        options={{
          headerTitleAlign: "center",
          headerTitle: "See More TV Shows",
        }}
      />
    </Stack.Navigator>
  );
};
const ForYouTab = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Genre"
        component={ForYou}
        initialParams={{ type: "genre" }}
      />
      <Tab.Screen
        name="Actor"
        component={ForYou}
        initialParams={{ type: "actor" }}
      />
    </Tab.Navigator>
  );
};
const ForYou = ({ route }) => {
  const { type } = route.params;
  const [localFavTvGenreList, setLocalFavTvGenreList] = useState([]);
  const [tvListBasedOnFavTvGenre, setTvListBasedOnFavTvGenre] = useState([]);
  const navigation = useNavigation();
  const [localFavActorList, setLocalFavActorList] = useState([]);
  const [tvListBasedOnFavActor, setTvListBasedOnFavActor] = useState([]);
  const [realLocalFavActorList, setRealLocalFavActorList] = useState([]);
  const [orJoinType, setOrJoinType] = useState(true);
  const [isVietnamese, setIsVietnamese] = useState(false);

  const fetchFavTvGenreFromDatabase = async () => {
    try {
      const tvGenreListFromDB = await fetchFavTvGenre();
      if (tvGenreListFromDB.length > 0) {
        const favTvGenreIds = tvGenreListFromDB.map(
          (item) => item.favTvGenreId
        );

        setLocalFavTvGenreList(favTvGenreIds);
        console.log("fetched favTvGenre: ", favTvGenreIds);
      } else {
        setLocalFavTvGenreList(tvGenreListFromDB);
        console.log("fetched favTvGenre: ", tvGenreListFromDB);
      }
    } catch (error) {
      console.log("Error fetching favTvGenre list:", error);
    }
  };

  const fetchActorsFromDatabase = async () => {
    try {
      const actorsListFromDB = await fetchActor();
      setRealLocalFavActorList(actorsListFromDB);
      console.log("real list: ", actorsListFromDB);
      if (actorsListFromDB.length > 0) {
        const favActorIds = actorsListFromDB.map((item) => item.actorId);

        setLocalFavActorList(favActorIds);
        console.log("fetched favActor: ", favActorIds);
      } else {
        setLocalFavActorList(actorsListFromDB);
        console.log("fetched favActor: ", actorsListFromDB);
      }
    } catch (error) {
      console.log("Error fetching favTvGenre list:", error);
    }
  };

  const fetchFavGenreResult = () => {
    const joinText = orJoinType
      ? localFavTvGenreList.join("|")
      : localFavTvGenreList.join(",");
    const language = isVietnamese ? "vi" : "en";
    axios
      .get(
        `https://api.themoviedb.org/3/discover/tv?api_key=841da308423b4b64ea4d57d052583683&include_adult=false&include_video=false&with_genres=${joinText}&with_original_language=${language}`

        //&language=en-US
      )
      .then((res) => {
        //console.log(res.data.results);
        setTvListBasedOnFavTvGenre(res.data.results);
        // if (res.data.total_pages > 500) {
        //   setMaxFavGenrePage(500);
        // } else {
        //   setMaxFavGenrePage(res.data.total_pages);
        // }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  //   const fetchFavActorTv = () => {
  //     const joinText = orJoinType
  //       ? localFavActorList.join("|")
  //       : localFavActorList.join(",");
  //     console.log(joinText);
  //     axios
  //       .get(
  //         `https://api.themoviedb.org/3/discover/tv?api_key=841da308423b4b64ea4d57d052583683&include_adult=false&include_video=false&with_cast=${joinText}`

  //         //&language=en-US
  //       )
  //       .then((res) => {
  //         //console.log(res.data.results);
  //         setTvListBasedOnFavActor(res.data.results);
  //         // if (res.data.total_pages > 500) {
  //         //   setMaxFavActorPage(500);
  //         // } else {
  //         //   setMaxFavActorPage(res.data.total_pages);
  //         // }
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   };
  useFocusEffect(
    useCallback(() => {
      fetchFavTvGenreFromDatabase();
      // fetchFlaggedMovieFromDatabase();
      fetchActorsFromDatabase();
    }, [])
  );
  useEffect(() => {
    if (localFavTvGenreList.length > 0) {
      fetchFavGenreResult();
    }
  }, [localFavTvGenreList, orJoinType, isVietnamese]);
  //   useEffect(() => {
  //     if (localFavActorList.length > 0) {
  //       fetchFavActorTv();
  //     }
  //   }, [orJoinType, localFavActorList]);
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        className="flex flex-row justify-start h-40 p-px my-px rounded-md border-x-indigo-500 border-x-4 border-y-red-700 border-y-4"
        onPress={() => {
          navigation.navigate("MainShowDetail", {
            series_id: item.id,
            header: isVietnamese ? item.original_name : item.name,
            origin: "tvmain",
            orJoinType: orJoinType,
          });
        }}
      >
        <View className="w-fit">
          {item.poster_path ? (
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w185/${item.poster_path}`,
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
          <Text className="text-lg font-bold">
            {isVietnamese ? item.original_name : item.name}
          </Text>
          <Text className="font-light">
            {"First aired date: " + item.first_air_date}
          </Text>
          <View className="flex flex-row items-center">
            <Text className="font-semibold">Rating: </Text>
            <Badge
              value={item.vote_average}
              status="primary"
              badgeStyle={{
                height: 22,
              }}
              textStyle={{
                fontSize: 14,
                fontWeight: "bold",
                color: "white",
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return type === "genre" ? (
    <>
      {localFavTvGenreList && localFavTvGenreList.length > 0 ? (
        <>
          <Button
            title={orJoinType ? "Search Type: Or" : "Search Type: And"}
            onPress={() => {
              setOrJoinType((prev) => !prev);
            }}
          />
          <Button
            title={
              isVietnamese
                ? "Current language: Vietnamese"
                : "Current language: English"
            }
            onPress={() => {
              setIsVietnamese((prev) => !prev);
            }}
          />

          {tvListBasedOnFavTvGenre && tvListBasedOnFavTvGenre.length > 0 ? (
            <>
              <FlatList
                data={tvListBasedOnFavTvGenre.slice(0, 5)}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListFooterComponent={() => {
                  return (
                    <View className="flex flex-row items-center justify-evenly">
                      {tvListBasedOnFavTvGenre.length <= 5 ? null : (
                        <TouchableOpacity
                          className="w-[48%] bg-lime-300 flex-row items-center h-12 self-center justify-center border-2 border-fuchsia-400 rounded-lg"
                          onPress={() => {
                            navigation.navigate("ForYouTvSeeMore", {
                              list: localFavTvGenreList,
                              isVietnamese: isVietnamese,
                              type: "genre",
                              orJoinType: orJoinType,
                              isActor: false,
                            });
                          }}
                        >
                          <Text className="text-lg font-semibold text-center">
                            See more results
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        className="w-[48%] bg-lime-300 flex-row items-center h-12 self-center justify-center border-2 border-fuchsia-400 rounded-lg"
                        onPress={() => {
                          navigation.navigate("Shows");
                        }}
                      >
                        <Text className="text-lg font-semibold text-center">
                          To Popular Shows
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </>
          ) : (
            <View className="flex items-center justify-center w-full h-full">
              <Text className="text-2xl font-bold text-center">
                Looks like no shows match your criteria.
              </Text>
              <View>
                <Text className="text-2xl font-bold text-center">
                  Or you can visit Popular TV Shows for some suggestions!
                </Text>
                <TouchableOpacity
                  className="flex-row items-center  h-12 bg-green-600 border-2 rounded-md w-[65%] self-center"
                  onPress={() => {
                    navigation.navigate("Shows");
                  }}
                >
                  <Text className="text-base font-medium text-center text-white">
                    To Popular TV Shows
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      ) : (
        <View className="flex items-center justify-center w-full h-full">
          <Text className="text-2xl font-bold text-center">
            {
              "Looks like you have not set any genre as your favorites yet. Modify it in Profile => Settings to see changes!"
            }
          </Text>
          <View>
            <Text className="text-2xl font-bold text-center">
              Or you can visit Popular TV Shows for some suggestions!
            </Text>
            <TouchableOpacity
              className="flex-row items-center  h-12 bg-green-600 border-2 rounded-md w-[65%] self-center"
              onPress={() => {
                navigation.navigate("Shows");
              }}
            >
              <Text className="text-base font-medium text-center text-white">
                To Popular TV Shows
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  ) : (
    <>
      {localFavActorList && localFavActorList.length > 0 ? (
        <>
          {/* <Button
            title={orJoinType ? "Search Type: Or" : "Search Type: And"}
            onPress={() => {
              setOrJoinType((prev) => !prev);
            }}
          /> */}
          {/* {realLocalFavActorList && realLocalFavActorList.length > 0 ? ( */}
          <FlatList
            ListHeaderComponent={
              <Text className="text-xl font-bold text-center">
                Tap on any person to see the shows they starred in!
              </Text>
            }
            data={realLocalFavActorList}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  className="flex flex-row justify-start h-40 p-px my-px rounded-md border-x-indigo-500 border-x-4 border-y-red-700 border-y-4"
                  onPress={() => {
                    navigation.navigate("ForYouTvSeeMore", {
                      actorId: item.actorId,
                      isActor: true,
                      list: localFavTvGenreList,
                      isVietnamese: isVietnamese,
                      type: "actor",
                      orJoinType: orJoinType,
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
            keyExtractor={(item) => item.actorId}
            ListFooterComponent={() => {
              <TouchableOpacity
                className="w-[70%] bg-lime-300 flex-row items-center h-12 self-center justify-center border-2 border-fuchsia-400 rounded-lg"
                onPress={() => {
                  navigation.navigate("Shows");
                }}
              >
                <Text className="text-lg font-semibold text-center">
                  To Popular Shows
                </Text>
              </TouchableOpacity>;
            }}
          />
          {/* ) : (
            <View className="flex items-center justify-center w-full h-full">
              <Text className="text-2xl font-bold text-center">
                Looks like no shows match your criteria.
              </Text>
              <View>
                <Text className="text-2xl font-bold text-center">
                  Or you can visit Popular TV Shows for some suggestions!
                </Text>
                <TouchableOpacity
                  className="flex-row items-center  h-12 bg-green-600 border-2 rounded-md w-[65%] self-center"
                  onPress={() => {
                    navigation.navigate("Shows");
                  }}
                >
                  <Text className="text-base font-medium text-center text-white">
                    To Popular TV Shows
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )} */}
        </>
      ) : (
        <View className="flex items-center justify-center w-full h-full">
          <Text className="text-2xl font-bold text-center">
            Looks like you have not set any actor as your favorites yet. Like
            some people to see changes!
          </Text>
          <View>
            <Text className="text-2xl font-bold text-center">
              Or you can visit Popular TV Shows for some suggestions!
            </Text>
            <TouchableOpacity
              className="flex-row items-center  h-12 bg-green-600 border-2 rounded-md w-[65%] self-center"
              onPress={() => {
                navigation.navigate("Shows");
              }}
            >
              <Text className="text-base font-medium text-center text-white">
                To Popular TV Shows
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default ForYouTvStack;
