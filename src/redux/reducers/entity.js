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
            if (checkEntityType) {
                data.forEach(d => {
                    d.type = pluralize.singular(d.type);
                    entities[d.type] = {
                        ...entities[d.type],
                        [d.id]: d,
                    };
                });
            } else {
                data.forEach(d => {
                    entities[entityType]={
                        ...entities[entityType],
                        [d.id]: d
                    }
                });
            }

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

