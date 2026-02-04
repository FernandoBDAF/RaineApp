import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { getOfferings, purchasePackage, restorePurchases } from '../services/revenuecat';
import { useEntitlement } from '../hooks/useEntitlement';

export default function SubscriptionScreen() {
  const { hasAccess, isLoading: entitlementLoading } = useEntitlement('premium');
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const offerings = await getOfferings();
        setOffering(offerings.current ?? null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePurchase = async (pack: PurchasesPackage) => {
    await purchasePackage(pack);
  };

  if (loading || entitlementLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 py-6">
      <Text className="text-2xl font-bold text-slate-900">Upgrade</Text>
      <Text className="mt-2 text-slate-500">
        {hasAccess ? 'You are on the premium plan.' : 'Unlock premium features.'}
      </Text>
      <View className="mt-6 space-y-4">
        {offering?.availablePackages.map((pack) => (
          <View key={pack.identifier} className="rounded-lg border border-slate-200 p-4">
            <Text className="text-lg font-semibold text-slate-800">
              {pack.product.title}
            </Text>
            <Text className="mt-1 text-slate-500">{pack.product.description}</Text>
            <View className="mt-3">
              <Button
                title={`Subscribe ${pack.product.priceString}`}
                onPress={() => handlePurchase(pack)}
              />
            </View>
          </View>
        ))}
      </View>
      <View className="mt-6">
        <Button title="Restore purchases" onPress={restorePurchases} variant="outline" />
      </View>
    </ScrollView>
  );
}
