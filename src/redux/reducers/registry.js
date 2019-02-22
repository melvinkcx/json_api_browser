/**
 * Registry Reducer
 * 
 * Why a registry?
 * We wouldn't know what's ahead of us, but we can
 * get list of available entities from `GET /`.
 * 
 * In this case, we keep a registry of the entities 
 * available.
 * 
 * Before adding an entity to the registry, we shall
 * singularize the entity type/name
 * 
 */
import {ADD_ENTITY_TO_REGISTRY} from "../actionTypes";

const initialState = {
    entityRegistered: [
        'blog',
        'entry',
        'author',
        'comment'
    ],   // This is an entity registry.
};

export default function registryReducer(state = initialState, action) {
    switch(action.type) {
        case ADD_ENTITY_TO_REGISTRY: {
            const {entities} = action.payload;

            return {
                ...state,
                entityRegistered: [...state.entityRegistered, ...entities],
            };
        }
        default: {
            return state;
        }
    }
}