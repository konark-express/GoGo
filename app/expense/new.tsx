import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ChevronLeft, Camera, User, Plus, Check, X, Calculator } from 'lucide-react-native';
import { Trip } from '@/types/trip';
import { mockTrips } from '@/data/mockData';

type SplitMethod = 'equal' | 'percentage' | 'custom' | 'shares';
type ParticipantShare = {
  id: string;
  amount: string;
  percentage: string;
  shares: string;
};

export default function NewExpenseScreen() {
  const { tripId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [paidBy, setPaidBy] = useState<string>('1'); // Default to current user
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal');
  const [trip, setTrip] = useState<Trip | null>(null);
  const [participantShares, setParticipantShares] = useState<Record<string, ParticipantShare>>({});
  const [showCalculator, setShowCalculator] = useState(false);
  
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
        // Initialize participant shares
        const shares: Record<string, ParticipantShare> = {};
        foundTrip.participants.forEach(p => {
          shares[p.id] = {
            id: p.id,
            amount: '0',
            percentage: '0',
            shares: '1'
          };
        });
        setParticipantShares(shares);
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
    
    // Validate split amounts based on method
    const totalAmount = parseFloat(amount);
    if (splitMethod === 'percentage') {
      const totalPercentage = Object.values(participantShares)
        .reduce((sum, share) => sum + parseFloat(share.percentage || '0'), 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        alert('Total percentage must equal 100%');
        return;
      }
    } else if (splitMethod === 'custom') {
      const totalSplit = Object.values(participantShares)
        .reduce((sum, share) => sum + parseFloat(share.amount || '0'), 0);
      if (Math.abs(totalSplit - totalAmount) > 0.01) {
        alert('Split amounts must equal total expense amount');
        return;
      }
    }
    
    // In a real app, we would save the expense to the backend
    if (tripId) {
      router.push(`/trip/${tripId}`);
    } else {
      router.push('/expenses');
    }
  };

  const updateParticipantShare = (participantId: string, field: keyof ParticipantShare, value: string) => {
    setParticipantShares(prev => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [field]: value
      }
    }));
  };

  const calculateSplitAmount = (participantId: string): string => {
    if (!amount) return '0';
    const totalAmount = parseFloat(amount);
    
    switch (splitMethod) {
      case 'equal':
        return (totalAmount / Object.keys(participantShares).length).toFixed(2);
      
      case 'percentage': {
        const percentage = parseFloat(participantShares[participantId]?.percentage || '0');
        return ((totalAmount * percentage) / 100).toFixed(2);
      }
      
      case 'shares': {
        const participantShares = Object.values(participantShares);
        const totalShares = participantShares.reduce((sum, share) => 
          sum + parseFloat(share.shares || '1'), 0);
        const shareValue = totalAmount / totalShares;
        const shares = parseFloat(participantShares[participantId]?.shares || '1');
        return (shareValue * shares).toFixed(2);
      }
      
      case 'custom':
        return participantShares[participantId]?.amount || '0';
      
      default:
        return '0';
    }
  };

  const categories = [
    { id: 'food', name: 'Food', color: '#FF9500' },
    { id: 'transport', name: 'Transport', color: '#007AFF' },
    { id: 'accommodation', name: 'Accommodation', color: '#5856D6' },
    { id: 'activities', name: 'Activities', color: '#FF2D55' },
    { id: 'shopping', name: 'Shopping', color: '#34C759' },
    { id: 'other', name: 'Other', color: '#8E8E93' },
  ];

  const splitMethods = [
    { id: 'equal', name: 'Split Equally' },
    { id: 'percentage', name: 'By Percentage' },
    { id: 'shares', name: 'By Shares' },
    { id: 'custom', name: 'Custom Amount' },
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
              <TouchableOpacity
                style={styles.calculatorButton}
                onPress={() => setShowCalculator(true)}
              >
                <Calculator size={20} color={secondaryTextColor} />
              </TouchableOpacity>
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
        {trip && (
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Split Details
            </Text>
            
            {/* Paid By Selector */}
            <View style={styles.paidByContainer}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                Paid By
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.paidBySelector}
              >
                {trip.participants.map((participant) => (
                  <TouchableOpacity 
                    key={participant.id}
                    style={[
                      styles.paidByItem,
                      { 
                        backgroundColor: paidBy === participant.id ? '#007AFF' : inputBgColor,
                        borderColor: borderColor
                      }
                    ]}
                    onPress={() => setPaidBy(participant.id)}
                  >
                    <User size={16} color={paidBy === participant.id ? '#FFFFFF' : textColor} />
                    <Text 
                      style={[
                        styles.paidByText,
                        { color: paidBy === participant.id ? '#FFFFFF' : textColor }
                      ]}
                    >
                      {participant.id === '1' ? 'You' : participant.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Split Method Selector */}
            <View style={styles.splitMethodContainer}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                Split Method
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.splitMethodSelector}
              >
                {splitMethods.map((method) => (
                  <TouchableOpacity 
                    key={method.id}
                    style={[
                      styles.splitMethodItem,
                      { 
                        backgroundColor: splitMethod === method.id ? '#007AFF' : inputBgColor,
                        borderColor: borderColor
                      }
                    ]}
                    onPress={() => setSplitMethod(method.id as SplitMethod)}
                  >
                    <Text 
                      style={[
                        styles.splitMethodText,
                        { color: splitMethod === method.id ? '#FFFFFF' : textColor }
                      ]}
                    >
                      {method.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Participant Shares */}
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
                    <View>
                      <Text style={[styles.participantName, { color: textColor }]}>
                        {participant.id === '1' ? 'You' : participant.name}
                      </Text>
                      <Text style={[styles.participantShare, { color: '#34C759' }]}>
                        ${calculateSplitAmount(participant.id)}
                      </Text>
                    </View>
                  </View>
                  
                  {splitMethod !== 'equal' && (
                    <View style={[styles.shareInputContainer, { backgroundColor: inputBgColor }]}>
                      {splitMethod === 'percentage' && (
                        <>
                          <TextInput
                            style={[styles.shareInput, { color: textColor }]}
                            keyboardType="decimal-pad"
                            value={participantShares[participant.id]?.percentage}
                            onChangeText={(value) => 
                              updateParticipantShare(participant.id, 'percentage', value)
                            }
                            placeholder="0"
                            placeholderTextColor={placeholderColor}
                          />
                          <Text style={[styles.shareUnit, { color: secondaryTextColor }]}>%</Text>
                        </>
                      )}
                      
                      {splitMethod === 'shares' && (
                        <>
                          <TextInput
                            style={[styles.shareInput, { color: textColor }]}
                            keyboardType="decimal-pad"
                            value={participantShares[participant.id]?.shares}
                            onChangeText={(value) => 
                              updateParticipantShare(participant.id, 'shares', value)
                            }
                            placeholder="1"
                            placeholderTextColor={placeholderColor}
                          />
                          <Text style={[styles.shareUnit, { color: secondaryTextColor }]}>
                            shares
                          </Text>
                        </>
                      )}
                      
                      {splitMethod === 'custom' && (
                        <>
                          <Text style={[styles.currencySymbol, { color: textColor }]}>$</Text>
                          <TextInput
                            style={[styles.shareInput, { color: textColor }]}
                            keyboardType="decimal-pad"
                            value={participantShares[participant.id]?.amount}
                            onChangeText={(value) => 
                              updateParticipantShare(participant.id, 'amount', value)
                            }
                            placeholder="0.00"
                            placeholderTextColor={placeholderColor}
                          />
                        </>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
        
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
      
      {/* Calculator Modal */}
      {showCalculator && (
        <View style={[styles.calculatorModal, { backgroundColor: bgColor }]}>
          <View style={styles.calculatorHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowCalculator(false)}
            >
              <X size={24} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.calculatorTitle, { color: textColor }]}>
              Calculator
            </Text>
            <TouchableOpacity 
              style={[styles.doneButton, { backgroundColor: '#007AFF' }]}
              onPress={() => setShowCalculator(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          {/* Calculator implementation would go here */}
          <View style={styles.calculatorContent}>
            <Text style={[styles.calculatorPlaceholder, { color: secondaryTextColor }]}>
              Calculator UI would be implemented here
            </Text>
          </View>
        </View>
      )}
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
    paddingBottom: 120, // Increased to prevent FAB overlap
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
    marginBottom: 20, // Increased for better spacing between elements
  },
  inputLabel: {
    fontSize: 15, // Slightly increased for better readability
    fontWeight: '500', // Added font weight for better visibility
    marginBottom: 8,
  },
  input: {
    height: 52, // Increased height for better touch targets
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  amountInputWrapper: {
    height: 52, // Increased height to match other inputs
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 6, // Increased spacing between currency symbol and amount
  },
  amountInput: {
    flex: 1,
    height: 52, // Increased to match wrapper
    fontSize: 18,
    fontWeight: '600',
  },
  calculatorButton: {
    padding: 8,
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
  // Participant selection styles
  paidByContainer: {
    marginBottom: 24, // Increased spacing
  },
  paidBySelector: {
    flexDirection: 'row',
    paddingBottom: 10, // Increased padding to prevent cut-off
    flexWrap: 'wrap', // Allow wrapping for many participants
    marginHorizontal: -4, // Negative margin to offset child margins
  },
  paidByItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12, // Increased padding for better touch targets
    borderRadius: 24, // Increased for more rounded appearance
    marginRight: 8, // Horizontal spacing between items
    marginBottom: 8, // Added vertical spacing between wrapped items
    marginHorizontal: 4, // Offset from parent negative margin
    borderWidth: 1,
  },
  paidByText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  splitMethodContainer: {
    marginBottom: 20,
  },
  splitMethodSelector: {
    flexDirection: 'row',
    paddingBottom: 8, // Add bottom padding to prevent cut-off
  },
  splitMethodItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10, // More space between items
    borderWidth: 1,
  },
  splitMethodText: {
    fontSize: 14,
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
    flex: 1,
  },
  participantIcon: {
    marginRight: 12,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  participantShare: {
    fontSize: 14,
    fontWeight: '500',
  },
  shareInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
  },
  shareInput: {
    fontSize: 16,
    textAlign: 'right',
    flex: 1,
    paddingVertical: 0,
  },
  shareUnit: {
    fontSize: 14,
    marginLeft: 4,
  },
  textArea: {
    minHeight: 120, // Increased height for better usability
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 14, // Increased for better spacing
    paddingBottom: 14, // Increased for better spacing
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
  calculatorModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  calculatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  closeButton: {
    padding: 8,
  },
  calculatorTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  calculatorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorPlaceholder: {
    fontSize: 16,
  },
});
