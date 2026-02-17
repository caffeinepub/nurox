import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeActor } from './useSafeActor';
import type { Trade, Settings, UserProfile } from '../backend';

/**
 * All React Query hooks for trades, settings, and profile operations using useSafeActor with proper actor gating and cache invalidation.
 */

// Profile queries
export function useGetCallerUserProfile() {
  const { actor, isLoading: actorLoading } = useSafeActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorLoading,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorLoading || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Trade queries
export function useGetAllTrades() {
  const { actor, isLoading: actorLoading } = useSafeActor();

  return useQuery<Trade[]>({
    queryKey: ['trades'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTrades();
    },
    enabled: !!actor && !actorLoading,
  });
}

export function useSaveTrade() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trade: Trade) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveTrade(trade);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
  });
}

export function useDeleteTrade() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tradeId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteTrade(tradeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
  });
}

// Settings queries
export function useGetSettings() {
  const { actor, isLoading: actorLoading } = useSafeActor();

  return useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      if (!actor) {
        return {
          defaultAccount: 0,
          defaultRiskPercent: 0,
          baseCurrency: '',
          theme: 'light',
          strategyPresets: '',
        };
      }
      return actor.getSettings();
    },
    enabled: !!actor && !actorLoading,
  });
}

export function useSaveSettings() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Settings) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

// Start Fresh mutation
export function useStartFresh() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.startFresh();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
