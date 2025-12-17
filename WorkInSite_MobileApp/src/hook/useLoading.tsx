import { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

// Hook for managing loading state
const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const show = () => setIsLoading(true);
  const hide = () => setIsLoading(false);

  // A simple loader component you can render
  const Loader = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  return { show, hide, Loader };
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // optional semi-transparent background
  },
});

export { useLoading };
