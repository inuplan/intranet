import * as React from "react";
// import { ButtonToolbar, ButtonGroup, Button, Glyphicon, MenuItem, Dropdown } from "react-bootstrap";
import { Editor, EditorState, RichUtils } from "draft-js";

// interface TextToolbarProps {
//     id: string;
//     bold: boolean;
//     italics: boolean;
//     h1: boolean;
//     h2: boolean;
//     h3: boolean;
//     normal: boolean;
//     onClickBold: React.EventHandler<React.MouseEvent<React.ClassicComponent<any, {}>>>;
//     onClickItalics: React.EventHandler<React.MouseEvent<React.ClassicComponent<any, {}>>>;
//     onClickHeading1: React.EventHandler<React.MouseEvent<React.ClassicComponent<any, {}>>>;
//     onClickHeading2: React.EventHandler<React.MouseEvent<React.ClassicComponent<any, {}>>>;
//     onClickHeading3: React.EventHandler<React.MouseEvent<React.ClassicComponent<any, {}>>>;
//     onClickNormal: React.EventHandler<React.MouseEvent<React.ClassicComponent<any, {}>>>;
// }

interface TextToolbarState {
    editorState: EditorState;
}

export class TextToolbar extends React.Component<null, TextToolbarState> {
    constructor(props: any) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty()
        };

        this.onChange = this.onChange.bind(this);
        this.onBoldClick = this.onBoldClick.bind(this);
    }

    onChange(editorState: EditorState) {
        this.setState({editorState});
    }

    onBoldClick(e: React.MouseEvent<any>) {
        e.preventDefault();
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE"));
    }

    render() {
        // const { id, bold, italics, h1, h2, h3, normal } = this.props;
        // const { onClickBold, onClickItalics, onClickHeading1, onClickHeading2, onClickHeading3, onClickNormal } = this.props;
        const { editorState } = this.state;
        return  <div>
                    <button onClick={this.onBoldClick}>Bold</button>
                    <Editor editorState={editorState} onChange={this.onChange} />
                </div>;
        // return  <ButtonToolbar>
        //             <ButtonGroup>
        //                 <Button onClick={onClickBold} active={bold}><Glyphicon glyph="bold" /></Button>
        //                 <Button onClick={onClickItalics} active={italics}><Glyphicon glyph="italic" /></Button>
        //                 <Dropdown id={id}>
        //                     <Dropdown.Toggle>
        //                         <Glyphicon glyph="text-size" />
        //                     </Dropdown.Toggle>
        //                     <Dropdown.Menu>
        //                         <MenuItem onClick={onClickHeading1} eventKey="1" active={h1}>Overskrift 1</MenuItem>
        //                         <MenuItem onClick={onClickHeading2} eventKey="2" active={h2}>Overskrift 2</MenuItem>
        //                         <MenuItem onClick={onClickHeading3} eventKey="3" active={h3}>Overskrift 3</MenuItem>
        //                         <MenuItem onClick={onClickNormal} eventKey="4" active={normal}>Normal</MenuItem>
        //                     </Dropdown.Menu>
        //                 </Dropdown>
        //             </ButtonGroup>
        //         </ButtonToolbar>;
    }
}