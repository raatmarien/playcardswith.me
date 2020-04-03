import React from 'react';

export default class CreateRoomComponent extends React.Component {
    constructor(props: any) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    public render() {
        return (
            <form onSubmit={this.handleSubmit} className="create-room">
                <input type="submit" value="NEW ROOM" />
            </form>
        );
    }

    handleSubmit(event: any) {
        event.preventDefault();
        window.location.href = "/room/new";
    }
}
