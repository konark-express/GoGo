import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Plus, MapPin, Clock } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { Activity } from '@/types/activity';
import { mockActivities } from '@/data/mockData';
import EmptyState from '@/components/EmptyState';

export default function ActivitiesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  
  const bgColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#8E8E93' : '#636366';
  const cardBgColor = isDark ? '#2C2C2E' : '#F2F2F7';

  useEffect(() => {
    // Simulate API call to fetch activities
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);
  const addActivity = () => {
    // Temporary commented out due to router path issue
    // router.push('/activity/new');
    console.log('Add activity');
  };
  const viewActivityDetails = (activityId: string) => {
    // Temporary commented out due to router path issue
    // router.push(`/activity/${activityId}`);
    console.log('View activity details:', activityId);
  };

  const renderTripSelector = () => {
    return (
      <View style={styles.tripSelectorContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Select Trip
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tripsScrollView}>
          <TouchableOpacity
            style={[
              styles.tripItem,
              { 
                backgroundColor: selectedTrip === null ? '#007AFF' : cardBgColor,
                borderColor: isDark ? '#38383A' : '#E5E5EA',
              }
            ]}
            onPress={() => setSelectedTrip(null)}
          >
            <Text 
              style={[
                styles.tripItemText, 
                { color: selectedTrip === null ? '#FFFFFF' : textColor }
              ]}
            >
              All Trips
            </Text>
          </TouchableOpacity>
          
          {['Summer Vacation', 'Business Trip', 'Weekend Getaway'].map((trip, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tripItem,
                { 
                  backgroundColor: selectedTrip === trip ? '#007AFF' : cardBgColor,
                  borderColor: isDark ? '#38383A' : '#E5E5EA',
                }
              ]}
              onPress={() => setSelectedTrip(trip)}
            >
              <Text 
                style={[
                  styles.tripItemText, 
                  { color: selectedTrip === trip ? '#FFFFFF' : textColor }
                ]}
              >
                {trip}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  const renderActivityItem = ({ item }: { item: Activity }) => {
    return (
      <TouchableOpacity 
        style={[styles.activityCard, { backgroundColor: cardBgColor }]}
        onPress={() => viewActivityDetails(item.id)}
        activeOpacity={0.8}
      >
        {item.photos && item.photos.length > 0 && (
          <Image 
            source={{ uri: item.photos[0] }}
            style={styles.activityImage}
          />
        )}
        
        <View style={styles.activityContent}>
          <Text style={[styles.activityTitle, { color: textColor }]}>
            {item.title}
          </Text>
          
          <View style={styles.activityMeta}>
            <View style={styles.metaItem}>
              <Clock size={14} color={secondaryTextColor} style={styles.metaIcon} />
              <Text style={[styles.metaText, { color: secondaryTextColor }]}>
                {item.date} • {item.time}
              </Text>
            </View>
            
            {item.location && (
              <View style={styles.metaItem}>
                <MapPin size={14} color={secondaryTextColor} style={styles.metaIcon} />
                <Text style={[styles.metaText, { color: secondaryTextColor }]}>
                  {item.location}
                </Text>
              </View>
            )}
          </View>
          
          {item.description && (
            <Text 
              style={[styles.activityDescription, { color: secondaryTextColor }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {renderTripSelector()}
      
      {activities.length === 0 && !loading ? (
        <EmptyState
          title="No activities yet"
          message="Add your first activity to start logging your trip."
          buttonText="Add Activity"
          onButtonPress={addActivity}
          icon="calendar"
          isDark={isDark}
        />
      ) : (
        <FlatList
          data={activities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <TouchableOpacity 
        style={[styles.fabButton, { backgroundColor: '#007AFF' }]} 
        onPress={addActivity}
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
  tripSelectorContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tripsScrollView: {
    flexDirection: 'row',
    paddingBottom: 8, // Add bottom padding to prevent cut-off
  },
  tripItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,     // Increase spacing between trip selector items
    borderWidth: 1,
  },
  tripItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 120, // Increased padding to avoid FAB overlap
  },
  activityCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Slightly increased elevation for better card visibility
  },
  activityImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  activityContent: {
    padding: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  activityMeta: {
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 14,
  },
  activityDescription: {
    fontSize: 14,
    lineHeight: 20,
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
    elevation: 6, // Increased elevation for better visibility on Android
    zIndex: 10,   // Ensure FAB is above other elements
  },
});