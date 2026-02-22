import React, { useMemo } from "react";
import { View } from "react-native";
import { Select, type SelectOption } from "../ui/Select";
import { Input } from "../ui/Input";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const MONTH_OPTIONS: SelectOption[] = MONTH_NAMES.map((name, i) => ({
  value: String(i + 1),
  label: name
}));

function getYearOptions(): SelectOption[] {
  const currentYear = new Date().getFullYear();
  return [
    { value: String(currentYear - 1), label: String(currentYear - 1) },
    { value: String(currentYear), label: String(currentYear) },
    { value: String(currentYear + 1), label: String(currentYear + 1) }
  ];
}

interface MonthYearPickerProps {
  month: string;
  year: string;
  onChange: (next: { month: string; year: string }) => void;
  monthPlaceholder?: string;
  yearPlaceholder?: string;
  setYearManual?: boolean;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  month,
  year,
  onChange,
  monthPlaceholder = "Month",
  yearPlaceholder = "Year",
  setYearManual = false
}) => {
  const yearOptions = useMemo(() => getYearOptions(), []);

  const normalizedMonth =
    month && Number(month) >= 1 && Number(month) <= 12
      ? String(Number(month))
      : "";

  const normalizedYear = setYearManual ? year : yearOptions.some((opt) => opt.value === year)
    ? year
    : "";

  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Select
          value={normalizedMonth}
          options={MONTH_OPTIONS}
          placeholder={monthPlaceholder}
          onChange={(m) => onChange({ month: m, year: normalizedYear })}
        />
      </View>
      <View className="flex-1">
        {setYearManual ? (
          <Input
            value={normalizedYear}
            placeholder={yearPlaceholder}
            onChangeText={(y: string) => onChange({ month: normalizedMonth, year: y })}
            maxLength={4}
            keyboardType="numeric"
          />
        ) : (
          <Select
            value={normalizedYear}
            options={yearOptions}
            placeholder={yearPlaceholder}
            onChange={(y) => onChange({ month: normalizedMonth, year: y })}
          />
        )}
      </View>
    </View>
  );
};
