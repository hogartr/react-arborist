"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeApi = void 0;
const utils = __importStar(require("../utils"));
const default_cursor_1 = require("../components/default-cursor");
const default_row_1 = require("../components/default-row");
const default_node_1 = require("../components/default-node");
const edit_slice_1 = require("../state/edit-slice");
const focus_slice_1 = require("../state/focus-slice");
const create_root_1 = require("../data/create-root");
const open_slice_1 = require("../state/open-slice");
const selection_slice_1 = require("../state/selection-slice");
const dnd_slice_1 = require("../state/dnd-slice");
const default_drag_preview_1 = require("../components/default-drag-preview");
const default_container_1 = require("../components/default-container");
const create_list_1 = require("../data/create-list");
const create_index_1 = require("../data/create-index");
const { safeRun, identify, identifyNull } = utils;
class TreeApi {
    constructor(store, props, list, listEl) {
        this.store = store;
        this.props = props;
        this.list = list;
        this.listEl = listEl;
        this.visibleStartIndex = 0;
        this.visibleStopIndex = 0;
        this.rowHeight = (index) => {
            if (!this.props.rowHeight) {
                return 24;
            }
            const node = this.at(index);
            if (!node) {
                return 0;
            }
            return typeof this.props.rowHeight === "function"
                ? this.props.rowHeight(node)
                : this.props.rowHeight;
        };
        this.rowTopPosition = (index) => {
            let position = 0;
            for (let i = 0; i < index; i++) {
                position += this.rowHeight(i);
            }
            return position;
        };
        this.redrawList = (afterIndex) => {
            var _a;
            (_a = this.list.current) === null || _a === void 0 ? void 0 : _a.resetAfterIndex(afterIndex !== null && afterIndex !== void 0 ? afterIndex : 0);
        };
        /* Changes here must also be made in update() */
        this.root = (0, create_root_1.createRoot)(this);
        this.visibleNodes = (0, create_list_1.createList)(this);
        this.idToIndex = (0, create_index_1.createIndex)(this.visibleNodes);
    }
    /* Changes here must also be made in constructor() */
    update(props) {
        this.props = props;
        this.root = (0, create_root_1.createRoot)(this);
        this.visibleNodes = (0, create_list_1.createList)(this);
        this.idToIndex = (0, create_index_1.createIndex)(this.visibleNodes);
    }
    /* Store helpers */
    dispatch(action) {
        return this.store.dispatch(action);
    }
    get state() {
        return this.store.getState();
    }
    get openState() {
        return this.state.nodes.open.unfiltered;
    }
    /* Tree Props */
    get width() {
        var _a;
        return (_a = this.props.width) !== null && _a !== void 0 ? _a : 300;
    }
    get height() {
        var _a;
        return (_a = this.props.height) !== null && _a !== void 0 ? _a : 500;
    }
    get indent() {
        var _a;
        return (_a = this.props.indent) !== null && _a !== void 0 ? _a : 24;
    }
    get overscanCount() {
        var _a;
        return (_a = this.props.overscanCount) !== null && _a !== void 0 ? _a : 1;
    }
    get searchTerm() {
        return (this.props.searchTerm || "").trim();
    }
    get matchFn() {
        var _a;
        const match = (_a = this.props.searchMatch) !== null && _a !== void 0 ? _a : ((node, term) => {
            const string = JSON.stringify(Object.values(node.data));
            return string.toLocaleLowerCase().includes(term.toLocaleLowerCase());
        });
        return (node) => match(node, this.searchTerm);
    }
    accessChildren(data) {
        var _a;
        const get = this.props.childrenAccessor || "children";
        return (_a = utils.access(data, get)) !== null && _a !== void 0 ? _a : null;
    }
    accessId(data) {
        const get = this.props.idAccessor || "id";
        const id = utils.access(data, get);
        if (!id)
            throw new Error("Data must contain an 'id' property or props.idAccessor must return a string");
        return id;
    }
    /* Node Access */
    get firstNode() {
        var _a;
        return (_a = this.visibleNodes[0]) !== null && _a !== void 0 ? _a : null;
    }
    get lastNode() {
        var _a;
        return (_a = this.visibleNodes[this.visibleNodes.length - 1]) !== null && _a !== void 0 ? _a : null;
    }
    get focusedNode() {
        var _a;
        return (_a = this.get(this.state.nodes.focus.id)) !== null && _a !== void 0 ? _a : null;
    }
    get mostRecentNode() {
        var _a;
        return (_a = this.get(this.state.nodes.selection.mostRecent)) !== null && _a !== void 0 ? _a : null;
    }
    get nextNode() {
        const index = this.indexOf(this.focusedNode);
        if (index === null)
            return null;
        else
            return this.at(index + 1);
    }
    get prevNode() {
        const index = this.indexOf(this.focusedNode);
        if (index === null)
            return null;
        else
            return this.at(index - 1);
    }
    get(id) {
        if (!id)
            return null;
        if (id in this.idToIndex)
            return this.visibleNodes[this.idToIndex[id]] || null;
        else
            return null;
    }
    at(index) {
        return this.visibleNodes[index] || null;
    }
    nodesBetween(startId, endId) {
        var _a;
        if (startId === null || endId === null)
            return [];
        const index1 = (_a = this.indexOf(startId)) !== null && _a !== void 0 ? _a : 0;
        const index2 = this.indexOf(endId);
        if (index2 === null)
            return [];
        const start = Math.min(index1, index2);
        const end = Math.max(index1, index2);
        return this.visibleNodes.slice(start, end + 1);
    }
    indexOf(id) {
        const key = utils.identifyNull(id);
        if (!key)
            return null;
        return this.idToIndex[key];
    }
    /* Data Operations */
    get editingId() {
        return this.state.nodes.edit.id;
    }
    createInternal() {
        return this.create({ type: "internal" });
    }
    createLeaf() {
        return this.create({ type: "leaf" });
    }
    create(opts = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const parentId = opts.parentId === undefined
                ? utils.getInsertParentId(this)
                : opts.parentId;
            const index = (_a = opts.index) !== null && _a !== void 0 ? _a : utils.getInsertIndex(this);
            const type = (_b = opts.type) !== null && _b !== void 0 ? _b : "leaf";
            const data = yield safeRun(this.props.onCreate, {
                type,
                parentId,
                index,
                parentNode: this.get(parentId),
            });
            if (data) {
                this.focus(data);
                setTimeout(() => {
                    this.edit(data).then(() => {
                        this.select(data);
                        this.activate(data);
                    });
                });
            }
        });
    }
    delete(node) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!node)
                return;
            const idents = Array.isArray(node) ? node : [node];
            const ids = idents.map(identify);
            const nodes = ids.map((id) => this.get(id)).filter((n) => !!n);
            this.redrawList(Math.min(...nodes.map((node) => { var _a; return (_a = node.rowIndex) !== null && _a !== void 0 ? _a : 0; })));
            yield safeRun(this.props.onDelete, { nodes, ids });
        });
    }
    edit(node) {
        var _a;
        const id = identify(node);
        this.resolveEdit({ cancelled: true });
        this.scrollTo(id);
        this.dispatch((0, edit_slice_1.edit)(id));
        this.redrawList((_a = this.get(id)) === null || _a === void 0 ? void 0 : _a.rowIndex);
        return new Promise((resolve) => {
            TreeApi.editPromise = resolve;
        });
    }
    submit(identity, value) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!identity)
                return;
            const id = identify(identity);
            yield safeRun(this.props.onRename, {
                id,
                name: value,
                node: this.get(id),
            });
            this.dispatch((0, edit_slice_1.edit)(null));
            this.resolveEdit({ cancelled: false, value });
            this.redrawList((_a = this.get(id)) === null || _a === void 0 ? void 0 : _a.rowIndex);
            setTimeout(() => this.onFocus()); // Return focus to element;
        });
    }
    reset() {
        this.dispatch((0, edit_slice_1.edit)(null));
        this.resolveEdit({ cancelled: true });
        this.redrawList();
        setTimeout(() => this.onFocus()); // Return focus to element;
    }
    activate(id) {
        const node = this.get(identifyNull(id));
        if (!node)
            return;
        safeRun(this.props.onActivate, node);
    }
    resolveEdit(value) {
        const resolve = TreeApi.editPromise;
        if (resolve)
            resolve(value);
        TreeApi.editPromise = null;
    }
    /* Focus and Selection */
    get selectedIds() {
        return this.state.nodes.selection.ids;
    }
    get selectedNodes() {
        let nodes = [];
        for (let id of Array.from(this.selectedIds)) {
            const node = this.get(id);
            if (node)
                nodes.push(node);
        }
        return nodes;
    }
    focus(node, opts = {}) {
        if (!node)
            return;
        /* Focus is responsible for scrolling, while selection is
         * responsible for focus. If selectionFollowsFocus, then
         * just select it. */
        if (this.props.selectionFollowsFocus) {
            this.select(node);
        }
        else {
            this.dispatch((0, focus_slice_1.focus)(identify(node)));
            if (opts.scroll !== false)
                this.scrollTo(node);
            if (this.focusedNode)
                safeRun(this.props.onFocus, this.focusedNode);
        }
    }
    pageUp() {
        var _a, _b;
        const start = this.visibleStartIndex;
        const stop = this.visibleStopIndex;
        const page = stop - start;
        let index = (_b = (_a = this.focusedNode) === null || _a === void 0 ? void 0 : _a.rowIndex) !== null && _b !== void 0 ? _b : 0;
        if (index > start) {
            index = start;
        }
        else {
            index = Math.max(start - page, 0);
        }
        this.focus(this.at(index));
    }
    pageDown() {
        var _a, _b;
        const start = this.visibleStartIndex;
        const stop = this.visibleStopIndex;
        const page = stop - start;
        let index = (_b = (_a = this.focusedNode) === null || _a === void 0 ? void 0 : _a.rowIndex) !== null && _b !== void 0 ? _b : 0;
        if (index < stop) {
            index = stop;
        }
        else {
            index = Math.min(index + page, this.visibleNodes.length - 1);
        }
        this.focus(this.at(index));
    }
    select(node, opts = {}) {
        if (!node)
            return;
        const changeFocus = opts.focus !== false;
        const id = identify(node);
        if (changeFocus)
            this.dispatch((0, focus_slice_1.focus)(id));
        this.dispatch(selection_slice_1.actions.only(id));
        this.dispatch(selection_slice_1.actions.anchor(id));
        this.dispatch(selection_slice_1.actions.mostRecent(id));
        this.scrollTo(id, opts.align);
        if (this.focusedNode && changeFocus) {
            safeRun(this.props.onFocus, this.focusedNode);
        }
        safeRun(this.props.onSelect, this.selectedNodes);
    }
    deselect(node) {
        if (!node)
            return;
        const id = identify(node);
        this.dispatch(selection_slice_1.actions.remove(id));
    }
    selectMulti(identity) {
        const node = this.get(identifyNull(identity));
        if (!node)
            return;
        this.dispatch((0, focus_slice_1.focus)(node.id));
        this.dispatch(selection_slice_1.actions.add(node.id));
        this.dispatch(selection_slice_1.actions.anchor(node.id));
        this.dispatch(selection_slice_1.actions.mostRecent(node.id));
        this.scrollTo(node);
        if (this.focusedNode)
            safeRun(this.props.onFocus, this.focusedNode);
        safeRun(this.props.onSelect, this.selectedNodes);
    }
    selectContiguous(identity) {
        if (!identity)
            return;
        const id = identify(identity);
        const { anchor, mostRecent } = this.state.nodes.selection;
        this.dispatch((0, focus_slice_1.focus)(id));
        this.dispatch(selection_slice_1.actions.remove(this.nodesBetween(anchor, mostRecent)));
        this.dispatch(selection_slice_1.actions.add(this.nodesBetween(anchor, identifyNull(id))));
        this.dispatch(selection_slice_1.actions.mostRecent(id));
        this.scrollTo(id);
        if (this.focusedNode)
            safeRun(this.props.onFocus, this.focusedNode);
        safeRun(this.props.onSelect, this.selectedNodes);
    }
    deselectAll() {
        this.setSelection({ ids: [], anchor: null, mostRecent: null });
        safeRun(this.props.onSelect, this.selectedNodes);
    }
    selectAll() {
        var _a;
        this.setSelection({
            ids: Object.keys(this.idToIndex),
            anchor: this.firstNode,
            mostRecent: this.lastNode,
        });
        this.dispatch((0, focus_slice_1.focus)((_a = this.lastNode) === null || _a === void 0 ? void 0 : _a.id));
        if (this.focusedNode)
            safeRun(this.props.onFocus, this.focusedNode);
        safeRun(this.props.onSelect, this.selectedNodes);
    }
    setSelection(args) {
        var _a;
        const ids = new Set((_a = args.ids) === null || _a === void 0 ? void 0 : _a.map(identify));
        const anchor = identifyNull(args.anchor);
        const mostRecent = identifyNull(args.mostRecent);
        this.dispatch(selection_slice_1.actions.set({ ids, anchor, mostRecent }));
        safeRun(this.props.onSelect, this.selectedNodes);
    }
    /* Drag and Drop */
    get cursorParentId() {
        const { cursor } = this.state.dnd;
        switch (cursor.type) {
            case "highlight":
                return cursor.id;
            default:
                return null;
        }
    }
    get cursorOverFolder() {
        return this.state.dnd.cursor.type === "highlight";
    }
    get dragNodes() {
        return this.state.dnd.dragIds
            .map((id) => this.get(id))
            .filter((n) => !!n);
    }
    get dragNode() {
        return this.get(this.state.nodes.drag.id);
    }
    get dragDestinationParent() {
        return this.get(this.state.nodes.drag.destinationParentId);
    }
    get dragDestinationIndex() {
        return this.state.nodes.drag.destinationIndex;
    }
    canDrop() {
        var _a;
        if (this.isFiltered)
            return false;
        const parentNode = (_a = this.get(this.state.dnd.parentId)) !== null && _a !== void 0 ? _a : this.root;
        const dragNodes = this.dragNodes;
        const isDisabled = this.props.disableDrop;
        for (const drag of dragNodes) {
            if (!drag)
                return false;
            if (!parentNode)
                return false;
            if (drag.isInternal && utils.isDescendant(parentNode, drag))
                return false;
        }
        // Allow the user to insert their own logic
        if (typeof isDisabled == "function") {
            return !isDisabled({
                parentNode,
                dragNodes: this.dragNodes,
                index: this.state.dnd.index || 0,
            });
        }
        else if (typeof isDisabled == "string") {
            // @ts-ignore
            return !parentNode.data[isDisabled];
        }
        else if (typeof isDisabled === "boolean") {
            return !isDisabled;
        }
        else {
            return true;
        }
    }
    hideCursor() {
        this.dispatch(dnd_slice_1.actions.cursor({ type: "none" }));
    }
    showCursor(cursor) {
        this.dispatch(dnd_slice_1.actions.cursor(cursor));
    }
    /* Visibility */
    open(identity, redraw = true) {
        var _a;
        const id = identifyNull(identity);
        if (!id)
            return;
        if (this.isOpen(id))
            return;
        this.dispatch(open_slice_1.actions.open(id, this.isFiltered));
        redraw && this.redrawList((_a = this.get(id)) === null || _a === void 0 ? void 0 : _a.rowIndex);
        safeRun(this.props.onToggle, id);
    }
    close(identity, redraw = true) {
        var _a;
        const id = identifyNull(identity);
        if (!id)
            return;
        if (!this.isOpen(id))
            return;
        this.dispatch(open_slice_1.actions.close(id, this.isFiltered));
        redraw && this.redrawList((_a = this.get(id)) === null || _a === void 0 ? void 0 : _a.rowIndex);
        safeRun(this.props.onToggle, id);
    }
    toggle(identity) {
        const id = identifyNull(identity);
        if (!id)
            return;
        return this.isOpen(id) ? this.close(id) : this.open(id);
    }
    openParents(identity) {
        const id = identifyNull(identity);
        if (!id)
            return;
        const node = utils.dfs(this.root, id);
        let parent = node === null || node === void 0 ? void 0 : node.parent;
        while (parent) {
            this.open(parent.id, false);
            parent = parent.parent;
        }
        this.redrawList();
    }
    openSiblings(node) {
        const parent = node.parent;
        if (!parent) {
            this.toggle(node.id);
        }
        else if (parent.children) {
            const isOpen = node.isOpen;
            for (let sibling of parent.children) {
                if (sibling.isInternal) {
                    isOpen ? this.close(sibling.id, false) : this.open(sibling.id, false);
                }
            }
            this.redrawList();
            this.scrollTo(this.focusedNode);
        }
    }
    openAll() {
        utils.walk(this.root, (node) => {
            if (node.isInternal)
                this.open(node, false);
        });
        this.redrawList();
    }
    closeAll() {
        utils.walk(this.root, (node) => {
            if (node.isInternal)
                this.close(node, false);
        });
        this.redrawList();
    }
    /* Scrolling */
    scrollTo(identity, align = "smart") {
        if (!identity)
            return;
        const id = identify(identity);
        this.openParents(id);
        return utils
            .waitFor(() => id in this.idToIndex)
            .then(() => {
            var _a;
            const index = this.idToIndex[id];
            if (index === undefined)
                return;
            (_a = this.list.current) === null || _a === void 0 ? void 0 : _a.scrollToItem(index, align);
        })
            .catch(() => {
            // Id: ${id} never appeared in the list.
        });
    }
    /* State Checks */
    get isEditing() {
        return this.state.nodes.edit.id !== null;
    }
    get isFiltered() {
        var _a;
        return !!((_a = this.props.searchTerm) === null || _a === void 0 ? void 0 : _a.trim());
    }
    get hasFocus() {
        return this.state.nodes.focus.treeFocused;
    }
    get hasNoSelection() {
        return this.state.nodes.selection.ids.size === 0;
    }
    get hasOneSelection() {
        return this.state.nodes.selection.ids.size === 1;
    }
    get hasMultipleSelections() {
        return this.state.nodes.selection.ids.size > 1;
    }
    isSelected(id) {
        if (!id)
            return false;
        return this.state.nodes.selection.ids.has(id);
    }
    isOpen(id) {
        var _a, _b, _c;
        if (!id)
            return false;
        if (id === create_root_1.ROOT_ID)
            return true;
        const def = (_a = this.props.openByDefault) !== null && _a !== void 0 ? _a : true;
        if (this.isFiltered) {
            return (_b = this.state.nodes.open.filtered[id]) !== null && _b !== void 0 ? _b : true; // Filtered folders are always opened by default
        }
        else {
            return (_c = this.state.nodes.open.unfiltered[id]) !== null && _c !== void 0 ? _c : def;
        }
    }
    isEditable(data) {
        var _a;
        const check = this.props.disableEdit || (() => false);
        return (_a = !utils.access(data, check)) !== null && _a !== void 0 ? _a : true;
    }
    isDraggable(data) {
        var _a;
        const check = this.props.disableDrag || (() => false);
        return (_a = !utils.access(data, check)) !== null && _a !== void 0 ? _a : true;
    }
    isDragging(node) {
        const id = identifyNull(node);
        if (!id)
            return false;
        return this.state.nodes.drag.id === id;
    }
    isFocused(id) {
        return this.hasFocus && this.state.nodes.focus.id === id;
    }
    isMatch(node) {
        return this.matchFn(node);
    }
    willReceiveDrop(node) {
        const id = identifyNull(node);
        if (!id)
            return false;
        const { destinationParentId, destinationIndex } = this.state.nodes.drag;
        return id === destinationParentId && destinationIndex === null;
    }
    /* Tree Event Handlers */
    onFocus() {
        const node = this.focusedNode || this.firstNode;
        if (node)
            this.dispatch((0, focus_slice_1.focus)(node.id));
    }
    onBlur() {
        this.dispatch((0, focus_slice_1.treeBlur)());
    }
    onItemsRendered(args) {
        this.visibleStartIndex = args.visibleStartIndex;
        this.visibleStopIndex = args.visibleStopIndex;
    }
    /* Get Renderers */
    get renderContainer() {
        return this.props.renderContainer || default_container_1.DefaultContainer;
    }
    get renderRow() {
        return this.props.renderRow || default_row_1.DefaultRow;
    }
    get renderNode() {
        return this.props.children || default_node_1.DefaultNode;
    }
    get renderDragPreview() {
        return this.props.renderDragPreview || default_drag_preview_1.DefaultDragPreview;
    }
    get renderCursor() {
        return this.props.renderCursor || default_cursor_1.DefaultCursor;
    }
}
exports.TreeApi = TreeApi;
