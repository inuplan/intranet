import * as React from "react";
import { Components } from "../../interfaces/Components";
import { TextToolbar } from "./TextToolbar";
import { formatText } from "../../utilities/utils";

interface CommentFormState {
    SelectionStart?: number,
    SelectionEnd?: number,
    Text?: string;
    Bold?: boolean;
    Italics?: boolean;
    Preview?: string;
}

export class CommentForm extends React.Component<Components.CommentForm, CommentFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            SelectionStart: 0,
            SelectionEnd: 0,
            Text: "",
            Bold: false,
            Italics: false,
            Preview: ""
        };

        this.postComment = this.postComment.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleBoldClick = this.handleBoldClick.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
    }

    postComment(e: React.FormEvent<any>) {
        e.preventDefault();

        const { postHandle } = this.props;
        postHandle(this.state.Text);
        this.setState({
            Text: "",
            Bold: false,
            Italics: false
        });
    }

    handleTextChange(e: any) {
        const text = e.target.value;
        const html = text ? (formatText(text)).__html : "";

        this.setState({
            Text: text,
            Preview: html
        });
    }

    handleSelection(start: number, end: number) {
        this.setState({
            SelectionStart: start,
            SelectionEnd: end
        });
    }

    handleBoldClick() {
        const { SelectionStart, SelectionEnd } = this.state;
        const hasSelection = SelectionStart !== SelectionEnd;
        if (!hasSelection) return;
        else {
            const boldText = this.toggleBold(SelectionStart, SelectionEnd);
            const html = (formatText(boldText)).__html;
            this.setState({
                Text: boldText,
                Preview: html
            });
        }
    }

    toggleBold(start: number, end: number) {
        const { Text } = this.state;
        const beginText = Text.substring(0, start);
        const midText = Text.substring(start, end);
        const endText = Text.substring(end);
        const isBold = midText.startsWith("**") && midText.endsWith("**");

        let result;
        if (isBold) {
            result = midText.substring(2, midText.length - 2);
        } else {
            result = "**" + midText + "**";
        }

        return beginText.concat(result, endText);
    }

    toggleItalics(start: number, end: number) {
        const { Text } = this.state;
        const beginText = Text.substring(0, start);
        const midText = Text.substring(start, end);
        const endText = Text.substring(end);
        const isItalics =   (midText.startsWith("***") && midText.endsWith("***"))
                            || ((midText.startsWith("*") && midText.endsWith("*")) && !(midText.startsWith("**") && midText.endsWith("**")));
        let result;
        if (isItalics) {
            result = midText.substring(1, midText.length - 1);
        } else {
            result = "*" + midText + "*";
        }

        return beginText.concat(result, endText);
    }

    render() {
        const { Preview } = this.state;
        return  <form onSubmit={this.postComment}>
                    <label htmlFor="remark">Kommentar</label>
                    <TextToolbar />
                    <br />
                    {Preview ? <label htmlFor="preview">Eksempel</label> : null}
                    <div dangerouslySetInnerHTML={{__html: Preview}} id="preview" />
                    <button type="submit" className="btn btn-primary">Send</button>
                </form>;
    }
}

                    // <textarea
                    //     className="form-control"
                    //     onChange={this.handleTextChange}
                    //     value={this.state.Text}
                    //     placeholder="Skriv kommentar her..."
                    //     id="remark"
                    //     onSelect={(e) => {
                    //             const t = e.target as any;
                    //             const start = t.selectionStart;
                    //             const end = t.selectionEnd;
                    //             this.handleSelection(start, end);
                    //         }
                    //     }
                    //     onBlur={(_) => {
                    //     }}
                    //     rows={4}>
                    // </textarea>
                    // <TextToolbar
                    //     id="textFont"
                    //     bold={false}
                    //     italics={false}
                    //     h1={false}
                    //     h2={false}
                    //     h3={false}
                    //     normal={true}
                    //     onClickBold={this.handleBoldClick}
                    //     onClickItalics={(e) => { console.log(e.getModifierState("ctrl")); }}
                    //     onClickHeading1={(e) => { console.log(e); }}
                    //     onClickHeading2={(e) => { console.log(e); }}
                    //     onClickHeading3={(e) => { console.log(e); }}
                    //     onClickNormal={(e) => { console.log(e); }}
                    // />