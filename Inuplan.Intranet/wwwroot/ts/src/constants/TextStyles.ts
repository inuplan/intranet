const enum TextStyles {
    Block,
    Inline,
    Code,
    Link,
    None
}

export default TextStyles;

export type Style =    "header-one" |
                        "header-two" |
                        "header-three" |
                        "header-four" |
                        "header-five" |
                        "header-six" |
                        "blockquote" |
                        "unordered-list-item" |
                        "ordered-list-item" |
                        "code-block" |
                        "unstyled" |
                        "" |
                        "BOLD" |
                        "ITALIC" |
                        "UNDERLINE" |
                        "CODE";