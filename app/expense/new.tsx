import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ChevronLeft, Camera, User } from 'lucide-react-native';
import { Trip } from '@/types/trip';
import { mockTrips } from '@/data/mockData';

export default function NewExpenseScreen() {
  const { tripId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [splitEqually, setSplitEqually] = useState(true);
  const [trip, setTrip] = useState<Trip | null>(null);
  
  const bgColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#8E8E93' : '#636366';
  const inputBgColor = isDark ? '#2C2C2E' : '#F2F2F7';
  const placeholderColor = isDark ? '#636366' : '#8E8E93';
  const borderColor = isDark ? '#38383A' : '#E5E5EA';
  
  // Find the trip if a tripId is provided
  useState(() => {
    if (tripId) {
      const foundTrip = mockTrips.find(t => t.id === tripId);
      if (foundTrip) {
        setTrip(foundTrip);
      }
    }
  });
  
  const goBack = () => {
    router.back();
  };
  
  const handleSaveExpense = () => {
    if (!title) {
      alert('Please enter an expense title');
      return;
    }
    
    if (!amount) {
      alert('Please enter an amount');
      return;
    }
    
    if (!date) {
      alert('Please enter a date');
      return;
    }
    
    // In a real app, we would save the expense to the backend
    if (tripId) {
      router.push(`/trip/${tripId}`);
    } else {
      router.push('/expenses');
    }
  };
  
  const toggleSplitEqually = () => {
    setSplitEqually(!splitEqually);
  };
  
  const categories = [
    { id: 'food', name: 'Food', color: '#FF9500' },
    { id: 'transport', name: 'Transport', color: '#007AFF' },
    { id: 'accommodation', name: 'Accommodation', color: '#5856D6' },
    { id: 'activities', name: 'Activities', color: '#FF2D55' },
    { id: 'shopping', name: 'Shopping', color: '#34C759' },
    { id: 'other', name: 'Other', color: '#8E8E93' },
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color={textColor} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: textColor }]}>
          New Expense
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            { 
              backgroundColor: title && amount && date ? '#007AFF' : inputBgColor,
              opacity: title && amount && date ? 1 : 0.5
            }
          ]} 
          onPress={handleSaveExpense}
          disabled={!title || !amount || !date}
        >
          <Text 
            style={[
              styles.saveButtonText, 
              { 
                color: title && amount && date 
                  ? '#FFFFFF' 
                  : secondaryTextColor 
              }
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Trip Selection - Only show if not coming from a trip screen */}
        {!tripId && (
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Select Trip
            </Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tripSelector}
            >
              {mockTrips.map((t) => (
                <TouchableOpacity 
                  key={t.id}
                  style={[
                    styles.tripItem,
                    { 
                      backgroundColor: trip?.id === t.id ? '#007AFF' : inputBgColor,
                      borderColor: borderColor
                    }
                  ]}
                  onPress={() => setTrip(t)}
                >
                  <Text 
                    style={[
                      styles.tripItemText,
                      { color: trip?.id === t.id ? '#FFFFFF' : textColor }
                    ]}
                  >
                    {t.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Basic Expense Details */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
              Title *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: inputBgColor,
                  color: textColor,
                }
              ]}
              placeholder="e.g. Dinner at Restaurant"
              placeholderTextColor={placeholderColor}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
              Amount *
            </Text>
            <View style={[styles.amountInputWrapper, { backgroundColor: inputBgColor }]}>
              <Text style={[styles.currencySymbol, { color: textColor }]}>$</Text>
              <TextInput
                style={[
                  styles.amountInput,
                  { color: textColor }
                ]}
                placeholder="0.00"
                placeholderTextColor={placeholderColor}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
              Category
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categorySelector}
            >
              {categories.map((cat) => (
                <TouchableOpacity 
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    { 
                      backgroundColor: category === cat.id ? cat.color : inputBgColor,
                      borderColor: cat.color
                    }
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text 
                    style={[
                      styles.categoryItemText,
                      { color: category === cat.id ? '#FFFFFF' : cat.color }
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
              Date *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: inputBgColor,
                  color: textColor,
                }
              ]}
              placeholder="MM/DD/YYYY"
              placeholderTextColor={placeholderColor}
              value={date}
              onChangeText={setDate}
            />
          </View>
        </View>
        
        {/* Participants and Splitting */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Paid By
          </Text>
          
          <TouchableOpacity 
            style={[styles.paidBySelector, { backgroundColor: inputBgColor }]}
          >
            <Text style={[styles.paidByText, { color: textColor }]}>
              You
            </Text>
          </TouchableOpacity>
          
          <View style={styles.splitContainer}>
            <Text style={[styles.splitLabel, { color: textColor }]}>
              Split Equally
            </Text>
            <Switch
              value={splitEqually}
              onValueChange={toggleSplitEqually}
              trackColor={{ false: '#767577', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          {trip && (
            <View style={styles.participantsContainer}>
              {trip.participants.map((participant) => (
                <View 
                  key={participant.id}
                  style={[
                    styles.participantItem,
                    { borderBottomColor: borderColor }
                  ]}
                >
                  <View style={styles.participantInfo}>
                    <User size={24} color="#007AFF" style={styles.participantIcon} />
                    <Text style={[styles.participantName, { color: textColor }]}>
                      {participant.id === '1' ? 'You' : participant.name}
                    </Text>
                  </View>
                  
                  {!splitEqually && (
                    <View style={[styles.customAmountInput, { backgroundColor: inputBgColor }]}>
                      <Text style={[styles.currencySymbol, { color: textColor }]}>$</Text>
                      <TextInput
                        style={[
                          styles.amountInput,
                          { color: textColor, width: 80 }
                        ]}
                        placeholder="0.00"
                        placeholderTextColor={placeholderColor}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Notes and Photo */}
        <View style={[styles.formSection, styles.lastSection]}>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
              Notes
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: inputBgColor,
                  color: textColor,
                }
              ]}
              placeholder="Add notes about this expense (optional)"
              placeholderTextColor={placeholderColor}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.uploadReceiptButton,
              { borderColor: isDark ? '#38383A' : '#E5E5EA' }
            ]}
          >
            <Camera size={24} color="#007AFF" style={styles.receiptIcon} />
            <Text style={[styles.uploadReceiptText, { color: '#007AFF' }]}>
              Upload Receipt
            </Text>
          </TouchableOpacity>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  formSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  lastSection: {
    borderBottomWidth: 0,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  tripSelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tripItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  tripItemText: {
    fontSize: 14,
    fontWeight: '500',
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
  amountInputWrapper: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
    fontWeight: '600',
  },
  categorySelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paidBySelector: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 20,
  },
  paidByText: {
    fontSize: 16,
  },
  splitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  splitLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  participantsContainer: {
    marginTop: 4,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantIcon: {
    marginRight: 12,
  },
  participantName: {
    fontSize: 16,
  },
  customAmountInput: {
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  textArea: {
    minHeight: 100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
  },
  uploadReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: 8,
  },
  receiptIcon: {
    marginRight: 8,
  },
  uploadReceiptText: {
    fontSize: 16,
    fontWeight: '500',
  },
});