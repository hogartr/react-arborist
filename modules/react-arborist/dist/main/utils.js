"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsertParentId = exports.getInsertIndex = exports.waitFor = exports.safeRun = exports.mergeRefs = exports.identify = exports.identifyNull = exports.access = exports.focusPrevElement = exports.focusNextElement = exports.walk = exports.dfs = exports.noop = exports.indexOf = exports.isDescendant = exports.isOpenWithEmptyChildren = exports.isClosed = exports.isItem = exports.bound = void 0;
function bound(n, min, max) {
    return Math.max(Math.min(n, max), min);
}
exports.bound = bound;
function isItem(node) {
    return node && node.isLeaf;
}
exports.isItem = isItem;
function isClosed(node) {
    return node && node.isInternal && !node.isOpen;
}
exports.isClosed = isClosed;
function isOpenWithEmptyChildren(node) {
    var _a;
    return node && node.isOpen && !((_a = node.children) === null || _a === void 0 ? void 0 : _a.length);
}
exports.isOpenWithEmptyChildren = isOpenWithEmptyChildren;
/**
 * Is first param a descendant of the second param
 */
const isDescendant = (a, b) => {
    let n = a;
    while (n) {
        if (n.id === b.id)
            return true;
        n = n.parent;
    }
    return false;
};
exports.isDescendant = isDescendant;
const indexOf = (node) => {
    if (!node.parent)
        throw Error("Node does not have a parent");
    return node.parent.children.findIndex((c) => c.id === node.id);
};
exports.indexOf = indexOf;
function noop() { }
exports.noop = noop;
function dfs(node, id) {
    if (!node)
        return null;
    if (node.id === id)
        return node;
    if (node.children) {
        for (let child of node.children) {
            const result = dfs(child, id);
            if (result)
                return result;
        }
    }
    return null;
}
exports.dfs = dfs;
function walk(node, fn) {
    fn(node);
    if (node.children) {
        for (let child of node.children) {
            walk(child, fn);
        }
    }
}
exports.walk = walk;
function focusNextElement(target) {
    const elements = getFocusable(target);
    let next;
    for (let i = 0; i < elements.length; ++i) {
        const item = elements[i];
        if (item === target) {
            next = nextItem(elements, i);
            break;
        }
    }
    // @ts-ignore ??
    next === null || next === void 0 ? void 0 : next.focus();
}
exports.focusNextElement = focusNextElement;
function focusPrevElement(target) {
    const elements = getFocusable(target);
    let next;
    for (let i = 0; i < elements.length; ++i) {
        const item = elements[i];
        if (item === target) {
            next = prevItem(elements, i);
            break;
        }
    }
    // @ts-ignore
    next === null || next === void 0 ? void 0 : next.focus();
}
exports.focusPrevElement = focusPrevElement;
function nextItem(list, index) {
    if (index + 1 < list.length) {
        return list[index + 1];
    }
    else {
        return list[0];
    }
}
function prevItem(list, index) {
    if (index - 1 >= 0) {
        return list[index - 1];
    }
    else {
        return list[list.length - 1];
    }
}
function getFocusable(target) {
    return Array.from(document.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)')).filter((e) => e === target || !target.contains(e));
}
function access(obj, accessor) {
    if (typeof accessor === "boolean")
        return accessor;
    if (typeof accessor === "string")
        return obj[accessor];
    return accessor(obj);
}
exports.access = access;
function identifyNull(obj) {
    if (obj === null)
        return null;
    else
        return identify(obj);
}
exports.identifyNull = identifyNull;
function identify(obj) {
    return typeof obj === "string" ? obj : obj.id;
}
exports.identify = identify;
function mergeRefs(...refs) {
    return (instance) => {
        refs.forEach((ref) => {
            if (typeof ref === "function") {
                ref(instance);
            }
            else if (ref != null) {
                ref.current = instance;
            }
        });
    };
}
exports.mergeRefs = mergeRefs;
function safeRun(fn, ...args) {
    if (fn)
        return fn(...args);
}
exports.safeRun = safeRun;
function waitFor(fn) {
    return new Promise((resolve, reject) => {
        let tries = 0;
        function check() {
            tries += 1;
            if (tries === 100)
                reject();
            if (fn())
                resolve();
            else
                setTimeout(check, 10);
        }
        check();
    });
}
exports.waitFor = waitFor;
function getInsertIndex(tree) {
    var _a, _b;
    const focus = tree.focusedNode;
    if (!focus)
        return (_b = (_a = tree.root.children) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    if (focus.isOpen)
        return 0;
    if (focus.parent)
        return focus.childIndex + 1;
    return 0;
}
exports.getInsertIndex = getInsertIndex;
function getInsertParentId(tree) {
    const focus = tree.focusedNode;
    if (!focus)
        return null;
    if (focus.isOpen)
        return focus.id;
    if (focus.parent && !focus.parent.isRoot)
        return focus.parent.id;
    return null;
}
exports.getInsertParentId = getInsertParentId;
