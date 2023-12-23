import React, {
  Component,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import ForYouMovieSeeMore from "./ForYouMovieSeeMore";
import {
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { fetchFavMovieGenre, fetchFlaggedMovie, fetchActor } from "./Database";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Badge } from "@rneui/themed";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
const ForyouMovieStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ForYouMovieTab"
        component={ForYouTab}
        options={{ headerTitle: "For You", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="ForYouMovieSeeMore"
        component={ForYouMovieSeeMore}
        options={{ headerTitleAlign: "center", headerTitle: "See More Movies" }}
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
  const [localFavMovieGenreList, setLocalFavMovieGenreList] = useState([]);
  const [movieListBasedOnFavMovieGenre, setMovieListBasedOnFavMovieGenre] =
    useState([]);
  const navigation = useNavigation();
  const [localFavActorList, setLocalFavActorList] = useState([]);
  const [movieListBasedOnFavActor, setMovieListBasedOnFavActor] = useState([]);

  const [orJoinType, setOrJoinType] = useState(true);
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [localFlaggedMovie, setLocalFlaggedMovie] = useState([]);
  const fetchFavMovieGenreFromDatabase = async () => {
    try {
      const movieGenreListFromDB = await fetchFavMovieGenre();
      if (movieGenreListFromDB.length > 0) {
        const favMovieGenreIds = movieGenreListFromDB.map(
          (item) => item.favMovieGenreId
        );

        setLocalFavMovieGenreList(favMovieGenreIds);
        console.log("fetched favMovieGenre: ", favMovieGenreIds);
      } else {
        setLocalFavMovieGenreList(movieGenreListFromDB);
        console.log("fetched favMovieGenre: ", movieGenreListFromDB);
      }
    } catch (error) {
      console.log("Error fetching favMovieGenre list:", error);
    }
  };

  // const fetchFlaggedMovieFromDatabase = async () => {
  //   try {
  //     const flaggedMovieListFromDB = await fetchFlaggedMovie();

  //     setLocalFlaggedMovie(flaggedMovieListFromDB);
  //     console.log("fetched flaggedMovie: ", flaggedMovieListFromDB);
  //   } catch (error) {
  //     console.log("Error fetching actors list:", error);
  //   }
  // };

  const fetchActorsFromDatabase = async () => {
    try {
      const actorsListFromDB = await fetchActor();
      if (actorsListFromDB.length > 0) {
        const favActorIds = actorsListFromDB.map((item) => item.actorId);

        setLocalFavActorList(favActorIds);
        console.log("fetched favActor: ", favActorIds);
      } else {
        setLocalFavActorList(actorsListFromDB);
        console.log("fetched favActor: ", actorsListFromDB);
      }
    } catch (error) {
      console.log("Error fetching favMovieGenre list:", error);
    }
  };
  // useEffect(() => {
  //   fetchFavMovieGenreFromDatabase();
  // }, []);
  const fetchFavGenreResult = () => {
    const joinText = orJoinType
      ? localFavMovieGenreList.join("|")
      : localFavMovieGenreList.join(",");
    const language = isVietnamese ? "vi" : "en";
    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=841da308423b4b64ea4d57d052583683&include_adult=false&include_video=false&with_genres=${joinText}&with_original_language=${language}`

        //&language=en-US
      )
      .then((res) => {
        //console.log(res.data.results);
        setMovieListBasedOnFavMovieGenre(res.data.results);
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
  const fetchFavActorMovie = () => {
    const joinText = orJoinType
      ? localFavActorList.join("|")
      : localFavActorList.join(",");
    console.log(joinText);
    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=841da308423b4b64ea4d57d052583683&include_adult=false&include_video=false&with_cast=${joinText}`

        //&language=en-US
      )
      .then((res) => {
        //console.log(res.data.results);
        setMovieListBasedOnFavActor(res.data.results);
        // if (res.data.total_pages > 500) {
        //   setMaxFavActorPage(500);
        // } else {
        //   setMaxFavActorPage(res.data.total_pages);
        // }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useFocusEffect(
    useCallback(() => {
      fetchFavMovieGenreFromDatabase();

      fetchActorsFromDatabase();
    }, [])
  );
  useEffect(() => {
    if (localFavMovieGenreList.length > 0) {
      fetchFavGenreResult();
    }
  }, [localFavMovieGenreList, orJoinType, isVietnamese]);
  useEffect(() => {
    if (localFavActorList.length > 0) {
      fetchFavActorMovie();
    }
  }, [orJoinType, localFavActorList]);
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        className="flex flex-row justify-start h-40 p-px my-px rounded-md border-x-indigo-500 border-x-4 border-y-red-700 border-y-4"
        onPress={() => {
          navigation.navigate("MainMovieDetail", {
            movie_id: item.id,
            header: isVietnamese ? item.original_title : item.title,
            origin: "moviemain",
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
            {isVietnamese ? item.original_title : item.title}
          </Text>
          <Text className="font-light">
            {"Release date: " + item.release_date}
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
      {localFavMovieGenreList && localFavMovieGenreList.length > 0 ? (
        <>
          <View className="flex flex-row items-center justify-evenly">
            <View className="w-1/2">
              <Text className="text-base font-bold">
                Tap to change filter type:
              </Text>
            </View>
            <View className="w-2/5">
              <Button
                title={orJoinType ? "Or" : "And"}
                onPress={() => {
                  setOrJoinType((prev) => !prev);
                }}
              />
            </View>
          </View>
          <View className="flex flex-row items-center justify-evenly">
            <View className="w-1/2">
              <Text className="text-base font-bold">
                Tap to change filter language:
              </Text>
            </View>
            <View className="w-2/5">
              <Button
                title={isVietnamese ? "Vietnamese" : "English"}
                onPress={() => {
                  setIsVietnamese((prev) => !prev);
                }}
              />
            </View>
          </View>

          {movieListBasedOnFavMovieGenre &&
          movieListBasedOnFavMovieGenre.length > 0 ? (
            <>
              <FlatList
                data={movieListBasedOnFavMovieGenre.slice(0, 5)}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListFooterComponent={() => {
                  return (
                    <View className="flex flex-row items-center justify-evenly">
                      {movieListBasedOnFavMovieGenre.length <= 5 ? null : (
                        <TouchableOpacity
                          className="w-[48%] bg-lime-300 flex-row items-center h-12 self-center justify-center border-2 border-fuchsia-400 rounded-lg"
                          onPress={() => {
                            navigation.navigate("ForYouMovieSeeMore", {
                              list: localFavMovieGenreList,
                              isVietnamese: isVietnamese,
                              type: "genre",
                              orJoinType: orJoinType,
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
                          navigation.navigate("Movies");
                        }}
                      >
                        <Text className="text-lg font-semibold text-center">
                          To Popular Movies
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
                Looks like no movies match your criteria.
              </Text>
              <View>
                <Text className="text-2xl font-bold text-center">
                  Or you can visit Popular Movies for some suggestions!
                </Text>
                <TouchableOpacity
                  className="flex-row items-center  h-12 bg-green-600 border-2 rounded-md w-[65%] self-center"
                  onPress={() => {
                    navigation.navigate("Movies");
                  }}
                >
                  <Text className="text-base font-medium text-center text-white">
                    To Popular Movies
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
              Or you can visit Popular Movies for some suggestions!
            </Text>
            <TouchableOpacity
              className="flex-row items-center  h-12 bg-green-600 border-2 rounded-md w-[65%] self-center"
              onPress={() => {
                navigation.navigate("Movies");
              }}
            >
              <Text className="text-base font-medium text-center text-white">
                To Popular Movies
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
          <View className="flex flex-row items-center justify-evenly">
            <View className="w-1/2">
              <Text className="text-base font-bold">
                Tap to change filter type:
              </Text>
            </View>
            <View className="w-2/5">
              <Button
                title={orJoinType ? "Or" : "And"}
                onPress={() => {
                  setOrJoinType((prev) => !prev);
                }}
              />
            </View>
          </View>
          {movieListBasedOnFavActor && movieListBasedOnFavActor.length > 0 ? (
            <FlatList
              data={movieListBasedOnFavActor.slice(0, 5)}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ListFooterComponent={() => {
                return (
                  <View className="flex flex-row items-center justify-evenly">
                    {movieListBasedOnFavActor.length <= 5 ? null : (
                      <TouchableOpacity
                        className="w-[48%] bg-lime-300 flex-row items-center h-12 self-center justify-center border-2 border-fuchsia-400 rounded-lg"
                        onPress={() => {
                          navigation.navigate("ForYouMovieSeeMore", {
                            list: localFavActorList,
                            isVietnamese: isVietnamese,
                            type: "actor",
                            orJoinType: orJoinType,
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
                        navigation.navigate("Movies");
                      }}
                    >
                      <Text className="text-lg font-semibold text-center">
                        To Popular Movies
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          ) : (
            <View className="flex items-center justify-center w-full h-full">
              <Text className="text-2xl font-bold text-center">
                Looks like no movies match your criteria.
              </Text>
              <View>
                <Text className="text-2xl font-bold text-center">
                  Or you can visit Popular Movies for some suggestions!
                </Text>
                <TouchableOpacity
                  className="flex-row items-center  h-12 bg-green-600 border-2 rounded-md w-[65%] self-center"
                  onPress={() => {
                    navigation.navigate("Movies");
                  }}
                >
                  <Text className="text-base font-medium text-center text-white">
                    To Popular Movies
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      ) : (
        <View className="flex items-center justify-center w-full h-full">
          <Text className="text-2xl font-bold text-center">
            Looks like you have not set any actor as your favorites yet. Like
            some people to see changes!
          </Text>
          <View>
            <Text className="text-2xl font-bold text-center">
              Or you can visit Popular Movies for some suggestions!
            </Text>
            <TouchableOpacity
              className="flex-row items-center  h-12 bg-green-600 border-2 rounded-md w-[65%] self-center"
              onPress={() => {
                navigation.navigate("Movies");
              }}
            >
              <Text className="text-base font-medium text-center text-white">
                To Popular Movies
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default ForyouMovieStack;
