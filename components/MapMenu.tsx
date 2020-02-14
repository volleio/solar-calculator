import React, { Component } from 'react';

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
						Solar Energy:
						<div className={solarCalculationStateClass}>
							<div className="dot dot--1"></div>
							<div className="dot dot--2"></div>
							<div className="dot dot--3"></div>
						</div>
					</div>
				</div>
				<style jsx>
				{`
					.map-menu {
						position: absolute;
						top: 0;
						left: 0;
						width: 300px;
						height: 600px;
						margin: 8px;
						background: radial-gradient(#FFF, #F9F9F9);
						box-shadow: 0 1px 4px 2px rgba(50, 50, 50, 0.3);
    					border-radius: 4px;
					}

					.solar-calculation__header {
						height: 40px;
						display: flex;
						align-items: flex-end;
						justify-content: center;
						font-size: 30px;
						color: navy;
					}

					.solar-calculation__state {
						position: relative;
						width: 40px;
						height: 40px;
						margin: 0 4px;
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
						border-radius: 50%;
					}
					.solar-calculation__state > .dot.dot--1 {
						transform: translate(-10px, 10px);
					}
					.solar-calculation__state > .dot.dot--2 {
						transform: translate(0px, 10px);
					}
					.solar-calculation__state > .dot.dot--3 {
						transform: translate(10px, 10px);
					}

					.solar-calculation__state--error {
						
					}
					.solar-calculation__state--loading {
						
					}
					.solar-calculation__state--value {
						
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
