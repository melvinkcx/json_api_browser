import pluralize from "pluralize";
import { ADD_ENTITY_ENTRIES } from "../actionTypes";

const initialState = {
    entities: {}, // Instead of storing as array, we store as associative array
}

export default function entityReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_ENTITY_ENTRIES: {
            let { entityType, data, checkEntityType } = action.payload; // Data obj is the entire data object (type, id, attrs, relationships, meta)

            const entities = { ...state.entities };

            data.forEach(d => {
                const type = checkEntityType ? pluralize.singular(d.type) : entityType;
                entities[type] = {
                    ...entities[type],
                    [d.id]: d,
                };
            });

            return {
                ...state,
                entities,
            }
        }
        default: {
            return state;
        }
    };
}

