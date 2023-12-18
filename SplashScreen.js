import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("./assets/swingingBall.json")} // Replace with the path to your Lottie animation JSON file
        autoPlay
        loop={true}
        //onAnimationFinish={handleAnimationFinish}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
