import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
//import { insertFlaggedMovie, fetchFlaggedMovie } from "./Database";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import PersonProfileStack from "./PersonProfile";
import VideoList from "./VideoList";
import Loading from "./Loading";
import { useNavigation } from "@react-navigation/native";
import { Context } from "./Context";
import { createStackNavigator } from "@react-navigation/stack";
import VideoWebView from "./VideoWebView";
const Stack = createStackNavigator();
import RatingModal from "./RatingModal";
import MoreMovieAndShowImageList from "./MoreMovieAndShowImageList";
import HorizontalFlatList from "./HorizontalFlatList";
function MovieDetail({ route, navigation }) {
  const { movie_id, header, origin } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({ title: header });
  }, [navigation, header]);
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="MovieDetailInfo"
        component={MovieDetailInfo}
        initialParams={{ movie_id: movie_id, origin: origin }}
        options={{ headerTitle: header }}
      />
      <Stack.Screen
        name="MovieVideoList"
        component={VideoList}
        options={{ headerTitle: "Related Videos" }}
      />
      <Stack.Screen
        name="MoviePersonProfile"
        component={PersonProfileStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoreMovieImageList"
        component={MoreMovieAndShowImageList}
        options={{ headerTitle: "More Images" }}
      />

      <Stack.Screen name="MovieVideoWebView" component={VideoWebView} />
    </Stack.Navigator>
  );
}

const MovieDetailInfo = ({ route }) => {
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [sliderValue, setSliderValue] = useState(5);
  const navigation2 = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const { sessionId, accountDetail, flaggedMovieList, setFlaggedMovieList } =
    useContext(Context);
  const { movie_id, origin } = route.params;
  const [movieDetail, setMovieDetail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [genre, setGenre] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [language, setLanguage] = useState(false);
  const [localRatings, setLocalRatings] = useState(false);
  //const [localFlaggedMovieList, setLocalFlaggedMovieList] = useState([]);
  const pushLocation =
    origin === "moviemain"
      ? "MainMovieDetail"
      : origin === "moviesearch"
      ? "SearchMovieDetails"
      : origin === "moviediscover"
      ? "DiscoverMovie"
      : "MyMovieDetails";
  // const fetchFlaggedFromDatabase = async () => {
  //   try {
  //     const flaggedMovieListFromDB = await fetchFlaggedMovie();
  //     setFlaggedMovieList(flaggedMovieListFromDB);
  //     setLocalFlaggedMovieList(flaggedMovieListFromDB);
  //     console.log("fetched movie: ", flaggedMovieListFromDB);
  //   } catch (error) {
  //     console.log("Error fetching movie list:", error);
  //   }
  // };
  const GetMovieInfo = () => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/${movie_id}?api_key=841da308423b4b64ea4d57d052583683`
      )
      .then((res) => {
        //console.log("movies info: ", res.data);
        setMovieDetail(res.data);
        setGenre(res.data.genres.map((genre) => genre.name).join(", "));
        setLanguage(
          res.data.spoken_languages.map((language) => language.english_name)
        );

        axios
          .get(
            `https://api.themoviedb.org/3/movie/${movie_id}/account_states?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`
          )
          .then((res) => {
            //console.log(res.data);
            setIsFavorited(res.data.favorite);
            setIsInWatchlist(res.data.watchlist);
            setIsRated(res.data.rated);
            setSliderValue(res.data.rated ? res.data.rated.value : 5);
            //console.log(res.data.rated.value);
            axios
              .get(
                `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=841da308423b4b64ea4d57d052583683`
              )
              .then((res) => {
                //console.log(res.data.cast);
                setCast(res.data.cast);
                setCrew(res.data.crew);
                axios
                  .get(
                    `https://api.themoviedb.org/3/movie/${movie_id}/recommendations?api_key=841da308423b4b64ea4d57d052583683`
                  )
                  .then((res) => {
                    //console.log("recommendation:", res.data.results);
                    setRecommendations(res.data.results);
                  })
                  .catch((err) => {
                    console.error(err);
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    //console.log("movie id:", id);
    // fetchFlaggedFromDatabase();
    GetMovieInfo();
  }, []);
  // const handleInsertMovie = async () => {
  //   try {
  //     await insertFlaggedMovie(movie_id);
  //     fetchFlaggedFromDatabase(); // Fetch updated notes after deleting a note
  //   } catch (error) {
  //     console.error("Error inserting movie:", error);
  //   }
  // };
  const handleHeartPress = () => {
    //console.log("HeartPressed");
    const newState = !isFavorited;
    setIsFavorited(newState);
    axios
      .post(
        `https://api.themoviedb.org/3/account/${accountDetail.id}/favorite?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`,
        {
          media_type: "movie",
          media_id: movie_id,
          favorite: newState,
        }
      )
      .then((response) => {
        // console.log("changed fav state:", response.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // handleInsertMovie(movie_id);
      });
  };
  const handleBookmarkPress = () => {
    //console.log("BookmarkPressed");
    const newState = !isInWatchlist;
    setIsInWatchlist(newState);
    axios
      .post(
        `https://api.themoviedb.org/3/account/${accountDetail.id}/watchlist?api_key=841da308423b4b64ea4d57d052583683&session_id=${sessionId}`,
        {
          media_type: "movie",
          media_id: movie_id,
          watchlist: newState,
        }
      )
      .then((response) => {
        // console.log("changed watchlist state:", response.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        //handleInsertMovie(movie_id);
      });
  };
  const handleStarPress = () => {
    //console.log("StarPressed");
    setModalVisible(true);
  };
  return isLoading || movieDetail === null ? (
    <Loading />
  ) : (
    <>
      {/* <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/original/${movieDetail.backdrop_path}`,
        }}
      > */}
      <RatingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        isRated={isRated}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        id={movie_id}
        setIsRated={setIsRated}
        type={"movie"}
        setLocalRatings={setLocalRatings}
        season_number={false}
        episode_number={false}
        //setList={setLocalFlaggedMovieList}
      />
      <ScrollView className="px-4 ">
        {movieDetail.poster_path ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original/${movieDetail.poster_path}`,
            }}
            className="self-center w-full h-[480] rounded-lg mt-4"
          />
        ) : (
          <Image
            source={require("./assets/blank.png")}
            className="self-center w-full h-[480] rounded-lg mt-4"
          />
        )}
        <Text className="mt-4 text-2xl font-bold text-center">
          {movieDetail.title}
        </Text>
        {movieDetail.tagline ? (
          <Text className="my-2 text-base italic text-center">
            "{movieDetail.tagline}"
          </Text>
        ) : null}
        {sessionId ? (
          <>
            <View className="flex flex-row w-full justify-evenly">
              <TouchableOpacity
                className="items-center w-1/3 text-center"
                onPress={() => {
                  handleHeartPress();
                }}
              >
                <AntDesign
                  name={isFavorited ? "heart" : "hearto"}
                  size={30}
                  color={isFavorited ? "fuchsia" : "black"}
                />
                {isFavorited ? (
                  <Text>Favorited</Text>
                ) : (
                  <Text>Add to Favorites</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center w-1/3 text-center"
                onPress={() => {
                  handleBookmarkPress();
                }}
              >
                <FontAwesome
                  name={isInWatchlist ? "bookmark" : "bookmark-o"}
                  size={30}
                  color={isInWatchlist ? "red" : "black"}
                />
                {isInWatchlist ? (
                  <Text>In Watchlist</Text>
                ) : (
                  <Text>Add to Watchlist</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center w-1/3 text-center"
                onPress={() => {
                  handleStarPress();
                }}
              >
                <FontAwesome
                  name={isRated ? "star" : "star-o"}
                  size={30}
                  color={isRated ? "#E06e0a" : "black"}
                />
                {isRated ? (
                  <Text className="text-center">Tap to change your rating</Text>
                ) : (
                  <Text>Add your rating</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : null}
        {isRated.value ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">
              Your rating:{" "}
            </Text>
            {isRated.value}
          </Text>
        ) : localRatings ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">
              Your rating:{" "}
            </Text>
            {localRatings}
          </Text>
        ) : null}
        {movieDetail.overview ? (
          <>
            <Text className="text-lg font-semibold">Sypnosis:</Text>
            <Text className="text-base">{movieDetail.overview}</Text>
          </>
        ) : null}

        {genre ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">Genre: </Text>
            {genre}
          </Text>
        ) : null}
        {movieDetail.vote_average ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">Ratings: </Text>
            {movieDetail.vote_average}
            {movieDetail.vote_count ? (
              <>
                <Text className="text-lg font-semibold text-black"> from </Text>
                <Text>{movieDetail.vote_count} votes</Text>
              </>
            ) : null}
          </Text>
        ) : null}
        {language.length > 0 ? (
          language.length > 1 ? (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Spoken languages:{" "}
              </Text>
              {language.join(", ")}
            </Text>
          ) : (
            <Text className="text-base italic text-sky-600">
              <Text className="text-lg font-semibold text-black">
                Spoken languages:{" "}
              </Text>
              {language.join(", ")}
            </Text>
          )
        ) : null}

        {movieDetail.release_date ? (
          <Text className="text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">
              Release date:{" "}
            </Text>
            {movieDetail.release_date}
          </Text>
        ) : null}
        {movieDetail.runtime ? (
          <Text className="mb-2 text-base italic text-sky-600">
            <Text className="text-lg font-semibold text-black">Runtime: </Text>
            {movieDetail.runtime === 1
              ? `${movieDetail.runtime} minute`
              : `${movieDetail.runtime} minutes`}
          </Text>
        ) : null}

        {cast && cast.length > 0 ? (
          <>
            <View
              style={{
                padding: 16,
                backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired background color with opacity
              }}
              className="backdrop-blur-3xl"
            >
              <Text className="text-2xl font-extrabold ">Cast:</Text>
            </View>
            {/* <FlatList
                className="mb-4"
                data={cast}
                initialNumToRender={5}
                maxToRenderPerBatch={7}
                updateCellsBatchingPeriod={1000}
                horizontal // Set the horizontal prop to true
                showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
                keyExtractor={(item) => item.credit_id.toString()} // Convert the ID to a string for the keyExtractor
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation2.push("MoviePersonProfile", {
                        id: item.id,
                        origin: origin,
                        header: item.name,
                      });
                    }}
                    className="items-center px-1 pt-4 mx-1 bg-gray-300 rounded-lg w-[180] h-[300]"
                  >
                    {item.profile_path ? (
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w185/${item.profile_path}`,
                        }}
                        className="w-4/5 h-3/4"
                      />
                    ) : (
                      <Image
                        source={require("./assets/blank_avatar.jpg")}
                        className="w-4/5 h-3/4"
                      />
                    )}

                    <Text className="text-base font-bold text-center">
                      {truncateName(item.name)}
                    </Text>
                    <Text className="text-sm font-bold text-center">
                      {truncateRole(item.character)}
                    </Text>
                  </TouchableOpacity>
                )}
              /> */}
            <HorizontalFlatList
              data={cast}
              level2Text={true}
              level3Text={false}
              level4Text={false}
              navigationDestination={"MoviePersonProfile"}
              origin={origin}
              dataType={"personcast"}
              series_id={null}
              movie_id={movie_id}
              season_number={null}
            />
          </>
        ) : null}
        {crew && crew.length > 0 ? (
          <>
            <Text className="text-2xl font-extrabold">Crew:</Text>
            {/* <FlatList
                className="mb-4"
                data={crew}
                initialNumToRender={5}
                maxToRenderPerBatch={7}
                updateCellsBatchingPeriod={1000}
                horizontal // Set the horizontal prop to true
                showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
                keyExtractor={(item) => item.credit_id.toString()} // Convert the ID to a string for the keyExtractor
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation2.push("MoviePersonProfile", {
                        id: item.id,
                        origin: origin,
                        header: item.name,
                      });
                    }}
                    className="items-center px-1 pt-4 mx-1 bg-gray-300 rounded-lg w-[180] h-[300]"
                  >
                    {item.profile_path ? (
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w185/${item.profile_path}`,
                        }}
                        className="w-4/5 h-3/4"
                      />
                    ) : (
                      <Image
                        source={require("./assets/blank_avatar.jpg")}
                        className="w-4/5 h-3/4"
                      />
                    )}

                    <Text className="text-base font-bold text-center">
                      {truncateName(item.name)}
                    </Text>
                    <Text className="text-sm font-bold text-center">
                      {truncateRole(item.job)}
                    </Text>
                  </TouchableOpacity>
                )}
              /> */}
            <HorizontalFlatList
              data={crew}
              level2Text={true}
              level3Text={false}
              level4Text={false}
              navigationDestination={"MoviePersonProfile"}
              origin={origin}
              dataType={"personcrew"}
              series_id={null}
              movie_id={movie_id}
              season_number={null}
            />
          </>
        ) : null}

        {recommendations.length > 0 ? (
          <>
            <Text className="text-2xl font-extrabold">You may also like:</Text>
            {/* <FlatList
                className="mb-4"
                data={recommendations}
                initialNumToRender={5}
                maxToRenderPerBatch={7}
                updateCellsBatchingPeriod={1000}
                horizontal // Set the horizontal prop to true
                showsHorizontalScrollIndicator={false} // Optional: hide the horizontal scroll indicator
                keyExtractor={(item) => item.id.toString()} // Convert the ID to a string for the keyExtractor
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation2.push(pushLocation, {
                        id: item.id,
                        header: item.title,
                        origin: origin,
                      });
                    }}
                    className="items-center px-1 pt-4 mx-1 bg-gray-300 rounded-lg w-[180] h-[300]"
                  >
                    {item.poster_path ? (
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w154/${item.poster_path}`,
                        }}
                        className="w-4/5 h-3/4"
                      />
                    ) : (
                      <Image
                        source={require("./assets/blank.png")}
                        className="w-4/5 h-2/3"
                      />
                    )}

                    <Text className="text-sm font-bold text-center">
                      {truncateRole(item.title)}
                    </Text>
                    <View className="flex flex-row items-center justify-evenly">
                      <Text className="w-1/3 text-sm font-medium ">
                        {item.release_date.split("-")[0]}
                      </Text>
                      <Badge
                        value={item.vote_average}
                        status="primary"
                        badgeStyle={{ height: 22 }}
                        textStyle={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "white",
                        }}
                        className="w-1/3"
                      />
                    </View>
                  </TouchableOpacity>
                )}
              /> */}
            <HorizontalFlatList
              data={recommendations}
              level2Text={false}
              level3Text={true}
              level4Text={false}
              navigationDestination={pushLocation}
              origin={origin}
              dataType={"movie"}
              series_id={null}
              movie_id={movie_id}
            />
          </>
        ) : null}
        <View className="flex flex-row items-center w-full justify-evenly">
          <TouchableOpacity
            onPress={() => {
              navigation2.navigate("MoreMovieImageList", {
                id: movie_id,
                type: "movie",
                season_number: false,
                episode_number: false,
              });
            }}
            className="h-24 border-4 border-black w-[45%]"
          >
            <Text>More Images</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation2.navigate("MovieVideoList", {
                id: movie_id,
                type: "movie",
                season_number: false,
                episode_number: false,
              });
            }}
            className="h-24 border-4 w-[45%] border-black"
          >
            <Text>Related Videos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* </ImageBackground> */}
    </>
  );
};

export default MovieDetail;
