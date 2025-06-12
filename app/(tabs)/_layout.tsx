import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Chrome as Home, CreditCard, Calendar, User } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDark ? '#8E8E93' : '#636366',
        tabBarStyle: {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderTopColor: isDark ? '#38383A' : '#E5E5EA',
          height: 70,
          paddingTop: 8,
          paddingBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 8,
        },
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#000000',
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '800',
          marginBottom: 6,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size }) => <Home size={size+2} color={color} strokeWidth={2.5} />,
          headerTitle: 'My Trips',
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, size }) => <CreditCard size={size+2} color={color} strokeWidth={2.5} />,
          headerTitle: 'Expenses',
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Activities',
          tabBarIcon: ({ color, size }) => <Calendar size={size+2} color={color} strokeWidth={2.5} />,
          headerTitle: 'Activities',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size+2} color={color} strokeWidth={2.5} />,
          headerTitle: 'Profile',
        }}
      />
    </Tabs>
  );
}
