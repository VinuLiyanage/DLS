import React from 'react';
import axios from 'axios';
import ReactToPrint from "react-to-print";

import "../../Assests/css/CustomCss/Report.css";
import commonConstants from "../Common/CommonConstants";

const printConditionURL = commonConstants.getPrintConditionsURL();

class PrintConditions extends React.Component {
    constructor(props) {
        super(props);
        this.token = commonConstants.AUTHENTICATION().getAccessToken().accessToken; //get token;
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: printConditionURL,
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        })
            .then((response) => {
                this.setState({ data: response.data });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <>
                <div className="container btnPrint">
                    <ReactToPrint
                        trigger={() => {
                            return (
                                <a className="waves-effect waves-light btn-small" href="#">
                                    Print
                                </a>
                            );
                        }}
                        content={() => this.componentRef}
                    />
                </div>

                <div ref={(el) => (this.componentRef = el)}>
                    <div id='printCondition' className="container" >
                        <div style={{ height: "400px" }}>
                            {/*1st Section*/}
                            <div className='row' style={{ marginTop: "20px" }}>
                                <div className='col s12'>
                                    <b><u>නියමයන් හා කොන්දේසි</u></b>
                                </div>
                            </div>
                            <div className='row'>
                                {
                                    <div>
                                        {this.state.data.map((c, key) => {
                                            return (
                                                <div className='conditions'>
                                                    <div className='row'>
                                                        <div className='col s12' key={c.id}>({key + 1}) {c.condition}</div>;
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                        <hr></hr>
                        <div className='row' style={{ marginTop: "20px" }}>
                            <div className='col s12'>
                                <b><u>උකස බේරා ගැනීම</u></b>
                                <br />
                                <p>මෙම පත්‍රිකාවෙන් උකස් කල මුල් පිටුවෙහි සඳහන් භාණ්ඩ සියල්ල ලැබුණු බැවින් උකස පිලිබඳ සියළු වගකීම් හා බැඳීම් වලින් B.M.S. උකස් මධ්‍යස්ථානය මෙයින් නිදහස් කරමි.</p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col s2'>
                                <p>බේරා ගන්නා දිනය</p>
                                <br />
                                <p>...................................</p>
                            </div>
                            <div className='col s8'></div>
                            <div className='col s2' style={{ textAlign: "right" }}>
                                <p>උකස්කරුගේ අත්සන</p>
                                <br />
                                <p>.....................................</p>
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>

                    {/*2nd Section*/}
                    <div id='printCondition' className="container" style={{ marginTop: "76px" }}>
                    <div style={{ height: "400px" }}>
                            {/*Upper part*/}
                            <div className='row' style={{ marginTop: "20px" }}>
                                <div className='col s12'>
                                    <b><u>නියමයන් හා කොන්දේසි</u></b>
                                </div>
                            </div>
                            <div className='row'>
                                {
                                    <div>
                                        {this.state.data.map((c, key) => {
                                            return (
                                                <div className='conditions'>
                                                    <div className='row'>
                                                        <div className='col s12' key={c.id}>({key + 1}) {c.condition}</div>;
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                        <hr></hr>
                        <div className='row' style={{ marginTop: "16px" }}>
                            <div className='col s12'>
                                <b><u>උකස බේරා ගැනීම</u></b>
                                <br />
                                <p>මෙම පත්‍රිකාවෙන් උකස් කල මුල් පිටුවෙහි සඳහන් භාණ්ඩ සියල්ල ලැබුණු බැවින් උකස පිලිබඳ සියළු වගකීම් හා බැඳීම් වලින් B.M.S. උකස් මධ්‍යස්ථානය මෙයින් නිදහස් කරමි.</p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col s2'>
                                <p>බේරා ගන්නා දිනය</p>
                                <br />
                                <p>...................................</p>
                            </div>
                            <div className='col s8'></div>
                            <div className='col s2' style={{ textAlign: "right" }}>
                                <p>උකස්කරුගේ අත්සන</p>
                                <br />
                                <p>.....................................</p>
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default PrintConditions;
