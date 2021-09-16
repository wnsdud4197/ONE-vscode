import React, { useState } from 'react';
import styles from '../styles/Detail.module.css';

function Detail({ selectedOP, displayTimeUnit }) {
    const [ isOpenArgs, setIsOpenArgs ] = useState(true);
    const [ timeUnit ] = useState({'ms': 10**(-3), 'us': 1, 'ns': 10**3});

    function renderTds(value) {
        const totals = {
            name: 'totals',
            dur: 0,
            occurrences: 0
        };

        value.forEach(op => {
            totals.dur += op.dur;
            totals.occurrences += op.occurrences;
        });

        value.push(totals);
        return value.map(ele => {
            if (ele['name'] === 'totals') {
                return <>
                    <tr className={ styles.totals } key={ele.name}>
                        <td>{ele['name']}</td>
                        <td>{Math.round(ele['dur'] * timeUnit[displayTimeUnit] * 1000) / 1000} {displayTimeUnit}</td>
                        <td>{Math.round(ele['dur'] * timeUnit[displayTimeUnit] * 1000) / 1000 / ele['occurrences']} {displayTimeUnit}</td>
                        <td>{ele['occurrences']}</td>
                    </tr>
                </>;
            } else {
                return <tr key={ele.name}>
                    <td>{ele['name']}</td>
                    <td>{Math.round(ele['dur'] * timeUnit[displayTimeUnit] * 1000) / 1000} {displayTimeUnit}</td>
                    <td>{Math.round(ele['dur'] * timeUnit[displayTimeUnit] * 1000) / 1000 / ele['occurrences']} {displayTimeUnit}</td>
                    <td>{ele['occurrences']}</td>
                </tr>;
            }
        });
    }
    
    function renderArgs(args){
        return Object.keys(args).map(key => {
            return <li className={styles.arg} key={key}>{key} : {args[key]}</li>;
        });
    }

    function renderSingleContent() {
        return Object.keys(selectedOP[0]).map(key => {
            if (key === 'args') {
                return <>
                    <div key={key}>
                        <span className={styles.args} onClick={() => setIsOpenArgs(!isOpenArgs)}>
                            {isOpenArgs ? '▼' : '▶'} {key}
                        </span>
                        {isOpenArgs && 
                            <ul className={styles.argList}>
                                {renderArgs(selectedOP[0][key])}
                            </ul>
                        }
                    </div>
                </>;
            } else if (key === 'ts' || key === 'dur') {
                return  <div key={key}>{key} : {Math.round(selectedOP[0][key] * timeUnit[displayTimeUnit] * 1000) / 1000} {displayTimeUnit}</div>;
            } else if (key !== 'pk'){
                return  <div key={key}>{key} : {selectedOP[0][key]}</div>;
            }
        });
    }

    function renderMultiContent() {
        const refinedOP = [];
        const refinedOPDict = {};
        let idx = 0;

        selectedOP.forEach(element => {
            const opname = element.name;
            const opts = element.ts;
            const opdur = element.dur;

            const info = {
                name: opname,
                ts: opts,
                dur: opdur,
                occurrences: 1
            };

            if (opname in refinedOPDict) { 
                const idx = refinedOPDict[opname];
                refinedOP[idx].dur += info.dur;
                refinedOP[idx].occurrences += 1;
            } else {
                refinedOP.push(info);
                refinedOPDict[opname] = idx;
                idx += 1;
            }
        });

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>Wall Duration</th>
                            <th>Average Wall Duration</th>
                            <th>Occurrences</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTds(refinedOP)}
                    </tbody>
                </table>
            </div>
        );
        
    }

    function renderDetail() {
        if (selectedOP.length >= 1) {
            if (selectedOP.length === 1) {
                return renderSingleContent();
            } else {
                return renderMultiContent();
            }
        } else {
            return <div>nothing is selected</div>;
        }
    }

    return (
        <div className={styles.detail}>
            <div className={styles.title}><div>selected stuff</div></div>
            <div className={styles.detailContent}>
                {renderDetail()}
            </div>
        </div>
    );
}

export default Detail;