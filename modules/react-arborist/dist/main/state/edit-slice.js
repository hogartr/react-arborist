"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.edit = void 0;
/* Actions */
function edit(id) {
    return { type: "EDIT", id };
}
exports.edit = edit;
/* Reducer */
function reducer(state = { id: null }, action) {
    if (action.type === "EDIT") {
        return Object.assign(Object.assign({}, state), { id: action.id });
    }
    else {
        return state;
    }
}
exports.reducer = reducer;
