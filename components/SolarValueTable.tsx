import React, { Component } from 'react';
import * as PvWatts from '../api/PvWatts';

class SolarValueTable extends Component<ISolarValueTableProps, ISolarValueTableState> {
	constructor(props: ISolarValueTableProps) {
		super(props);
	}

	public render() {
		return (
			<div className="solar-values">
				<div className="solar-values-table" onClick={(evt) => {
					const table = evt.currentTarget as HTMLTableElement;
					if (table.classList.contains('solar-values-table--expanded'))
						table.classList.remove('solar-values-table--expanded');
					else
						table.classList.add('solar-values-table--expanded');
				}}>
					<div className="solar-value-header">Mo.</div>
					{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(value =>
						(<div className="solar-value">{value}</div>))}

					<div className="solar-value-header">Solar Radiation</div>
					{this.props.solarValues.solrad_monthly.map(value =>
						(<div className="solar-value"><b>{Math.round(value * 100) / 100}</b> <span className="value-unit"> kWh/m²/day</span></div>))}

					<div className="solar-value-header">AC Energy</div>
					{this.props.solarValues.ac_monthly.map(value =>
						(<div className="solar-value"><b>{Math.round(value)}</b> <span className="value-unit"> kWh</span></div>))}
				</div>

				<div className="solar-value-footer">Total: <b>{Math.round(this.props.solarValues.ac_annual)}</b> <span className="value-unit"> kWh/Year</span></div>

				<style jsx>
					{`
					.solar-values{
						margin: 10px;
						margin-bottom: 0;
					}
					
					.solar-values-table {
						position: relative;
						display: grid;
						grid-template-columns: 40px 1fr 1fr;
						grid-auto-flow: column;
						grid-template-rows: repeat(13, 30px);
						grid-gap: 1px;
						height: 75px;
						background-color: #DDD;
						border: 1px solid #DDD;
						border-radius: 3px;
						text-align: center;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						cursor: pointer;
					}
					.solar-values-table.solar-values-table--expanded {
						height: auto;
					}
					@media screen and (min-width: 640px) {
						.solar-values-table:not(.solar-values-table--expanded)::after {
							top: 0;
							bottom: 0;
							left: 0;
							right: 0;
							background: linear-gradient(0deg, #FFF, transparent);
						}
					}
					@media screen and (max-width: 640px) {
						.solar-values-table {
							height: auto;
						}
					}

					.solar-value-header {
						height: 30px;
						display: flex;
    					align-items: center;
						justify-content: center;
    					align-items: center;
					}

					.solar-value {
						background-color: #FFF;
						display: flex;
						justify-content: center;
    					align-items: center;
					}
					.value-unit {
						margin-left: 4px;
						font-size: 0.8em;
					}

					.solar-value-footer {
						margin: 8px;
						text-align: center;
					}
				`}
				</style>
			</div>
		);
	}

	public componentDidMount() {

	}
}

interface ISolarValueTableProps {
	solarValues: PvWatts.ResponseOutput;
}

interface ISolarValueTableState {
}

export default SolarValueTable;
