import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

class SolarMap extends Component<ISolarMapProps, ISolarMapState> {
	constructor(props: ISolarMapProps) {
		super(props);
	}

	public render() {
		return (
			<div className="solarmap">
				<div id="mapbox-container" className="mapbox-container"></div>
				<style jsx>
				{`
					.solarmap {
						position: relative;
						width: 100%;
						height: 100vh;
					}

					.mapbox-container {
						position: absolute;
						top: 0;
						bottom: 0;
						left: 0;
						right: 0;
					}
				`}
				</style>
			</div>
		);
	}

	public componentDidMount() {
		mapboxgl.accessToken = 'pk.eyJ1IjoibHJ2b2xsZSIsImEiOiJjajFpcndxN2swMWJ0MnFvaG1uaWNlOHVkIn0.ptRQFGDH9slee6PowWtXOg';

		const map = new mapboxgl.Map({
			container: 'mapbox-container',
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [-98.5795, 39.8283],
			zoom: 3,
		});
    }
}

interface ISolarMapProps {
}

interface ISolarMapState {
}

export default SolarMap;
