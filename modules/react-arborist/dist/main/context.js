"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDataUpdates = exports.DataUpdatesContext = exports.useDndContext = exports.DndContext = exports.useNodesContext = exports.NodesContext = exports.useTreeApi = exports.TreeApiContext = void 0;
const react_1 = require("react");
exports.TreeApiContext = (0, react_1.createContext)(null);
function useTreeApi() {
    const value = (0, react_1.useContext)(exports.TreeApiContext);
    if (value === null)
        throw new Error("No Tree Api Provided");
    return value;
}
exports.useTreeApi = useTreeApi;
exports.NodesContext = (0, react_1.createContext)(null);
function useNodesContext() {
    const value = (0, react_1.useContext)(exports.NodesContext);
    if (value === null)
        throw new Error("Provide a NodesContext");
    return value;
}
exports.useNodesContext = useNodesContext;
exports.DndContext = (0, react_1.createContext)(null);
function useDndContext() {
    const value = (0, react_1.useContext)(exports.DndContext);
    if (value === null)
        throw new Error("Provide a DnDContext");
    return value;
}
exports.useDndContext = useDndContext;
exports.DataUpdatesContext = (0, react_1.createContext)(0);
function useDataUpdates() {
    (0, react_1.useContext)(exports.DataUpdatesContext);
}
exports.useDataUpdates = useDataUpdates;
