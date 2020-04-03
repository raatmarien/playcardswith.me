import React from 'react';

type State = {
    roomID: string,
}
export default class JoinRoomComponent extends React.Component<{},State> {
    constructor(props : any) {
        super(props);

        this.state = {roomID: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        console.log(this.state.roomID);
        return (
            <form onSubmit={this.handleSubmit} className="join-room">
                <input type="text" value={this.state.roomID}
                       onChange={this.handleChange}
                       placeholder="ABCDE" />
                <input type="submit" value="JOIN ROOM" />
            </form>
        );
    }
    handleChange(event: any) {
        this.setState({roomID: event.target.value});
    }
    handleSubmit(event: any) {
        event.preventDefault();
        let l = window.location.href = '/room/' + this.state.roomID; 
    }
}
