import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ChevronLeft, Calendar, MapPin, Camera, X, Plus, Check } from 'lucide-react-native';

export default function NewTripScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.pexels.com/photos/1051073/pexels-photo-1051073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  const [participants, setParticipants] = useState([
    { id: '1', name: 'Me', email: 'me@example.com' }
  ]);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  
  const bgColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#8E8E93' : '#636366';
  const inputBgColor = isDark ? '#2C2C2E' : '#F2F2F7';
  const placeholderColor = isDark ? '#636366' : '#8E8E93';
  const borderColor = isDark ? '#38383A' : '#E5E5EA';

  const goBack = () => {
    router.back();
  };

  const handleCreateTrip = () => {
    if (!title) {
      alert('Please enter a trip title');
      return;
    }
    
    if (!startDate || !endDate) {
      alert('Please enter both start and end dates');
      return;
    }
    
    // In a real app, we would save the trip to the backend
    router.push('/');
  };

  const addParticipant = () => {
    if (!newParticipantName || !newParticipantEmail) {
      alert('Please enter both name and email for the participant');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newParticipantEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    
    const newParticipant = {
      id: `user-${Date.now()}`,
      name: newParticipantName,
      email: newParticipantEmail,
    };
    
    setParticipants([...participants, newParticipant]);
    setNewParticipantName('');
    setNewParticipantEmail('');
    setShowAddParticipant(false);
  };

  const removeParticipant = (id: string) => {
    if (id === '1') {
      // Cannot remove yourself
      return;
    }
    
    setParticipants(participants.filter(p => p.id !== id));
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color={textColor} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: textColor }]}>
          New Trip
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.createButton, 
            { 
              backgroundColor: title && startDate && endDate ? '#007AFF' : inputBgColor,
              opacity: title && startDate && endDate ? 1 : 0.5
            }
          ]} 
          onPress={handleCreateTrip}
          disabled={!title || !startDate || !endDate}
        >
          <Text 
            style={[
              styles.createButtonText, 
              { 
                color: title && startDate && endDate 
                  ? '#FFFFFF' 
                  : secondaryTextColor 
              }
            ]}
          >
            Create
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <TouchableOpacity style={styles.coverImageContainer}>
          {coverImage ? (
            <>
              <Image
                source={{ uri: coverImage }}
                style={styles.coverImage}
              />
              <View style={styles.changeCoverButton}>
                <Camera size={20} color="#FFFFFF" />
                <Text style={styles.changeCoverText}>Change Cover</Text>
              </View>
            </>
          ) : (
            <View 
              style={[
                styles.coverPlaceholder, 
                { backgroundColor: inputBgColor }
              ]}
            >
              <Camera size={32} color={secondaryTextColor} />
              <Text style={[styles.coverPlaceholderText, { color: secondaryTextColor }]}>
                Add Cover Photo
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Trip Details */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
              Trip Title *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: inputBgColor,
                  color: textColor,
                }
              ]}
              placeholder="e.g. Summer Vacation 2023"
              placeholderTextColor={placeholderColor}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: inputBgColor,
                  color: textColor,
                }
              ]}
              placeholder="Describe your trip (optional)"
              placeholderTextColor={placeholderColor}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
          
          <View style={styles.dateContainer}>
            <View style={[styles.dateInputContainer, { marginRight: 8 }]}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                Start Date *
              </Text>
              <View 
                style={[
                  styles.dateInputWrapper,
                  { backgroundColor: inputBgColor }
                ]}
              >
                <TextInput
                  style={[
                    styles.dateInput,
                    { color: textColor }
                  ]}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={placeholderColor}
                  value={startDate}
                  onChangeText={setStartDate}
                />
                <Calendar size={20} color={secondaryTextColor} style={styles.dateIcon} />
              </View>
            </View>
            
            <View style={styles.dateInputContainer}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                End Date *
              </Text>
              <View 
                style={[
                  styles.dateInputWrapper,
                  { backgroundColor: inputBgColor }
                ]}
              >
                <TextInput
                  style={[
                    styles.dateInput,
                    { color: textColor }
                  ]}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={placeholderColor}
                  value={endDate}
                  onChangeText={setEndDate}
                />
                <Calendar size={20} color={secondaryTextColor} style={styles.dateIcon} />
              </View>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
              Location
            </Text>
            <View 
              style={[
                styles.locationInputWrapper,
                { backgroundColor: inputBgColor }
              ]}
            >
              <TextInput
                style={[
                  styles.locationInput,
                  { color: textColor }
                ]}
                placeholder="e.g. Paris, France"
                placeholderTextColor={placeholderColor}
                value={location}
                onChangeText={setLocation}
              />
              <MapPin size={20} color={secondaryTextColor} style={styles.locationIcon} />
            </View>
          </View>
        </View>
        
        {/* Participants */}
        <View style={[styles.formSection, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Participants
            </Text>
          </View>
          
          {participants.map((participant) => (
            <View 
              key={participant.id}
              style={[
                styles.participantItem,
                { borderBottomColor: borderColor }
              ]}
            >
              <View style={styles.participantInfo}>
                <Text style={[styles.participantName, { color: textColor }]}>
                  {participant.name}
                </Text>
                <Text style={[styles.participantEmail, { color: secondaryTextColor }]}>
                  {participant.email}
                </Text>
              </View>
              
              {participant.id !== '1' && (
                <TouchableOpacity 
                  style={styles.removeParticipantButton}
                  onPress={() => removeParticipant(participant.id)}
                >
                  <X size={18} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          {showAddParticipant ? (
            <View style={styles.addParticipantForm}>
              <View style={styles.addParticipantInputs}>
                <TextInput
                  style={[
                    styles.participantInput,
                    { 
                      backgroundColor: inputBgColor,
                      color: textColor,
                      marginBottom: 8
                    }
                  ]}
                  placeholder="Name"
                  placeholderTextColor={placeholderColor}
                  value={newParticipantName}
                  onChangeText={setNewParticipantName}
                />
                
                <TextInput
                  style={[
                    styles.participantInput,
                    { 
                      backgroundColor: inputBgColor,
                      color: textColor,
                    }
                  ]}
                  placeholder="Email"
                  placeholderTextColor={placeholderColor}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={newParticipantEmail}
                  onChangeText={setNewParticipantEmail}
                />
              </View>
              
              <View style={styles.addParticipantActions}>
                <TouchableOpacity 
                  style={[
                    styles.participantActionButton,
                    { backgroundColor: '#FF3B30' }
                  ]}
                  onPress={() => setShowAddParticipant(false)}
                >
                  <X size={20} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.participantActionButton,
                    { 
                      backgroundColor: '#34C759',
                      marginLeft: 8
                    }
                  ]}
                  onPress={addParticipant}
                >
                  <Check size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={[
                styles.addParticipantButton,
                { borderColor: isDark ? '#38383A' : '#E5E5EA' }
              ]}
              onPress={() => setShowAddParticipant(true)}
            >
              <Plus size={20} color="#007AFF" style={styles.addParticipantIcon} />
              <Text style={[styles.addParticipantText, { color: '#007AFF' }]}>
                Add Participant
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  coverImageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeCoverButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeCoverText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  formSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  lastSection: {
    paddingBottom: 100,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateInputWrapper: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  dateIcon: {
    marginRight: 16,
  },
  locationInputWrapper: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  locationIcon: {
    marginRight: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  participantEmail: {
    fontSize: 14,
  },
  removeParticipantButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addParticipantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: 16,
  },
  addParticipantIcon: {
    marginRight: 8,
  },
  addParticipantText: {
    fontSize: 16,
    fontWeight: '500',
  },
  addParticipantForm: {
    marginTop: 16,
  },
  addParticipantInputs: {
    marginBottom: 12,
  },
  participantInput: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addParticipantActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  participantActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});