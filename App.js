import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MovieStack from "./Movies";
import ShowsStack from "./Shows";
import Search from "./Search";
import ProfileStack from "./Profile";
import { ContextProvider } from "./Context";
import { MaterialIcons, Entypo, FontAwesome } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoginScreen from "./LoginScreen";
import { Context } from "./Context";
import { useContext, useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import DiscoverStack from "./Discover";
import { setUpDatabase } from "./Database";
function MyTabs() {
  return (
    <Tab.Navigator
    // screenOptions={{
    //   // headerShown: false,
    //   // tabBarActiveTintColor: '#000',
    //   // tabBarInactiveTintColor: '#fff',
    //   // tabBarShowLabel: true,
    //   tabBarStyle: {
    //     // backgroundColor: '#327B5B',
    //     position: "absolute",
    //     bottom: 0,
    //     left: 0,
    //     elevation: 0,
    //     // flex: 1,
    //     height: 50,
    //   },
    // }}
    >
      <Tab.Screen
        name="MoviesStack"
        component={MovieStack}
        options={{
          headerShown: false,
          tabBarLabel: "Movies",
          tabBarIcon: () => (
            <MaterialIcons name="movie" size={24} color="#187fba" />
          ),
        }}
      />
      <Tab.Screen
        name="ShowsStack"
        component={ShowsStack}
        options={{
          headerShown: false,
          tabBarLabel: "TV Shows",
          tabBarIcon: () => <Entypo name="tv" size={24} color="#187fba" />,
        }}
      />
      <Tab.Screen
        name="DiscoverStack"
        component={DiscoverStack}
        options={{
          headerShown: false,
          tabBarLabel: "Discover",
          tabBarIcon: () => (
            <FontAwesome name="filter" size={24} color="#187fba" />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <FontAwesome name="search" size={24} color="#187fba" />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: () => (
            <FontAwesome name="user" size={24} color="#187fba" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const RenderLogin = () => {
  const { sessionId } = useContext(Context);
  return sessionId ? <MyTabs /> : <LoginScreen />;
};

const App = () => {
  setUpDatabase();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulating the asynchronous process of checking session ID
    setTimeout(() => {
      // Replace this with your actual logic to check the session ID
      setIsLoading(false);
    }, 6000); // Simulating a 2-second delay
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  } else
    return (
      <SafeAreaProvider>
        <ContextProvider>
          <NavigationContainer>
            <RenderLogin />
          </NavigationContainer>
        </ContextProvider>
      </SafeAreaProvider>
    );
};

export default App;
