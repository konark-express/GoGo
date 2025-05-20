import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import EmptyState from '@/components/EmptyState';
import { Trip } from '@/types/trip';
import { mockTrips } from '@/data/mockData';

export default function TripsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    // Simulate API call to fetch trips
    setTimeout(() => {
      setTrips(mockTrips);
      setLoading(false);
    }, 1000);
  }, []);

  const bgColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#8E8E93' : '#636366';
  const cardBgColor = isDark ? '#2C2C2E' : '#F2F2F7';

  const goToTripDetails = (tripId: string) => {
    router.push(`/trip/${tripId}`);
  };

  const createNewTrip = () => {
    router.push('/trip/new');
  };

  const renderTripItem = ({ item, index }) => {
    // Add a small delay to each item for staggered animation
    const ITEM_HEIGHT = 220;
    const translateY = scrollY.interpolate({
      inputRange: [
        (index - 1) * ITEM_HEIGHT,
        index * ITEM_HEIGHT,
        (index + 1) * ITEM_HEIGHT
      ],
      outputRange: [0, 0, 20],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View
        style={[
          styles.tripCard,
          { 
            backgroundColor: cardBgColor,
            transform: [{ translateY }],
            marginTop: index === 0 ? 10 : 0
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.tripCardInner} 
          onPress={() => goToTripDetails(item.id)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: item.coverImage }}
            style={styles.tripCoverImage}
          />
          <View style={styles.tripInfo}>
            <Text style={[styles.tripTitle, { color: textColor }]}>{item.title}</Text>
            <Text style={[styles.tripDate, { color: secondaryTextColor }]}>
              {item.startDate} - {item.endDate}
            </Text>
            <View style={styles.tripMetaInfo}>
              <Text style={[styles.tripMeta, { color: secondaryTextColor }]}>
                {item.participants.length} people
              </Text>
              <Text style={[styles.tripMeta, { color: secondaryTextColor }]}>
                {item.expenses.length} expenses
              </Text>
              <Text style={[styles.tripTotal, { color: isDark ? '#4CD964' : '#34C759' }]}>
                ${item.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {trips.length === 0 && !loading ? (
        <EmptyState
          title="No trips yet"
          message="Create your first trip to start tracking expenses and activities."
          buttonText="Create Trip"
          onButtonPress={createNewTrip}
          icon="map"
          isDark={isDark}
        />
      ) : (
        <Animated.FlatList
          data={trips}
          renderItem={renderTripItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        />
      )}
      
      <TouchableOpacity 
        style={[styles.fabButton, { backgroundColor: '#007AFF' }]} 
        onPress={createNewTrip}
      >
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  tripCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripCardInner: {
    height: 220,
  },
  tripCoverImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  tripInfo: {
    padding: 12,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  tripMetaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripMeta: {
    fontSize: 13,
  },
  tripTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});