import React from 'react'
import { Media, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap'

export class WhatsNewTooltip extends React.Component {
    tooltipView(tip) {
        return  <Tooltip id="tooltip">{tip}</Tooltip>
    }

    render() {
        const { tooltip, children } = this.props;
        return  <OverlayTrigger placement="left" overlay={this.tooltipView(tooltip)}>
                    {children}
                </OverlayTrigger>
    }
}
