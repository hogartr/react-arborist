"use strict";
/* Types */
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.treeBlur = exports.focus = void 0;
/* Actions */
function focus(id) {
    return { type: "FOCUS", id };
}
exports.focus = focus;
function treeBlur() {
    return { type: "TREE_BLUR" };
}
exports.treeBlur = treeBlur;
/* Reducer */
function reducer(state = { id: null, treeFocused: false }, action) {
    if (action.type === "FOCUS") {
        return Object.assign(Object.assign({}, state), { id: action.id, treeFocused: true });
    }
    else if (action.type === "TREE_BLUR") {
        return Object.assign(Object.assign({}, state), { treeFocused: false });
    }
    else {
        return state;
    }
}
exports.reducer = reducer;
