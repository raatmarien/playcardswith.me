import React from 'react';
import './RegisterFormComponent.css';
import './CreateRoomComponent.css';

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
            <form className="register" onSubmit={this.handleSubmit}>
                <label> Fill in the room ID below to join a game room</label>
                <div className="input-wrapper">
                    <input type="text" value={this.state.roomID} onChange={this.handleChange} />
                    <input type="submit" value="Join room" />
                </div>
            </form>
        );
    }
    handleChange(event: any) {
        this.setState({roomID: event.target.value});
    }
    handleSubmit(event: any) {
        event.preventDefault();
        let l = window.location;
        l.href = '/g/?r=' + this.state.roomID; 
        // TODO: go to room {this.state.roomID}   
    }
}


