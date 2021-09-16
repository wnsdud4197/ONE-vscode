import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import styles from '../styles/Slider.module.css';
import '../styles/input-range.css';

function Slider({ ratio, changeRatio }) {
    return (
        <div className={styles.slider}>
            <span>-</span>
            <InputRange
                minValue={100}
                maxValue={5000}
                step={1}
                value={ratio}
                onChange={value => changeRatio(value)} />
            <span>+</span>
        </div>
    );
}

export default Slider;