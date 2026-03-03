import React from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAvatarSource } from '../../constants/avatars';
import { MomsLikeYouPreview } from '../../services/home/home-functions';

export type ConnectionStatus = 'none' | 'pending' | 'connected' | 'pending_incoming';

interface MatchProfileCardProps {
  profile: MomsLikeYouPreview;
  connectionStatus: ConnectionStatus;
  onSayHi: () => void;
  onSave: () => void;
  onPending?: () => void;
  onSendMessage?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  isAccepting?: boolean;
  isDeclining?: boolean;
}

export const MatchProfileCard: React.FC<MatchProfileCardProps> = ({
  profile,
  connectionStatus,
  onSayHi,
  onSave,
  onPending,
  onSendMessage,
  onAccept,
  onDecline,
  isAccepting = false,
  isDeclining = false
}) => {
  const isAcceptDeclineBusy = isAccepting || isDeclining;
  const renderButtons = () => {
    if (connectionStatus === 'pending_incoming' && onAccept && onDecline) {
      return (
        <>
          <Pressable
            disabled={isAcceptDeclineBusy}
            onPress={onAccept}
            className="flex-1 flex-row items-center justify-center gap-1 rounded-full bg-orange-500 py-1.5 disabled:opacity-60"
          >
            {isAccepting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={14} color="white" />
                <Text className="text-[10px] font-bold tracking-wider text-white">Accept</Text>
              </>
            )}
          </Pressable>
          <Pressable
            disabled={isAcceptDeclineBusy}
            onPress={onDecline}
            className="flex-1 flex-row items-center justify-center gap-1 rounded-full border border-slate-300 py-1.5 disabled:opacity-60"
          >
            {isDeclining ? (
              <ActivityIndicator size="small" color="#94a3b8" />
            ) : (
              <>
                <Ionicons name="close-circle" size={14} color="#94a3b8" />
                <Text className="text-[10px] font-bold tracking-wider text-slate-400">Decline</Text>
              </>
            )}
          </Pressable>
        </>
      );
    }
    if (connectionStatus === 'pending' && onPending) {
      return (
        <Pressable
          onPress={onPending}
          className="flex-1 items-center rounded-full border border-amber-500 bg-amber-50 py-1.5"
        >
          <Text className="text-[10px] font-bold tracking-wider text-amber-900">Pending</Text>
        </Pressable>
      );
    }
    if (connectionStatus === 'connected' && onSendMessage) {
      return (
        <Pressable
          onPress={onSendMessage}
          className="flex-1 items-center rounded-full border border-orange-500 py-1.5"
        >
          <Text className="text-[10px] font-bold tracking-wider text-orange-500">Send message</Text>
        </Pressable>
      );
    }
    return (
      <>
        <Pressable
          onPress={onSayHi}
          className="flex-1 items-center rounded-full border border-orange-500 py-1.5"
        >
          <Text className="text-[10px] font-bold tracking-wider text-orange-500">SAY HI!</Text>
        </Pressable>
        <Pressable
          onPress={onSave}
          className="flex-1 items-center rounded-full border border-slate-300 py-1.5"
        >
          <Text className="text-[10px] font-bold tracking-wider text-slate-400">SAVE</Text>
        </Pressable>
      </>
    );
  };

  return (
    <View className="w-40">
      {/* Photo with name overlay */}
      <View className="relative">
        <Image
          source={getAvatarSource(profile.photoURL)}
          className="h-[200px] w-full rounded-lg"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black/30 px-2 pb-2 pt-1">
          <Text className="text-base font-bold text-white" style={{ fontFamily: 'serif' }}>
            {profile.firstName} {profile.lastInitial}.
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View className="mt-2 flex-row gap-2">{renderButtons()}</View>
    </View>
  );
};
