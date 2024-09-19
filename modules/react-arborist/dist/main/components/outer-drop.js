"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OuterDrop = void 0;
const outer_drop_hook_1 = require("../dnd/outer-drop-hook");
function OuterDrop(props) {
    (0, outer_drop_hook_1.useOuterDrop)();
    return props.children;
}
exports.OuterDrop = OuterDrop;
