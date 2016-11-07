import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, ProgressBar } from 'react-bootstrap'
import { fetchSpaceInfo } from '../../actions/status'

const mapStateToProps = (state) => {
    return {
        usedMB: (state.statusInfo.spaceInfo.usedSpacekB / 1000),
        totalMB: (state.statusInfo.spaceInfo.totalSpacekB / 1000),
        loaded: (state.statusInfo.spaceInfo.totalSpacekB != -1)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getSpaceInfo: (url) => {
            dispatch(fetchSpaceInfo(url));
        }
    }
}

class UsedSpaceView extends React.Component {
    componentDidMount() {
        const { getSpaceInfo } = this.props;
        const url = `${globals.urls.diagnostics}/getspaceinfo`;
        getSpaceInfo(url);
    }

    render() {
        const { usedMB, totalMB } = this.props;
        const total = Math.round(totalMB);
        const used = Math.round(usedMB*100) / 100;
        const free = Math.round((total - used)*100) / 100;
        const usedPercent = ((used/total)* 100);
        const percentRound = Math.round(usedPercent*100) / 100;
        return  <Row>
                    <Col>
                        <ProgressBar striped={true} bsStyle="success" now={usedPercent} key={1} />
                        <p>
                            Brugt: {used.toString()} MB ({percentRound.toString()} %)<br />
                            Fri plads: {free.toString()} MB<br />
                            Total: {total.toString()} MB
                        </p>
                    </Col>
                </Row>
    }
}

const UsedSpace = connect(mapStateToProps, mapDispatchToProps)(UsedSpaceView);
export default UsedSpace;
