import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import HttpServiceTab from "./HttpServiceTab";
import PowerControlTab from "./PowerControlTab";

export default function index() {
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("80"); // Default HTTP port
  const [selectedMethod, setSelectedMethod] = useState("GET");
  const [connectionStatus, setConnectionStatus] = useState<
    "none" | "success" | "error"
  >("none");
  const [powerState, setPowerState] = useState("OFF");
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"http" | "power">("http");

  const checkConnection = async (ip: string) => {
    if (!ip) {
      if (!isDevelopmentMode) {
        Alert.alert("Error", "Please enter an IP address");
      } else {
        console.log("Development Mode: IP address is missing");
      }
      return false;
    }

    try {
      const response = await fetch(`http://${ip}:${port}`, { method: "GET" });
      if (!response.ok) throw new Error("Connection failed");
      setConnectionStatus("success");
      return true;
    } catch (error) {
      setConnectionStatus("error");
      if (isDevelopmentMode) {
        Alert.alert(
          "Development Mode",
          `Connection failed to ${ip}:${port}\nMake sure the device is on the same network and the server is running.`
        );
      }
      return false;
    }
  };

  const handlePowerToggle = async (state: "ON" | "OFF") => {
    if (await checkConnection(ipAddress)) {
      setPowerState(state);
      console.log(`POST request to ${ipAddress}: Power ${state}`);
    }
  };

  const renderConnectionStatus = () => {
    if (connectionStatus === "none") return null;

    return (
      <Text
        style={{
          color: connectionStatus === "success" ? "#4CAF50" : "#f44336",
          fontSize: 14,
          marginTop: -15,
          marginBottom: 15,
        }}
      >
        {connectionStatus === "success"
          ? "✓ Connected successfully"
          : "⚠ Connection failed - Development Mode"}
      </Text>
    );
  };

  const renderDevelopmentSwitch = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 20, // Add gap between text and button
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            flex: 1, // Allow text to take available space
          }}
        >
          Development Mode
        </Text>
        <Pressable
          style={{
            backgroundColor: isDevelopmentMode ? "#4CAF50" : "#e0e0e0",
            padding: 8,
            borderRadius: 5,
            width: 80,
            alignItems: "center",
          }}
          onPress={() => setIsDevelopmentMode(!isDevelopmentMode)}
        >
          <Text
            style={{
              color: isDevelopmentMode ? "#fff" : "#000",
              fontWeight: "500",
            }}
          >
            {isDevelopmentMode ? "ON" : "OFF"}
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderTabs = () => (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      }}
    >
      <Pressable
        style={{
          flex: 1,
          padding: 15,
          alignItems: "center",
          borderBottomWidth: 2,
          borderBottomColor: activeTab === "http" ? "#007AFF" : "transparent",
        }}
        onPress={() => setActiveTab("http")}
      >
        <Text
          style={{
            color: activeTab === "http" ? "#007AFF" : "#666",
            fontWeight: "500",
          }}
        >
          HTTP Service
        </Text>
      </Pressable>
      <Pressable
        style={{
          flex: 1,
          padding: 15,
          alignItems: "center",
          borderBottomWidth: 2,
          borderBottomColor: activeTab === "power" ? "#007AFF" : "transparent",
        }}
        onPress={() => setActiveTab("power")}
      >
        <Text
          style={{
            color: activeTab === "power" ? "#007AFF" : "#666",
            fontWeight: "500",
          }}
        >
          Power Control
        </Text>
      </Pressable>
    </View>
  );

  const renderTestConnection = () => {
    return (
      <View style={{ width: "100%", maxWidth: 400, marginBottom: 20 }}>
        <Pressable
          style={{
            backgroundColor: "#007AFF",
            padding: 12,
            borderRadius: 5,
            alignItems: "center",
          }}
          onPress={() => checkConnection(ipAddress)}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
            Test Connection
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  console.log("onRefresh");
                }}
              />
            }
          >
            <View style={{ flex: 1, padding: 20, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                Welcome to simple App Http
              </Text>

              {renderTabs()}
              {renderDevelopmentSwitch()}
              {renderTestConnection()}

              {activeTab === "http" ? (
                <HttpServiceTab
                  ipAddress={ipAddress}
                  setIpAddress={setIpAddress}
                  port={port}
                  setPort={setPort}
                  selectedMethod={selectedMethod}
                  setSelectedMethod={setSelectedMethod}
                  connectionStatus={connectionStatus}
                  setConnectionStatus={setConnectionStatus}
                  renderConnectionStatus={renderConnectionStatus}
                  isDevelopmentMode={isDevelopmentMode} // Add this line
                />
              ) : (
                <PowerControlTab
                  ipAddress={ipAddress}
                  port={port}
                  powerState={powerState}
                  handlePowerToggle={handlePowerToggle}
                  isDevelopmentMode={isDevelopmentMode}
                />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
