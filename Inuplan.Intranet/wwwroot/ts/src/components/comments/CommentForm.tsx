import * as React from "react";
import { Components } from "../../interfaces/Components";
import { TextEditor } from "../texteditor/TextEditor";

export class CommentForm extends React.Component<Components.CommentForm, null> {
    constructor(props: any) {
        super(props);

        this.postComment = this.postComment.bind(this);
    }

    postComment(e: React.FormEvent<any>) {
        e.preventDefault();

        const { postHandle } = this.props;
        const editor = this.refs.editor as TextEditor;
        const text = editor.getText();
        postHandle(text);

        // Clear textarea
        editor.setText("");
    }

    render() {
        return  <form onSubmit={this.postComment}>
                    <label htmlFor="remark">Kommentar</label>
                    <TextEditor
                        placeholder="Skriv tekst"
                        markdown=""
                        ref="editor"
                    />
                    <button type="submit" className="btn btn-primary">Send</button>
                </form>;
    }
}