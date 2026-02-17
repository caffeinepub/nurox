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
    profitLossAmount: number;
    stopLossSize: number;
    direction: string;
    entryType: string;
    entryTimestamp: Time;
    riskAmount: number;
    screenshotUrl?: string;
    pair: string;
    takeProfitPrice: number;
    liquiditySweepConfirmed: boolean;
    violations: Array<Violation>;
    positionSize: number;
    riskReward?: number;
    newsSusceptibility: boolean;
    resultRR?: number;
    disciplineScore: number;
    accountSize: number;
    stopLossPrice: number;
    positionSizeError: boolean;
    grade?: string;
    exitTimestamp?: Time;
    isScreenshot: boolean;
    entryPrice: number;
    emotions: string;
    resultPips?: number;
    rewardReached: boolean;
    structureBreakConfirmed: boolean;
    positionSizeMethod: string;
    winLossResult: WinLossResult;
}
export interface Violation {
    rule: string;
    description: string;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WinLossResult {
    win = "win",
    loss = "loss"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteTrade(tradeId: string): Promise<void>;
    getAllTrades(): Promise<Array<Trade>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSettings(): Promise<Settings>;
    getTrade(tradeId: string): Promise<Trade>;
    getTradeByPair(pair: string): Promise<Array<Trade>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    healthCheck(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveScreenshot(image: ExternalBlob): Promise<ExternalBlob>;
    saveSettings(settings: Settings): Promise<void>;
    saveTrade(trade: Trade): Promise<void>;
    startFresh(): Promise<void>;
}
