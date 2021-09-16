import React from 'react';
import styled from "styled-components";
import Bar from "./Bar";
import styles from '../styles/DataBar.module.css';

// ================= style ======================= //
const StyledBargraduation = styled.div`
    top: 0%;
    left: ${(props) => props.i/props.cnt*100}%; 
    position: absolute;
    height: 100%;
    width: 0.5px;
    background-color: rgb(204, 204, 204);
`;

function DataBar({ calculatedEndTime, digit, categoryName, data, clickBar })  {
    function renderBar() {
        return data.map((ele) => {
            return <Bar 
                        calculatedEndTime={calculatedEndTime}
                        digit={digit}
                        clickBar={clickBar}
                        data={ele}
                        key={ele.pk}
                        />;
        });
    }

    function mapToBarGraduation() {
        const result = [];

        for(let i = 0; i < parseInt(calculatedEndTime / (10 ** (digit - 1))); i++){
            result.push(<StyledBargraduation i={i} cnt={parseInt(calculatedEndTime / (10 ** (digit - 1)))} key={i}/>);
        }
        
        return result;
    };

    return (
        <div className={styles.dataBarContainer}>
            <header className={styles.dataBarTitle}>
                <div>{categoryName}</div>
            </header>
            <div className={styles.dataBar}>
                {renderBar()}
                <div className={styles.graduation}>
                    {mapToBarGraduation()}
                </div>
            </div>
        </div>
    );
}

export default DataBar;