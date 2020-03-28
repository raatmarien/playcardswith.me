import React from "react";
import {Player} from "cards-library";
import PointerComponent from "./PointerComponent";

type Props = {
    players: Player[],
    currentPlayerId: string,
};

export default class PointersComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <div className="pointers">
                {this.props.players
                     .filter((player) => player.id !== this.props.currentPlayerId)
                     .map((player) =>
                        <PointerComponent key={player.id}
                                          location={player.pointer}
                                          id={player.id} />
                )}
            </div>
        );
    }
}
