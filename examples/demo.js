import { render } from "react-dom";
var React = require("react");
// var PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
var _ = require("lodash");
var WidthProvider = require("../src/index").WidthProvider;
var ResponsiveReactGridLayout = require("../src/index").Responsive;
var ReactGridLayout = require("../src/index");
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
import "./demo.scss";
import 'react-grid-layout/css/styles.css'
/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
class AddRemoveLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [0].map(function(i, key, list) {
                return {
                    i: i.toString(),
                    x: i * 2,
                    y: 0,
                    w: 2,
                    h: 2,
                    add: i === (list.length - 1).toString()
                };
            }),
            newCounter: 0
        };
    }
    //   mixins: [PureRenderMixin],
    static defaultProps = {
        className: "layout",
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
        rowHeight: 100
    };

    getInitialState() {
        return {
            items: [0].map(function(i, key, list) {
                return {
                    i: i.toString(),
                    x: i * 2,
                    y: 0,
                    w: 2,
                    h: 2,
                    add: i === (list.length - 1).toString()
                };
            }),
            newCounter: 0
        };
    }

    createElement=(el)=> {
        var removeStyle = {
            position: "absolute",
            right: "2px",
            top: 0,
            cursor: "pointer"
        };
        var i = el.add ? "+" : el.i;
        return (
            <div key={i} data-grid={el}>
                {el.add ? (
                    <span
                        className="add text"
                        onClick={this.onAddItem}
                        title="You can add an item by clicking here, too."
                    >
                        Add +
                    </span>
                ) : (
                    <span className="text">{i}</span>
                )}
                <span
                    className="remove"
                    style={removeStyle}
                    onClick={this.onRemoveItem.bind(this, i)}
                >
                    x
                </span>
            </div>
        );
    }

    onAddItem(x, y) {
        /*eslint no-console: 0*/
        this.setState({
            // Add a new item. It must have a unique key!
            items: this.state.items.concat({
                i: "n" + this.state.newCounter,
                x: x,
                y: y,
                w: 2,
                h: 2
            }),
            // Increment the counter to ensure key is always unique.
            newCounter: this.state.newCounter + 1
        });
        let self = this;
    }

    // We're using the cols coming back from this to calculate where to add new items.
    onBreakpointChange(breakpoint, cols) {
        this.setState({
            breakpoint: breakpoint,
            cols: cols
        });
    }

    onLayoutChange=(layout) =>{
        this.props.onLayoutChange(layout);
        this.setState({ layout: layout });
    }

    onRemoveItem(i) {
        console.log("removing", i);
        this.setState({ items: _.reject(this.state.items, { i: i }) });
    }
    componentDidMount() {
        let self = this;
        var layoutContainer = document.getElementsByClassName(
            "react-grid-layout layout"
        )[0];
        this.refs.grid.onmousedown = function(e) {
            // self.onAddItem();
            window.onmouseup = function(e) {
                let { clientX, clientY } = e;
                setTimeout(function() {
                    self.refs.ResponsiveReactGridLayout.refs.ComposedComponent.refs.reactGridLayout.addGridOnDropPosition(
                        clientX - 60,
                        clientY - 310,
                        "n" + (self.state.newCounter - 1)
                    );
                }, 0);
                window.onmouseup = null;
                window.onmousemove = null;
                layoutContainer.onmouseenter = null;
            };
            layoutContainer.onmouseenter = function(e) {
                let { clientX, clientY } = e;
                let {
                    x,
                    y
                } = self.refs.ResponsiveReactGridLayout.refs.ComposedComponent.refs.reactGridLayout.calcXY(
                    clientY - 310,
                    clientX - 60,
                    2,
                    2
                );
                self.onAddItem(x, y);
                window.onmousemove = function(e) {
                    let { clientX, clientY } = e;
                    self.refs.ResponsiveReactGridLayout.refs.ComposedComponent.refs.reactGridLayout.showPlaceHolderWhileDrag(
                        clientX - 60,
                        clientY - 310,
                        "n" + (self.state.newCounter - 1)
                    );
                };
            };
        };
    }

    render() {
        return (
            <div>
                <div
                    ref="grid"
                    style={{
                        width: "100px",
                        margin: "20px",
                        cursor: "pointer"
                    }}
                >
                    Add Item
                </div>
                <ResponsiveReactGridLayout
                    ref="ResponsiveReactGridLayout"
                    onLayoutChange={this.onLayoutChange}
                    onBreakpointChange={this.onBreakpointChange}
                    {...this.props}
                >
                    {_.map(this.state.items, this.createElement)}
                </ResponsiveReactGridLayout>
            </div>
        );
    }
}

var demo = function(Layout){
  return class ExampleLayout extends React.Component {

    state = {layout: []};

    onLayoutChange = (layout) => {
      this.setState({layout: layout});
    };

    stringifyLayout() {
      return this.state.layout.map(function(l) {
        return <div className="layoutItem" key={l.i}><b>{l.i}</b>: [{l.x}, {l.y}, {l.w}, {l.h}]</div>;
      });
    }

    render(){
      return (
        <div>
          <div className="layoutJSON">
            Displayed as <code>[x, y, w, h]</code>:
            <div className="columns">
              {this.stringifyLayout()}
            </div>
          </div>
          <Layout ref= 'layout' onLayoutChange={this.onLayoutChange} />
        </div>
      );
    }
  }
};

function start() {
    var Ele = demo(AddRemoveLayout);
    render(<Ele />, document.getElementById("app"));
}

start();

if (module.hot) start();
