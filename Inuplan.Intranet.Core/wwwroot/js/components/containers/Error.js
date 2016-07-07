import React from 'react'

export class Error extends React.Component {
    render() {
        const { clearError, title, message  } = this.props;
        return (
            <div className="row">
                <div className="col-lg-offset-2 col-lg-8">
                    <div className="alert alert-danger" role="alert">
                         <button onClick={clearError} type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                         <strong>{title}</strong>
                         <p>
                            {message}
                         </p>
                    </div>
                </div>
            </div>
        );
    }
}