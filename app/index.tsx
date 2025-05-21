import { useRouter } from "expo-router";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const route = useRouter();

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                console.log("onRefresh");
              }}
            />
          }
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Welcome to simple App Http
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>
              This is a simple app to test the Http client
            </Text>
            <Pressable onPress={() => route.push("./httpservice")}>
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 20,
                  padding: 10,
                  backgroundColor: "#007AFF",
                  color: "#fff",
                  borderRadius: 5,
                }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
