import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { Row, Col, ProgressBar } from "react-bootstrap";
import { fetchSpaceInfo } from "../../actions/status";
import { Root } from "../../interfaces/State";

interface StateToProps {
    usedMB: number;
    totalMB: number;
    loaded: boolean;
}

interface DispatchToProps {
    getSpaceInfo: (url: string) => void;
}

const mapStateToProps = (state: Root) => {
    return {
        usedMB: (state.statusInfo.spaceInfo.usedSpacekB / 1000),
        totalMB: (state.statusInfo.spaceInfo.totalSpacekB / 1000),
        loaded: (state.statusInfo.spaceInfo.totalSpacekB !== -1)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Root>) => {
    return {
        getSpaceInfo: (url: string) => {
            dispatch(fetchSpaceInfo(url));
        }
    };
};

class UsedSpaceView extends React.Component<StateToProps & DispatchToProps, any> {
    componentDidMount() {
        const { getSpaceInfo } = this.props;
        const url = `${globals.urls.diagnostics}/getspaceinfo`;
        getSpaceInfo(url);
    }

    render() {
        const { usedMB, totalMB } = this.props;
        const total = Math.round(totalMB);
        const used = Math.round(usedMB * 100) / 100;
        const free = Math.round((total - used) * 100) / 100;
        const usedPercent = ((used / total) * 100);
        const percentRound = Math.round(usedPercent * 100) / 100;
        const show = Boolean(usedPercent) && Boolean(used) && Boolean(free) && Boolean(total);
        if (!show) return null;

        return  <Row>
                    <Col>
                        <ProgressBar striped={true} bsStyle="success" now={usedPercent} key={1} />
                        <p>
                            Brugt: {used.toString()} MB ({percentRound.toString()} %)<br />
                            Fri plads: {free.toString()} MB<br />
                            Total: {total.toString()} MB
                        </p>
                    </Col>
                </Row>;
    }
}

const UsedSpace = connect(mapStateToProps, mapDispatchToProps)(UsedSpaceView);
export default UsedSpace;

//                        <UsedSpaceDoughnut
//                            id="canvasDoughnut"
//                            free={Math.round(free)}
//                            used={Math.round(used)}
//                            width={460}
//                            height={300}
//                        />

// class UsedSpaceDoughnut extends React.Component {
//    componentDidMount() {
//        const { id, used, free } = this.props;
//        const ctx = document.getElementById(id);
//        const dataOptions = {
//            labels: ["Brugt", "Fri"],
//            datasets: [
//                {
//                    data: [used, free],
//                    backgroundColor: [
//                        "#FF6384",
//                        "#36A2EB"
//                    ],
//                    hoverBackgroundColor: [
//                        "#FF6384",
//                        "#36A2EB"
//                    ]
//                }
//            ]
//        };
//        let chart = new Chart(ctx, {
//            type: 'doughnut',
//            data: dataOptions
//        })
//    }
//
//    render() {
//        const { id, width, height } = this.props;
//        return  <canvas id={id} width={width} height={height}>
//                </canvas>
//    }
// }
