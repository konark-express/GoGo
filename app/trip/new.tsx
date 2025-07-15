import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  Pressable
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ChevronLeft, Calendar, MapPin, Camera, X, Plus, Check, Users } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isLargeScreen = width > 768;
const isDesktop = width > 1024;

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
  
  // Focus states for input animations
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const [startDateFocused, setStartDateFocused] = useState(false);
  const [endDateFocused, setEndDateFocused] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const participantAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Animated entrance effect
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const bgColor = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#9CA3AF' : '#6B7280';
  const inputBgColor = isDark ? '#1F2937' : '#F9FAFB';
  const placeholderColor = isDark ? '#6B7280' : '#9CA3AF';
  const borderColor = isDark ? '#374151' : '#E5E7EB';
  const cardBgColor = isDark ? '#111827' : '#FFFFFF';
  const shadowColor = isDark ? '#000000' : '#000000';

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
    
    // Add success animation before navigation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // In a real app, we would save the trip to the backend
      router.push('/');
    });
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
    
    // Animate new participant addition
    Animated.sequence([
      Animated.timing(participantAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(participantAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
    
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
      
      {/* Web-optimized Header */}
      <Animated.View 
        style={[
          styles.header,
          isWeb && styles.webHeader,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            backgroundColor: isWeb 
              ? (isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)')
              : scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [
                    isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
                    isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)'
                  ],
                  extrapolate: 'clamp',
                }),
            ...Platform.select({
              web: {
                boxShadow: isDark 
                  ? '0 4px 20px rgba(0,0,0,0.3)' 
                  : '0 4px 20px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
              },
              ios: {
                shadowColor: shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 0.1],
                  extrapolate: 'clamp',
                }),
                shadowRadius: 8,
              },
              android: {
                elevation: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 8],
                  extrapolate: 'clamp',
                }),
              },
            }),
          }
        ]}
      >
        <View style={[styles.headerContent, isWeb && styles.webHeaderContent]}>
          <TouchableOpacity 
            style={[styles.backButton, isWeb && styles.webBackButton]} 
            onPress={goBack}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: inputBgColor }]}>
              <ChevronLeft size={24} color={textColor} />
            </View>
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: textColor }, isWeb && styles.webHeaderTitle]}>
            Create Trip
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.createButton,
              isWeb && styles.webCreateButton,
              { 
                backgroundColor: title && startDate && endDate ? '#FF385C' : inputBgColor,
                opacity: title && startDate && endDate ? 1 : 0.6,
              },
              isWeb && title && startDate && endDate && {
                boxShadow: '0 8px 25px rgba(255, 56, 92, 0.3)',
              },
              Platform.OS === 'ios' && {
                shadowColor: '#FF385C',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: title && startDate && endDate ? 0.3 : 0,
                shadowRadius: 8,
              },
              Platform.OS === 'android' && {
                elevation: title && startDate && endDate ? 8 : 0,
              }
            ]} 
            onPress={handleCreateTrip}
            disabled={!title || !startDate || !endDate}
            activeOpacity={0.8}
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
              Create Trip
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Web-optimized ScrollView */}
      <Animated.ScrollView 
        style={[
          styles.content,
          isWeb && styles.webContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={!isWeb}
        scrollEventThrottle={16}
        onScroll={isWeb ? undefined : Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Hero Cover Image with web optimization */}
        <Animated.View 
          style={[
            styles.coverImageContainer,
            isWeb && styles.webCoverImageContainer,
            !isWeb && {
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 280],
                    outputRange: [0, -140],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          {coverImage ? (
            <Pressable 
              onPress={() => {/* TODO: Image picker */}}
              style={[isWeb && styles.webCoverImagePressable]}
            >
              <Animated.Image
                source={{ uri: coverImage }}
                style={[
                  styles.coverImage,
                  isWeb && styles.webCoverImage,
                  !isWeb && {
                    transform: [
                      {
                        scale: scrollY.interpolate({
                          inputRange: [-100, 0],
                          outputRange: [1.3, 1],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              />
              <View style={[styles.coverOverlay, isWeb && styles.webCoverOverlay]}>
                <TouchableOpacity 
                  style={[styles.changeCoverButton, isWeb && styles.webChangeCoverButton]}
                  activeOpacity={0.8}
                >
                  <Camera size={20} color="#FFFFFF" />
                  <Text style={styles.changeCoverText}>Change Cover</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          ) : (
            <TouchableOpacity 
              style={[
                styles.coverPlaceholder, 
                { backgroundColor: inputBgColor },
                isWeb && styles.webCoverPlaceholder
              ]}
              activeOpacity={0.8}
            >
              <Camera size={40} color={secondaryTextColor} />
              <Text style={[styles.coverPlaceholderText, { color: secondaryTextColor }]}>
                Add Cover Photo
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
        
        {/* Web-optimized Form Layout */}
        <View style={[styles.formContainer, isWeb && styles.webFormContainer]}>
          {isDesktop ? (
            // Desktop Two-Column Layout
            <View style={styles.desktopFormLayout}>
              {/* Left Column - Trip Details */}
              <Animated.View style={[
                styles.formCard,
                styles.desktopLeftColumn,
                { 
                  backgroundColor: cardBgColor,
                  ...Platform.select({
                    web: {
                      boxShadow: isDark 
                        ? '0 10px 40px rgba(0,0,0,0.3)' 
                        : '0 10px 40px rgba(0,0,0,0.1)',
                    },
                    ios: {
                      shadowColor: shadowColor,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.12,
                      shadowRadius: 20,
                    },
                    android: {
                      elevation: 6,
                    },
                  }),
                }
              ]}>
                <Text style={[styles.cardTitle, { color: textColor }]}>
                  Trip Details
                </Text>
                
                {/* Trip Title */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                    Trip Title *
                  </Text>
                  <TextInput
                    style={[
                      styles.modernInput,
                      isWeb && styles.webInput,
                      { 
                        backgroundColor: inputBgColor,
                        color: textColor,
                        borderColor: titleFocused ? '#FF385C' : (title ? '#FF385C' : borderColor),
                        borderWidth: titleFocused ? 2 : 1.5,
                        transform: [{ scale: titleFocused ? 1.02 : 1 }],
                      }
                    ]}
                    placeholder="Where to next?"
                    placeholderTextColor={placeholderColor}
                    value={title}
                    onChangeText={setTitle}
                    onFocus={() => setTitleFocused(true)}
                    onBlur={() => setTitleFocused(false)}
                  />
                </View>
                
                {/* Description */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                    Description
                  </Text>
                  <TextInput
                    style={[
                      styles.modernTextArea,
                      isWeb && styles.webTextArea,
                      { 
                        backgroundColor: inputBgColor,
                        color: textColor,
                        borderColor: descriptionFocused ? '#FF385C' : (description ? '#FF385C' : borderColor),
                        borderWidth: descriptionFocused ? 2 : 1.5,
                        transform: [{ scale: descriptionFocused ? 1.01 : 1 }],
                      }
                    ]}
                    placeholder="Tell us about your adventure..."
                    placeholderTextColor={placeholderColor}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                    onFocus={() => setDescriptionFocused(true)}
                    onBlur={() => setDescriptionFocused(false)}
                  />
                </View>
                
                {/* Dates Row */}
                <View style={[styles.dateRow, isWeb && styles.webDateRow]}>
                  <View style={[styles.dateColumn, { marginRight: 16 }]}>
                    <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                      Check-in *
                    </Text>
                    <TouchableOpacity 
                      style={[
                        styles.modernDateInput,
                        isWeb && styles.webDateInput,
                        { 
                          backgroundColor: inputBgColor,
                          borderColor: startDateFocused ? '#FF385C' : (startDate ? '#FF385C' : borderColor),
                          borderWidth: startDateFocused ? 2 : 1.5,
                          transform: [{ scale: startDateFocused ? 1.02 : 1 }],
                        }
                      ]}
                    >
                      <TextInput
                        style={[styles.dateInputText, { color: textColor }]}
                        placeholder="Add date"
                        placeholderTextColor={placeholderColor}
                        value={startDate}
                        onChangeText={setStartDate}
                        onFocus={() => setStartDateFocused(true)}
                        onBlur={() => setStartDateFocused(false)}
                      />
                      <Calendar size={20} color="#FF385C" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.dateColumn}>
                    <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                      Check-out *
                    </Text>
                    <TouchableOpacity 
                      style={[
                        styles.modernDateInput,
                        isWeb && styles.webDateInput,
                        { 
                          backgroundColor: inputBgColor,
                          borderColor: endDateFocused ? '#FF385C' : (endDate ? '#FF385C' : borderColor),
                          borderWidth: endDateFocused ? 2 : 1.5,
                          transform: [{ scale: endDateFocused ? 1.02 : 1 }],
                        }
                      ]}
                    >
                      <TextInput
                        style={[styles.dateInputText, { color: textColor }]}
                        placeholder="Add date"
                        placeholderTextColor={placeholderColor}
                        value={endDate}
                        onChangeText={setEndDate}
                        onFocus={() => setEndDateFocused(true)}
                        onBlur={() => setEndDateFocused(false)}
                      />
                      <Calendar size={20} color="#FF385C" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Location */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                    Location
                  </Text>
                  <View 
                    style={[
                      styles.modernLocationInput,
                      isWeb && styles.webLocationInput,
                      { 
                        backgroundColor: inputBgColor,
                        borderColor: locationFocused ? '#FF385C' : (location ? '#FF385C' : borderColor),
                        borderWidth: locationFocused ? 2 : 1.5,
                        transform: [{ scale: locationFocused ? 1.02 : 1 }],
                      }
                    ]}
                  >
                    <MapPin size={20} color="#FF385C" style={styles.locationIconLeft} />
                    <TextInput
                      style={[styles.locationInputText, { color: textColor }]}
                      placeholder="Search destinations"
                      placeholderTextColor={placeholderColor}
                      value={location}
                      onChangeText={setLocation}
                      onFocus={() => setLocationFocused(true)}
                      onBlur={() => setLocationFocused(false)}
                    />
                  </View>
                </View>
              </Animated.View>
              
              {/* Right Column - Participants */}
              <Animated.View style={[
                styles.formCard,
                styles.desktopRightColumn,
                { 
                  backgroundColor: cardBgColor,
                  ...Platform.select({
                    web: {
                      boxShadow: isDark 
                        ? '0 10px 40px rgba(0,0,0,0.3)' 
                        : '0 10px 40px rgba(0,0,0,0.1)',
                    },
                    ios: {
                      shadowColor: shadowColor,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.12,
                      shadowRadius: 20,
                    },
                    android: {
                      elevation: 6,
                    },
                  }),
                }
              ]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: textColor }]}>
                    Who's coming?
                  </Text>
                  <View style={styles.participantCount}>
                    <Users size={16} color="#FF385C" />
                    <Text style={[styles.participantCountText, { color: '#FF385C' }]}>
                      {participants.length}
                    </Text>
                  </View>
                </View>
                
                {participants.map((participant, index) => (
                  <Animated.View 
                    key={participant.id}
                    style={[
                      styles.modernParticipantItem,
                      { 
                        borderBottomColor: borderColor,
                        transform: [{ scale: participantAnim }],
                      }
                    ]}
                  >
                    <View style={styles.participantAvatar}>
                      <Text style={styles.participantInitial}>
                        {participant.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.participantDetails}>
                      <Text style={[styles.participantName, { color: textColor }]}>
                        {participant.name}
                      </Text>
                      <Text style={[styles.participantEmail, { color: secondaryTextColor }]}>
                        {participant.email}
                      </Text>
                    </View>
                    
                    {participant.id !== '1' && (
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removeParticipant(participant.id)}
                        activeOpacity={0.7}
                      >
                        <X size={18} color="#FF385C" />
                      </TouchableOpacity>
                    )}
                  </Animated.View>
                ))}
                
                {showAddParticipant ? (
                  <Animated.View style={[styles.addParticipantCard, isWeb && styles.webAddParticipantCard]}>
                    <View style={styles.addParticipantInputs}>
                      <TextInput
                        style={[
                          styles.modernInput,
                          isWeb && styles.webInput,
                          { 
                            backgroundColor: inputBgColor,
                            color: textColor,
                            marginBottom: 12,
                            borderColor: borderColor,
                          }
                        ]}
                        placeholder="Full name"
                        placeholderTextColor={placeholderColor}
                        value={newParticipantName}
                        onChangeText={setNewParticipantName}
                      />
                      
                      <TextInput
                        style={[
                          styles.modernInput,
                          isWeb && styles.webInput,
                          { 
                            backgroundColor: inputBgColor,
                            color: textColor,
                            borderColor: borderColor,
                          }
                        ]}
                        placeholder="Email address"
                        placeholderTextColor={placeholderColor}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={newParticipantEmail}
                        onChangeText={setNewParticipantEmail}
                      />
                    </View>
                    
                    <View style={styles.addParticipantActions}>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => setShowAddParticipant(false)}
                        activeOpacity={0.8}
                      >
                        <X size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.confirmButton]}
                        onPress={addParticipant}
                        activeOpacity={0.8}
                      >
                        <Check size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                ) : (
                  <TouchableOpacity 
                    style={[
                      styles.addParticipantButton,
                      isWeb && styles.webAddParticipantButton,
                      { borderColor: '#FF385C' }
                    ]}
                    onPress={() => setShowAddParticipant(true)}
                    activeOpacity={0.8}
                  >
                    <Plus size={20} color="#FF385C" style={styles.addIcon} />
                    <Text style={[styles.addParticipantText, { color: '#FF385C' }]}>
                      Invite someone
                    </Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            </View>
          ) : (
            // Mobile Single-Column Layout (original)
            <>
              {/* Trip Details Card */}
              <Animated.View style={[
                styles.formCard,
                styles.tripDetailsCard,
                { 
                  backgroundColor: cardBgColor,
                  ...Platform.select({
                    ios: {
                      shadowColor: shadowColor,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.12,
                      shadowRadius: 20,
                    },
                    android: {
                      elevation: 6,
                    },
                  }),
                }
              ]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>
              Trip Details
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                Trip Title *
              </Text>
              <TextInput
                style={[
                  styles.modernInput,
                  { 
                    backgroundColor: inputBgColor,
                    color: textColor,
                    borderColor: titleFocused ? '#FF385C' : (title ? '#FF385C' : borderColor),
                    borderWidth: titleFocused ? 2 : 1.5,
                    transform: [{ scale: titleFocused ? 1.02 : 1 }],
                  }
                ]}
                placeholder="Where to next?"
                placeholderTextColor={placeholderColor}
                value={title}
                onChangeText={setTitle}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                Description
              </Text>
              <TextInput
                style={[
                  styles.modernTextArea,
                  { 
                    backgroundColor: inputBgColor,
                    color: textColor,
                    borderColor: descriptionFocused ? '#FF385C' : (description ? '#FF385C' : borderColor),
                    borderWidth: descriptionFocused ? 2 : 1.5,
                    transform: [{ scale: descriptionFocused ? 1.01 : 1 }],
                  }
                ]}
                placeholder="Tell us about your adventure..."
                placeholderTextColor={placeholderColor}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                onFocus={() => setDescriptionFocused(true)}
                onBlur={() => setDescriptionFocused(false)}
              />
            </View>
            
            <View style={styles.dateRow}>
              <View style={[styles.dateColumn, { marginRight: 12 }]}>
                <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                  Check-in *
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.modernDateInput,
                    { 
                      backgroundColor: inputBgColor,
                      borderColor: startDateFocused ? '#FF385C' : (startDate ? '#FF385C' : borderColor),
                      borderWidth: startDateFocused ? 2 : 1.5,
                      transform: [{ scale: startDateFocused ? 1.02 : 1 }],
                    }
                  ]}
                >
                  <TextInput
                    style={[styles.dateInputText, { color: textColor }]}
                    placeholder="Add date"
                    placeholderTextColor={placeholderColor}
                    value={startDate}
                    onChangeText={setStartDate}
                    onFocus={() => setStartDateFocused(true)}
                    onBlur={() => setStartDateFocused(false)}
                  />
                  <Calendar size={20} color="#FF385C" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dateColumn}>
                <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                  Check-out *
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.modernDateInput,
                    { 
                      backgroundColor: inputBgColor,
                      borderColor: endDateFocused ? '#FF385C' : (endDate ? '#FF385C' : borderColor),
                      borderWidth: endDateFocused ? 2 : 1.5,
                      transform: [{ scale: endDateFocused ? 1.02 : 1 }],
                    }
                  ]}
                >
                  <TextInput
                    style={[styles.dateInputText, { color: textColor }]}
                    placeholder="Add date"
                    placeholderTextColor={placeholderColor}
                    value={endDate}
                    onChangeText={setEndDate}
                    onFocus={() => setEndDateFocused(true)}
                    onBlur={() => setEndDateFocused(false)}
                  />
                  <Calendar size={20} color="#FF385C" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                Location
              </Text>
              <View 
                style={[
                  styles.modernLocationInput,
                  { 
                    backgroundColor: inputBgColor,
                    borderColor: locationFocused ? '#FF385C' : (location ? '#FF385C' : borderColor),
                    borderWidth: locationFocused ? 2 : 1.5,
                    transform: [{ scale: locationFocused ? 1.02 : 1 }],
                  }
                ]}
              >
                <MapPin size={20} color="#FF385C" style={styles.locationIconLeft} />
                <TextInput
                  style={[styles.locationInputText, { color: textColor }]}
                  placeholder="Search destinations"
                  placeholderTextColor={placeholderColor}
                  value={location}
                  onChangeText={setLocation}
                  onFocus={() => setLocationFocused(true)}
                  onBlur={() => setLocationFocused(false)}
                />
              </View>
            </View>
          </Animated.View>
          
          {/* Participants Card */}
          <Animated.View style={[
            styles.formCard,
            styles.participantsCard,
            { 
              backgroundColor: cardBgColor,
              marginTop: 24,
              ...Platform.select({
                ios: {
                  shadowColor: shadowColor,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 20,
                },
                android: {
                  elevation: 6,
                },
              }),
            }
          ]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Who's coming?
              </Text>
              <View style={styles.participantCount}>
                <Users size={16} color="#FF385C" />
                <Text style={[styles.participantCountText, { color: '#FF385C' }]}>
                  {participants.length}
                </Text>
              </View>
            </View>
            
            {participants.map((participant, index) => (
              <Animated.View 
                key={participant.id}
                style={[
                  styles.modernParticipantItem,
                  { 
                    borderBottomColor: borderColor,
                    transform: [{ scale: participantAnim }],
                  }
                ]}
              >
                <View style={styles.participantAvatar}>
                  <Text style={styles.participantInitial}>
                    {participant.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.participantDetails}>
                  <Text style={[styles.participantName, { color: textColor }]}>
                    {participant.name}
                  </Text>
                  <Text style={[styles.participantEmail, { color: secondaryTextColor }]}>
                    {participant.email}
                  </Text>
                </View>
                
                {participant.id !== '1' && (
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeParticipant(participant.id)}
                    activeOpacity={0.7}
                  >
                    <X size={18} color="#FF385C" />
                  </TouchableOpacity>
                )}
              </Animated.View>
            ))}
            
            {showAddParticipant ? (
              <Animated.View style={styles.addParticipantCard}>
                <View style={styles.addParticipantInputs}>
                  <TextInput
                    style={[
                      styles.modernInput,
                      { 
                        backgroundColor: inputBgColor,
                        color: textColor,
                        marginBottom: 12,
                        borderColor: borderColor,
                      }
                    ]}
                    placeholder="Full name"
                    placeholderTextColor={placeholderColor}
                    value={newParticipantName}
                    onChangeText={setNewParticipantName}
                  />
                  
                  <TextInput
                    style={[
                      styles.modernInput,
                      { 
                        backgroundColor: inputBgColor,
                        color: textColor,
                        borderColor: borderColor,
                      }
                    ]}
                    placeholder="Email address"
                    placeholderTextColor={placeholderColor}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={newParticipantEmail}
                    onChangeText={setNewParticipantEmail}
                  />
                </View>
                
                <View style={styles.addParticipantActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => setShowAddParticipant(false)}
                    activeOpacity={0.8}
                  >
                    <X size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={addParticipant}
                    activeOpacity={0.8}
                  >
                    <Check size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ) : (
              <TouchableOpacity 
                style={[
                  styles.addParticipantButton,
                  { borderColor: '#FF385C' }
                ]}
                onPress={() => setShowAddParticipant(true)}
                activeOpacity={0.8}
              >
                <Plus size={20} color="#FF385C" style={styles.addIcon} />
                <Text style={[styles.addParticipantText, { color: '#FF385C' }]}>
                  Invite someone
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
            </>
          )}
        </View>
      </Animated.ScrollView>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 0,
  },
  backButton: {
    zIndex: 1001,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 120 : 100,
  },
  coverImageContainer: {
    width: width,
    height: 280,
    marginBottom: 0,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  changeCoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  changeCoverText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  coverPlaceholderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  formCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 0,
  },
  tripDetailsCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  participantsCard: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  participantCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  participantCountText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  modernInput: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    borderWidth: 1.5,
    fontWeight: '500',
  },
  modernTextArea: {
    minHeight: 120,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    fontSize: 16,
    borderWidth: 1.5,
    fontWeight: '500',
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dateColumn: {
    flex: 1,
  },
  modernDateInput: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderWidth: 1.5,
  },
  dateInputText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  modernLocationInput: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderWidth: 1.5,
  },
  locationIconLeft: {
    marginRight: 12,
  },
  locationInputText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  modernParticipantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  participantAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  participantInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  participantDetails: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  participantEmail: {
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addParticipantCard: {
    marginTop: 16,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addParticipantInputs: {
    marginBottom: 16,
  },
  addParticipantActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#FF385C',
  },
  confirmButton: {
    backgroundColor: '#00A86B',
  },
  addParticipantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: 16,
  },
  addIcon: {
    marginRight: 8,
  },
  addParticipantText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  desktopFormLayout: {
    flexDirection: 'row',
    gap: 40,
  },
  
  // Web-specific styles
  webHeader: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  webHeaderContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  webBackButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  webHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  webCreateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 140,
  },
  webContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  webCoverImageContainer: {
    height: 400,
    borderRadius: 16,
    marginBottom: 40,
  },
  webCoverImagePressable: {
    borderRadius: 16,
  },
  webCoverImage: {
    borderRadius: 16,
  },
  webCoverOverlay: {
    borderRadius: 16,
  },
  webChangeCoverButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  webCoverPlaceholder: {
    borderRadius: 16,
  },
  webFormContainer: {
    paddingTop: 40,
    paddingBottom: 80,
  },
  webInput: {
    fontSize: 16,
    paddingHorizontal: 20,
    height: 56,
  },
  webTextArea: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 140,
  },
  webDateRow: {
    gap: 20,
  },
  webDateInput: {
    height: 56,
    paddingHorizontal: 20,
  },
  webLocationInput: {
    height: 56,
    paddingHorizontal: 20,
  },
  webAddParticipantCard: {
    padding: 20,
  },
  webAddParticipantButton: {
    paddingVertical: 16,
  },
  desktopLeftColumn: {
    marginRight: 20,
  },
  desktopRightColumn: {
    marginLeft: 20,
    position: 'sticky' as any,
    top: 120,
    height: 'fit-content' as any,
  },
  
  // Legacy styles (keeping for compatibility)
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
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
    height: 52,
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
  formSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  lastSection: {
    paddingBottom: 120,
  },
  inputContainer: {
    marginBottom: 20,
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
  removeParticipantButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addParticipantForm: {
    marginTop: 16,
  },
  participantInput: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addParticipantIcon: {
    marginRight: 8,
  },
  participantActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});