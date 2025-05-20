import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { Expense } from '@/types/expense';
import { mockExpenses } from '@/data/mockData';
import EmptyState from '@/components/EmptyState';

export default function ExpensesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const fadeAnim = new Animated.Value(0);
  
  const bgColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#8E8E93' : '#636366';
  const cardBgColor = isDark ? '#2C2C2E' : '#F2F2F7';
  const borderColor = isDark ? '#38383A' : '#E5E5EA';

  useEffect(() => {
    // Simulate API call to fetch expenses
    setTimeout(() => {
      setExpenses(mockExpenses);
      setLoading(false);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, []);

  const addExpense = () => {
    router.push('/expense/new');
  };

  const viewExpenseDetails = (expenseId: string) => {
    router.push(`/expense/${expenseId}`);
  };

  const filterExpenses = (filter: string) => {
    setSelectedFilter(filter);
    // In a real app, we would filter the expenses based on the selected filter
  };

  const getCategoryColor = (category: string) => {
    const categoryColors = {
      'food': '#FF9500',
      'transport': '#007AFF',
      'accommodation': '#5856D6',
      'activities': '#FF2D55',
      'shopping': '#FF3B30',
      'other': '#8E8E93',
    };
    return categoryColors[category.toLowerCase()] || '#8E8E93';
  };

  const renderExpenseItem = ({ item }) => {
    const isPayer = item.paidBy === 'me';
    
    return (
      <TouchableOpacity 
        style={[styles.expenseCard, { backgroundColor: cardBgColor }]}
        onPress={() => viewExpenseDetails(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.expenseHeader}>
          <View style={styles.categoryIndicator}>
            <View 
              style={[
                styles.categoryDot, 
                { backgroundColor: getCategoryColor(item.category) }
              ]} 
            />
            <Text style={[styles.categoryText, { color: secondaryTextColor }]}>
              {item.category}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: secondaryTextColor }]}>
            {item.date}
          </Text>
        </View>
        
        <Text style={[styles.expenseTitle, { color: textColor }]}>
          {item.title}
        </Text>
        
        <View style={styles.expenseFooter}>
          <View style={styles.expensePayer}>
            {isPayer ? (
              <ArrowUpRight size={16} color="#FF3B30" style={styles.payerIcon} />
            ) : (
              <ArrowDownLeft size={16} color="#34C759" style={styles.payerIcon} />
            )}
            <Text 
              style={[
                styles.payerText, 
                { 
                  color: isPayer ? '#FF3B30' : '#34C759'
                }
              ]}
            >
              {isPayer ? 'You paid' : `${item.paidBy} paid`}
            </Text>
          </View>
          
          <Text style={[styles.amountText, { color: textColor }]}>
            ${item.amount.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.filterContainer, { borderColor }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {['All', 'Food', 'Transport', 'Accommodation', 'Activities', 'Shopping', 'Other'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                { 
                  backgroundColor: selectedFilter.toLowerCase() === filter.toLowerCase() 
                    ? '#007AFF' 
                    : isDark ? '#2C2C2E' : '#F2F2F7' 
                }
              ]}
              onPress={() => filterExpenses(filter.toLowerCase())}
            >
              <Text 
                style={[
                  styles.filterText,
                  { 
                    color: selectedFilter.toLowerCase() === filter.toLowerCase()
                      ? '#FFFFFF'
                      : isDark ? '#FFFFFF' : '#000000' 
                  }
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {expenses.length === 0 && !loading ? (
        <EmptyState
          title="No expenses yet"
          message="Add your first expense to start tracking your spending."
          buttonText="Add Expense"
          onButtonPress={addExpense}
          icon="credit-card"
          isDark={isDark}
        />
      ) : (
        <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
          <FlatList
            data={expenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}
      
      <TouchableOpacity 
        style={[styles.fabButton, { backgroundColor: '#007AFF' }]} 
        onPress={addExpense}
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
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  expenseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 14,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expensePayer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payerIcon: {
    marginRight: 4,
  },
  payerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  amountText: {
    fontSize: 18,
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