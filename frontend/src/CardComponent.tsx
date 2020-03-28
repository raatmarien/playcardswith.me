import React from 'react';
import ReactDOM from 'react-dom';
import {LocatedCard, Vector} from "cards-library";
import "./CardComponent.css";

type Props = {
    locatedCard: LocatedCard,
    onClick: () => void,
    onDrag: (x: number, y: number) => void,
    onDragRelease: () => void,
};

type State = {
    localLocation: Vector,
}


export default class CardComponent extends React.Component<Props, State> {
    dragging = false;
    clicked = false;
    startDragX = -1;
    startDragY = -1;
    handleX = -1;
    handleY = -1;

    constructor(props: Props) {
        super(props);
        this.state = { localLocation: this.props.locatedCard.location };
    }

    private movedEnough(event : any) {
        let difx = event.pageX - this.startDragX;
        let dify = event.pageY - this.startDragY;
        let distSq = difx * difx + dify * dify;
        return distSq > 100;
    }

    private onMouseDown(event : any) {
        console.log("Mouse down");
        this.clicked = true;
        this.startDragX = event.pageX;
        this.startDragY = event.pageY;
        this.handleX = event.pageX -
            this.state.localLocation.x;
        this.handleY = event.pageY -
            this.state.localLocation.y;
    }

    private onMouseMove(event : any) {
        if (this.clicked) {
            console.log("Mouse move");
            if (!this.dragging && this.movedEnough(event)) {
                this.dragging = true;
            }

            if (this.dragging) {
                let localLocation = new Vector(
                    event.pageX - this.handleX,
                    event.pageY - this.handleY);
                this.props.onDrag(localLocation.x,
                                  localLocation.y);
                this.setState({ localLocation: localLocation });
            }
        }
    }

    private onMouseUp(event : any) {
        if (this.clicked) {
            console.log("Mouse up");
            if (!this.dragging) {
                this.props.onClick();
            } else {
                this.props.onDragRelease();
            }
            this.dragging = false;
            this.clicked = false;
        }
    }

    componentDidMount() {
        // strategy from https://stackoverflow.com/a/36181539
        let component = ReactDOM.findDOMNode(this)!;
        component.addEventListener("mousedown",
                                   this.onMouseDown.bind(this));
        component.addEventListener("mousemove",
                                   this.onMouseMove.bind(this));
        component.addEventListener("mouseup",
                                   this.onMouseUp.bind(this));
    }

    componentWillUnmount() {
        let component = ReactDOM.findDOMNode(this)!;
        component.removeEventListener("mousedown",
                                      this.onMouseDown.bind(this));
        component.removeEventListener("mousemove",
                                      this.onMouseMove.bind(this));
        component.removeEventListener("mouseup",
                                      this.onMouseUp.bind(this));
    }

    static getDerivedStateFromProps(props : Props, state : State) : State {
        return { localLocation: props.locatedCard.location };
    }

    public render() {
        let className = "card ";
        if (this.props.locatedCard.card.open) {
            className += "card-open";
        } else {
            className += "card-closed";
        }

        let loc = this.state.localLocation;
        let styles = {
            left: loc.x,
            top: loc.y,
        }

        return (
            <div className={className} style={styles} >
                {this.props.locatedCard.card.open
                ? this.props.locatedCard.card.name
                : ""}
            </div>
        );
    }
}
