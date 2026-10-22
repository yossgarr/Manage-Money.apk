import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { Dark } from '../constants/darkTheme';

const { width, height } = Dimensions.get('window');
const JUMLAH_BINTANG = 28;

type Bintang = {
  x: number;
  y: number;
  size: number;
  delay: number;
  durasi: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
};

function buatBintang(): Bintang {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.5 + 1,
    delay: Math.random() * 3000,
    durasi: 2500 + Math.random() * 2500,
    opacity: new Animated.Value(0.2),
    translateY: new Animated.Value(0),
  };
}

export default function StarfieldBackground() {
  const bintang = useMemo(() => Array.from({ length: JUMLAH_BINTANG }, buatBintang), []);
  const ref = useRef(bintang);

  useEffect(() => {
    const animasi = ref.current.map((b) => {
      const kedip = Animated.loop(
        Animated.sequence([
          Animated.delay(b.delay),
          Animated.timing(b.opacity, {
            toValue: 1,
            duration: b.durasi,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(b.opacity, {
            toValue: 0.15,
            duration: b.durasi,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      const melayang = Animated.loop(
        Animated.sequence([
          Animated.timing(b.translateY, {
            toValue: -12,
            duration: b.durasi * 1.5,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(b.translateY, {
            toValue: 0,
            duration: b.durasi * 1.5,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      kedip.start();
      melayang.start();
      return () => {
        kedip.stop();
        melayang.stop();
      };
    });

    return () => animasi.forEach((stop) => stop());
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#0B0B0F', '#12101F', '#0B0B0F']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.orbUngu} />
      <View style={styles.orbBiru} />

      {ref.current.map((b, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bintang,
            {
              left: b.x,
              top: b.y,
              width: b.size,
              height: b.size,
              borderRadius: b.size / 2,
              opacity: b.opacity,
              transform: [{ translateY: b.translateY }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  orbUngu: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Dark.glow,
  },
  orbBiru: {
    position: 'absolute',
    bottom: -140,
    left: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  bintang: {
    position: 'absolute',
    backgroundColor: '#E9E3FF',
  },
});