import React from "react";
import ReactGridLayout from "react-grid-layout";
import { utils } from "react-grid-layout";
import GridItem from "react-grid-layout/build/GridItem";
import isEqual from "lodash.isequal";
let {
    getLayoutItem,
    childrenEqual,
    synchronizeLayoutWithChildren,
    moveElement,
    compact
} = utils;
export default class PatchReactGridLayout extends ReactGridLayout {
    componentWillReceiveProps(nextProps) {
        let newLayoutBase;
        // Allow parent to set layout directly.
        if (!isEqual(nextProps.layout, this.props.layout)) {
            newLayoutBase = nextProps.layout;
        } else if (!childrenEqual(this.props.children, nextProps.children)) {
            // If children change, also regenerate the layout. Use our state
            // as the base in case because it may be more up to date than
            // what is in props.
            newLayoutBase = this.state.layout;
        }
        //如果有占位组件的话
        let placeHolderCompoentIndex = nextProps.layout.findIndex(
            item => item.isPlaceHolder
        );
        // We need to regenerate the layout.
        if (newLayoutBase) {
            let newLayout = synchronizeLayoutWithChildren(
                newLayoutBase,
                nextProps.children,
                nextProps.cols,
                this.compactType(nextProps)
            );
            const oldLayout = this.state.layout;
            if (placeHolderCompoentIndex !== -1) {
                let placeHolderCom = nextProps.layout[placeHolderCompoentIndex];
                let { x, y, i } = placeHolderCom;
                let newPlaceHolderCom = newLayout.find(item => item.i === i);
                newLayout = moveElement(
                    newLayout,
                    newPlaceHolderCom,
                    x,
                    y,
                    true /* isUserAction */
                );
                newLayout = compact(newLayout, this.compactType(nextProps));
            }
            this.setState({ layout: newLayout });
            this.onLayoutMaybeChanged(newLayout, oldLayout);
        }
    }
    showPlaceHolderWhileDrag(pixelX, pixelY, i) {
        let { x, y } = this.refs.gridItem.calcXY(pixelY, pixelX);
        //  const {oldDragItem} = this.state;
        let { layout } = this.state;
        var l = getLayoutItem(layout, i);
        // console.log(layout);
        if (!l) return;
        // Create placeholder (display only)
        // var placeholder = {
        //   w: l.w, h: l.h, x: l.x, y: l.y, placeholder: true, i: i
        // };
        // Move the element to the dragged location.
        layout = moveElement(layout, l, x, y, true /* isUserAction */);
        // this.props.onDrag(layout, oldDragItem, l, placeholder, e, node);
        const newLayout = compact(layout, this.compactType());
        this.setState({
            layout: newLayout,
            activeDrag: null
        });
        return newLayout;
    }
    addGridOnDropPosition(pixelX, pixelY, i) {
        let { x, y } = this.refs.gridItem.calcXY(pixelY, pixelX);
        let { layout } = this.state;
        const l = getLayoutItem(layout, i);
        if (!l) return;

        // Move the element here
        layout = moveElement(layout, l, x, y, true /* isUserAction */);

        // Set state
        const newLayout = compact(layout, this.props.verticalCompact);
        const { oldLayout } = this.state;
        this.setState({
            activeDrag: null,
            layout: newLayout,
            oldDragItem: null,
            oldLayout: null
        });
        this.onLayoutMaybeChanged(newLayout, oldLayout);
    }
    calcXY(top, left, w, h) {
        const { margin, cols, rowHeight, maxRows } = this.props;
        const colWidth = this.calcColWidth();

        // left = colWidth * x + margin * (x + 1)
        // l = cx + m(x+1)
        // l = cx + mx + m
        // l - m = cx + mx
        // l - m = x(c + m)
        // (l - m) / (c + m) = x
        // x = (left - margin) / (coldWidth + margin)
        let x = Math.round((left - margin[0]) / (colWidth + margin[0]));
        let y = Math.round((top - margin[1]) / (rowHeight + margin[1]));

        // Capping
        x = Math.max(Math.min(x, cols - w), 0);
        y = Math.max(Math.min(y, maxRows - h), 0);
        return { x, y };
    }
    calcColWidth() {
        const { margin, width, cols } = this.props;
        const containerPadding =
            this.props.containerPadding || this.props.margin;
        return (
            (width - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols
        );
    }
    processGridItem(child) {
        if (!child.key) return;
        const l = getLayoutItem(this.state.layout, child.key);
        if (!l) return null;
        const {
            width,
            cols,
            margin,
            containerPadding,
            rowHeight,
            maxRows,
            isDraggable,
            isResizable,
            useCSSTransforms,
            draggableCancel,
            draggableHandle
        } = this.props;
        const { mounted } = this.state;

        // Parse 'static'. Any properties defined directly on the grid item will take precedence.
        const draggable = Boolean(
            !l.static && isDraggable && (l.isDraggable || l.isDraggable == null)
        );
        const resizable = Boolean(
            !l.static && isResizable && (l.isResizable || l.isResizable == null)
        );
        return (
            <GridItem
                ref={"gridItem"}
                containerWidth={width}
                cols={cols}
                margin={margin}
                containerPadding={containerPadding || margin}
                maxRows={maxRows}
                rowHeight={rowHeight}
                cancel={draggableCancel}
                handle={draggableHandle}
                onDragStop={this.onDragStop}
                onDragStart={this.onDragStart}
                onDrag={this.onDrag}
                onResizeStart={this.onResizeStart}
                onResize={this.onResize}
                onResizeStop={this.onResizeStop}
                isDraggable={draggable}
                isResizable={resizable}
                useCSSTransforms={useCSSTransforms && mounted}
                usePercentages={!mounted}
                w={l.w}
                h={l.h}
                x={l.x}
                y={l.y}
                i={l.i}
                minH={l.minH}
                minW={l.minW}
                maxH={l.maxH}
                maxW={l.maxW}
                static={l.static}
            >
                {child}
            </GridItem>
        );
    }
    render() {
        return super.render();
    }
}
