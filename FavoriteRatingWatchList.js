import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Loading from "./Loading";
import { createStackNavigator } from "@react-navigation/stack";
import ListView from "./ListView";
import ShowDetails from "./ShowDetails";
import MovieDetail from "./MovieDetail";
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
  const [moviePage, setMoviePage] = useState(1);
  const [TVShowPage, setTVShowPage] = useState(1);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResultEmpty, setIsResultEmpty] = useState(false);
  // useFocusEffect(
  //   useCallback(() => {
  //     FetchResult();
  //   }, [moviePage, TVShowPage])
  // );
  const [isNewDataEmpty, setIsNewDataEmpty] = useState(false);
  useEffect(() => {
    FetchResult();
  }, [moviePage, TVShowPage]);
  const { type, listType, id, sessionId, origin } = route.params;
  const FetchResult = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/account/${id}/${listType}/${type}?api_key=841da308423b4b64ea4d57d052583683&page=${
          type === "movies" ? moviePage : TVShowPage
        }&session_id=${sessionId}`
      )
      .then((response) => {
        //console.log(response.data.results);
        if (response.data.results.length === 0) {
          if (results.length == 0) {
            setIsResultEmpty(true);
          }
          setIsNewDataEmpty(true);
        } else {
          const filteredResults = response.data.results.filter(
            (newResult) =>
              !results.some(
                (existingResult) => existingResult.id === newResult.id
              )
          );
          setResults((prevResults) => [...prevResults, ...filteredResults]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return !isLoading ? (
    !isResultEmpty ? (
      <ListView
        role={""}
        results={results}
        type={type}
        setPage={type === "movies" ? setMoviePage : setTVShowPage}
        // moviePage={moviePage}
        // setMoviePage={setMoviePage}
        // TVShowPage={TVShowPage}
        // setTVShowPage={setTVShowPage}
        origin={origin}
        isNewDataEmpty={isNewDataEmpty}
      />
    ) : (
      <View className="flex items-center justify-center w-full h-full">
        <Text className="px-4 text-2xl font-extrabold text-center ">
          Seems like there are no items at the moment, let's add some to this
          list!
        </Text>
      </View>
    )
  ) : (
    <Loading />
  );
};

export default FavoriteRatingWatchList;
