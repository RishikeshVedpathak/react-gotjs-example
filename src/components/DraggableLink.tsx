import React from 'react';
import go from 'gojs';
import './MyDiagram.css';

interface MyDiagramProps {}

interface MyDiagramState {
    myDiagram;
}

class DraggableLink extends React.PureComponent<MyDiagramProps, MyDiagramState> {
    go: any;
    myPalette: any;

    constructor(props: MyDiagramProps) {
        super(props);
        this.go = go.GraphObject.make;
        this.state = {
            myDiagram: null
        };
    }

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    makePort = (name, spot, output, input) => {
        // the port is basically just a small transparent square
        return this.go(go.Shape, 'Circle', {
            fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
            stroke: null,
            desiredSize: new go.Size(7, 7),
            alignment: spot, // align the port on the main Shape
            alignmentFocus: spot, // just inside the Shape
            portId: name, // declare this object to be a "port"
            fromSpot: spot,
            toSpot: spot, // declare where links may connect at this port
            fromLinkable: output,
            toLinkable: input, // declare whether the user may draw links to/from here
            cursor: 'pointer' // show a different cursor to indicate potential link point
        });
    };

    showSmallPorts = (node, show) => {
        node.ports.each(function(port) {
            if (port.portId !== '') {
                // don't change the default port, which is the big shape
                port.fill = show ? 'rgba(0,0,0,.3)' : null;
            }
        });
    };

    componentDidMount() {
        let myDiagram = this.go(
            go.Diagram,
            'myDiagramDiv', // create a Diagram for the DIV HTML element
            {
                grid: this.go(
                    go.Panel,
                    'Grid',
                    this.go(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
                    this.go(go.Shape, 'LineH', { stroke: 'gray', strokeWidth: 0.5, interval: 10 }),
                    this.go(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 }),
                    this.go(go.Shape, 'LineV', { stroke: 'gray', strokeWidth: 0.5, interval: 10 })
                ),
                'undoManager.isEnabled': true,
                'relinkingTool.fromHandleArchetype': this.go(go.Shape, 'Diamond', {
                    segmentIndex: 0,
                    cursor: 'pointer',
                    desiredSize: new go.Size(8, 8),
                    fill: 'tomato',
                    stroke: 'darkred'
                }),
                'relinkingTool.toHandleArchetype': this.go(go.Shape, 'Diamond', {
                    segmentIndex: -1,
                    cursor: 'pointer',
                    desiredSize: new go.Size(8, 8),
                    fill: 'darkred',
                    stroke: 'tomato'
                }),
                'linkReshapingTool.handleArchetype': this.go(go.Shape, 'Diamond', {
                    desiredSize: new go.Size(7, 7),
                    fill: 'lightblue',
                    stroke: 'deepskyblue'
                }),
                'rotatingTool.handleAngle': 270,
                'rotatingTool.handleDistance': 30,
                'rotatingTool.snapAngleMultiple': 15,
                'rotatingTool.snapAngleEpsilon': 15
            }
        );

        // when the document is modified, add a "*" to the title and enable the "Save" button
        myDiagram.addDiagramListener('Modified', function(e) {
            var button = document.getElementById('SaveButton') as HTMLButtonElement;
            if (button) {
                button.disabled = !myDiagram.isModified;
            }
            var idx = document.title.indexOf('*');
            if (myDiagram.isModified) {
                if (idx < 0) {
                    document.title += '*';
                }
            } else {
                if (idx >= 0) {
                    document.title = document.title.substr(0, idx);
                }
            }
        });

        const nodeSelectionAdornmentTemplate = this.go(
            go.Adornment,
            'Auto',
            this.go(go.Shape, { fill: null, stroke: 'deepskyblue', strokeWidth: 1.5, strokeDashArray: [4, 2] }),
            this.go(go.Placeholder)
        );

        const nodeResizeAdornmentTemplate = this.go(
            go.Adornment,
            'Spot',
            { locationSpot: go.Spot.Right },
            this.go(go.Placeholder),
            this.go(go.Shape, {
                alignment: go.Spot.TopLeft,
                cursor: 'nw-resize',
                desiredSize: new go.Size(6, 6),
                fill: 'lightblue',
                stroke: 'deepskyblue'
            }),
            this.go(go.Shape, {
                alignment: go.Spot.Top,
                cursor: 'n-resize',
                desiredSize: new go.Size(6, 6),
                fill: 'lightblue',
                stroke: 'deepskyblue'
            }),
            this.go(go.Shape, {
                alignment: go.Spot.TopRight,
                cursor: 'ne-resize',
                desiredSize: new go.Size(6, 6),
                fill: 'lightblue',
                stroke: 'deepskyblue'
            }),

            this.go(go.Shape, {
                alignment: go.Spot.Left,
                cursor: 'w-resize',
                desiredSize: new go.Size(6, 6),
                fill: 'lightblue',
                stroke: 'deepskyblue'
            }),
            this.go(go.Shape, {
                alignment: go.Spot.Right,
                cursor: 'e-resize',
                desiredSize: new go.Size(6, 6),
                fill: 'lightblue',
                stroke: 'deepskyblue'
            }),

            this.go(go.Shape, {
                alignment: go.Spot.BottomLeft,
                cursor: 'se-resize',
                desiredSize: new go.Size(6, 6),
                fill: 'lightblue',
                stroke: 'deepskyblue'
            }),
            this.go(go.Shape, {
                alignment: go.Spot.Bottom,
                cursor: 's-resize',
                desiredSize: new go.Size(6, 6),
                fill: 'lightblue',
                stroke: 'deepskyblue'
            }),
            this.go(go.Shape, {
                alignment: go.Spot.BottomRight,
                cursor: 'sw-resize',
                desiredSize: new go.Size(6, 6),
                fill: 'lightblue',
                stroke: 'deepskyblue'
            })
        );

        const nodeRotateAdornmentTemplate = this.go(
            go.Adornment,
            { locationSpot: go.Spot.Center, locationObjectName: 'CIRCLE' },
            this.go(go.Shape, 'Circle', {
                name: 'CIRCLE',
                cursor: 'pointer',
                desiredSize: new go.Size(7, 7),
                fill: 'lightblue',
                stroke: 'deepskyblue'
            }),
            this.go(go.Shape, {
                geometryString: 'M3.5 7 L3.5 30',
                isGeometryPositioned: true,
                stroke: 'deepskyblue',
                strokeWidth: 1.5,
                strokeDashArray: [4, 2]
            })
        );

        // define a simple Node template
        myDiagram.nodeTemplate = this.go(
            go.Node,
            'Spot',
            { locationSpot: go.Spot.Center },
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
            { resizable: true, resizeObjectName: 'PANEL', resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
            { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
            new go.Binding('angle').makeTwoWay(),
            // the main object is a Panel that surrounds a TextBlock with a Shape
            this.go(
                go.Panel,
                'Auto',
                { name: 'PANEL' },
                new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
                this.go(
                    go.Shape,
                    'Rectangle', // default figure
                    {
                        portId: '', // the default port: if no spot on link data, use closest side
                        fromLinkable: true,
                        toLinkable: true,
                        cursor: 'pointer',
                        fill: 'white', // default color
                        strokeWidth: 2
                    },
                    new go.Binding('figure'),
                    new go.Binding('fill')
                ),
                this.go(
                    go.TextBlock,
                    {
                        font: 'bold 11pt Helvetica, Arial, sans-serif',
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding('text').makeTwoWay()
                )
            ),
            // four small named ports, one on each side:
            this.makePort('T', go.Spot.Top, false, true),
            this.makePort('L', go.Spot.Left, true, true),
            this.makePort('R', go.Spot.Right, true, true),
            this.makePort('B', go.Spot.Bottom, true, false),
            {
                // handle mouse enter/leave events to show/hide the ports
                mouseEnter: (e, node) => {
                    this.showSmallPorts(node, true);
                },
                mouseLeave: (e, node) => {
                    this.showSmallPorts(node, false);
                }
            }
        );

        let linkSelectionAdornmentTemplate = this.go(
            go.Adornment,
            'Link',
            this.go(
                go.Shape,
                // isPanelMain declares that this Shape shares the Link.geometry
                { isPanelMain: true, fill: null, stroke: 'deepskyblue', strokeWidth: 0 }
            ) // use selection object's strokeWidth
        );

        myDiagram.linkTemplate = this.go(
            go.Link, // the whole link panel
            { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
            { relinkableFrom: true, relinkableTo: true, reshapable: true },
            {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 5,
                toShortLength: 4
            },
            new go.Binding('points').makeTwoWay(),
            this.go(
                go.Shape, // the link path shape
                { isPanelMain: true, strokeWidth: 2 }
            ),
            this.go(
                go.Shape, // the arrowhead
                { toArrow: 'Standard', stroke: null }
            ),
            this.go(
                go.Panel,
                'Auto',
                new go.Binding('visible', 'isSelected').ofObject(),
                this.go(
                    go.Shape,
                    'RoundedRectangle', // the link shape
                    { fill: '#F8F8F8', stroke: null }
                ),
                this.go(
                    go.TextBlock,
                    {
                        textAlign: 'center',
                        font: '10pt helvetica, arial, sans-serif',
                        stroke: '#919191',
                        margin: 2,
                        minSize: new go.Size(10, NaN),
                        editable: true
                    },
                    new go.Binding('text').makeTwoWay()
                )
            )
        );

        this.setState(
            {
                myDiagram: myDiagram
            },
            () => {
                this.initializePallete();
            }
        );
    }

    initializePallete = () => {
        // initialize the Palette that is on the left side of the page
        this.myPalette = this.go(
            go.Palette,
            'myPaletteDiv', // must name or refer to the DIV HTML element
            {
                maxSelectionCount: 1,
                nodeTemplateMap: this.state.myDiagram.nodeTemplateMap, // share the templates used by myDiagram
                // simplify the link template, just in this Palette
                linkTemplate: this.go(
                    go.Link,
                    {
                        // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
                        // to line up the Link in the same manner we have to pretend the Link has the same location spot
                        locationSpot: go.Spot.Center,
                        selectionAdornmentTemplate: this.go(
                            go.Adornment,
                            'Link',
                            { locationSpot: go.Spot.Center },
                            this.go(go.Shape, { isPanelMain: true, fill: null, stroke: 'deepskyblue', strokeWidth: 0 }),
                            this.go(
                                go.Shape, // the arrowhead
                                { toArrow: 'Standard', stroke: null }
                            )
                        )
                    },
                    {
                        routing: go.Link.AvoidsNodes,
                        curve: go.Link.JumpOver,
                        corner: 5,
                        toShortLength: 4
                    },
                    new go.Binding('points'),
                    this.go(
                        go.Shape, // the link path shape
                        { isPanelMain: true, strokeWidth: 2 }
                    ),
                    this.go(
                        go.Shape, // the arrowhead
                        { toArrow: 'Standard', stroke: null }
                    )
                ),
                model: new go.GraphLinksModel(
                    [
                        // specify the contents of the Palette
                        { text: 'Start', figure: 'Circle', fill: '#00AD5F' },
                        { text: 'Step' },
                        { text: 'DB', figure: 'Database', fill: 'lightgray' },
                        { text: '???', figure: 'Diamond', fill: 'lightskyblue' },
                        { text: 'End', figure: 'Circle', fill: '#CE0620' },
                        { text: 'Comment', figure: 'RoundedRectangle', fill: 'lightyellow' }
                    ],
                    [
                        // the Palette also has a disconnected Link, which the user can drag-and-drop
                        {
                            points: new go.List(/*go.Point*/).addAll([
                                new go.Point(0, 0),
                                new go.Point(30, 0),
                                new go.Point(30, 40),
                                new go.Point(60, 40)
                            ])
                        }
                    ]
                )
            }
        );
    };

    // Show the diagram's model in JSON format that the user may edit
    save = () => {
        this.state.myDiagram.makeImage({ scale: 1.5 });
        this.saveDiagramProperties(); // do this first, before writing to JSON
        const { myDiagram } = this.state;
        localStorage.setItem('savedJSON', JSON.stringify(myDiagram.model.toJson()));
        myDiagram.isModified = false;
        this.setState({
            myDiagram: myDiagram
        });
    };

    undo = () => {
        this.state.myDiagram.commandHandler.undo();
    };

    redo = () => {
        this.state.myDiagram.commandHandler.redo();
    };

    clear = () => {
        this.state.myDiagram.clear();
    };

    saveDiagramProperties() {
        const { myDiagram } = this.state;
        myDiagram.model.modelData.position = go.Point.stringify(this.state.myDiagram.position);
        this.setState({ myDiagram: myDiagram });
    }

    load = () => {
        // const initJSON = {
        //   "class": "GraphLinksModel",
        //   "linkFromPortIdProperty": "fromPort",
        //   "linkToPortIdProperty": "toPort",
        //   "modelData": { "position": "-390.5 -291.9012470688931" },
        //   "nodeDataArray": [
        //     { "text": "Start", "figure": "Circle", "fill": "#00AD5F", "key": -1, "loc": "40 -243.4012470688931", "size": "73.80249413778616 87" },
        //     { "text": "Step", "key": -2, "loc": "50 -140" },
        //     { "text": "DB", "figure": "Database", "fill": "lightgray", "key": -3, "loc": "40 -30" }
        //   ],
        //   "linkDataArray": [
        //     { "from": -1, "to": -2, "fromPort": "", "toPort": "", "points": [40, -213.09875293110696, 40, -203.09875293110696, 40, -204, 40, -204, 40, -188, 50, -188, 50, -166.9377243041992, 50, -156.9377243041992] },
        //     { "from": -2, "to": -3, "fromPort": "B", "toPort": "T", "points": [50, -123.06227569580076, 50, -113.06227569580076, 50, -92.9688621520996, 40, -92.9688621520996, 40, -72.87544860839844, 40, -62.875448608398436] }
        //   ]
        // };
        const initJSON = JSON.parse(localStorage.getItem('savedJSON'));
        let { myDiagram } = this.state;
        myDiagram.model = go.Model.fromJson(initJSON);
        this.setState({
            myDiagram: myDiagram
        });
        this.loadDiagramProperties(); // do this after the Model.modelData has been brought into memory
    };

    loadDiagramProperties = () => {
        // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
        let { position: pos } = this.state.myDiagram.model.modelData;
        if (pos) {
            this.state.myDiagram.initialPosition = go.Point.parse(pos);
        }
    };

    render() {
        return (
            <div style={{ flex: 1, display: 'flex', flexFlow: 'row' }}>
                <div
                    id="myPaletteDiv"
                    style={{ flex: 1, marginRight: '2px', backgroundColor: 'whitesmoke', border: 'solid 1px black' }}
                />
                <div style={{ flex: 4, display: 'flex', flexFlow: 'column', border: 'solid 4px black' }}>
                    <div
                        id="myDiagramDiv"
                        style={{ flex: 1, display: 'flex', flexFlow: 'column', border: 'solid 1px black' }}
                    />
                    <div>
                        <button onClick={this.load} style={{ width: '100px', margin: '10px', cursor: 'pointer' }}>
                            Load
                        </button>
                        <button
                            id="SaveButton"
                            onClick={this.save}
                            style={{ width: '100px', margin: '10px', cursor: 'pointer' }}
                        >
                            Save
                        </button>
                        <button onClick={this.undo} style={{ width: '100px', margin: '10px', cursor: 'pointer' }}>
                            Undo
                        </button>
                        <button onClick={this.redo} style={{ width: '100px', margin: '10px', cursor: 'pointer' }}>
                            Redo
                        </button>
                        <button onClick={this.clear} style={{ width: '100px', margin: '10px', cursor: 'pointer' }}>
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DraggableLink;
