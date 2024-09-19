import { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useTreeApi } from "../context";
import { actions as dnd } from "../state/dnd-slice";
import { safeRun } from "../utils";
import { ROOT_ID } from "../data/create-root";
export function useDragHook(node) {
    const tree = useTreeApi();
    const ids = tree.selectedIds;
    const [_, ref, preview] = useDrag(() => ({
        canDrag: () => node.isDraggable,
        type: "NODE",
        item: () => {
            // This is fired once at the begging of a drag operation
            const dragIds = tree.isSelected(node.id) ? Array.from(ids) : [node.id];
            tree.dispatch(dnd.dragStart(node.id, dragIds));
            return { id: node.id };
        },
        end: () => {
            var _a, _b;
            tree.hideCursor();
            let { parentId, index, dragIds } = tree.state.dnd;
            // If they held down meta, we need to create a copy
            // if (drop.dropEffect === "copy")
            if (tree.canDrop()) {
                safeRun(tree.props.onMove, {
                    dragIds,
                    parentId: parentId === ROOT_ID ? null : parentId,
                    index: index === null ? 0 : index, // When it's null it was dropped over a folder
                    dragNodes: tree.dragNodes,
                    parentNode: tree.get(parentId),
                });
                tree.open(parentId);
            }
            (_b = (_a = tree.list) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.resetAfterIndex(0);
            tree.dispatch(dnd.dragEnd());
        },
    }), [ids, node]);
    useEffect(() => {
        preview(getEmptyImage());
    }, [preview]);
    return ref;
}
