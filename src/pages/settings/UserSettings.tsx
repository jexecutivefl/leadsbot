import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import styles from './UserSettings.module.css';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatar?: string;
  timezone: string;
  language: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newLeadAlerts: boolean;
  leadStatusUpdates: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Mock user data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corporation',
    role: 'Sales Manager',
    timezone: 'America/New_York',
    language: 'en'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    newLeadAlerts: true,
    leadStatusUpdates: true,
    systemUpdates: true,
    marketingEmails: false,
    weeklyReports: true,
    monthlyReports: true
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordChangeData>>({});

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    setUnsavedChanges(true);
  };

  const updateNotifications = (updates: Partial<NotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...updates }));
    setUnsavedChanges(true);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile saved:', userProfile);
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Notifications saved:', notifications);
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (): boolean => {
    const errors: Partial<PasswordChangeData> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ja', label: 'Japanese' }
  ];

  return (
    <div className={styles.userSettings}>
      <div className={styles.header}>
        <div>
          <h1>User Settings</h1>
          <p>Manage your account preferences and settings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'notifications' ? styles.active : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'security' ? styles.active : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className={styles.tabContent}>
          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3>Personal Information</h3>
              <p>Update your personal details and preferences</p>
            </div>

            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt="Profile" />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {userProfile.firstName[0]}{userProfile.lastName[0]}
                  </div>
                )}
              </div>
              <div className={styles.avatarActions}>
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>First Name</label>
                <Input
                  value={userProfile.firstName}
                  onChange={(e) => updateProfile({ firstName: e.target.value })}
                  placeholder="Enter your first name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Last Name</label>
                <Input
                  value={userProfile.lastName}
                  onChange={(e) => updateProfile({ lastName: e.target.value })}
                  placeholder="Enter your last name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email Address</label>
                <Input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <Input
                  type="tel"
                  value={userProfile.phone}
                  onChange={(e) => updateProfile({ phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Company</label>
                <Input
                  value={userProfile.company}
                  onChange={(e) => updateProfile({ company: e.target.value })}
                  placeholder="Enter your company name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <Input
                  value={userProfile.role}
                  onChange={(e) => updateProfile({ role: e.target.value })}
                  placeholder="Enter your role"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Timezone</label>
                <select
                  value={userProfile.timezone}
                  onChange={(e) => updateProfile({ timezone: e.target.value })}
                  className={styles.select}
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Language</label>
                <select
                  value={userProfile.language}
                  onChange={(e) => updateProfile({ language: e.target.value })}
                  className={styles.select}
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <Button
                variant="primary"
                onClick={handleSaveProfile}
                disabled={!unsavedChanges || isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className={styles.tabContent}>
          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3>Notification Preferences</h3>
              <p>Choose how you want to be notified about important events</p>
            </div>

            <div className={styles.notificationGroups}>
              <div className={styles.notificationGroup}>
                <h4>General Notifications</h4>
                <div className={styles.checkboxList}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => updateNotifications({ emailNotifications: e.target.checked })}
                    />
                    <span>Email notifications</span>
                    <small>Receive notifications via email</small>
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={(e) => updateNotifications({ pushNotifications: e.target.checked })}
                    />
                    <span>Push notifications</span>
                    <small>Receive browser push notifications</small>
                  </label>
                </div>
              </div>

              <div className={styles.notificationGroup}>
                <h4>Lead Notifications</h4>
                <div className={styles.checkboxList}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.newLeadAlerts}
                      onChange={(e) => updateNotifications({ newLeadAlerts: e.target.checked })}
                    />
                    <span>New lead alerts</span>
                    <small>Get notified when new leads are added</small>
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.leadStatusUpdates}
                      onChange={(e) => updateNotifications({ leadStatusUpdates: e.target.checked })}
                    />
                    <span>Lead status updates</span>
                    <small>Get notified when lead status changes</small>
                  </label>
                </div>
              </div>

              <div className={styles.notificationGroup}>
                <h4>System & Reports</h4>
                <div className={styles.checkboxList}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.systemUpdates}
                      onChange={(e) => updateNotifications({ systemUpdates: e.target.checked })}
                    />
                    <span>System updates</span>
                    <small>Important system notifications and updates</small>
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReports}
                      onChange={(e) => updateNotifications({ weeklyReports: e.target.checked })}
                    />
                    <span>Weekly reports</span>
                    <small>Receive weekly performance summaries</small>
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.monthlyReports}
                      onChange={(e) => updateNotifications({ monthlyReports: e.target.checked })}
                    />
                    <span>Monthly reports</span>
                    <small>Receive monthly analytics reports</small>
                  </label>
                </div>
              </div>

              <div className={styles.notificationGroup}>
                <h4>Marketing</h4>
                <div className={styles.checkboxList}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.marketingEmails}
                      onChange={(e) => updateNotifications({ marketingEmails: e.target.checked })}
                    />
                    <span>Marketing emails</span>
                    <small>Product updates, tips, and promotional content</small>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <Button
                variant="primary"
                onClick={handleSaveNotifications}
                disabled={!unsavedChanges || isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className={styles.tabContent}>
          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3>Change Password</h3>
              <p>Update your password to keep your account secure</p>
            </div>

            <div className={styles.passwordForm}>
              <div className={styles.formGroup}>
                <label>Current Password</label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter your current password"
                  error={passwordErrors.currentPassword}
                />
              </div>

              <div className={styles.formGroup}>
                <label>New Password</label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter your new password"
                  error={passwordErrors.newPassword}
                />
                <small>Password must be at least 8 characters long</small>
              </div>

              <div className={styles.formGroup}>
                <label>Confirm New Password</label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your new password"
                  error={passwordErrors.confirmPassword}
                />
              </div>
            </div>

            <div className={styles.cardFooter}>
              <Button
                variant="primary"
                onClick={handleChangePassword}
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || isLoading}
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </Card>

          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3>Account Security</h3>
              <p>Additional security options for your account</p>
            </div>

            <div className={styles.securityOptions}>
              <div className={styles.securityOption}>
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">
                  Enable 2FA
                </Button>
              </div>

              <div className={styles.securityOption}>
                <div>
                  <h4>Active Sessions</h4>
                  <p>Manage devices and sessions that are currently logged in</p>
                </div>
                <Button variant="outline">
                  View Sessions
                </Button>
              </div>

              <div className={styles.securityOption}>
                <div>
                  <h4>Login Alerts</h4>
                  <p>Get notified of new login attempts</p>
                </div>
                <Button variant="outline">
                  Configure
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {unsavedChanges && (
        <div className={styles.unsavedNotice}>
          You have unsaved changes. Don't forget to save your settings.
        </div>
      )}
    </div>
  );
};

export default UserSettings;