import React from "react";
import { Pressable, Text, View } from "react-native";

type PowerControlTabProps = {
  ipAddress: string;
  port: string; // Add this line
  powerState: string;
  handlePowerToggle: (state: "ON" | "OFF") => Promise<void>;
  isDevelopmentMode: boolean;
};

export default function PowerControlTab({
  ipAddress,
  powerState,
  handlePowerToggle,
  isDevelopmentMode,
}: PowerControlTabProps) {
  const handlePress = (state: "ON" | "OFF") => {
    if (isDevelopmentMode) {
      console.log(`Development Mode - Power Control:
        IP: ${ipAddress}
        Action: Setting power to ${state}
        Current State: ${powerState}
        Method: POST`);
    }
    handlePowerToggle(state);
  };

  return (
    <View style={{ width: "100%", maxWidth: 400 }}>
      <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: "500" }}>
        Power Control:
      </Text>
      <Text style={{ fontSize: 14, marginBottom: 12, color: "#666" }}>
        Toggle the power state using HTTP POST requests. The current state is:{" "}
        {powerState}
      </Text>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: powerState === "ON" ? "#4CAF50" : "#e0e0e0",
            padding: 15,
            borderRadius: 5,
            alignItems: "center",
          }}
          onPress={() => handlePress("ON")}
        >
          <Text
            style={{
              color: powerState === "ON" ? "#fff" : "#000",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            ON
          </Text>
        </Pressable>

        <Pressable
          style={{
            flex: 1,
            backgroundColor: powerState === "OFF" ? "#f44336" : "#e0e0e0",
            padding: 15,
            borderRadius: 5,
            alignItems: "center",
          }}
          onPress={() => handlePress("OFF")}
        >
          <Text
            style={{
              color: powerState === "OFF" ? "#fff" : "#000",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            OFF
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
