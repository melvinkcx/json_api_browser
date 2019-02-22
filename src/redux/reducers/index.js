import {combineReducers} from "redux";
import entity from "./entity";
import registry from "./registry";
import meta from "./meta";

export default combineReducers({ 
    entity, 
    registry,
    meta,
});