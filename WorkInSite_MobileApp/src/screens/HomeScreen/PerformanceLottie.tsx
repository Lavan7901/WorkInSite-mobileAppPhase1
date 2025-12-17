import React, { useRef, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

interface Props {
  source: any;
  size?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

const PerformanceLottie: React.FC<Props> = ({
  source,
  size = 35,
  loop = false,
  autoPlay = true,
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (autoPlay) {
      animationRef.current?.play();
    }
  }, [autoPlay]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LottieView
        ref={animationRef}
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        resizeMode="cover" // ensures no extra spacing
        style={{ width: size, height: size }}
        hardwareAccelerationAndroid
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', // crop any extra padding/margin from JSON
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PerformanceLottie;
