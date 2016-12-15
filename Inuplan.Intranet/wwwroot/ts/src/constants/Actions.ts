export enum ActionType {
    ADD_USERS,
    RECEIVED_USERS,
    SET_CURRENT_USER_ID,

    // Error -->
    SET_HAS_ERROR,
    SET_ERROR_TITLE,
    CLEAR_ERROR_TITLE,
    SET_ERROR_MESSAGE,
    CLEAR_ERROR_MESSAGE,
    // <-- end

    // WhatsNew -->
    SET_LATEST,
    SET_SKIP_WHATS_NEW,
    SET_TAKE_WHATS_NEW,
    SET_PAGE_WHATS_NEW,
    SET_TOTAL_PAGES_WHATS_NEW
    // <-- end
}