
import { useState } from 'react';
import { formatDisplayDate } from '@/lib/utils/dateUtils';
import { BookingResponse } from '@shared/schema';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DeleteConfirmation from './DeleteConfirmation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookingDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  bookings: BookingResponse[];
  onEdit: (booking: BookingResponse) => void;
  onBookPeriod: (period: 'morning' | 'evening' | 'both') => void;
  onRefresh?: () => void;
}

export default function BookingDetails({ isOpen, onClose, date, bookings, onEdit, onBookPeriod }: BookingDetailsProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  
  if (!date) return null;

  // Find bookings for this specific date
  const dateStr = date.toISOString().split('T')[0];
  const dayBookings = bookings.filter(booking => {
    // Handle different date formats
    let bookingDateStr;
    if (booking.bookingDate) {
      bookingDateStr = booking.bookingDate.split('T')[0];
    } else if (booking.booking_date) {
      bookingDateStr = booking.booking_date.split('T')[0];
    } else {
      return false;
    }
    return bookingDateStr === dateStr;
  });

  // Find specific period bookings
  const morningBooking = dayBookings.find(booking => 
    booking.period === 'morning' || booking.period === 'both'
  );
  const eveningBooking = dayBookings.find(booking => 
    booking.period === 'evening' || booking.period === 'both'
  );
  
  const hasMorningBooking = !!morningBooking;
  const hasEveningBooking = !!eveningBooking;

  // Format period text in Arabic
  const getPeriodText = (period: string) => {
    switch (period) {
      case 'morning':
        return 'فترة صباحية';
      case 'evening':
        return 'فترة مسائية';
      case 'both':
        return 'الفترتين (صباحي ومسائي)';
      default:
        return '';
    }
  };
  
  // Get appropriate icon for period
  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning':
        return <i className="fas fa-sun text-amber-500"></i>;
      case 'evening':
        return <i className="fas fa-moon text-indigo-500"></i>;
      case 'both':
        return (
          <div className="flex items-center gap-1">
            <i className="fas fa-sun text-amber-500"></i>
            <i className="fas fa-moon text-indigo-500"></i>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Function to render booking details
  const renderBookingDetails = (booking: BookingResponse | undefined, periodType: 'morning' | 'evening') => {
    if (!booking) {
      return (
        <div className="p-6 text-center">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
            <i className="fas fa-calendar-plus text-xl"></i>
          </div>
          <p className="text-lg font-medium mb-2">هذه الفترة متاحة للحجز</p>
          <p className="text-gray-600 mb-4">لا يوجد حجز في هذه الفترة. هل ترغب في إضافة حجز جديد؟</p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 mt-2"
            onClick={() => onBookPeriod(periodType)}
          >
            <i className="fas fa-plus mr-2"></i>
            حجز جديد
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4 p-4">
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 ml-3">
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">الفترة</p>
              <p className="font-medium flex items-center gap-2">
                {getPeriodIcon(booking.period)}
                <span>{getPeriodText(booking.period)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-600">اسم المستأجر:</span>
            <span className="font-medium">{booking.customerName || booking.customer_name}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-600">رقم الهاتف:</span>
            <span className="font-medium" dir="ltr">{booking.customerPhone || booking.customer_phone}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-600">المبلغ المدفوع:</span>
            <span className="font-medium">{booking.amountPaid || booking.amount_paid} دينار</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-600">المبلغ المتبقي:</span>
            <span className="font-medium">{booking.amountRemaining || booking.amount_remaining} دينار</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-600">عدد الأشخاص:</span>
            <span className="font-medium">{booking.peopleCount || booking.people_count} أشخاص</span>
          </div>
        </div>

        <div className="flex justify-between pt-4 gap-2">
          <Button 
            className="bg-amber-500 hover:bg-amber-600 flex-1"
            onClick={() => onEdit(booking)}
          >
            <i className="fas fa-edit mr-2"></i>
            تعديل الحجز
          </Button>
          <Button 
            variant="destructive"
            className="flex-1"
            onClick={() => {
              setSelectedBookingId(booking.id);
              setShowDeleteConfirmation(true);
            }}
          >
            <i className="fas fa-trash mr-2"></i>
            إلغاء الحجز
          </Button>
        </div>
      </div>
    );
  };

  // If neither period is booked, show booking options
  if (!hasMorningBooking && !hasEveningBooking) {
    return (
      <Dialog open={isOpen && !showDeleteConfirmation} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>حجز جديد</DialogTitle>
            <DialogDescription>
              يمكنك إضافة حجز جديد لهذا التاريخ
            </DialogDescription>
          </DialogHeader>
          
          <div className="mb-4">
            <h4 className="font-bold mb-2">
              التاريخ: <span className="font-normal">{formatDisplayDate(date)}</span>
            </h4>
          </div>

          <div className="p-6 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
              <i className="fas fa-calendar-plus text-xl"></i>
            </div>
            <p className="text-lg font-medium mb-2">هذا اليوم متاح بالكامل</p>
            <p className="text-gray-600 mb-4">يمكنك إضافة حجز للفترة الصباحية أو المسائية أو كلاهما.</p>
            
            <div className="grid grid-cols-1 gap-3 mt-4">
              <Button 
                className="bg-amber-500 hover:bg-amber-600"
                onClick={() => onBookPeriod('morning')}
              >
                <i className="fas fa-sun mr-2"></i> فترة صباحية
              </Button>
              <Button 
                className="bg-indigo-500 hover:bg-indigo-600"
                onClick={() => onBookPeriod('evening')}
              >
                <i className="fas fa-moon mr-2"></i> فترة مسائية
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => onBookPeriod('both')}
              >
                <i className="fas fa-calendar-check mr-2"></i> اليوم كامل
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="mt-2"
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen && !showDeleteConfirmation} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الحجز</DialogTitle>
            <DialogDescription>
              عرض وإدارة حجوزات هذا التاريخ
            </DialogDescription>
          </DialogHeader>
          
          <div className="mb-2">
            <h4 className="font-bold mb-2">
              التاريخ: <span className="font-normal">{formatDisplayDate(date)}</span>
            </h4>
          </div>

          <Tabs defaultValue={hasMorningBooking ? "morning" : "evening"} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="morning" className="w-1/2">
                <i className="fas fa-sun ml-1 text-amber-500"></i>
                الفترة الصباحية
              </TabsTrigger>
              <TabsTrigger value="evening" className="w-1/2">
                <i className="fas fa-moon ml-1 text-indigo-500"></i>
                الفترة المسائية
              </TabsTrigger>
            </TabsList>
            <TabsContent value="morning">
              {renderBookingDetails(morningBooking, 'morning')}
            </TabsContent>
            <TabsContent value="evening">
              {renderBookingDetails(eveningBooking, 'evening')}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {selectedBookingId && (
        <DeleteConfirmation
          isOpen={showDeleteConfirmation}
          onClose={() => {
            setShowDeleteConfirmation(false);
            setSelectedBookingId(null);
          }}
          bookingId={selectedBookingId}
          onDeleted={() => {
            setShowDeleteConfirmation(false);
            setSelectedBookingId(null);
            if (onRefresh) {
              onRefresh();
            }
            onClose();
          }}
        />
      )}
    </>
  );
}
