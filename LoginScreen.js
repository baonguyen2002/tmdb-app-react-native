import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, Text, Image, Button, Alert } from "react-native";
import { Context } from "./Context";
import axios from "axios";

import { createStackNavigator } from "@react-navigation/stack";
import ConfirmPage from "./ConfirmPage";
import Loading from "./Loading";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
const Stack = createStackNavigator();
const LoginScreen = () => {
  const navigation = useNavigation();
  const { setSessionId, approved } = useContext(Context);
  const [requestToken, setRequestToken] = useState("");

  const fetchRequestToken = () => {
    setRequestToken("");
    axios
      .get(
        `https://api.themoviedb.org/3/authentication/token/new?api_key=841da308423b4b64ea4d57d052583683`
      )
      .then((response) => {
        console.log("request token: " + response.data.request_token);
        setRequestToken(response.data.request_token);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const gettingApprovalClick = () => {
    navigation.navigate("ConfirmPage", {
      requestToken: requestToken,
    });
  };
  useFocusEffect(
    useCallback(() => {
      if (!approved) {
        fetchRequestToken();
      }
    }, [approved])
  );
  const fetchSessionId = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/authentication/session/new?api_key=841da308423b4b64ea4d57d052583683&request_token=${requestToken}`
      )
      .then((response) => {
        console.log("session id: " + response.data.session_id);
        setSessionId(response.data.session_id);
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", "Log in failed, please try again");

        fetchRequestToken();
      });
  };

  return (
    <View className="items-center justify-center w-full">
      <Image source={require("./assets/tmdb.png")} className="my-32" />
      {requestToken ? (
        <>
          <Button
            title="Get approval from TMDB"
            onPress={() => {
              gettingApprovalClick();
            }}
          />
          {approved ? (
            <View className="mt-4">
              <Button
                title="Log in"
                onPress={() => {
                  fetchSessionId();
                }}
              />
            </View>
          ) : null}
        </>
      ) : (
        <>
          <Text className="mb-10">Initializing. Please wait...</Text>
          <Loading />
        </>
      )}
    </View>
  );
};

const LoginStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmPage"
        component={ConfirmPage}
        options={{
          headerTitleAlign: "center",
          headerTitle: "Approval Request",
        }}
      />
    </Stack.Navigator>
  );
};

export default LoginStack;
