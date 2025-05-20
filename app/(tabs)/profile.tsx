import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { LogOut, ChevronRight, User, Bell, Cloud, Shield, CreditCard, CircleHelp as HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { mockUserProfile } from '@/data/mockData';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [user, setUser] = useState(null);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const bgColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#8E8E93' : '#636366';
  const sectionBgColor = isDark ? '#2C2C2E' : '#F2F2F7';
  const dividerColor = isDark ? '#38383A' : '#E5E5EA';

  useEffect(() => {
    // Simulate API call to fetch user profile
    setTimeout(() => {
      setUser(mockUserProfile);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    // Implement logout logic
    router.replace('/auth/login');
  };

  const navigateToScreen = (screen: string) => {
    router.push(screen);
  };

  const toggleSync = () => {
    setSyncEnabled(!syncEnabled);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const renderSettingsOption = (icon, title, onPress, rightElement = null, showDivider = true) => {
    return (
      <>
        <TouchableOpacity
          style={styles.settingsOption}
          onPress={onPress}
          disabled={!onPress}
        >
          <View style={styles.settingsOptionLeft}>
            {icon}
            <Text style={[styles.settingsOptionText, { color: textColor }]}>
              {title}
            </Text>
          </View>
          
          {rightElement || (
            onPress && <ChevronRight size={20} color={secondaryTextColor} />
          )}
        </TouchableOpacity>
        
        {showDivider && (
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        )}
      </>
    );
  };

  if (loading || !user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <Text style={{ color: textColor }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={isDark ? ['#1C1C1E', '#0C0C0E'] : ['#F2F2F7', '#FFFFFF']}
          style={styles.profileHeaderContainer}
        >
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.profileAvatar}
            />
            
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: textColor }]}>
                {user.name}
              </Text>
              <Text style={[styles.profileEmail, { color: secondaryTextColor }]}>
                {user.email}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.editProfileButton, { backgroundColor: '#007AFF' }]}
            onPress={() => navigateToScreen('/profile/edit')}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>
        
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: sectionBgColor }]}>
            <Text style={[styles.statNumber, { color: textColor }]}>
              {user.stats.trips}
            </Text>
            <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
              Trips
            </Text>
          </View>
          
          <View style={[styles.statBox, { backgroundColor: sectionBgColor }]}>
            <Text style={[styles.statNumber, { color: textColor }]}>
              {user.stats.expenses}
            </Text>
            <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
              Expenses
            </Text>
          </View>
          
          <View style={[styles.statBox, { backgroundColor: sectionBgColor }]}>
            <Text style={[styles.statNumber, { color: textColor }]}>
              ${user.stats.totalSpent}
            </Text>
            <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
              Spent
            </Text>
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Settings
          </Text>
          
          <View style={[styles.settingsBox, { backgroundColor: sectionBgColor }]}>
            {renderSettingsOption(
              <User size={22} color="#007AFF" style={styles.settingsIcon} />,
              'Account Settings',
              () => navigateToScreen('/profile/account'),
            )}
            
            {renderSettingsOption(
              <Bell size={22} color="#FF9500" style={styles.settingsIcon} />,
              'Notifications',
              null,
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor="#FFFFFF"
              />
            )}
            
            {renderSettingsOption(
              <Cloud size={22} color="#5856D6" style={styles.settingsIcon} />,
              'Sync to Google Drive',
              null,
              <Switch
                value={syncEnabled}
                onValueChange={toggleSync}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor="#FFFFFF"
              />
            )}
            
            {renderSettingsOption(
              <CreditCard size={22} color="#FF2D55" style={styles.settingsIcon} />,
              'Payment Methods',
              () => navigateToScreen('/profile/payment-methods'),
            )}
            
            {renderSettingsOption(
              <Shield size={22} color="#34C759" style={styles.settingsIcon} />,
              'Privacy & Security',
              () => navigateToScreen('/profile/privacy'),
              null,
              false
            )}
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Support
          </Text>
          
          <View style={[styles.settingsBox, { backgroundColor: sectionBgColor }]}>
            {renderSettingsOption(
              <HelpCircle size={22} color="#007AFF" style={styles.settingsIcon} />,
              'Help & Support',
              () => navigateToScreen('/profile/support'),
              null,
              false
            )}
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FF3B30" style={styles.logoutIcon} />
          <Text style={[styles.logoutText, { color: '#FF3B30' }]}>
            Logout
          </Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: secondaryTextColor }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
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
  profileHeaderContainer: {
    padding: 24,
    paddingBottom: 32,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
  },
  editProfileButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editProfileButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  settingsSection: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  settingsBox: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    marginRight: 12,
  },
  settingsOptionText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginLeft: 50,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 14,
  },
});