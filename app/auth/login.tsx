import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#8E8E93' : '#636366';
  const inputBgColor = isDark ? '#2C2C2E' : '#F2F2F7';
  const placeholderColor = isDark ? '#636366' : '#8E8E93';

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    
    // Simulate Google authentication process
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const goToSignUp = () => {
    router.push('/auth/signup');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={isDark ? ['#007AFF', '#5856D6'] : ['#007AFF', '#5856D6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/7412095/pexels-photo-7412095.jpeg?auto=compress&cs=tinysrgb&w=300' }}
              style={styles.logo}
            />
          </View>
        </LinearGradient>
        
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: textColor }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
            Log in to your account to continue
          </Text>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: inputBgColor,
                    color: textColor,
                  }
                ]}
                placeholder="your.email@example.com"
                placeholderTextColor={placeholderColor}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>
                Password
              </Text>
              <View style={[
                styles.passwordInputWrapper,
                { backgroundColor: inputBgColor }
              ]}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    { color: textColor }
                  ]}
                  placeholder="Your password"
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIconButton}
                  onPress={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={secondaryTextColor} />
                  ) : (
                    <Eye size={20} color={secondaryTextColor} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity style={styles.forgotPasswordLink}>
              <Text style={[styles.forgotPasswordText, { color: '#007AFF' }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: '#007AFF' },
                loading && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging in...' : 'Log In'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.orContainer}>
              <View style={[styles.orLine, { backgroundColor: isDark ? '#38383A' : '#E5E5EA' }]} />
              <Text style={[styles.orText, { color: secondaryTextColor }]}>OR</Text>
              <View style={[styles.orLine, { backgroundColor: isDark ? '#38383A' : '#E5E5EA' }]} />
            </View>
            
            <TouchableOpacity
              style={[
                styles.googleButton,
                { backgroundColor: inputBgColor }
              ]}
              onPress={handleGoogleLogin}
            >
              <Image
                source={{ uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' }}
                style={styles.googleIcon}
              />
              <Text style={[styles.googleButtonText, { color: textColor }]}>
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: secondaryTextColor }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={goToSignUp}>
              <Text style={[styles.signupLink, { color: '#007AFF' }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
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
  passwordInputWrapper: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeIconButton: {
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    marginRight: 4,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});