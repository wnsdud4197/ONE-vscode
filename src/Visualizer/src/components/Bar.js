import React from 'react';
import styled from 'styled-components';
import styles from '../styles/Bar.module.css';

// ================= style ======================= //
const StyledBar = styled.div`
    position: absolute;
    cursor: pointer;
    text-align: center;
    top: 0%;
    left: ${(props) => props.start/props.calculatedEndTime*100}%;
    height: 100%;
    width: ${(props) => props.duration/props.calculatedEndTime*100}%; 
    z-index: 1;
    background-color: ${(props) => props.backgroundColor};
`;

function Bar({ calculatedEndTime, digit, clickBar, data }) {
    function localClickBar(e){
        const info = {
            ...data
        };

        delete info['backgroundColor'];

        if (e.ctrlKey) {
            clickBar(info, 0);
        } else {
            clickBar(info, 1);
        }
    }
    
    return (
        <StyledBar 
            className={styles.bar}
            calculatedEndTime={calculatedEndTime}
            digit={digit}
            onClick={(e) => localClickBar(e)} 
            start={data.ts}
            duration={data.dur}
            name={data.name}
            backgroundColor={data.backgroundColor}>
            <div className={styles.barTitle}>
                {data.name}
            </div>
        </StyledBar>
    );
}

export default Bar;