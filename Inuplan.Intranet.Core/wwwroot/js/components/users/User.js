import React from 'react'
import { Link } from 'react-router'

export class User extends React.Component {
    render() {
        var email = "mailto:" + this.props.email;
        var gallery = "/" + this.props.username + "/gallery";
        return (
            <div className="col-lg-3 panel panel-default" style={{ paddingTop: "8px", paddingBottom: "8px" }}>
                <div className="row">
                    <div className="col-lg-6">
                        <strong>Brugernavn</strong>
                    </div>
                    <div className="col-lg-6">
                        {this.props.username}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <strong>Fornavn</strong>
                    </div>
                    <div className="col-lg-6">
                        {this.props.firstName}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <strong>Efternavn</strong>
                    </div>
                    <div className="col-lg-6">
                        {this.props.lastName}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <strong>Email</strong>
                    </div>
                    <div className="col-lg-6">
                        <a href={email}>{this.props.email}</a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <strong>Billeder</strong>
                    </div>
                    <div className="col-lg-6">
                        <Link to={gallery}>Billeder</Link>
                    </div>
                </div>
            </div>
        );
    }
}