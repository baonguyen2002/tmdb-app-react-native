import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import axios from "axios";
import Slider from "@react-native-community/slider";
import { Context } from "./Context";
const RatingModal = ({
  modalVisible,
  setModalVisible,
  isRated,
  id,
  setIsRated,
  sliderValue,
  setSliderValue,
  type,
  setLocalRatings,
  season_number,
  episode_number,
}) => {
  const { sessionId } = useContext(Context);
  const handleDeletePress = () => {
    const setUrl = () => {
      if (typeof episode_number === "number") {
        return `https://api.themoviedb.org/3/tv/${id}/season/${season_number}/episode/${episode_number}/rating?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`;
      } else {
        return `https://api.themoviedb.org/3/${type}/${id}/rating?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`;
      }
    };
    axios
      .delete(setUrl())
      .then((res) => {
        console.log("delete success: ", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    setIsRated(false);
    setModalVisible(false);
    setLocalRatings(false);
  };
  const handleOkPress = () => {
    const setUrl = () => {
      if (typeof episode_number === "number") {
        return `https://api.themoviedb.org/3/tv/${id}/season/${season_number}/episode/${episode_number}/rating?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`;
      } else {
        return `https://api.themoviedb.org/3/${type}/${id}/rating?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`;
      }
    };
    axios
      .post(setUrl(), {
        value: sliderValue,
      })
      .then((response) => {
        console.log("update rating success: ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    setIsRated(true);
    setModalVisible(false);
    setLocalRatings(sliderValue);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        //Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View className="flex items-center justify-center w-full h-full ">
        <View className="w-3/4 h-40 p-4 bg-green-200 ">
          <Text className="text-2xl font-bold text-center">
            Set your rating:
          </Text>
          <Text className="text-2xl font-bold text-center">{sliderValue}</Text>
          <View className="flex flex-row items-center mb-2 justify-evenly">
            <Text className="text-base">0.5</Text>
            <View className="w-4/5">
              <Slider
                minimumValue={0.5}
                maximumValue={10}
                step={0.5}
                onValueChange={(value) => {
                  setSliderValue(value);
                }}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                value={sliderValue ? sliderValue : 5}
              />
            </View>
            <Text className="text-base">10</Text>
          </View>

          <View className="flex flex-row w-full h-8 justify-evenly">
            <TouchableOpacity
              disabled={!isRated}
              className="items-center justify-center w-1/4 h-full"
              style={{ backgroundColor: isRated ? "red" : "#9e9e9e" }}
              onPress={() => handleDeletePress()}
            >
              <Text className="text-center text-white">Delete</Text>
            </TouchableOpacity>

            <View className="flex-row w-2/3 justify-evenly">
              <TouchableOpacity
                className="items-center justify-center w-2/5 h-full bg-amber-400"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text className="text-center ">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center justify-center w-2/5 h-full bg-cyan-500 "
                onPress={() => handleOkPress()}
              >
                <Text className="text-center text-white">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;
