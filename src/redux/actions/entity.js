import plurarize from "pluralize";
import { BACKEND_URL } from "../../constants";
import { updateCurrentDisplayEntity, updateCurrentLinks, updateCurrentPagination, updateLoadingIndicator } from "./meta";
import { ADD_ENTITY_ENTRIES } from "../actionTypes";

function updateOrAddEntityEntries(payload) {
    return {
        type: ADD_ENTITY_ENTRIES,
        payload,
    }
}


export function getList(entityType, page = 1, pageSize = 5) {
    return async dispatch => {
        try {
            const response = await fetch(`${BACKEND_URL}/${plurarize.plural(entityType)}?page[number]=${page}&page[size]=${pageSize}`);
            if (response.status === 200) {
                const resData = await response.json();
                const { meta, links, data, included } = resData;

                links && dispatch(updateCurrentLinks({
                    links: links || {},
                }));

                const { pagination } = meta || {};
                pagination && dispatch(updateCurrentPagination({
                    pagination: pagination || {},
                }));

                data && dispatch(updateOrAddEntityEntries({
                    entityType: entityType,
                    data,
                }));

                included && dispatch(updateOrAddEntityEntries({
                    entityType: entityType,
                    data: included,
                    checkEntityType: true,
                }));

                data && dispatch(updateCurrentDisplayEntity({
                    entityType,
                    entityIds: data.map(x => x.id),
                    many: true,
                }));
            } else {
                throw new Error(`error fetching list`);
            }
        } catch (error) {
            return Promise.reject(error);
        }

        return Promise.resolve();
    }
}

export function getEntity(entityType, entityId, link) {
    return async dispatch => {
        try {
            const response = await fetch(link || `${BACKEND_URL}/${plurarize.plural(entityType)}/${entityId}`);
            if (response.status === 200) {
                const resData = await response.json();
                const { data, included } = resData;

                data && dispatch(updateOrAddEntityEntries({
                    entityType,
                    data: [data],
                }));

                included && dispatch(updateOrAddEntityEntries({
                    entityType,
                    data: included,
                    checkEntityType: true,
                }));

                data && dispatch(updateCurrentDisplayEntity({
                    entityType,
                    entityIds: data.id,
                    many: false,
                }));
            } else {
                throw new Error(response.statusText || `error fetching entity`);
            }
        } catch (error) {
            return Promise.reject(error);
        }

        return Promise.resolve();
    }
}
