import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getCurrentUser, 
  signIn, 
  signUp, 
  signOut, 
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  type AuthUser,
  type SignInInput,
  type SignUpInput
} from 'aws-amplify/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInUser: (input: SignInInput) => Promise<void>;
  signUpUser: (input: SignUpInput) => Promise<any>;
  signOutUser: () => Promise<void>;
  confirmSignUpUser: (username: string, confirmationCode: string) => Promise<any>;
  resetPasswordUser: (username: string) => Promise<any>;
  confirmResetPasswordUser: (username: string, confirmationCode: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('Checking auth state...');
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);
      setUser(currentUser);
    } catch (error) {
      console.log('No authenticated user:', error);
      setUser(null);
    } finally {
      console.log('Auth loading finished, setting isLoading to false');
      setIsLoading(false);
    }
  };

  const signInUser = async (input: SignInInput) => {
    try {
      const { isSignedIn } = await signIn(input);
      if (isSignedIn) {
        await checkAuthState();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUpUser = async (input: SignUpInput) => {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp(input);
      return { isSignUpComplete, userId, nextStep };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const confirmSignUpUser = async (username: string, confirmationCode: string) => {
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username,
        confirmationCode,
      });
      return { isSignUpComplete };
    } catch (error) {
      console.error('Confirm sign up error:', error);
      throw error;
    }
  };

  const resetPasswordUser = async (username: string) => {
    try {
      const { nextStep } = await resetPassword({ username });
      return { nextStep };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const confirmResetPasswordUser = async (username: string, confirmationCode: string, newPassword: string) => {
    try {
      await confirmResetPassword({
        username,
        confirmationCode,
        newPassword,
      });
    } catch (error) {
      console.error('Confirm reset password error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInUser,
    signUpUser,
    signOutUser,
    confirmSignUpUser,
    resetPasswordUser,
    confirmResetPasswordUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 