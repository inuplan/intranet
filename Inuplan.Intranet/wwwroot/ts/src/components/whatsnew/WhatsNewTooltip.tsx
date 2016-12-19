import * as React from 'react'
import { Media, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap'

interface stateProps {
    tooltip: string
}
export class WhatsNewTooltip extends React.Component<stateProps, any> {
    tooltipView(tip: string) {
        return  <Tooltip id="tooltip">{tip}</Tooltip>
    }

    render() {
        const { tooltip, children } = this.props;
        return  <OverlayTrigger placement="left" overlay={this.tooltipView(tooltip)}>
                    {children}
                </OverlayTrigger>
    }
}