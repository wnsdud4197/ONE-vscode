import React, { useState } from 'react';
import DataBar from './DataBar';
import styles from '../styles/Level.module.css';

function Level({ calculatedEndTime, digit, processName, utility, data, clickBar })  {
    const [ isPannelOpen, setIsPannelOpen ] = useState(true);

    function renderDataBar() {
        return Object.keys(data).map(key => {
            return  <DataBar
                        calculatedEndTime={calculatedEndTime}
                        digit={digit}
                        categoryName={key}
                        data={data[key]}
                        key={key}
                        clickBar={clickBar}/>;
        });
    }

    return (
        <div className={styles.levelContainer}>
            <div className={styles.levelHeader}>
                <div className={styles.levelTitle} onClick={() => setIsPannelOpen(!isPannelOpen)}>
                    {isPannelOpen ? '▼' : '▶'} {processName} 
                    <span className={styles.utility}>
                        {utility < 1 && ' (' + utility*100 + '%)'}
                    </span>
                </div>
            </div>
            {isPannelOpen &&
                <div className={styles.levelContent}>
                    {renderDataBar()}
                </div>
            }
        </div>
    );
}

export default Level;