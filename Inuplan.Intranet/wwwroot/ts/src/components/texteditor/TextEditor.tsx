import * as React from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import TextStyles, { Style } from "../../constants/TextStyles";
import { ToolbarBlock } from "./ToolbarBlock";
import { stateFromMarkdown } from "draft-js-import-markdown";
import { stateToMarkdown } from "draft-js-export-markdown";

require("draft-js/dist/Draft.css");

interface TextEditorProps {
    placeholder: string;
    onSubmit: (markdown: string) => void;
    markdown: string;
}

interface TextEditorState {
    hasFocus: boolean;
    editorState: EditorState;
}

export class TextEditor extends React.Component<TextEditorProps, TextEditorState> {
    constructor(props: TextEditorProps) {
        super(props);

        const editorState = Boolean(props.markdown) ? EditorState.createWithContent(stateFromMarkdown(props.markdown)) : EditorState.createEmpty();
        this.state = {
            hasFocus: false,
            editorState: editorState
        };

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleFocus = this.handleFocus.bind(this);

        this.onStyleClick = this.onStyleClick.bind(this);
    }

    onSubmit(e: React.MouseEvent<any>) {
        e.preventDefault();
        const { onSubmit } = this.props;
        const { editorState } = this.state;
        const markdown = stateToMarkdown(editorState.getCurrentContent());
        onSubmit(markdown);
        this.setState({ editorState: EditorState.createEmpty() });
    }

    onChange(editorState: EditorState) {
        this.setState({ editorState });
    }

    onFocus(_: React.SyntheticEvent<{}>) {
        this.setState({ hasFocus: true });
    }

    onBlur(_: React.SyntheticEvent<{}>) {
        this.setState({ hasFocus: false });
    }

    onStyleClick(styleType: TextStyles, style: Style) {
        const { editorState } = this.state;
        let changeState: EditorState;
        switch (styleType) {
            case TextStyles.Block: {
                changeState = RichUtils.toggleBlockType(editorState, style);
                break;
            }
            case TextStyles.Inline: {
                changeState = RichUtils.toggleInlineStyle(editorState, style);
                break;
            }
            default: {
                changeState = editorState;
                break;
            }
        }

        this.onChange(changeState);
    }

    handleFocus(_: React.MouseEvent<any>) {
        const { hasFocus } = this.state;

        if (!hasFocus) {
            const editor = this.refs.editor as Editor;
            editor.focus();
        }
    }

    render() {
        const { placeholder } = this.props;
        const { hasFocus, editorState } = this.state;
        const currentBlockType: any = RichUtils.getCurrentBlockType(editorState);
        const currentInlineType = editorState.getCurrentInlineStyle();
        const css = hasFocus ? "richEditor-root textEditor-focus" : "richEditor-root";
        const styleMap = {
            "CODE": {
                padding: "2px 4px",
                fontSize: "90%",
                color: "#c7254e",
                backgroundColor: "#f9f2f4",
                borderRadius: "4px"
            }
        };
        return  <div>
                    <div className={css}>
                        <ToolbarBlock
                            onStyleClick={this.onStyleClick}
                            currentBlockType={currentBlockType}
                            currentInlineType={currentInlineType}
                        />

                        <div onClick={this.handleFocus} className="textEditor-base">
                            <Editor
                                editorState={editorState}
                                onChange={this.onChange}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                                placeholder={placeholder}
                                customStyleMap={styleMap}
                                ref="editor"
                            />
                        </div>
                    </div>

                    <br />

                    <div>
                        <button type="submit" onClick={this.onSubmit} className="btn btn-primary">Send</button>
                    </div>
                </div>;
    }
}