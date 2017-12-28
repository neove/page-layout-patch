import Responsive from "react-grid-layout/build/ResponsiveReactGridLayout";
import React from "react";
import ReactGridLayout from './ReactGridLayout'
import isEqual from "lodash.isequal";

export default class ResponsivePatch extends Responsive {
    render() {
        // eslint-disable-next-line no-unused-vars
        const {
            breakpoint,
            breakpoints,
            cols,
            layouts,
            onBreakpointChange,
            onLayoutChange,
            onWidthChange,
            ...other
        } = this.props;
        return (
            <ReactGridLayout
                ref="reactGridLayout"
                {...other}
                onLayoutChange={this.onLayoutChange}
                layout={this.state.layout}
                cols={this.state.cols}
            />
        );
    }
}
