
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_KEY = 'app_notifications';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'hearing_reminder' | 'case_assignment' | 'document_upload' | 'system';
  data?: any;
  read: boolean;
  createdAt: Date;
}

class NotificationService {
  async scheduleHearingReminder(hearingId: string, hearingDate: Date, caseNumber: string) {
    try {
      // Schedule notification 1 day before hearing
      const reminderDate = new Date(hearingDate);
      reminderDate.setDate(reminderDate.getDate() - 1);
      reminderDate.setHours(9, 0, 0, 0); // 9 AM

      if (reminderDate > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Hearing Reminder',
            body: `You have a hearing tomorrow for case ${caseNumber}`,
            data: { hearingId, type: 'hearing_reminder' },
          },
          trigger: {
            date: reminderDate,
          },
        });
      }

      // Schedule notification 1 hour before hearing
      const hourBeforeDate = new Date(hearingDate);
      hourBeforeDate.setHours(hourBeforeDate.getHours() - 1);

      if (hourBeforeDate > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Hearing Starting Soon',
            body: `Your hearing for case ${caseNumber} starts in 1 hour`,
            data: { hearingId, type: 'hearing_reminder' },
          },
          trigger: {
            date: hourBeforeDate,
          },
        });
      }
    } catch (error) {
      console.log('Error scheduling hearing reminder:', error);
    }
  }

  async sendDailyDigest() {
    try {
      // This would typically fetch today's and tomorrow's hearings
      // For now, we'll just send a sample notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Digest',
          body: 'Check your hearings for today and tomorrow',
          data: { type: 'daily_digest' },
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.log('Error sending daily digest:', error);
    }
  }

  async addNotification(notification: Omit<AppNotification, 'id' | 'createdAt'>) {
    try {
      const newNotification: AppNotification = {
        ...notification,
        id: 'notif_' + Date.now(),
        createdAt: new Date(),
      };

      const existingNotifications = await this.getNotifications();
      const updatedNotifications = [newNotification, ...existingNotifications];
      
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
      
      return newNotification;
    } catch (error) {
      console.log('Error adding notification:', error);
      return null;
    }
  }

  async getNotifications(): Promise<AppNotification[]> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.log('Error getting notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string) {
    try {
      const notifications = await this.getNotifications();
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log('Error marking notification as read:', error);
    }
  }

  async clearAllNotifications() {
    try {
      await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
    } catch (error) {
      console.log('Error clearing notifications:', error);
    }
  }
}

export const notificationService = new NotificationService();
