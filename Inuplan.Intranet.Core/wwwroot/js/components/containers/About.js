import React from 'react'

export default class About extends React.Component {
    componentDidMount() {
        document.title = "Om";
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-offset-2 col-lg-8">
                    <p>
                        Dette er en single page application!
                        <br />
                        Teknologier brugt:
                    </p>
                    <ul>
                        <li>React</li>
                        <li>Redux</li>
                        <li>ReactRouter</li>
                        <li>Asp.net Core RC 2</li>
                        <li>Asp.net Web API 2</li>
                    </ul>
                </div>
            </div>
        );
    }
}