import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Loading from "./Loading";
import { Badge } from "@rneui/themed";
import { createStackNavigator } from "@react-navigation/stack";
import ListView from "./ListView";
import {
  fetchFavMovie,
  fetchWatchlistMovie,
  fetchRatedMovie,
  fetchFavTv,
  fetchWatchlistTv,
  fetchRatedTv,
} from "./Database";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const FavoriteRatingWatchList = ({ route }) => {
  const { listType, title, id, sessionId } = route.params;

  // useLayoutEffect(() => {
  //   navigation.setOptions({ title: title, headerTitleAlign: "center" });
  // }, [navigation, title]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TopTabs"
        component={TopTabs}
        initialParams={{
          listType: listType,
          id: id,
          sessionId: sessionId,
          title: title,
        }}
        options={{
          headerTitle: title,
          // origin === "favorite"
          //   ? "My Favorites"
          //   : origin === "ratings"
          //   ? "My Ratings"
          //   : "My Watchlist",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};
const TopTabs = ({ route }) => {
  const { listType, id, sessionId } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Movies"
        component={List}
        initialParams={{
          type: "movies",
          listType: listType,
          id: id,
          sessionId: sessionId,
          origin: "moviemy",
        }}
      />
      <Tab.Screen
        name="Tv Shows"
        component={List}
        initialParams={{
          type: "tv",
          listType: listType,
          id: id,
          sessionId: sessionId,
          origin: "tvmy",
        }}
      />
    </Tab.Navigator>
  );
};

const List = ({ route }) => {
  // const [moviePage, setMoviePage] = useState(1);
  // const [TVShowPage, setTVShowPage] = useState(1);
  //const [results, setResults] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [isResultEmpty, setIsResultEmpty] = useState(false);
  // useFocusEffect(
  //   useCallback(() => {
  //     FetchResult();
  //   }, [moviePage, TVShowPage])
  // );

  const [favMovieList, setFavMovieList] = useState([]);
  const [watchMovieList, setwatchMovieList] = useState([]);
  const [ratedMovieList, setRatedMovieList] = useState([]);
  const [favTvList, setFavTvList] = useState([]);
  const [watchlistTv, setwatchlistTv] = useState([]);
  const [ratedTv, setratedTv] = useState([]);
  const fetchFavMovieFromDatabase = async () => {
    try {
      const movieListFromDB = await fetchFavMovie();

      setFavMovieList(movieListFromDB);
      console.log("fetched favMovie: ", movieListFromDB);
    } catch (error) {
      console.log("Error fetching favMovie list:", error);
    }
  };
  const fetchRatedMovieFromDatabase = async () => {
    try {
      const movieListFromDB = await fetchRatedMovie();

      setRatedMovieList(movieListFromDB);
      console.log("fetched ratedMovie: ", movieListFromDB);
    } catch (error) {
      console.log("Error fetching ratedMovie list:", error);
    }
  };
  const fetchWatchMovieFromDatabase = async () => {
    try {
      const movieListFromDB = await fetchWatchlistMovie();

      setwatchMovieList(movieListFromDB);
      console.log("fetched watchlistMovie: ", movieListFromDB);
    } catch (error) {
      console.log("Error fetching watchlistMovie:", error);
    }
  };
  const fetchFavTvFromDatabase = async () => {
    try {
      const tvListFromDB = await fetchFavTv();

      setFavTvList(tvListFromDB);
      console.log("fetched favTv: ", tvListFromDB);
    } catch (error) {
      console.log("Error fetching favTv:", error);
    }
  };
  const fetchWatchlistTvFromDatabase = async () => {
    try {
      const tvListFromDB = await fetchWatchlistTv();

      setwatchlistTv(tvListFromDB);
      console.log("fetched watchlistTv: ", tvListFromDB);
    } catch (error) {
      console.log("Error fetching watchlistTv:", error);
    }
  };
  const fetchRatedTvFromDatabase = async () => {
    try {
      const tvListFromDB = await fetchRatedTv();

      setratedTv(tvListFromDB);
      console.log("fetched ratedTv: ", tvListFromDB);
    } catch (error) {
      console.log("Error fetching ratedTv list:", error);
    }
  };
  //const [isNewDataEmpty, setIsNewDataEmpty] = useState(false);
  // useEffect(() => {
  //   FetchResult();
  // }, [moviePage, TVShowPage]);
  const { type, listType, id, sessionId, origin } = route.params;
  // const FetchResult = () => {
  //   axios
  //     .get(
  //       `https://api.themoviedb.org/3/account/${id}/${listType}/${type}?api_key=841da308423b4b64ea4d57d052583683&page=${
  //         type === "movies" ? moviePage : TVShowPage
  //       }&session_id=${sessionId}`
  //     )
  //     .then((response) => {
  //       //console.log(response.data.results);
  //       if (response.data.results.length === 0) {
  //         if (results.length == 0) {
  //           setIsResultEmpty(true);
  //         }
  //         setIsNewDataEmpty(true);
  //       } else {
  //         const filteredResults = response.data.results.filter(
  //           (newResult) =>
  //             !results.some(
  //               (existingResult) => existingResult.id === newResult.id
  //             )
  //         );
  //         setResults((prevResults) => [...prevResults, ...filteredResults]);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };
  useFocusEffect(
    useCallback(() => {
      fetchFavMovieFromDatabase();
      fetchWatchMovieFromDatabase();
      fetchRatedMovieFromDatabase();
      fetchFavTvFromDatabase();
      fetchWatchlistTvFromDatabase();
      fetchRatedTvFromDatabase();
    }, [])
  );
  return (
    // !isResultEmpty ? (
    //   <ListView
    //     role={""}
    //     results={results}
    //     type={type}
    //     setPage={type === "movies" ? setMoviePage : setTVShowPage}
    //     // moviePage={moviePage}
    //     // setMoviePage={setMoviePage}
    //     // TVShowPage={TVShowPage}
    //     // setTVShowPage={setTVShowPage}
    //     origin={origin}
    //     isNewDataEmpty={isNewDataEmpty}
    //   />
    // ) : (
    //   <View className="flex items-center justify-center w-full h-full">
    //     <Text className="px-4 text-2xl font-extrabold text-center ">
    //       Seems like there are no items at the moment, let's add some to this
    //       list!
    //     </Text>
    //   </View>
    // )
    <List2
      type={type}
      listType={listType}
      favMovieList={favMovieList}
      watchMovieList={watchMovieList}
      ratedMovieList={ratedMovieList}
      favTvList={favTvList}
      watchlistTv={watchlistTv}
      ratedTv={ratedTv}
    />
  );
};

const List2 = ({
  favMovieList,
  type,
  listType,
  watchMovieList,
  ratedMovieList,
  favTvList,
  watchlistTv,
  ratedTv,
}) => {
  const navigation = useNavigation();
  return (
    <>
      {type === "movies" ? (
        listType === "favorite" ? (
          favMovieList && favMovieList.length > 0 ? (
            <FlatList
              data={favMovieList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex flex-row justify-start h-40 p-px my-px rounded-md border-x-indigo-500 border-x-4 border-y-red-700 border-y-4"
                  onPress={() => {
                    navigation.navigate("MyMovieDetails", {
                      movie_id: item.favMovieId,
                      header: item.name,
                      origin: "moviemy",
                    });
                  }}
                >
                  <View className="w-fit">
                    {item.posterImageUrl ? (
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                    {item.releaseDate ? (
                      <Text className="font-light">
                        {"Release date: " + item.releaseDate}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.favMovieId}
            />
          ) : (
            <View className="flex items-center justify-center w-full h-full">
              <Text className="px-4 text-2xl font-extrabold text-center ">
                Seems like there are no items at the moment, let's add some to
                this list!
              </Text>
            </View>
          )
        ) : listType === "watchlist" ? (
          watchMovieList && watchMovieList.length > 0 ? (
            <FlatList
              data={watchMovieList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex flex-row justify-start h-40 p-px my-px rounded-md border-x-indigo-500 border-x-4 border-y-red-700 border-y-4"
                  onPress={() => {
                    navigation.navigate("MyMovieDetails", {
                      movie_id: item.watchlistMovieId,
                      header: item.name,
                      origin: "moviemy",
                    });
                  }}
                >
                  <View className="w-fit">
                    {item.posterImageUrl ? (
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                    {item.releaseDate ? (
                      <Text className="font-light">
                        {"Release date: " + item.releaseDate}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.watchlistMovieId}
            />
          ) : (
            <View className="flex items-center justify-center w-full h-full">
              <Text className="px-4 text-2xl font-extrabold text-center ">
                Seems like there are no items at the moment, let's add some to
                this list!
              </Text>
            </View>
          )
        ) : ratedMovieList && ratedMovieList.length > 0 ? (
          <FlatList
            data={ratedMovieList}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex flex-row justify-start h-40 p-px my-px rounded-md border-x-indigo-500 border-x-4 border-y-red-700 border-y-4"
                onPress={() => {
                  navigation.navigate("MyMovieDetails", {
                    movie_id: item.ratedMovieId,
                    header: item.name,
                    origin: "moviemy",
                  });
                }}
              >
                <View className="w-fit">
                  {item.posterImageUrl ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                  {item.releaseDate ? (
                    <Text className="font-light">
                      {"Release date: " + item.releaseDate}
                    </Text>
                  ) : null}
                  <View className="flex flex-row items-center">
                    <Text className="font-semibold">Your rating: </Text>
                    <Badge
                      value={item.ratedValue}
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
            )}
            keyExtractor={(item) => item.ratedMovieId}
          />
        ) : (
          <View className="flex items-center justify-center w-full h-full">
            <Text className="px-4 text-2xl font-extrabold text-center ">
              Seems like there are no items at the moment, let's add some to
              this list!
            </Text>
          </View>
        )
      ) : listType === "favorite" ? (
        favTvList && favTvList.length > 0 ? (
          <FlatList
            data={favTvList}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex flex-row justify-start h-40 p-px my-px rounded-md border-x-indigo-500 border-x-4 border-y-red-700 border-y-4"
                onPress={() => {
                  navigation.navigate("MyTvDetails", {
                    series_id: item.favTvId,
                    header: item.name,
                    origin: "tvmy",
                  });
                }}
              >
                <View className="w-fit">
                  {item.posterImageUrl ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                  {item.firstAirDate ? (
                    <Text className="font-light">
                      {"Release date: " + item.firstAirDate}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.favTvId}
          />
        ) : (
          <View className="flex items-center justify-center w-full h-full">
            <Text className="px-4 text-2xl font-extrabold text-center ">
              Seems like there are no items at the moment, let's add some to
              this list!
            </Text>
          </View>
        )
      ) : listType === "watchlist" ? (
        watchlistTv && watchlistTv.length > 0 ? (
          <FlatList
            data={watchlistTv}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex flex-row justify-start h-40 p-px my-px rounded-md border-x-indigo-500 border-x-4 border-y-red-700 border-y-4"
                onPress={() => {
                  navigation.navigate("MyTvDetails", {
                    series_id: item.watchlistTvId,
                    header: item.name,
                    origin: "tvmy",
                  });
                }}
              >
                <View className="w-fit">
                  {item.posterImageUrl ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                  {item.firstAirDate ? (
                    <Text className="font-light">
                      {"Release date: " + item.firstAirDate}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.watchlistTvId}
          />
        ) : (
          <View className="flex items-center justify-center w-full h-full">
            <Text className="px-4 text-2xl font-extrabold text-center ">
              Seems like there are no items at the moment, let's add some to
              this list!
            </Text>
          </View>
        )
      ) : ratedTv && ratedTv.length > 0 ? (
        <FlatList
          data={ratedTv}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex flex-row justify-start h-40 p-px my-px rounded-md border-x-indigo-500 border-x-4 border-y-red-700 border-y-4"
              onPress={() => {
                navigation.navigate("MyTvDetails", {
                  series_id: item.ratedTvId,
                  header: item.name,
                  origin: "tvmy",
                });
              }}
            >
              <View className="w-fit">
                {item.posterImageUrl ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w154/${item.posterImageUrl}`,
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
                {item.firstAirDate ? (
                  <Text className="font-light">
                    {"Release date: " + item.firstAirDate}
                  </Text>
                ) : null}
                <View className="flex flex-row items-center">
                  <Text className="font-semibold">Your rating: </Text>
                  <Badge
                    value={item.ratedValue}
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
          )}
          keyExtractor={(item) => item.ratedTvId}
        />
      ) : (
        <View className="flex items-center justify-center w-full h-full">
          <Text className="px-4 text-2xl font-extrabold text-center ">
            Seems like there are no items at the moment, let's add some to this
            list!
          </Text>
        </View>
      )}
    </>
  );
};

export default FavoriteRatingWatchList;
