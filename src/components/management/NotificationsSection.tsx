import React from 'react';
import { Bell, Calendar, FileText, Car, AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'danger';
  link?: string;
  date: string;
}

interface NotificationsSectionProps {
  vehicleAlerts: {
    serviceAlerts: {
      count: number;
      vehicle: string;
    }[];
    licenseAlerts: {
      count: number;
      vehicle: string;
    }[];
  };
  sheqAlerts: {
    id: string;
    company_id: string;
    document_type: string;
    expiry_date: string;
  }[];
  deliveryCount: number;
  meetingCount: number;
  invoiceCount: number;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  vehicleAlerts,
  sheqAlerts,
  deliveryCount,
  meetingCount,
  invoiceCount
}) => {
  const getNotifications = (): Notification[] => {
    const notifications: Notification[] = [];

    // Vehicle service alerts
    vehicleAlerts.serviceAlerts.forEach(alert => {
      notifications.push({
        id: `service-${alert.vehicle}`,
        title: 'Vehicle Service Due',
        message: `${alert.vehicle} is due for service`,
        type: 'warning',
        link: '/vehicles/service',
        date: new Date().toISOString()
      });
    });

    // Vehicle license alerts
    vehicleAlerts.licenseAlerts.forEach(alert => {
      notifications.push({
        id: `license-${alert.vehicle}`,
        title: 'License Renewal',
        message: `${alert.vehicle} license needs renewal`,
        type: 'warning',
        link: '/vehicles',
        date: new Date().toISOString()
      });
    });

    // SHEQ alerts
    sheqAlerts.forEach(alert => {
      notifications.push({
        id: `sheq-${alert.id}`,
        title: 'SHEQ Document Expiring',
        message: `${alert.document_type} expires on ${new Date(alert.expiry_date).toLocaleDateString()}`,
        type: 'warning',
        link: `/sheq/company/${alert.company_id}`,
        date: alert.expiry_date
      });
    });

    // Deliveries today
    if (deliveryCount > 0) {
      notifications.push({
        id: 'deliveries-today',
        title: 'Today\'s Deliveries',
        message: `${deliveryCount} ${deliveryCount === 1 ? 'delivery' : 'deliveries'} scheduled for today`,
        type: 'info',
        link: '/deliveries',
        date: new Date().toISOString()
      });
    }

    // Upcoming meetings
    if (meetingCount > 0) {
      notifications.push({
        id: 'upcoming-meetings',
        title: 'Upcoming Meetings',
        message: `${meetingCount} ${meetingCount === 1 ? 'meeting' : 'meetings'} in the next 7 days`,
        type: 'info',
        link: '/meetings',
        date: new Date().toISOString()
      });
    }

    // Outstanding invoices
    if (invoiceCount > 0) {
      notifications.push({
        id: 'outstanding-invoices',
        title: 'Outstanding Invoices',
        message: `${invoiceCount} ${invoiceCount === 1 ? 'invoice requires' : 'invoices require'} attention`,
        type: 'danger',
        link: '/invoices',
        date: new Date().toISOString()
      });
    }

    // Sort notifications by date
    return notifications.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-100';
      case 'danger':
        return 'bg-red-50 border-red-100';
      case 'info':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const notifications = getNotifications();
  const displayedNotifications = notifications.slice(0, 5);
  const hasMoreNotifications = notifications.length > 5;

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        </div>
        {hasMoreNotifications && (
          <Link
            to="/notifications"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {displayedNotifications.map(notification => (
          <Link
            key={notification.id}
            to={notification.link || '#'}
            className={`block p-4 rounded-lg border ${getNotificationColor(notification.type)} hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {notification.message}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NotificationsSection;