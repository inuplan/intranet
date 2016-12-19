import * as React from 'react'
import { OverlayTrigger, Button, Glyphicon, Tooltip } from 'react-bootstrap'
import icons from '../../constants/glyphicons'

interface buttonTooltipProps {
    tooltip: string
    onClick: (e: React.MouseEvent<any>) => void
    icon: icons
    bsStyle: string
    active?: boolean
    mount: boolean
}

export class ButtonTooltip extends React.Component<buttonTooltipProps, null> {
    render() {
        const { tooltip, onClick, icon, bsStyle, active, mount } = this.props;
        let overlayTip = <Tooltip id="tooltip">{tooltip}</Tooltip>;

        if(!mount) return null;

        return  <OverlayTrigger placement="top" overlay={overlayTip}>
                    <Button bsStyle={bsStyle} bsSize="xsmall" onClick={onClick} active={active}>
                        <Glyphicon glyph={icon} />
                    </Button>
                </OverlayTrigger>
    }
}