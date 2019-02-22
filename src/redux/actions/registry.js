/**
 * Not using this for now.
 */

import plurarize from "pluralize";
import { BACKEND_URL } from "../../constants";
import { ADD_ENTITY_TO_REGISTRY } from "../actionTypes";

function registerEntity(entities) {
    return {
        type: ADD_ENTITY_TO_REGISTRY,
        payload: {entities},
    };
}

export function fetchRegistry() {
    /**
     * A sample response:
     * {
            "data": {
                "blogs": "http://localhost:8000/blogs",
                "entries": "http://localhost:8000/entries",
                "nopage-entries": "http://localhost:8000/nopage-entries",
                "authors": "http://localhost:8000/authors",
                "comments": "http://localhost:8000/comments",
                "companies": "http://localhost:8000/companies",
                "projects": "http://localhost:8000/projects",
                "project-types": "http://localhost:8000/project-types"
            }
        }
     */

    return async dispatch => {
        try {
            const response = await fetch(BACKEND_URL);
            if (response.status === 200) {
                const data = await response.json();
                let entities = Object.keys(data.data || {});
                entities = entities.map(x => plurarize.singular(x));

                dispatch(registerEntity(entities))
            } else {
               throw new Error(`error fetching register, responded with status ${response.status}`);
            }
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }

        return Promise.resolve();
    };
};