import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import DeliveryModal from './DeliveryModal';
import DeliveryStatusModal from './DeliveryStatusModal';
import { getDeliveriesByDate, updateDeliveryStatus } from '../../services/deliveryService';
import { Delivery } from '../../types/delivery';

const DeliveryCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [deliveries, setDeliveries] = useState<Record<string, Delivery[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeliveries();
  }, [currentDate]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const monthDeliveries = await getDeliveriesByDate(startOfMonth, endOfMonth);
      
      const grouped = monthDeliveries.reduce((acc, delivery) => {
        const date = delivery.date.split('T')[0];
        acc[date] = [...(acc[date] || []), delivery];
        return acc;
      }, {} as Record<string, Delivery[]>);
      
      setDeliveries(grouped);
    } catch (error) {
      console.error('Failed to load deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleDeliveryClick = (delivery: Delivery, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDelivery(delivery);
    setIsStatusModalOpen(true);
  };

  const handleMarkAsDelivered = async (id: string, notes: string) => {
    try {
      await updateDeliveryStatus(id, 'delivered', notes);
      await loadDeliveries();
      setIsStatusModalOpen(false);
      setSelectedDelivery(null);
    } catch (error) {
      console.error('Failed to mark delivery as delivered:', error);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayDeliveries = deliveries[dateString] || [];

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className="border border-gray-200 p-2 h-24 md:h-32 hover:bg-gray-50 cursor-pointer relative group overflow-auto"
        >
          <div className="font-semibold mb-1 flex justify-between items-center sticky top-0 bg-white z-10">
            <span className="text-sm md:text-base">{day}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
            </span>
          </div>
          <div className="space-y-1">
            {dayDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                onClick={(e) => handleDeliveryClick(delivery, e)}
                className="text-xs p-1.5 md:p-2 rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="truncate flex-1">
                    <span className="font-medium">{delivery.company}</span>
                    <span className="hidden md:inline text-blue-600"> - {delivery.area}</span>
                  </div>
                  {delivery.status === 'delivered' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-100 p-2 text-center">
            <span className="text-xs md:text-sm font-semibold">{day}</span>
          </div>
        ))}
        {renderCalendar()}
      </div>

      {selectedDate && (
        <DeliveryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDate(null);
          }}
          date={selectedDate}
          onDeliveryAdded={loadDeliveries}
        />
      )}

      {selectedDelivery && (
        <DeliveryStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => {
            setIsStatusModalOpen(false);
            setSelectedDelivery(null);
          }}
          delivery={selectedDelivery}
          onMarkDelivered={handleMarkAsDelivered}
        />
      )}
    </div>
  );
};

export default DeliveryCalendar;