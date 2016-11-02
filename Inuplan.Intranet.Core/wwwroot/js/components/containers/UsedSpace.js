import React from 'react'
import Chart from 'chart-js'
import { Row, Col, ProgressBar } from 'react-bootstrap'

export class UsedSpaceView extends React.Component {
    componentDidMount() {
        const ctx = document.getElementById("myChart");
        //        const usedSpace = Math.round(3096/1024);
        //        const freeSpace = 300 - usedSpace;
        //        const dataOptions = {
        //            labels: [
        //                "Brugt plads i MB",
        //                "Fri plads i MB"
        //            ],
        //            datasets: [
        //                {
        //                    data: [usedSpace, freeSpace],
        //                    backgroundColor: [
        //                        "#92FF24",
        //                        "#36A2EB"
        //                    ],
        //                    hoverBackgroundColor: [
        //                        "#92FF24",
        //                        "#36A2EB"
        //                    ]
        //                }
        //            ]
        //        };
        //        const doughnutOptions = {
        //
        //        };
        //        const myChart = new Chart(ctx, {
        //            type: 'doughnut',
        //            data: dataOptions,
        //            options: doughnutOptions
        //        });
    }

    render() {
        const totalMB = 300;
        const usedMB = Math.round(152.123);
        const usedPercent = Math.round((usedMB/totalMB) * 100);
        return  <Row>
                    <Col>
                        <h3>Personlig upload forbrug</h3>
                        <hr />
                        <p>
                            Herunder kan man se hvor meget plads der er brugt og hvor meget fri plads
                            der er tilbage. Gælder kun billede filer.
                        </p>
                        <ProgressBar bsStyle="success" now={usedPercent} key={1} />
                        <p>
                            Brugt: {usedMB} MB ({usedPercent} %)<br />
                            Fri plads: {totalMB - usedMB} MB<br />
                            Total: {totalMB} MB
                        </p>
                    </Col>
                </Row>
    }
}
