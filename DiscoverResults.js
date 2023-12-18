import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import Loading from "./Loading";
import GridView from "./GridView";
import { LinearGradient } from "expo-linear-gradient";
const DiscoverResults = ({ route }) => {
  const [currentPage, setcurrentPage] = useState(1);
  //const { moviePage, setMoviePage } = useContext(Context);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPage, setMaxPage] = useState(0);
  const { url, origin, type, navigationDestination } = route.params;
  useEffect(() => {
    console.log("url:", url, "origin:", origin);
    fetchResults();
  }, [page]);
  const fetchResults = () => {
    axios
      .get(`${url}&page=${page}`)
      .then((response) => {
        //console.log("response:", response.data.results);
        setResult(response.data.results);
        setcurrentPage(page.toString());
        if (response.data.total_pages > 500) {
          setMaxPage(500);
        } else {
          setMaxPage(response.data.total_pages);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
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
    } else if (parseInt(currentPage) === page) {
      Alert.alert("Notice", "You are at this page number");
      return;
    } else {
      setPage(parseInt(currentPage));
      setIsLoading(true);
    }
  };

  const GoNext = () => {
    setPage((prev) => prev + 1);
    setIsLoading(true);
  };

  const GoBack = () => {
    setPage((prev) => prev - 1);
    setIsLoading(true);
  };
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <GridView
        data={result}
        dataType={type}
        navigationDestination={navigationDestination}
        origin={origin}
      />
      <View className="flex flex-row items-center justify-between px-4 py-2">
        {page === 1 ? (
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
        {page === 500 ? (
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
      </View>
    </>
  );
};

export default DiscoverResults;
