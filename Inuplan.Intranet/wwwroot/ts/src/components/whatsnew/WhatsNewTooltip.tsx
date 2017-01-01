import * as React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface StateProps {
    tooltip: string;
}

export class WhatsNewTooltip extends React.Component<StateProps, any> {
    tooltipView(tip: string) {
        return  <Tooltip id="tooltip">{tip}</Tooltip>;
    }

    render() {
        const { tooltip, children } = this.props;
        return  <OverlayTrigger placement="left" overlay={this.tooltipView(tooltip)}>
                    {children}
                </OverlayTrigger>;
    }
}