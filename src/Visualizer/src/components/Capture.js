import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import styles from '../styles/DataBar.module.css';

class Capture extends Component {
    onCapture(area){
        const capture = document.querySelector(area);
        html2canvas(capture)
        .then(canvas => {
            if (canvas.msToBlob) { //for IE 10, 11
                var blob = canvas.msToBlob();
                window.navigator.msSaveBlob(blob, "capture.png");
            } else {
                this.onSaveAs(canvas.toDataURL(), "capture.png");
            }
        });
    }

    onSaveAs(uri, filename) {
        const link = document.createElement('a');
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    render() {
        return (
            <div className={styles.captureBtns}>
                <button onClick={() => this.onCapture('.main-container')}>Capture Screen</button>
                <button onClick={() => this.onCapture('.content')}>Capture Graph</button>
            </div>
        );
    }
}

export default Capture;