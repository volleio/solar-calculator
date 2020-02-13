import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import area from '@turf/area';

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
				<style jsx global>
					{`
					.mapboxgl-ctrl-top-right {
						display: flex;						
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

		map.addControl(new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			},
			trackUserLocation: true
		}));

		map.addControl(
			new MapboxGeocoder({
				accessToken: mapboxgl.accessToken,
				mapboxgl: mapboxgl
			})
		);

		const draw = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
				polygon: true,
				trash: true
			}
		});
		map.addControl(draw);

		map.on('draw.create', updateArea);
		map.on('draw.delete', updateArea);
		map.on('draw.update', updateArea);

		function updateArea(evt: Event) {
			var data = draw.getAll();
			var answer = document.getElementById('calculated-area') as HTMLElement;
			if (data.features.length > 0) {
				var area = turf.area(data);
				// restrict to area to 2 decimal points
				var rounded_area = Math.round(area * 100) / 100;
				answer.innerHTML =
					'<p><strong>' +
					rounded_area +
					'</strong></p><p>square meters</p>';
			} else {
				answer.innerHTML = '';
				if (evt.type !== 'draw.delete')
					alert('Use the draw tools to draw a polygon!');
			}
		}
	}
}

interface ISolarMapProps {
}

interface ISolarMapState {
}

export default SolarMap;
