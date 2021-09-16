import React from 'react';
import html2canvas from 'html2canvas';
import styles from '../styles/DataBar.module.css';

function Capture() {
    function onCapture(area){
        const capture = document.querySelector(area);
        html2canvas(capture)
        .then(canvas => {
            if (canvas.msToBlob) { //for IE 10, 11
                var blob = canvas.msToBlob();
                window.navigator.msSaveBlob(blob, "capture.png");
            } else {
                onSaveAs(canvas.toDataURL(), "capture.png");
            }
        });
    }

    function onSaveAs(uri, filename) {
        const link = document.createElement('a');
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className={styles.captureBtns}>
            <button onClick={() => onCapture('.mainContainer')}>Capture Screen</button>
            <button onClick={() => onCapture('.content')}>Capture Graph</button>
        </div>
    );
}

export default Capture;