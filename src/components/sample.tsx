import React from 'react';
import go from 'gojs';
// import './MyDiagram.css';

interface MyDiagramProps {}

class Sample extends React.PureComponent<MyDiagramProps> {
    go: any;

    constructor(props: MyDiagramProps) {
        super(props);
        this.go = go.GraphObject.make;
    }

    componentDidMount() {
        let myDiagram = this.go(
            go.Diagram,
            'myDiagramDiv', // create a Diagram for the DIV HTML element
            {
                'undoManager.isEnabled': true, // enable undo & redo
                'draggingTool.dragsLink': true,
                'linkingTool.isUnconnectedLinkValid': true,
                'linkingTool.portGravity': 20,
                'relinkingTool.isUnconnectedLinkValid': true,
                'relinkingTool.portGravity': 20
            }
        );

        // define a simple Node template
        myDiagram.nodeTemplate = this.go(
            go.Node,
            'Auto', // the Shape will go around the TextBlock
            this.go(
                go.Shape,
                'RoundedRectangle',
                { strokeWidth: 0, fill: 'white' },
                // Shape.fill is bound to Node.data.color
                new go.Binding('fill', 'color')
            ),
            this.go(
                go.TextBlock,
                { margin: 8 }, // some room around the text
                // TextBlock.text is bound to Node.data.key
                new go.Binding('text', 'key')
            )
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

        // create the model data that will be represented by Nodes and Links
        myDiagram.model = new go.GraphLinksModel(
            [
                { key: 'Alpha', color: 'lightblue' },
                { key: 'Beta', color: 'orange' },
                { key: 'Gamma', color: 'lightgreen' },
                { key: 'Delta', color: 'pink' }
            ],
            [
                { from: 'Alpha', to: 'Beta' },
                { from: 'Alpha', to: 'Gamma' },
                { from: 'Beta', to: 'Beta' },
                { from: 'Gamma', to: 'Delta' },
                { from: 'Delta', to: 'Alpha' }
            ]
        );
    }

    render() {
        return (
            <div
                id="myDiagramDiv"
                style={{
                    border: 'solid 1px black',
                    width: '99%',
                    margin: 'auto',
                    height: '500px',
                    alignSelf: 'center'
                }}
            />
        );
    }
}

export default Sample;
