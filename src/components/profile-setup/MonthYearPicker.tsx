import React from 'react';
import { View } from 'react-native';
import { Input } from '../ui/Input';

interface MonthYearPickerProps {
  month: string;
  year: string;
  onChange: (next: { month: string; year: string }) => void;
  monthPlaceholder?: string;
  yearPlaceholder?: string;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  month,
  year,
  onChange,
  monthPlaceholder = 'MM',
  yearPlaceholder = 'YYYY'
}) => {
  const baseMonth = '01';
  const baseYear = '2000';
  if (Number(month) < 0 || Number(month) > 12) {
    month = baseMonth;
  }
  if (Number(year) < 0 || Number(year) > 9999) {
    year = baseYear;
  }
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Input
          value={month}
          placeholder={monthPlaceholder}
          keyboardType="number-pad"
          maxLength={2}
          onChangeText={(text) => onChange({ month: text.replace(/\D/g, ''), year })}
        />
      </View>
      <View className="flex-1">
        <Input
          value={year}
          placeholder={yearPlaceholder}
          keyboardType="number-pad"
          maxLength={4}
          onChangeText={(text) => onChange({ month, year: text.replace(/\D/g, '') })}
        />
      </View>
    </View>
  );
};
