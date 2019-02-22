import { UPDATE_PAGINATION, UPDATE_LINKS, UPDATE_LOADING_INDICATOR, UPDATE_CURRENT_DISPLAY_ENTITY } from "../actionTypes";

export function updateCurrentPagination({ pagination }) {
    return {
        type: UPDATE_PAGINATION,
        payload: {
            pagination,
        }
    }
};

export function updateCurrentLinks({ links }) {
    return {
        type: UPDATE_LINKS,
        payload: {
            links,
        }
    }
};

export function updateCurrentDisplayEntity({ many, entityType, entityIds }) {
    return {
        type: UPDATE_CURRENT_DISPLAY_ENTITY,
        payload: {
            many,
            entityType,
            entityIds,
        }
    }
}

export function updateLoadingIndicator(value) {
    return {
        type: UPDATE_LOADING_INDICATOR,
        payload: {
            loading: value,
        }
    }
}