import * as React from "react";
import { StyleButton } from "./StyleButton";
import TextStyles, { Style } from "../../constants/TextStyles";
import { OrderedSet } from "immutable";

interface ToolbarBlockState {
}

interface ToolbarBlockProps {
    currentBlockType: Style;
    currentInlineType: OrderedSet<string>;
    onStyleClick: (styleType: TextStyles, style: Style) => void;
}

export class ToolbarBlock extends React.Component<ToolbarBlockProps, ToolbarBlockState> {
    constructor(props: any) {
        super(props);

        this.isActiveBlock = this.isActiveBlock.bind(this);
    }

    isActiveBlock(style: Style) {
        const { currentBlockType } = this.props;
        const active = style === currentBlockType;
        return active;
    }

    isActiveInline(style: Style) {
        const { currentInlineType } = this.props;
        const active = currentInlineType.contains(style);
        return active;
    }

    render() {
        const { onStyleClick } = this.props;
        return  <div className="richEditor-controls">
                    <StyleButton
                        key="H1"
                        active={this.isActiveBlock("header-one")}
                        label="Overskrift 1"
                        onClick={onStyleClick}
                        style="header-one"
                        styleType={TextStyles.Block}
                    />
                    <StyleButton
                        key="H2"
                        active={this.isActiveBlock("header-two")}
                        label="Overskrift 2"
                        onClick={onStyleClick}
                        style="header-two"
                        styleType={TextStyles.Block}
                    />
                    <StyleButton
                        key="H3"
                        active={this.isActiveBlock("header-three")}
                        label="Overskrift 3"
                        onClick={onStyleClick}
                        style="header-three"
                        styleType={TextStyles.Block}
                    />
                    <StyleButton
                        key="Normal"
                        active={this.isActiveBlock("unstyled")}
                        label="Normal"
                        onClick={onStyleClick}
                        style="unstyled"
                        styleType={TextStyles.Block}
                    />
                    <StyleButton
                        key="OL"
                        active={this.isActiveBlock("ordered-list-item")}
                        label="Liste"
                        onClick={onStyleClick}
                        style="ordered-list-item"
                        styleType={TextStyles.Block}
                    />
                    <StyleButton
                        key="UL"
                        active={this.isActiveBlock("unordered-list-item")}
                        label="Punkter"
                        onClick={onStyleClick}
                        style="unordered-list-item"
                        styleType={TextStyles.Block}
                    />
                    <br />
                    <StyleButton
                        key="BOLD"
                        active={this.isActiveInline("BOLD")}
                        label="Fed"
                        onClick={onStyleClick}
                        style="BOLD"
                        styleType={TextStyles.Inline}
                    />
                    <StyleButton
                        key="ITALIC"
                        active={this.isActiveInline("ITALIC")}
                        label="Kursiv"
                        onClick={onStyleClick}
                        style="ITALIC"
                        styleType={TextStyles.Inline}
                    />
                    <StyleButton
                        key="CODE"
                        active={this.isActiveInline("CODE")}
                        label="Marker"
                        onClick={onStyleClick}
                        style="CODE"
                        styleType={TextStyles.Inline}
                    />
                </div>;
    }
}
