import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Storage "blob-storage/Storage";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type Violation = {
    rule : Text;
    description : Text;
    timestamp : Time.Time;
  };

  public type WinLossResult = {
    #win;
    #loss;
  };

  public type Trade = {
    id : Text;
    entryTimestamp : Time.Time;
    exitTimestamp : ?Time.Time;
    pair : Text;
    direction : Text;
    entryType : Text;
    riskReward : ?Float;
    resultPips : ?Float;
    resultRR : ?Float;
    accountSize : Float;
    riskAmount : Float;
    positionSize : Float;
    stopLossSize : Float;
    positionSizeMethod : Text;
    positionSizeError : Bool;
    rewardExpectation : Float;
    rewardReached : Bool;
    liquiditySweepConfirmed : Bool;
    structureBreakConfirmed : Bool;
    newsSusceptibility : Bool;
    emotions : Text;
    disciplineScore : Float;
    violations : [Violation];
    isScreenshot : Bool;
    screenshotUrl : ?Text;
    entryPrice : Float;
    stopLossPrice : Float;
    takeProfitPrice : Float;
    grade : ?Text;
    winLossResult : WinLossResult;
    profitLossAmount : Float;
  };

  module TradeView {
    public func compareById(trade1 : ?Trade, trade2 : ?Trade) : Order.Order {
      switch (trade1, trade2) {
        case (null, null) { #equal };
        case (?_, null) { #less };
        case (null, ?_) { #greater };
        case (?t1, ?t2) { Text.compare(t1.id, t2.id) };
      };
    };
  };

  public type Settings = {
    defaultAccount : Float;
    defaultRiskPercent : Float;
    baseCurrency : Text;
    theme : Text;
    strategyPresets : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let tradesStore = Map.empty<Principal, Map.Map<Text, Trade>>();
  let settingsStore = Map.empty<Principal, Settings>();
  let userProfilesStore = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func healthCheck() : async Bool {
    true;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfilesStore.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfilesStore.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfilesStore.add(caller, profile);
  };

  public shared ({ caller }) func saveTrade(trade : Trade) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save trades");
    };
    let userTrades = switch (tradesStore.get(caller)) {
      case (null) {
        let newStore = Map.empty<Text, Trade>();
        newStore;
      };
      case (?existing) { existing };
    };
    userTrades.add(trade.id, trade);
    tradesStore.add(caller, userTrades);
  };

  public query ({ caller }) func getTrade(tradeId : Text) : async Trade {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trades");
    };
    switch (tradesStore.get(caller)) {
      case (null) { Runtime.trap("No trades found for this user") };
      case (?userTrades) {
        switch (userTrades.get(tradeId)) {
          case (null) { Runtime.trap("Trade not found") };
          case (?trade) { trade };
        };
      };
    };
  };

  public shared ({ caller }) func deleteTrade(tradeId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete trades");
    };
    switch (tradesStore.get(caller)) {
      case (null) { Runtime.trap("No trades found for this user") };
      case (?userTrades) {
        let updatedTrades = Map.empty<Text, Trade>();
        userTrades.entries().forEach(func((id, trade)) { if (id != tradeId) { updatedTrades.add(id, trade) } });
        tradesStore.add(caller, updatedTrades);
      };
    };
  };

  public query ({ caller }) func getAllTrades() : async [Trade] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trades");
    };
    switch (tradesStore.get(caller)) {
      case (null) { [] };
      case (?userTrades) {
        userTrades.values().toArray();
      };
    };
  };

  public query ({ caller }) func getTradeByPair(pair : Text) : async [Trade] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trades");
    };
    switch (tradesStore.get(caller)) {
      case (null) { [] };
      case (?userTrades) {
        Array.fromIter(
          userTrades.values().filter(
            func(trade) { trade.pair == pair }
          )
        );
      };
    };
  };

  public query ({ caller }) func getSettings() : async Settings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access settings");
    };
    switch (settingsStore.get(caller)) {
      case (?settings) { settings };
      case (null) {
        {
          defaultAccount = 0.0;
          defaultRiskPercent = 0.0;
          baseCurrency = "";
          theme = "light";
          strategyPresets = "";
        };
      };
    };
  };

  public shared ({ caller }) func saveSettings(settings : Settings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save settings");
    };
    settingsStore.add(caller, settings);
  };

  public shared ({ caller }) func saveScreenshot(image : Storage.ExternalBlob) : async Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save screenshots");
    };
    image;
  };

  public shared ({ caller }) func startFresh() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear their own data");
    };
    tradesStore.remove(caller);
    settingsStore.remove(caller);
    userProfilesStore.remove(caller);
  };
};
