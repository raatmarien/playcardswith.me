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
            <form className="register" onSubmit={this.handleSubmit}>
                <label>Click below to create a new game room!</label>
                <input type="submit" value="New room" />
            </form>
        );
    }
    
    handleSubmit(event: any) {
        event.preventDefault();
        let l = window.location;
        l.href = '/g/?r=new'; 
    }
}
