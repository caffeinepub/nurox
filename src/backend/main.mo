import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  public type Violation = {
    rule : Text;
    description : Text;
    timestamp : Time.Time;
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
  };

  public type TradeView = Trade;

  public type Entry = {
    id : Text;
    trade : Trade;
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

  module TradeView {
    public func compareById(trade1 : ?TradeView, trade2 : ?TradeView) : Order.Order {
      switch (trade1, trade2) {
        case (null, null) { #equal };
        case (?_, null) { #less };
        case (null, ?_) { #greater };
        case (?t1, ?t2) { Text.compare(t1.id, t2.id) };
      };
    };
  };

  type TradesStore = Map.Map<Text, Trade>;

  let tradesStorage = Map.empty<Principal, TradesStore>();
  let settingsStorage = Map.empty<Principal, Settings>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management (required by instructions)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Trade management functions - adapted for immutable persistent types
  public shared ({ caller }) func saveTrade(trade : Trade) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save trades");
    };

    let userTrades = switch (tradesStorage.get(caller)) {
      case (null) { Map.empty<Text, Trade>() };
      case (?trades) { trades };
    };

    userTrades.add(trade.id, trade);
    tradesStorage.add(caller, userTrades);
  };

  public query ({ caller }) func getTrade(tradeId : Text) : async TradeView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trades");
    };

    switch (tradesStorage.get(caller)) {
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

    switch (tradesStorage.get(caller)) {
      case (null) { Runtime.trap("No trades found for this user") };
      case (?userTrades) {
        let updatedTrades = Map.empty<Text, Trade>();
        userTrades.entries().forEach(func((id, trade)) { if (id != tradeId) { updatedTrades.add(id, trade) } });
        tradesStorage.add(caller, updatedTrades);
      };
    };
  };

  public query ({ caller }) func getAllTrades() : async [TradeView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trades");
    };

    switch (tradesStorage.get(caller)) {
      case (null) { [] };
      case (?userTrades) {
        userTrades.values().toArray();
      };
    };
  };

  public query ({ caller }) func getTradeByPair(pair : Text) : async [TradeView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trades");
    };

    switch (tradesStorage.get(caller)) {
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

  // Settings management functions
  public shared ({ caller }) func saveSettings(settings : Settings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save settings");
    };

    settingsStorage.add(caller, settings);
  };

  public query ({ caller }) func getSettings() : async ?Settings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access settings");
    };

    settingsStorage.get(caller);
  };

  // Screenshot management
  public shared ({ caller }) func saveScreenshot(image : Storage.ExternalBlob) : async Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save screenshots");
    };

    image;
  };
};
