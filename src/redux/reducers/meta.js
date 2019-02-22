/**
 * Meta 
 * To store pagination info and links of current 
 * entity in view, 
 */
import { UPDATE_PAGINATION, UPDATE_LINKS, UPDATE_CURRENT_DISPLAY_ENTITY, UPDATE_LOADING_INDICATOR } from "../actionTypes";

const initialState = {
    pagination: {
        page: 1,    // current page
        pages: 1,   // total pages
        count: 0,   // item count
    },
    links: {
        first: null,
        last: null,
        next: null,
        prev: null,
    },
    displayEntity: {
        loading: false,
        many: false,    // Value is an array ? many = true : many = false
        entityType: null,   // blog, etc
        entityIds: null // Value is an array or object
    },
};

export default function metaReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_PAGINATION: {
            const { page, pages, count } = action.payload.pagination;

            return {
                ...state,
                pagination: { page, pages, count, }
            };
        }
        case UPDATE_LINKS: {
            const { first, last, next, prev } = action.payload.links;

            return {
                ...state,
                links: { first, last, next, prev, }
            };
        }
        case UPDATE_CURRENT_DISPLAY_ENTITY: {
            const { many, entityType, entityIds } = action.payload;

            return {
                ...state,
                displayEntity: { ...state.displayEntity, many, entityType, entityIds },
            }
        }
        case UPDATE_LOADING_INDICATOR: {
            const { loading } = action.payload;

            return {
                ...state,
                displayEntity: { ...state.displayEntity, loading }
            }
        }
        default: {
            return state;
        }
    }
}

