import React, { useEffect, useState } from 'react';
import '../styles/ruler.css';

function Ruler({ ratio, calculatedEndTime, digit }) {
    const [ initGraduationCnt ] = useState(calculatedEndTime / ( 10 ** (digit - 1)));

    useEffect(() => {
        const body = document.querySelector("body");
        const ruler = document.querySelector(".ruler");
        const rulerBlank = document.querySelector(".rulerBlank");
        const graduation = document.querySelector(".ruler .graduation");
        const cnt =  document.querySelectorAll(".ruler .graduation").length;
        const staticRulerWidth = body.clientWidth - rulerBlank.clientWidth;
        const staticGraduationWidth = parseInt(staticRulerWidth / initGraduationCnt);

        if (graduation.offsetWidth < staticGraduationWidth - 3) { 
            removeGraduation(ruler, cnt);
        } else if (graduation.offsetWidth < staticGraduationWidth * 2) {
            return;
        } else {
            addGraduation(ruler, cnt);
        }
        updateGraduation();
    }, [ratio]);

    function removeGraduation(ruler, cnt){
        for(let i = 0; i < cnt / 2; i++){
            const child = document.querySelector(".ruler .graduation");
            ruler.removeChild(child);
        }
    }

    function addGraduation(ruler, cnt){
        for(let i = 0; i < cnt; i++){
            const child = document.createElement('div');
            child.className = 'graduation';

            for(let i = 0; i < 5; i++){
                const childOfChild = document.createElement('div');
                childOfChild.className = 'smallGraduation';

                if (i === 0) {
                    const index = document.createElement('div');
                    index.className = 'index';
                    childOfChild.append(index);
                }

                child.append(childOfChild);
            }
            ruler.append(child);
        }
    }

    function updateGraduation(){
        const rulerWidth = document.querySelector(".ruler").scrollWidth;
        const allGraduation = document.querySelectorAll(".ruler .graduation");
        let left = 0;

        allGraduation.forEach(ele => {
            ele.firstChild.firstChild.innerText = calculateGraduation(left / rulerWidth * calculatedEndTime);
            left += ele.offsetWidth;
        });
    }

    function calculateGraduation(graduation) {
        if (graduation >= 1000) {
            return Math.round(graduation / 1000 * 10) /10 + 'ms';
        } else if (graduation >= 1) {
            return Math.round(graduation) + 'us';
        } else if (graduation === 0) {
            return 0;
        } else {
            return Math.round(graduation * 1000 * 10) /10 + 'ns';
        }
    }

    function mapToRulergraduation() { // 줄자 눈금 반복 랜더링
        const result = [];

        for(let i = 0; i < parseInt(calculatedEndTime / (10 ** (digit - 1))); i++){
            result.push(
                <div className="graduation" key={i}>
                    <div className="smallGraduation">
                        <div className="index">
                            {calculateGraduation(i * (10 ** (digit - 1)))}
                        </div>
                    </div>
                    <div className="smallGraduation"></div>
                    <div className="smallGraduation"></div>
                    <div className="smallGraduation"></div>
                    <div className="smallGraduation"></div>
                </div>
            );
        }
        return result;
    };

    return (
        <div className="rulerContainer">
            <div className="rulerBlank"></div>
            <div className="ruler">
                {mapToRulergraduation()}
            </div>
        </div>
    );
    
}

export default Ruler;