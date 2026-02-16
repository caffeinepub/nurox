import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Settings {
    baseCurrency: string;
    theme: string;
    strategyPresets: string;
    defaultAccount: number;
    defaultRiskPercent: number;
}
export type Time = bigint;
export interface Trade {
    id: string;
    rewardExpectation: number;
    stopLossSize: number;
    direction: string;
    entryType: string;
    entryTimestamp: Time;
    riskAmount: number;
    screenshotUrl?: string;
    pair: string;
    liquiditySweepConfirmed: boolean;
    violations: Array<Violation>;
    positionSize: number;
    riskReward?: number;
    newsSusceptibility: boolean;
    resultRR?: number;
    disciplineScore: number;
    accountSize: number;
    positionSizeError: boolean;
    exitTimestamp?: Time;
    isScreenshot: boolean;
    emotions: string;
    resultPips?: number;
    rewardReached: boolean;
    structureBreakConfirmed: boolean;
    positionSizeMethod: string;
}
export interface Violation {
    rule: string;
    description: string;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export interface TradeView {
    id: string;
    rewardExpectation: number;
    stopLossSize: number;
    direction: string;
    entryType: string;
    entryTimestamp: Time;
    riskAmount: number;
    screenshotUrl?: string;
    pair: string;
    liquiditySweepConfirmed: boolean;
    violations: Array<Violation>;
    positionSize: number;
    riskReward?: number;
    newsSusceptibility: boolean;
    resultRR?: number;
    disciplineScore: number;
    accountSize: number;
    positionSizeError: boolean;
    exitTimestamp?: Time;
    isScreenshot: boolean;
    emotions: string;
    resultPips?: number;
    rewardReached: boolean;
    structureBreakConfirmed: boolean;
    positionSizeMethod: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteTrade(tradeId: string): Promise<void>;
    getAllTrades(): Promise<Array<TradeView>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSettings(): Promise<Settings | null>;
    getTrade(tradeId: string): Promise<TradeView>;
    getTradeByPair(pair: string): Promise<Array<TradeView>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveScreenshot(image: ExternalBlob): Promise<ExternalBlob>;
    saveSettings(settings: Settings): Promise<void>;
    saveTrade(trade: Trade): Promise<void>;
}
