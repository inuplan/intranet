export var ActionType;
(function (ActionType) {
    ActionType[ActionType["ADD_USERS"] = 0] = "ADD_USERS";
    ActionType[ActionType["RECEIVED_USERS"] = 1] = "RECEIVED_USERS";
    ActionType[ActionType["SET_CURRENT_USER_ID"] = 2] = "SET_CURRENT_USER_ID";
    // Error -->
    ActionType[ActionType["SET_HAS_ERROR"] = 3] = "SET_HAS_ERROR";
    ActionType[ActionType["SET_ERROR_TITLE"] = 4] = "SET_ERROR_TITLE";
    ActionType[ActionType["CLEAR_ERROR_TITLE"] = 5] = "CLEAR_ERROR_TITLE";
    ActionType[ActionType["SET_ERROR_MESSAGE"] = 6] = "SET_ERROR_MESSAGE";
    ActionType[ActionType["CLEAR_ERROR_MESSAGE"] = 7] = "CLEAR_ERROR_MESSAGE";
    // <-- end
    // WhatsNew -->
    ActionType[ActionType["SET_LATEST"] = 8] = "SET_LATEST";
    ActionType[ActionType["SET_SKIP_WHATS_NEW"] = 9] = "SET_SKIP_WHATS_NEW";
    ActionType[ActionType["SET_TAKE_WHATS_NEW"] = 10] = "SET_TAKE_WHATS_NEW";
    ActionType[ActionType["SET_PAGE_WHATS_NEW"] = 11] = "SET_PAGE_WHATS_NEW";
    ActionType[ActionType["SET_TOTAL_PAGES_WHATS_NEW"] = 12] = "SET_TOTAL_PAGES_WHATS_NEW";
    // <-- end
})(ActionType || (ActionType = {}));
