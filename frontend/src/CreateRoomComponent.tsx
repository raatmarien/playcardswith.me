import React from 'react';
import './RegisterFormComponent.css';
import './CreateRoomComponent.css';

export default class CreateRoomComponent extends React.Component {
    constructor(props: any) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    public render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Click below to create a new game room!</label>
                <input type="submit" value="New room" />
            </form>
        );
    }
    
    handleSubmit(event: any) {
        // TODO: create new room

        // TODO: go to room    
    }
}