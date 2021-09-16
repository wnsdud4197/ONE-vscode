import React, { Component } from 'react';
import DataBar from './DataBar';
import styles from '../styles/Level.module.css';

class Level extends Component {
    constructor(props) {
        super(props);
        this.handleLevelClick = this.handleLevelClick.bind(this);
    }

    state = {
        isPannelOpen: true,
    };

    handleLevelClick(){
        this.setState({isPannelOpen: !this.state.isPannelOpen});
    }

    renderDataBar() {
        return Object.keys(this.props.data).map(key => {
            return  <DataBar
                        calculatedEndTime={this.props.calculatedEndTime}
                        digit={this.props.digit}
                        unit={this.props.unit}
                        categoryName={key}
                        data={this.props.data[key]}
                        key={key}
                        rulerCnt={this.props.rulerCnt}
                        clickBar={this.props.clickBar}/>;
        });
    }

    render() {
        return (
            <div className={styles.levelContainer}>
                <div className={styles.levelHeader}>
                    <div className={styles.levelTitle} onClick={this.handleLevelClick}>
                        {this.state.isPannelOpen ? '▼' : '▶'} {this.props.processName} 
                        <span className={styles.utility}>
                            {this.props.utility < 1 && ' (' + this.props.utility*100 + '%)'}
                        </span>
                    </div>
                </div>
                {this.state.isPannelOpen &&
                    <div className={styles.levelContent}>
                        {this.renderDataBar()}
                    </div>
                }
            </div>
        );
    }
}

export default Level;