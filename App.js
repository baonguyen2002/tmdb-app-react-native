import "react-native-gesture-handler";
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
      screenOptions={{
        tabBarActiveBackgroundColor: "#14b8a6",
        tabBarInactiveBackgroundColor: "#5b21b6",
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "#14b8a6",
        tabBarLabelStyle: {
          fontWeight: "bold",
          fontSize: 13,
        },
      }}
    >
      <Tab.Screen
        name="MoviesStack"
        component={MovieStack}
        options={{
          headerShown: false,
          tabBarLabel: "Movies",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="movie"
              size={24}
              color={focused ? "#1e40af" : "#14b8a6"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ShowsStack"
        component={ShowsStack}
        options={{
          headerShown: false,
          tabBarLabel: "TV Shows",
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="tv"
              size={24}
              color={focused ? "#1e40af" : "#14b8a6"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="DiscoverStack"
        component={DiscoverStack}
        options={{
          headerShown: false,
          tabBarLabel: "Discover",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="filter"
              size={24}
              color={focused ? "#1e40af" : "#14b8a6"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="search"
              size={24}
              color={focused ? "#1e40af" : "#14b8a6"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user"
              size={24}
              color={focused ? "#1e40af" : "#14b8a6"}
            />
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
