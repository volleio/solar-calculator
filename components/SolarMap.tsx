import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import area from '@turf/area';

class SolarMap extends Component<ISolarMapProps, ISolarMapState> {
	private readonly SOLAR_CALCULATION_WAIT = 500; // 0.5 seconds

	private solarCalculationTimeout: number = -1;

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
			style: 'mapbox://styles/lrvolle/ck6l3i57b1bhs1imlp62ugefg',
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
			},
			// modes: MapboxDraw.modes.DIRECT_SELECT,
			styles: [
				// ACTIVE (being drawn)
				// line stroke
				{
					"id": "gl-draw-line",
					"type": "line",
					"filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
					"layout": {
					  "line-cap": "round",
					  "line-join": "round"
					},
					"paint": {
					  "line-color": "#001484",
					  "line-dasharray": [0.2, 2],
					  "line-width": 2
					}
				},
				// polygon fill
				{
				  "id": "gl-draw-polygon-fill",
				  "type": "fill",
				  "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
				  "paint": {
					"fill-color": "#fbdc75",
					"fill-outline-color": "#001484",
					"fill-opacity": 0.5
					// "background-pattern": ""
				  }
				},
				// polygon outline stroke
				// This doesn't style the first edge of the polygon, which uses the line stroke styling instead
				{
				  "id": "gl-draw-polygon-stroke-active",
				  "type": "line",
				  "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
				  "layout": {
					"line-cap": "round",
					"line-join": "round"
				  },
				  "paint": {
					"line-color": "#001484",
					"line-dasharray": [0.2, 2],
					"line-width": 2
				  }
				},
				// vertex point halos
				{
				  "id": "gl-draw-polygon-and-line-vertex-halo-active",
				  "type": "circle",
				  "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
				  "paint": {
					"circle-radius": 5,
					"circle-color": "#FFF"
				  }
				},
				// vertex points
				{
				  "id": "gl-draw-polygon-and-line-vertex-active",
				  "type": "circle",
				  "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
				  "paint": {
					"circle-radius": 3,
					"circle-color": "#001484",
				  }
				},
			
				// INACTIVE (static, already drawn)
				// line stroke
				{
					"id": "gl-draw-line-static",
					"type": "line",
					"filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
					"layout": {
					  "line-cap": "round",
					  "line-join": "round"
					},
					"paint": {
					  "line-color": "#000",
					  "line-width": 3
					}
				},
				// polygon fill
				{
				  "id": "gl-draw-polygon-fill-static",
				  "type": "fill",
				  "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
				  "paint": {
					"fill-color": "#000",
					"fill-outline-color": "#000",
					"fill-opacity": 0.1
				  }
				},
				// polygon outline
				{
				  "id": "gl-draw-polygon-stroke-static",
				  "type": "line",
				  "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
				  "layout": {
					"line-cap": "round",
					"line-join": "round"
				  },
				  "paint": {
					"line-color": "#000",
					"line-width": 3
				  }
				}
			  ],
		});
		map.addControl(draw);

		map.on('draw.create', (evt) => this.UpdateArea(evt, draw));
		map.on('draw.delete', (evt) => this.UpdateArea(evt, draw));
		map.on('draw.update', (evt) => this.UpdateArea(evt, draw));
	}

	private UpdateArea(evt: Event, draw: MapboxDraw) {
		const polygonData = draw.getAll();

		if (polygonData.features.length > 0) {
			// Loading indicator to show data isn't up to date
			this.SetSolarCalulationState(SolarCalulationState.loading);

			// Reset timeout. We only make a query every SOLAR_CALCULATION_WAIT so that requests aren't being made
			// while the user is currently updating the polygon, and so that we don't overload the API.
			if (this.solarCalculationTimeout >= 0)
				clearTimeout(this.solarCalculationTimeout);

			this.solarCalculationTimeout = window.setTimeout(() => {
				this.UpdateSolarCalculation(polygonData)
			}, this.SOLAR_CALCULATION_WAIT);

		} else { // Polygon deleted
			this.SetSolarCalulationState(SolarCalulationState.blank);

			if (evt.type !== 'draw.delete')
				alert('Use the draw tools to draw a polygon!');
		}
	}

	private SetSolarCalulationState(state: SolarCalulationState) {
		// Remove any style modifications


		// Set loading/error styles
		if (state === SolarCalulationState.loading) {

		} else if (state === SolarCalulationState.error) {

		} else if (state === SolarCalulationState.value) {
			// Set solar calulation values

		}
	}

	/** */
	private async UpdateSolarCalculation(polygonData: any) {
		// Use turf to calculate necessary/relevant info about the polygon
		const area = turf.area(polygonData);
		const center = turf.center(polygonData);

		const pvWattsResponse = await (await fetch('api/PvWatts', {
			method: 'POST',
			headers: {
				'Content-Type': 'Content-Type': 'application/json',
			},
			body: querystring.stringify({
				tp1 : newTypingPattern,
				tp2 : oldTypingPattern,
				quality : quality.toString(),
			}),
		})).json();
	}
}

enum SolarCalulationState {
	blank,
	loading,
	error,
	value
}

interface ISolarMapProps {
}

interface ISolarMapState {
}

export default SolarMap;
