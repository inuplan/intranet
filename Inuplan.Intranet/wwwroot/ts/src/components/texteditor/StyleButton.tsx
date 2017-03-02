import * as React from "react";
import TextStyles, { Style } from "../../constants/TextStyles";

interface StyleButtonProps {
    active: boolean;
    label: string;
    onClick: (styleType: TextStyles, style: Style) => void;
    style: Style;
    styleType: TextStyles;
    key: string;
}

export class StyleButton extends React.Component<StyleButtonProps, null> {
    constructor(props: any) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(e: React.MouseEvent<any>) {
        e.preventDefault();

        const { styleType, style, onClick } = this.props;
        onClick(styleType, style);
    }

    render() {
        const { label, active } = this.props;
        const css = active ? "richEditor-styleButton richEditor-activeButton" : "richEditor-styleButton";
        return  <span className={css} onClick={this.onClick}>
                    {label}
                </span>;
    }
}