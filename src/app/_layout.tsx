import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Dark } from '../constants/darkTheme';
import { SaldoProvider } from '../hooks/SaldoProvider';

export default function TabLayout() {
  return (
    <SaldoProvider>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(21, 21, 30, 0.95)',
            borderTopColor: '#2A2A3A',
            borderTopWidth: 1,
            height: 68,
            paddingBottom: 10,
            paddingTop: 8,
            position: 'absolute',
          },
          tabBarActiveTintColor: Dark.primary,
          tabBarInactiveTintColor: Dark.textMuted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="riwayat"
          options={{
            title: 'Riwayat',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="bulanan"
          options={{
            title: 'Bulanan',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </SaldoProvider>
  );
}