import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ChevronLeft, Calendar, User, CreditCard, Plus, CreditCard as Edit, Share2, Trash } from 'lucide-react-native';
import { Trip } from '@/types/trip';
import { mockTrips } from '@/data/mockData';

const HEADER_HEIGHT = 300;

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [HEADER_HEIGHT - 100, HEADER_HEIGHT - 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [HEADER_HEIGHT - 100, HEADER_HEIGHT - 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  useEffect(() => {
    let isMounted = true;
    
    // Simulate API call to fetch trip details
    const timeoutId = setTimeout(() => {
      const foundTrip = mockTrips.find(t => t.id === id);
      if (foundTrip && isMounted) {
        setTrip(foundTrip);
        setLoading(false);
      }
    }, 1000);

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [id]);

  const bgColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#8E8E93' : '#636366';
  const cardBgColor = isDark ? '#2C2C2E' : '#F2F2F7';
  const borderColor = isDark ? '#38383A' : '#E5E5EA';

  if (loading || !trip) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <Text style={{ color: textColor }}>Loading trip details...</Text>
      </View>
    );
  }

  const goBack = () => {
    router.back();
  };

  const editTrip = () => {
    router.push(`/trip/edit/${id}`);
  };

  const addExpense = () => {
    router.push(`/expense/new?tripId=${id}`);
  };

  const addActivity = () => {
    router.push(`/activity/new?tripId=${id}`);
  };

  const viewAllExpenses = () => {
    router.push(`/trip/${id}/expenses`);
  };

  const viewAllActivities = () => {
    router.push(`/trip/${id}/activities`);
  };

  const viewParticipants = () => {
    router.push(`/trip/${id}/participants`);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar style="light" />
      
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            opacity: headerBackgroundOpacity,
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.animatedHeaderTitle,
            {
              opacity: headerTitleOpacity,
              color: textColor,
            },
          ]}
        >
          {trip.title}
        </Animated.Text>
      </Animated.View>
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <ChevronLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      {/* More Options Button */}
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerActionButton} onPress={editTrip}>
          <Edit size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerActionButton}>
          <Share2 size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Cover Image */}
        <View style={styles.coverImageContainer}>
          <Image
            source={{ uri: trip.coverImage }}
            style={styles.coverImage}
          />
          <View style={styles.imageOverlay} />
          <View style={styles.tripHeaderInfo}>
            <Text style={styles.tripTitle}>{trip.title}</Text>
            <View style={styles.tripDateLocationContainer}>
              <Text style={styles.tripDateLocation}>
                {trip.startDate} - {trip.endDate}
              </Text>
              {trip.location && (
                <Text style={styles.tripDateLocation}>
                  {trip.location}
                </Text>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.content}>
          {/* Trip Description */}
          {trip.description && (
            <View style={styles.sectionContainer}>
              <Text style={[styles.description, { color: textColor }]}>
                {trip.description}
              </Text>
            </View>
          )}
          
          {/* Trip Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={[styles.statBox, { backgroundColor: cardBgColor }]} 
              onPress={viewParticipants}
            >
              <User size={22} color="#007AFF" style={styles.statIcon} />
              <Text style={[styles.statNumber, { color: textColor }]}>
                {trip.participants.length}
              </Text>
              <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                People
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statBox, { backgroundColor: cardBgColor }]} 
              onPress={viewAllExpenses}
            >
              <CreditCard size={22} color="#FF9500" style={styles.statIcon} />
              <Text style={[styles.statNumber, { color: textColor }]}>
                {trip.expenses.length}
              </Text>
              <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                Expenses
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statBox, { backgroundColor: cardBgColor }]} 
              onPress={viewAllActivities}
            >
              <Calendar size={22} color="#5856D6" style={styles.statIcon} />
              <Text style={[styles.statNumber, { color: textColor }]}>
                {trip.activities.length}
              </Text>
              <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                Activities
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Expenses Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Expenses
              </Text>
              
              <View style={styles.sectionActions}>
                <TouchableOpacity 
                  style={styles.viewAllButton} 
                  onPress={viewAllExpenses}
                >
                  <Text style={[styles.viewAllText, { color: '#007AFF' }]}>
                    View All
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: '#007AFF' }]}
                  onPress={addExpense}
                >
                  <Plus size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={[styles.summaryCard, { backgroundColor: cardBgColor }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: secondaryTextColor }]}>
                  Total Expenses
                </Text>
                <Text style={[styles.summaryValue, { color: textColor }]}>
                  ${trip.totalAmount.toFixed(2)}
                </Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: borderColor }]} />
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: secondaryTextColor }]}>
                  Per Person (Equal Split)
                </Text>
                <Text style={[styles.summaryValue, { color: textColor }]}>
                  ${(trip.totalAmount / trip.participants.length).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Activities Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Activities
              </Text>
              
              <View style={styles.sectionActions}>
                <TouchableOpacity 
                  style={styles.viewAllButton} 
                  onPress={viewAllActivities}
                >
                  <Text style={[styles.viewAllText, { color: '#007AFF' }]}>
                    View All
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: '#007AFF' }]}
                  onPress={addActivity}
                >
                  <Plus size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={[styles.datesListContainer, { backgroundColor: cardBgColor }]}>
              <Text style={[styles.dateItem, { color: textColor }]}>
                {trip.startDate}
              </Text>
              <Text style={[styles.dateItem, { color: textColor }]}>
                {trip.endDate}
              </Text>
            </View>
          </View>
          
          {/* Participants Section */}
          <View style={[styles.sectionContainer, styles.lastSection]}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Participants
              </Text>
              
              <TouchableOpacity 
                style={styles.viewAllButton} 
                onPress={viewParticipants}
              >
                <Text style={[styles.viewAllText, { color: '#007AFF' }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.participantsContainer, { backgroundColor: cardBgColor }]}>
              {trip.participants.map((participant, index) => (
                <View 
                  key={participant.id} 
                  style={[
                    styles.participantItem,
                    index < trip.participants.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: borderColor,
                    },
                  ]}
                >
                  <Text style={[styles.participantName, { color: textColor }]}>
                    {participant.name}
                  </Text>
                  <Text style={[styles.participantEmail, { color: secondaryTextColor }]}>
                    {participant.email}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.deleteButton, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
          >
            <Trash size={20} color="#FF3B30" style={styles.deleteIcon} />
            <Text style={[styles.deleteText, { color: '#FF3B30' }]}>
              Delete Trip
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
      
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: '#FF9500' }]}
          onPress={addExpense}
        >
          <CreditCard size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: '#5856D6' }]}
          onPress={addActivity}
        >
          <Calendar size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: 50,
    paddingHorizontal: 16,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 20,
    flexDirection: 'row',
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  coverImageContainer: {
    height: HEADER_HEIGHT,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  tripHeaderInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  tripTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tripDateLocationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tripDateLocation: {
    fontSize: 16,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginRight: 12,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllButton: {
    marginRight: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  datesListContainer: {
    borderRadius: 12,
    padding: 16,
  },
  dateItem: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 8,
  },
  participantsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  participantItem: {
    padding: 16,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  participantEmail: {
    fontSize: 14,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  deleteIcon: {
    marginRight: 8,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'column',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});