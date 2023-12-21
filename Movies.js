import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Context } from "./Context";
import Loading from "./Loading";
import { Badge } from "@rneui/themed";
import MovieDetail from "./MovieDetail";
import { AntDesign } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import GridView from "./GridView";
import ForyouMovieStack from "./ForYouMovie";
const Stack = createStackNavigator();

function MovieStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="ForYouMovie"
        component={ForyouMovieStack}
        options={{ headerShown: false }}
        initialParams={{ type: "movie" }}
      />
      <Stack.Screen
        name="Movies"
        component={Movies}
        options={{ headerTitle: "Popular Movies" }}
      />
      <Stack.Screen
        name="MainMovieDetail"
        component={MovieDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const Movies = () => {
  const [currentPage, setcurrentPage] = useState("1");
  const navigation = useNavigation();
  const [moviePage, setMoviePage] = useState(1);
  const [movieResult, setMovieResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPage, setMaxPage] = useState(0);
  const GetMovies = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/popular?api_key=841da308423b4b64ea4d57d052583683&page=${moviePage}`
      )
      .then((response) => {
        setMovieResult(response.data.results);
        setcurrentPage(moviePage.toString());
        if (response.data.total_pages > 500) {
          setMaxPage(500);
        } else {
          setMaxPage(response.data.total_pages);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        //always execute
      });
  };

  useEffect(() => {
    GetMovies();
  }, [moviePage]);

  function detectSpecialCharacters(str) {
    const regex = /[.,+\-\s]/g; // Regular expression to match commas, dots, plus signs, minus signs, and whitespace
    return regex.test(str);
  }
  const GoToPage = () => {
    if (detectSpecialCharacters(currentPage) || parseInt(currentPage) < 1) {
      Alert.alert("Invalid", "Invalid page number");
      return;
    } else if (parseInt(currentPage) > maxPage) {
      Alert.alert("Invalid", `Page number too high (<${maxPage})`);
      return;
    } else if (parseInt(currentPage) === moviePage) {
      Alert.alert("Notice", "You are at this page number");
      return;
    } else {
      setMoviePage(parseInt(currentPage));
      setIsLoading(true);
    }
  };

  const GoNext = () => {
    setMoviePage((prev) => prev + 1);
    setIsLoading(true);
  };

  const GoBack = () => {
    setMoviePage((prev) => prev - 1);
    setIsLoading(true);
  };
  return isLoading ? (
    <Loading />
  ) : (
    <>
      {/* <FlatList
        columnWrapperStyle={{
          justifyContent: "space-evenly",
        }}
        numColumns={2}
        data={movieResult}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MainMovieDetail", {
                id: item.id,
                header: item.title,
                origin: "moviemain",
              });
            }}
            className="w-[49%] bg-neutral-300 mb-0.5 rounded-2xl items-center p-2 "
          >
            {item.poster_path ? (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w300/${item.poster_path}`,
                }}
                className="w-full border-2 rounded-lg h-60 flex-2"
              />
            ) : (
              <Image
                source={require("./assets/blank.png")}
                className="w-full border-2 rounded-lg h-60 flex-2"
              />
            )}

            <Text className="text-base font-semibold text-center">
              {item.title}
            </Text>
            <View className="flex flex-row items-center w-full justify-evenly">
              <Text className="font-medium">
                Year: {item.release_date.split("-")[0]}
              </Text>
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
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      /> */}
      <GridView
        data={movieResult}
        dataType={"movie"}
        navigationDestination={"MainMovieDetail"}
        origin={"moviemain"}
      />
      {/* <View className="flex flex-row items-center justify-between px-4 py-2">
        {moviePage === 1 ? (
          <View></View>
        ) : (
          <TouchableOpacity
            onPress={() => GoBack()}
            className=" bg-gradient-to-r from-sky-500 to-indigo-500"
          >
            <Text> {"<<"} </Text>
          </TouchableOpacity>
        )}
        <View className="flex flex-row items-center justify-between">
          <Text>Page: </Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={setcurrentPage}
            value={currentPage}
            className="w-12 text-center"
          />
          <Button
            onPress={() => GoToPage()}
            title="Go"
            color="#841584"
            accessibilityLabel="Go to specified page"
          />
        </View>
        {moviePage === 500 ? (
          <View></View>
        ) : (
          <LinearGradient
            // Button Linear Gradient
            colors={["#fc3d03", "#000000", "#192f6a"]}
            className="rounded-xl"
            start={{ x: 0, y: 0 }} // Starting point at the top-left corner
            end={{ x: 1, y: 1 }} // Ending point at the bottom-right corner
          >
            <TouchableOpacity
              onPress={() => GoNext()}
              className="items-center justify-center w-14 h-9 rounded-xl"
            >
              <AntDesign name="forward" size={24} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View> */}
      <View className="flex flex-row items-center justify-between px-4 py-2">
        {moviePage === 1 ? (
          <View></View>
        ) : (
          <Button
            onPress={() => GoBack()}
            title="<<"
            color="#841584"
            accessibilityLabel="Go back previous page"
          />
        )}
        <View className="flex flex-row items-center justify-between">
          <Text>Page: </Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={setcurrentPage}
            value={currentPage}
            className="w-12 text-center"
          />
          <Button
            onPress={() => GoToPage()}
            title="Go"
            color="#841584"
            accessibilityLabel="Go to specified page"
          />
        </View>
        {moviePage === maxPage ? (
          <View></View>
        ) : (
          <Button
            onPress={() => GoNext()}
            title=">>"
            color="#841584"
            accessibilityLabel="Go to next page"
          />
        )}
      </View>
    </>
  );
};

export default MovieStack;
