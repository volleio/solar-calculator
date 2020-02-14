import React, { Component } from 'react';
import * as PvWatts from '../api/PvWatts';
import SolarValueTable from './SolarValueTable';

class MapMenu extends Component<IMapMenuProps, IMapMenuState> {
	constructor(props: IMapMenuProps) {
		super(props);
	}

	public render() {
		const solarCalculationStateClass = `solar-calculation__state 
			${this.props.solarCalculationState === SolarCalculationState.error ? 'solar-calculation__state--error' : ''}
			${this.props.solarCalculationState === SolarCalculationState.loading ? 'solar-calculation__state--loading' : ''}
			${this.props.solarCalculationState === SolarCalculationState.value ? 'solar-calculation__state--value' : ''}`;

		return (
			<div className="map-menu">
				<div className="solar-calculation">
					<div className="solar-calculation__header">
						Solar Energy
						<div className={solarCalculationStateClass} title={this.props.solarCalculationStateMessage ? 
							this.props.solarCalculationStateMessage : ''}>
							<div className="dot dot--1"></div>
							<div className="dot dot--2"></div>
							<div className="dot dot--3"></div>
						</div>
					</div>
					{this.props.area && this.props.nominalPower ?
					<div className="immediate-calculations">
						<div className="section-divider"></div>
						<div className="calculation-line">
							Area: <b>{Math.round(this.props.area)} m²</b>
						</div>
						<div className="calculation-line">
							Nominal power: <b>{Math.round(this.props.nominalPower)} kWdc</b>
						</div>
					</div>
					: null}
					{this.props.solarValues ? <SolarValueTable solarValues={this.props.solarValues} /> : null}
				</div>
				<style jsx>
					{`
					.map-menu {
						position: absolute;
						top: 0;
						left: 0;
						width: 300px;
						max-height: 600px;
						margin: 8px;
						padding: 6px;
						background: radial-gradient(#FFF, #F9F9F9);
						box-shadow: 0 1px 4px 2px rgba(50, 50, 50, 0.3);
    					border-radius: 4px;
					}

					.section-divider {
						margin: 8px 14px;
						border-bottom: 1px solid #DDD;
					}

					.solar-calculation {
						display: flex;
						flex-direction: column;
					}

					.solar-calculation__header {
						height: 40px;
						display: flex;
						align-items: flex-end;
						justify-content: center;
						font-size: 30px;
						color: navy;
						user-select: none;
					}

					.solar-calculation__state {
						position: relative;
						width: 40px;
						height: 40px;
						margin: 0 4px;
						transform: scale(1);
						transition: transform 0.1s ease;
					}
					{/* emphasise on hover only when there's a alt-text */}
					.solar-calculation__state:hover[title]:not([title=""]) {
						transform: scale(1.1);
					}

					.solar-calculation__state > .dot {
						position: absolute;
						top: 50%;
						left: 50%;
						margin-top: -2px;
						margin-left: -2px;
						width: 4px;
						height: 4px;
						background-color: navy;
						border-radius: 2px;
						opacity: 1;
						transition: all 0.3s;
					}
					.solar-calculation__state > .dot.dot--1 {
						transform: translate(-10px, 10px) scale(1);
					}
					.solar-calculation__state > .dot.dot--2 {
						transform: translate(0px, 10px) scale(1);
					}
					.solar-calculation__state > .dot.dot--3 {
						transform: translate(10px, 10px) scale(1);
					}

					
					.solar-calculation__state--error {
						
					}
					.solar-calculation__state--error > .dot.dot--1 {
						transform: translate(0px, 0px) scale(1, 3);
						background-color: #FFF;
						z-index: 1;
						border-radius: 1px;
					}
					.solar-calculation__state--error > .dot.dot--2 {
						transform: translate(0px, 4px) scale(7);
						background-color: #fc8f3d;
					}
					.solar-calculation__state--error > .dot.dot--3 {
						transform: translate(0px, 11px) scale(1);
						background-color: #FFF;
					}
					
					.solar-calculation__state--loading {
					}
					.solar-calculation__state--loading > .dot.dot--1 {
						--x-pos: -10px;
						animation: dot-jump-up 2s ease-in-out 0s infinite;
					}
					.solar-calculation__state--loading > .dot.dot--2 {
						--x-pos: 0px;
						animation: dot-jump-up 2s ease-in-out 0.3s infinite;
					}
					.solar-calculation__state--loading > .dot.dot--3 {
						--x-pos: 10px;
						animation: dot-jump-up 2s ease-in-out 0.6s infinite;
					}
					@keyframes dot-jump-up {
						0% { transform: translate(var(--x-pos), 10px) scale(1); }
						60% { transform: translate(var(--x-pos), 10px) scale(1); }
						80% { transform: translate(var(--x-pos), 4px) scale(1); }
						100% { transform: translate(var(--x-pos), 10px) scale(1); }
					}
					

					.solar-calculation__state--value {
						
					}
					.solar-calculation__state--value > .dot.dot--1 {
						transform: translate(-16px, -2px);
					}
					.solar-calculation__state--value > .dot.dot--2 {
						transform: translate(-16px, 4px);
						opacity: 0;
					}
					.solar-calculation__state--value > .dot.dot--3 {
						transform: translate(-16px, 10px);
					}

					.calculation-line {
						margin: 0 24px;
					}
				`}
				</style>
			</div>
		);
	}

	public componentDidMount() {

	}
}

interface IMapMenuProps {
	solarCalculationState: SolarCalculationState;
	solarCalculationStateMessage?: string;
	area?: number;
	nominalPower?: number;
	solarValues?: PvWatts.ResponseOutput;
}

interface IMapMenuState {
}

export enum SolarCalculationState {
	blank,
	loading,
	error,
	value
}

export default MapMenu;
