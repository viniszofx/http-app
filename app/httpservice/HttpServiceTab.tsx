import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type HttpServiceTabProps = {
  ipAddress: string;
  setIpAddress: (ip: string) => void;
  port: string;
  setPort: (port: string) => void;
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  connectionStatus: string;
  setConnectionStatus: (status: "none" | "success" | "error") => void;
  renderConnectionStatus: () => React.ReactNode;
  isDevelopmentMode?: boolean; // Add isDevelopmentMode prop
};

export default function HttpServiceTab({
  ipAddress,
  setIpAddress,
  port,
  setPort,
  selectedMethod,
  setSelectedMethod,
  connectionStatus,
  setConnectionStatus,
  renderConnectionStatus,
  isDevelopmentMode = false,
}: HttpServiceTabProps) {
  const handleSendRequest = async () => {
    if (!ipAddress) {
      if (isDevelopmentMode) {
        console.log("Development Mode: IP address is missing");
      }
      setConnectionStatus("error");
      return;
    }

    try {
      const url = `http://${ipAddress}:${port}`;
      const options = {
        method: selectedMethod,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (isDevelopmentMode) {
        console.log(`Development Mode - Sending Request:
          URL: ${url}
          Method: ${selectedMethod}
          Headers: ${JSON.stringify(options.headers)}`);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setConnectionStatus("success");

      if (isDevelopmentMode) {
        const responseData = await response.text();
        console.log(`Development Mode - Response:
          Status: ${response.status}
          Data: ${responseData}`);
      }
    } catch (error) {
      setConnectionStatus("error");
      if (isDevelopmentMode) {
        console.error(`Development Mode - Request Failed:
          Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  return (
    <View style={{ width: "100%", maxWidth: 400 }}>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        <View style={{ flex: 2 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: "500" }}>
            IP Address:
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: connectionStatus === "error" ? "#f44336" : "#ccc",
              borderRadius: 5,
              padding: 10,
              fontSize: 16,
            }}
            value={ipAddress}
            onChangeText={(text) => {
              setIpAddress(text);
              setConnectionStatus("none");
            }}
            placeholder="Enter IP address"
            keyboardType="numeric"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: "500" }}>
            Port:
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 10,
              fontSize: 16,
            }}
            value={port}
            onChangeText={setPort}
            placeholder="80"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>

      <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: "500" }}>
        Select HTTP Method:
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {["GET", "POST", "PUT", "DELETE"].map((method) => (
          <Pressable
            key={method}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#007AFF",
              backgroundColor:
                selectedMethod === method ? "#007AFF" : "transparent",
            }}
            onPress={() => setSelectedMethod(method)}
          >
            <Text
              style={{
                color: selectedMethod === method ? "#fff" : "#007AFF",
                fontSize: 14,
              }}
            >
              {method}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={{
          backgroundColor: "#007AFF",
          padding: 15,
          borderRadius: 5,
          alignItems: "center",
          marginTop: 20,
        }}
        onPress={handleSendRequest}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
          Send {selectedMethod} Request
        </Text>
      </Pressable>

      {renderConnectionStatus()}
    </View>
  );
}
