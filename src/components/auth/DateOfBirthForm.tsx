
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { validateYear } from '@/utils/form-validators';

interface DateOfBirthFormProps {
  day: string;
  month: string;
  year: string;
  setDay: (value: string) => void;
  setMonth: (value: string) => void;
  setYear: (value: string) => void;
  dobError: string;
  formTouched: boolean;
  onFieldChange: () => void;
}

export const DateOfBirthForm = ({
  day,
  month,
  year,
  setDay,
  setMonth,
  setYear,
  dobError,
  formTouched,
  onFieldChange
}: DateOfBirthFormProps) => {
  const currentYear = new Date().getFullYear();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Days in month array
  const getDaysInMonth = (month: string, year: string): number[] => {
    if (!month || !year) return Array.from({ length: 31 }, (_, i) => i + 1);
    
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) return Array.from({ length: 31 }, (_, i) => i + 1);
    
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return Array.from({ length: 31 }, (_, i) => i + 1);
    
    const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(month, year);

  // Reset day if it's greater than the days in the current month
  useEffect(() => {
    if (day && month && year) {
      const maxDay = getDaysInMonth(month, year).length;
      if (parseInt(day) > maxDay) {
        setDay(maxDay.toString());
      }
    }
  }, [month, year, day, setDay]);

  // Handle year input change
  const handleYearChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Limit to 4 digits
    if (numericValue.length <= 4) {
      setYear(numericValue);
      onFieldChange();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Date of Birth (must be 21+)</div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="day">Day</Label>
          <Select value={day} onValueChange={(value) => {
            setDay(value);
            onFieldChange();
          }}>
            <SelectTrigger id="day" className={cn(
              formTouched && dobError && !day ? "border-red-500 focus-visible:ring-red-500" : ""
            )}>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {days.map((d) => (
                <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="month">Month</Label>
          <Select value={month} onValueChange={(value) => {
            setMonth(value);
            onFieldChange();
          }}>
            <SelectTrigger id="month" className={cn(
              formTouched && dobError && !month ? "border-red-500 focus-visible:ring-red-500" : ""
            )}>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {months.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="text"
            placeholder="YYYY"
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            maxLength={4}
            inputMode="numeric"
            className={cn(
              formTouched && dobError && !validateYear(year) ? "border-red-500 focus-visible:ring-red-500" : ""
            )}
          />
        </div>
      </div>
      {formTouched && dobError && (
        <p className="text-xs text-red-500 mt-1">{dobError}</p>
      )}
    </div>
  );
};
