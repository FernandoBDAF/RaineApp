import React from "react";
import { Text, View } from "react-native";
import { Input } from "../ui/Input";
import { MonthYearPicker } from "./MonthYearPicker";
import type { Child, DueDate } from "../../types/profile-setup";

interface ChildFormProps {
  childCount: number;
  children: Child[];
  isExpecting: boolean;
  dueDate: DueDate | null;
  onChildrenChange: (children: Child[]) => void;
  onDueDateChange: (dueDate: DueDate | null) => void;
}

export const ChildForm: React.FC<ChildFormProps> = ({
  childCount,
  children,
  isExpecting,
  dueDate,
  onChildrenChange,
  onDueDateChange
}) => {
  const handleChildChange = (index: number, updates: Partial<Child>) => {
    const next = [...children];
    next[index] = { ...next[index], ...updates };
    onChildrenChange(next);
  };

  const handleDueDateChange = (next: { month: string; year: string }) => {
    if (!next.month && !next.year) {
      onDueDateChange(null);
      return;
    }
    onDueDateChange({
      month: Number(next.month),
      year: Number(next.year)
    });
  };

  return (
    <View className="gap-6">
      {isExpecting ? (
        <View className="gap-2">
          <Text className="text-sm font-semibold text-slate-700">Due Date</Text>
          <MonthYearPicker
            month={dueDate?.month ? String(dueDate.month).padStart(2, "0") : ""}
            year={dueDate?.year ? String(dueDate.year) : ""}
            onChange={handleDueDateChange}
          />
        </View>
      ) : null}

      {Array.from({ length: childCount }).map((_, index) => (
        <View key={`child-${index}`} className="gap-3 rounded-lg border border-slate-200 p-4">
          <Text className="text-sm font-semibold text-slate-700">
            {`Child ${index + 1}`}
          </Text>
          <Input
            value={children[index]?.name ?? ""}
            placeholder={`Name`}
            onChangeText={(text) => handleChildChange(index, { name: text })}
          />
          <MonthYearPicker
            month={
              children[index]?.birthMonth
                ? String(children[index]?.birthMonth).padStart(2, "0")
                : ""
            }
            year={children[index]?.birthYear ? String(children[index]?.birthYear) : ""}
            onChange={(next) =>
              handleChildChange(index, {
                birthMonth: Number(next.month),
                birthYear: Number(next.year)
              })
            }
          />
        </View>
      ))}
    </View>
  );
};
