import React, { Component } from 'react';
import styled from 'styled-components';
import Ruler from './Ruler';
import Detail from './Detail';
import Level from './Level';
import Capture from './Capture';
import Slider from './Slider';
import styles from '../styles/Board.module.css';

const ZoomInOut = styled.div`
    width: ${(props) => props.ratio || 100}%;
`;

class Board extends Component {
    constructor(props) {
        super(props);
        this.handleRulerCntClick = this.handleRulerCntClick.bind(this);
        this.clickBar = this.clickBar.bind(this);
        this.openFileSelector = this.openFileSelector.bind(this);
        this.processFile = this.processFile.bind(this);
        this.processData = this.processData.bind(this);
        this.changeRatio = this.changeRatio.bind(this);
    }

    state = {
        rulerCnt: null,
        ratio: 100,
        selectedOP: [],
        fileName: null,
        data: null,
        calculatedEndTime: null,
        utility: null,
        digit: null,
        displayTimeUnit: null,
        colorList: ['aquamarine', 'cornflowerblue', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgreen', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightsteelblue', 'lime', 'limegreen', 'mediumaquamarine', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'mistyrose', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegreen', 'palevioletred', 'paleturquoise', 'peru', 'pink', 'plum', 'powderblue', 'rosybrown', 'thistle', 'yellowgreen', 'firebrick', 'dodgerblue', 'darkorange', 'crimson', 'darkmagenta']
    };

    handleRulerCntClick(value){
        if (this.state.ratio === 100 && value < 0) {
            return;
        } else if (this.state.ratio + value <= 100) {
            this.setState({ratio: 100});
        } else if (this.state.ratio + value >= 5000) {
            this.setState({ratio: 5000});
        } else {
            this.setState({ratio: this.state.ratio + value});
        }
    }

    changeRatio(value){
        this.setState({ratio: value});
    }

    clickBar(info, state){
        if (state === 0) {
            for (const op of this.state.selectedOP) {
                if (info.pk === op.pk) {
                    return;
                }
            }
            const newstate = this.state.selectedOP.concat([info]);
            this.setState({selectedOP: newstate});
        } else {
            this.setState({selectedOP: [info]});
        }
    }

    initFIle(){
        this.setState({rulerCnt: null});
        this.setState({ratio: 100});
        this.setState({selectedOP: []});
        this.setState({fileName: null});
        this.setState({data: null});
        this.setState({calculatedEndTime: null});
        this.setState({utility: null});
        this.setState({digit: null});
        this.setState({displayTimeUnit: null});
    }

    openFileSelector(){
        this.initFIle();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "text/plain";
        input.onchange = (event) => {
            this.setState({fileName: event.target.files[0].name});
            this.processFile(event.target.files[0]);
        };
        input.click();
    }

    processFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
            const data = JSON.parse(reader.result).traceEvents;
            this.setState({displayTimeUnit: JSON.parse(reader.result).displayTimeUnit});
            this.processData(data);
        };
        reader.readAsText(file, "euc-kr");
    }

    processData(data) {
        const processedData = {};
        const backgroundColor = {};
        const utility = {};
        const colorLen = this.state.colorList.length;
        let maxEndTime = 0;
        let colorIdx = 0;

        data.forEach((ele, idx) => {
            if (!ele.pid) { return; }

            processedData[ele.pid] = processedData[ele.pid] ? processedData[ele.pid] : {};
            processedData[ele.pid][ele.tid] = processedData[ele.pid][ele.tid] ? processedData[ele.pid][ele.tid] : [];

            if (!backgroundColor[ele.name]) {
                backgroundColor[ele.name] = this.state.colorList[colorIdx];
                colorIdx += 1;
                colorIdx %= colorLen;
            }

            if (ele.ts + ele.dur > maxEndTime){
                maxEndTime = ele.ts + ele.dur;
            }
            
            ele['backgroundColor'] = backgroundColor[ele.name];
            ele['pk'] = idx;
            processedData[ele.pid][ele.tid].push(ele);
            utility[ele.pid] = utility[ele.pid] !== undefined ? utility[ele.pid] + ele.dur : ele.dur;
        });

        Object.keys(utility).forEach(key => {
            utility[key] = Math.round(utility[key] * 100 / maxEndTime)/100;
        });

        let maxEndTime_ = maxEndTime;
        let deci = 0;
        while (maxEndTime_ > 0) {
            maxEndTime_ = parseInt(maxEndTime_ / 10);
            deci += 1;
        }
        
        this.setState({utility: utility});
        this.setState({rulerCnt: Math.ceil(maxEndTime / (10 ** (deci - 1))) * (10 ** (deci - 1))});
        this.setState({calculatedEndTime: Math.ceil(maxEndTime / (10 ** (deci - 1))) * (10 ** (deci - 1))});
        this.setState({digit: deci});
        this.setState({data: processedData});
    }

    renderLevel() {
        return Object.keys(this.state.data).map((key) => {
            return <Level 
                        calculatedEndTime={this.state.calculatedEndTime}
                        digit={this.state.digit}
                        processName={key}
                        utility={this.state.utility[key]}
                        data={this.state.data[key]}
                        key={key}
                        rulerCnt={this.state.rulerCnt}
                        clickBar={this.clickBar}/>;
        });
    }

    render() {
        return (
            <div className={styles.mainContainer}>
                <nav>
                    <div className={styles.fileMenu}>
                        <Capture/>
                        <button onClick={() => this.openFileSelector()}>Load</button>
                        <div className={styles.fileName}><div>{this.state.fileName}</div></div>
                    </div>
                    <div className={styles.zoomMenu}>
                        <div className={styles.zoomBtns}>
                            <button onClick={() => this.handleRulerCntClick(50)}>ZoomIn</button>
                            <button onClick={() => this.handleRulerCntClick(-50)}>ZoomOut</button>
                        </div>
                        <Slider ratio={this.state.ratio} changeRatio={this.changeRatio}/>
                    </div>
                </nav>
                <div className={styles.board}>
                    {this.state.data? 
                        <ZoomInOut className={styles.content} ratio={this.state.ratio}>
                            <Ruler
                                ratio={this.state.ratio}
                                calculatedEndTime={this.state.calculatedEndTime}
                                digit={this.state.digit}
                                rulerCnt={this.state.rulerCnt}/>
                            {this.renderLevel()}
                        </ZoomInOut>
                    : ''}
                </div>
                <Detail selectedOP={this.state.selectedOP} displayTimeUnit={this.state.displayTimeUnit}/>
            </div>
        );
    }
}

export default Board;