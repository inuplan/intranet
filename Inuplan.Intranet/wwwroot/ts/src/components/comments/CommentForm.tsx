import * as React from 'react'
import { Components } from '../../interfaces/Components'

interface commentFormState {
    Text: string
}

export class CommentForm extends React.Component<Components.commentForm, commentFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            Text: ''
        };

        this.postComment = this.postComment.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    postComment(e: React.FormEvent<any>) {
        e.preventDefault();

        const { postHandle } = this.props;
        postHandle(this.state.Text);
        this.setState({ Text: '' });
    }

    handleTextChange(e: any) {
        this.setState({ Text: e.target.value })
    }

    render() {
        return  <form onSubmit={this.postComment}>
                    <label htmlFor="remark">Kommentar</label>
                    <textarea className="form-control" onChange={this.handleTextChange} value={this.state.Text} placeholder="Skriv kommentar her..." id="remark" rows={4}></textarea>
                    <br />
                    <button type="submit" className="btn btn-primary">Send</button>
                </form>
    }
}