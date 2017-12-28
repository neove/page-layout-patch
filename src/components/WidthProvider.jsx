import WidthProvider from "react-grid-layout/build/components/WidthProvider";
import React from 'react';
export default ComposedComponent => {
    let BaseComp = WidthProvider(ComposedComponent);
    return class WidthProviderPatch extends BaseComp {
        render() {
            if (this.props.measureBeforeMount && !this.mounted) {
                return (
                    <div
                        className={this.props.className}
                        style={this.props.style}
                    />
                );
            }

            return (
                <ComposedComponent
                    ref="ComposedComponent"
                    {...this.props}
                    {...this.state}
                />
            );
        }
    };
};
