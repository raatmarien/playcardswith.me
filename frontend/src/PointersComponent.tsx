import React from "react";
import {Player} from "cards-library";
import PointerComponent from "./PointerComponent";

type Props = {
    players: Player[],
};

export default class PointersComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <div className="pointers">
                {this.props.players.map((player) =>
                    <PointerComponent key={player.id}
                                      location={player.pointer}
                                      id={player.id} />
                )}
            </div>
        );
    }
}
