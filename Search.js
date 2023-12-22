import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Alert, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Button } from "@rneui/base";
import axios from "axios";
import ListView from "./ListView";
import { Ionicons } from "@expo/vector-icons";
import Loading from "./Loading";
import MovieDetail from "./MovieDetail";
import { createStackNavigator } from "@react-navigation/stack";
import ShowDetails from "./ShowDetails";
import PersonProfileStack from "./PersonProfile";
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchTab"
        component={SearchTab}
        options={{ headerTitleAlign: "center", headerTitle: "Search" }}
      />
      <Stack.Screen
        name="SearchMovieDetails"
        component={MovieDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchTvDetails"
        component={ShowDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchPersonDetails"
        component={PersonProfileStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const SearchTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Movies"
        component={SearchResults}
        initialParams={{ type: "movies" }}
      />
      <Tab.Screen
        name="TV Shows"
        component={SearchResults}
        initialParams={{ type: "tvshow" }}
      />
      <Tab.Screen
        name="Person"
        component={SearchResults}
        initialParams={{ type: "person" }}
        options={{ tabBarLabel: "People" }}
      />
    </Tab.Navigator>
  );
};

const SearchResults = ({ route }) => {
  const { type } = route.params;
  const [results, setResults] = useState([]);
  const [isNewDataEmpty, setIsNewDataEmpty] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResultEmpty, setIsResultEmpty] = useState(false);
  const [movieSearchPage, setMovieSearchPage] = useState(1);
  const [personSearchPage, setPersonSearchPage] = useState(1);
  const [TVShowSearchPage, setTVShowSearchPage] = useState(1);
  const [editable, setEditable] = useState(true);
  const clearText = () => {
    setLoading(true);
    setEditable(true);
    setKeyword("");
    setResults([]);
    setIsResultEmpty(false);
    if (type === "movies") {
      setMovieSearchPage(1);
    } else {
      setTVShowSearchPage(1);
    }
    setLoading(false);
  };
  useEffect(() => {
    //console.log(type);
    if (keyword) {
      Search();
    }
  }, [movieSearchPage, TVShowSearchPage, personSearchPage]);

  const Search = () => {
    const url =
      type === "movies"
        ? `
  https://api.themoviedb.org/3/search/movie?query=${keyword}&api_key=841da308423b4b64ea4d57d052583683&page=${movieSearchPage}`
        : type === "tvshow"
        ? `https://api.themoviedb.org/3/search/tv?query=${keyword}&api_key=841da308423b4b64ea4d57d052583683&page=${TVShowSearchPage}`
        : `https://api.themoviedb.org/3/search/person?query=${keyword}&api_key=841da308423b4b64ea4d57d052583683&page=${personSearchPage}&include_adult=false&language=en-US`;
    if (!keyword) {
      Alert.alert("Invalid", "Please enter a keyword");
      return;
    } else {
      setEditable(false);
      axios
        .get(url)
        .then((response) => {
          // console.log(response.data.results);
          //console.log(type);
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
            setIsNewDataEmpty(false);
          }

          //setKeyword(keyword);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const origin =
    type === "movies"
      ? "moviesearch"
      : type === "tvshow"
      ? "tvsearch"
      : "personsearch";

  return (
    <>
      <View className="flex flex-row justify-evenly">
        <TextInput
          editable={editable}
          onChangeText={setKeyword}
          value={keyword}
          className="w-4/6 border-4 border-indigo-500/75"
        />
        {keyword ? (
          <TouchableOpacity onPress={clearText}>
            <Ionicons name="close-circle-outline" size={20} color="gray" />
          </TouchableOpacity>
        ) : null}

        <Button
          title="Search"
          onPress={() => {
            setLoading(true);
            Search();
          }}
        />
      </View>
      {!loading ? (
        results && results.length > 0 ? (
          <ListView
            role={""}
            results={results}
            type={type}
            setPage={
              type === "movies"
                ? setMovieSearchPage
                : type === "tvshow"
                ? setTVShowSearchPage
                : setPersonSearchPage
            }
            origin={origin}
            isNewDataEmpty={isNewDataEmpty}
          />
        ) : isResultEmpty ? (
          <View className="flex items-center justify-center w-full h-full">
            <Text className="px-4 text-2xl font-extrabold text-center ">
              Seems like there are no results...
            </Text>
          </View>
        ) : null
      ) : (
        <Loading />
      )}
    </>
  );
};
export default SearchStack;
