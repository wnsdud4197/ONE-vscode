import React, { useState } from 'react';
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

function Board() {
    const [ ratio, setRatio ] = useState(100);
    const [ selectedOP, setSelectedOP ] = useState([]);
    const [ fileName, setFileName ] = useState(null);
    const [ data, setData ] = useState(null);
    const [ calculatedEndTime, setCalculatedEndTime ] = useState(null);
    const [ utility, setUtility ] = useState(null);
    const [ digit, setDigit ] = useState(null);
    const [ displayTimeUnit, setDisplayTimeUnit ] = useState(null);
    const [ colorList ] = useState(['aquamarine', 'cornflowerblue', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgreen', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightsteelblue', 'lime', 'limegreen', 'mediumaquamarine', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'mistyrose', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegreen', 'palevioletred', 'paleturquoise', 'peru', 'pink', 'plum', 'powderblue', 'rosybrown', 'thistle', 'yellowgreen', 'firebrick', 'dodgerblue', 'darkorange', 'crimson', 'darkmagenta']);

    function clickZoom(value){
        if (ratio === 100 && value < 0) {
            return;
        } else if (ratio + value <= 100) {
            setRatio(100);
        } else if (ratio + value >= 5000) {
            setRatio(5000);
        } else {
            setRatio(ratio + value);
        }
    }

    function changeRatio(value){
        setRatio(value);
    }

    function clickBar(info, state){
        if (state === 0) {
            for (const op of selectedOP) {
                if (info.pk === op.pk) {
                    return;
                }
            }
            const newstate = selectedOP.concat([info]);
            setSelectedOP(newstate);
        } else {
            setSelectedOP([info]);
        }
    }

    function initFIle(){
        setRatio(100);
        setSelectedOP([]);
        setFileName(null);
        setData(null);
        setCalculatedEndTime(null);
        setUtility(null);
        setDigit(null);
        setDisplayTimeUnit(null);
    }

    function openFileSelector(){
        initFIle();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "text/plain";
        input.onchange = (event) => {
            setFileName(event.target.files[0].name);
            processFile(event.target.files[0]);
        };
        input.click();
    }

    function processFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
            const data = JSON.parse(reader.result).traceEvents;
            setDisplayTimeUnit(JSON.parse(reader.result).displayTimeUnit);
            processData(data);
        };
        reader.readAsText(file, "euc-kr");
    }

    function processData(data) {
        const processedData = {};
        const backgroundColor = {};
        const utility = {};
        const colorLen = colorList.length;
        let maxEndTime = 0;
        let colorIdx = 0;

        data.forEach((ele, idx) => {
            if (!ele.pid) { return; }

            processedData[ele.pid] = processedData[ele.pid] ? processedData[ele.pid] : {};
            processedData[ele.pid][ele.tid] = processedData[ele.pid][ele.tid] ? processedData[ele.pid][ele.tid] : [];

            if (!backgroundColor[ele.name]) {
                backgroundColor[ele.name] = colorList[colorIdx];
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

        setUtility(utility);
        setCalculatedEndTime(Math.ceil(maxEndTime / (10 ** (deci - 1))) * (10 ** (deci - 1)));
        setDigit(deci);
        setData(processedData);
    }

    function renderLevel() {
        return Object.keys(data).map((key) => {
            return <Level 
                        calculatedEndTime={calculatedEndTime}
                        digit={digit}
                        processName={key}
                        utility={utility[key]}
                        data={data[key]}
                        key={key}
                        clickBar={clickBar}/>;
        });
    }

    return (
        <div className={`${styles.mainContainer} mainContainer`}>
            <nav>
                <div className={styles.fileMenu}>
                    <Capture/>
                    <button onClick={() => openFileSelector()}>Load</button>
                    <div className={styles.fileName}><div>{fileName}</div></div>
                </div>
                <div className={styles.zoomMenu}>
                    <div className={styles.zoomBtns}>
                        <button onClick={() => clickZoom(50)}>ZoomIn</button>
                        <button onClick={() => clickZoom(-50)}>ZoomOut</button>
                    </div>
                    <Slider ratio={ratio} changeRatio={changeRatio}/>
                </div>
            </nav>
            <div className={styles.board}>
                {data ? 
                    <ZoomInOut className="content" ratio={ratio}>
                        <Ruler
                            ratio={ratio}
                            calculatedEndTime={calculatedEndTime}
                            digit={digit}/>
                        {renderLevel()}
                    </ZoomInOut>
                : ''}
            </div>
            <Detail 
                selectedOP={selectedOP}
                displayTimeUnit={displayTimeUnit}/>
        </div>
    );
}

export default Board;