import React from "react";
import {Vector} from "cards-library";
import "./PointerComponent.css";
import randomColor from "randomcolor";

type Props = {
    location: Vector,
    id: string,
};

export default class PointerComponent extends React.PureComponent<Props> {
    public render() {
        let style = {
            left: this.props.location.x,
            top: this.props.location.y,
            borderColor: randomColor({
                seed: this.props.id
            }),
        };
        return (
            <div className="pointer" style={style}>
            </div>
        );
    }
}

