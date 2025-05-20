import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, CreditCard, Calendar, User } from 'lucide-react-native';

type EmptyStateProps = {
  title: string;
  message: string;
  buttonText: string;
  onButtonPress: () => void;
  icon: 'map' | 'credit-card' | 'calendar' | 'user';
  isDark: boolean;
};

export default function EmptyState({
  title,
  message,
  buttonText,
  onButtonPress,
  icon,
  isDark
}: EmptyStateProps) {
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#8E8E93' : '#636366';
  
  const getIcon = () => {
    const iconSize = 64;
    const iconColor = '#007AFF';
    
    switch (icon) {
      case 'map':
        return <MapPin size={iconSize} color={iconColor} />;
      case 'credit-card':
        return <CreditCard size={iconSize} color={iconColor} />;
      case 'calendar':
        return <Calendar size={iconSize} color={iconColor} />;
      case 'user':
        return <User size={iconSize} color={iconColor} />;
      default:
        return <MapPin size={iconSize} color={iconColor} />;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <Text style={[styles.title, { color: textColor }]}>
        {title}
      </Text>
      
      <Text style={[styles.message, { color: secondaryTextColor }]}>
        {message}
      </Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#007AFF' }]}
        onPress={onButtonPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.9,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});