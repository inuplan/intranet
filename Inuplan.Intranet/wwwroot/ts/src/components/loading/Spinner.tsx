import * as React from "react";

interface SpinnerProps {
    show: boolean;
}

export class Spinner extends React.Component<SpinnerProps, null> {
    constructor(props: SpinnerProps) {
        super(props);
    }

    render() {
        const { show } = this.props;

        if (!show) return null;

        return  <div className="dim">
                    <div className="center">
                        <div className="loading cssload-loader">
                            <span className="cssload-loader-inner">
                            </span>
                        </div>
                    </div>
                </div>;
    }
}