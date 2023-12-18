import React, { memo, PureComponent, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Badge } from "@rneui/themed";
import Loading from "./Loading";
import { useNavigation } from "@react-navigation/native";
const ListView = ({ results, type, setPage, origin, isNewDataEmpty, role }) => {
  const navigation = useNavigation();

  const LoadMore = () => {
    setPage((prev) => prev + 1);
  };
  const ListFooterComponent = () => {
    if (!isNewDataEmpty) {
      return <Loading />;
    } else {
      return null;
    }
  };
  const renderItem = useCallback(
    ({ item }) => {
      if (item.adult) {
        // If item.adult is true, return null to skip rendering the item
        return null;
      }
      return (
        <Item
          item={item}
          type={type}
          navigation={navigation}
          origin={origin}
          role={role}
        />
      );
    },
    [type, navigation, origin, role]
  );

  return (
    <>
      <FlatList
        data={results}
        // onEndReachedThreshold={0.5}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={2000}
        onEndReached={setPage ? LoadMore : false}
        renderItem={renderItem}
        ListFooterComponent={!isNewDataEmpty ? ListFooterComponent : null}
        keyExtractor={(item) => {
          if (role.includes("person")) {
            return item.credit_id.toString();
          } else {
            return item.id.toString();
          }
        }}
      />
    </>
  );
};

class Item extends PureComponent {
  render() {
    const { item, type, navigation, origin, role } = this.props;
    // const setScreenName = () => {
    //   if (origin.includes("my")) {
    //     if (type === "movies") {
    //       return "MyMovieDetails";
    //     } else {
    //       return "MyTvDetails";
    //     }
    //   } else if (origin.includes("search")) {
    //     if (type === "movies") {
    //       return "SearchMovieDetails";
    //     } else if (type === "tvshow") {
    //       return "SearchTvDetails";
    //     } else {
    //       return "SearchPersonDetails";
    //     }
    //   } else if (origin.includes("main")) {
    //     if (type === "movies") {
    //       return "MovieDetailInfo";
    //     } else {
    //       return "ShowDetailInfo";
    //     }
    //   }
    // };
    let location;
    switch (origin) {
      case "moviemain":
        location = "MainMovieDetail";
        break;
      case "moviesearch":
        location = "SearchMovieDetails";
        break;
      case "moviemy":
        location = "MyMovieDetails";
        break;
      case "tvmain":
        location = "MainShowDetail";
        break;
      case "tvsearch":
        location = "SearchTvDetails";
        break;
      case "tvmy":
        location = "MyTvDetails";
        break;
      case "moviediscover":
        location = "DiscoverMovie";
        break;
      case "tvdiscover":
        location = "DiscoverTv";
        break;
    }
    //const destinationPage = setScreenName();
    const header = type === "movies" ? item.title : item.name;
    // }
    function truncateName(str) {
      if (str.length > 50) {
        return str.slice(0, 40) + "...";
      }
      return str;
    }
    return (
      <TouchableOpacity
        className="flex flex-row justify-start h-40 p-px my-px rounded-md border-x-indigo-500 border-x-4 border-y-red-700 border-y-4"
        onPress={() => {
          console.log(
            "header:",
            header,
            "series_id: ",
            item.id,
            "origin: ",
            origin
          );
          navigation.push(location, {
            movie_id: item.id,
            series_id: item.id,
            header: header,
            origin: origin,
          });
        }}
      >
        {/* <View className="w-fit">
          {item.poster_path ? (
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w154/${item.poster_path}`,
              }}
              className="w-24 h-full mr-1 rounded-lg"
            />
          ) : (
            <Image
              source={require("./assets/blank.png")}
              className="w-24 h-full mr-1 rounded-lg"
            />
          )}
        </View> */}
        <RenderImage item={item} type={type} />
        <View className="flex items-start justify-center w-[71%]  ">
          <Text className="text-lg font-bold">
            {type === "movies"
              ? truncateName(item.title)
              : truncateName(item.name)}
          </Text>

          {type != "person" ? (
            <>
              <Text className="font-light">
                {type === "movies"
                  ? "Release date: " + item.release_date
                  : "First aired: " + item.first_air_date}
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
              {/* {role.length === 0 ? (
                item.character && item.character.length > 0 ? (
                  <Text style={{ fontSize: 14, fontWeight: "normal" }}>
                    As:{" "}
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                      {item.character}
                    </Text>
                  </Text>
                ) : (
                  <Text style={{ fontSize: 14, fontWeight: "normal" }}>
                    As:{" "}
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                      To be updated
                    </Text>
                  </Text>
                )
              ) : item.job && item.job.length > 0 ? (
                <Text style={{ fontSize: 14, fontWeight: "normal" }}>
                  Role:{" "}
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    {item.job}
                  </Text>
                </Text>
              ) : (
                <Text style={{ fontSize: 14, fontWeight: "normal" }}>
                  Role:{" "}
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    To be updated
                  </Text>
                </Text>
              )} */}
              {role.lenght != 0 ? (
                <>
                  {item.character ? (
                    item.character.length > 0 ? (
                      <Text>
                        As: <Text className="font-bold"> {item.character}</Text>
                      </Text>
                    ) : (
                      <Text>
                        As: <Text className="font-bold"> To be updated</Text>
                      </Text>
                    )
                  ) : null}
                  {item.job ? (
                    item.job.length > 0 ? (
                      <Text>
                        Job: <Text className="font-bold"> {item.job}</Text>
                      </Text>
                    ) : (
                      <Text>
                        Job: <Text className="font-bold"> To be updated</Text>
                      </Text>
                    )
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const RenderImage = ({ item, type }) => {
  const imageURL = type === "person" ? item.profile_path : item.poster_path;
  return (
    <View className="w-fit">
      {imageURL ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w185/${imageURL}`,
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
  );
};

export default memo(ListView);