import React from 'react'

export class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Text: ''
        };

        this.postComment = this.postComment.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    postComment(e) {
        e.preventDefault();

        const { postHandle } = this.props;
        postHandle(this.state.Text);
        this.setState({ Text: '' });
    }

    handleTextChange(e) {
        this.setState({ Text: e.target.value })
    }

    render() {
        return  <form onSubmit={this.postComment}>
                    <label htmlFor="remark">Kommentar</label>
                    <textarea className="form-control" onChange={this.handleTextChange} value={this.state.Text} placeholder="Skriv kommentar her..." id="remark" rows="4"></textarea>
                    <br />
                    <button type="submit" className="btn btn-primary">Send</button>
                </form>
    }
}

CommentForm.propTypes = {
    postHandle: React.PropTypes.func.isRequired
}
