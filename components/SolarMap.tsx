import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
//@ts-ignore
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';
import * as turf from '@turf/turf';
import PvWattsApi from '../api/PvWattsApi';
import * as PvWatts from '../api/PvWatts';
import MapMenu, { SolarCalculationState } from './MapMenu';
import { Styles } from './Styles';

class SolarMap extends Component<ISolarMapProps, ISolarMapState> {
	private readonly POLYGON_UPDATE_WAIT = 250; // 0.25 seconds
	private readonly SOLAR_CALCULATION_WAIT = 1000; // 1 second

	private pvWattsApi: PvWattsApi;

	private moduleEfficiency = 0.15;
	private polygonUpdateTimeout: number = -1;
	private solarCalculationTimeout: number = -1;
	private hasDrawnPolygon = false;

	constructor(props: ISolarMapProps) {
		super(props);

		this.pvWattsApi = new PvWattsApi();
		
		this.state = {
			solarCalculationState: SolarCalculationState.blank,
		};
	}

	public render() {
		return (
			<div className="solarmap">
				<div id="mapbox-container" className="mapbox-container"></div>
				<MapMenu solarCalculationState={this.state.solarCalculationState} solarCalculationStateMessage={this.state.solarCalculationStateMessage}/>
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
						align-items: center;
					}
					.mapboxgl-ctrl-top-right > .mapboxgl-ctrl {
						flex-shrink: 1;
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

		MapboxDraw.modes.static = StaticMode;
		const draw = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
				polygon: true,
				trash: true
			},
			defaultMode: 'static',
			styles: Styles.DrawStyles,
		});
		map.addControl(draw);

		map.on('draw.create', (evt) => {
			this.hasDrawnPolygon = true;
			this.UpdatePolygon(evt, draw);
		});
		map.on('draw.delete', (evt) => {
			this.hasDrawnPolygon = false;
			this.UpdatePolygon(evt, draw);
		});
		map.on('draw.update', (evt) => this.UpdatePolygon(evt, draw));

		map.on('zoomend', (evt) => {
			if (map.getZoom() < 16)
				draw.changeMode('static');
			else
				draw.changeMode(this.hasDrawnPolygon ? 'simple_select' : 'draw_polygon')
		});
	}

	private UpdatePolygon(evt: Event, draw: MapboxDraw): void {
		const polygonData = draw.getAll();

		if (polygonData.features.length > 0) {
			// Loading indicator to show data isn't up to date
			this.SetSolarCalculationState(SolarCalculationState.loading);

			// Don't update on every change, only every 250ms; calculating area is potentially expensive
			if (this.polygonUpdateTimeout === -1) {
				this.polygonUpdateTimeout = window.setTimeout(() => {
					this.polygonUpdateTimeout = -1;
					this.UpdatePolygonCalculations(polygonData);
				}, this.POLYGON_UPDATE_WAIT);
			}
		} else { // Polygon deleted
			this.SetSolarCalculationState(SolarCalculationState.blank);

			if (evt.type !== 'draw.delete')
				alert('Use the draw tools to draw a polygon!');
		}
	}

	private UpdatePolygonCalculations(polygonData: any): void {
		console.debug("UpdatePolygonCalculations");
		// Reset solar calculation timeout. We only make a query at most SOLAR_CALCULATION_WAIT ms so that requests 
		// aren't being made while the user is currently updating the polygon, and so that we don't overload the API.
		if (this.solarCalculationTimeout >= 0)
			clearTimeout(this.solarCalculationTimeout);

		this.solarCalculationTimeout = window.setTimeout(() => {
			this.solarCalculationTimeout = -1;

			// Make request for solar calculation and handle result
			const solarCalculation = this.UpdateSolarCalculation(polygonData);
			this.HandleSolarCalculation(solarCalculation);
		}, this.SOLAR_CALCULATION_WAIT);
	}

	/**
	 * Requests the PvWatts API to calculate the solar array output.
	 * @param polygonData Mapbox GeoJSON data for calculating 
	 */
	private async UpdateSolarCalculation(polygonData: any) {
		console.debug("UpdateSolarCalculation");
		// Use turf to calculate necessary/relevant info about the polygon
		const area = turf.area(polygonData); // square meters
		const system_capacity = area * this.moduleEfficiency; // DC System Size in kW
		if (system_capacity > 500000)
			throw "System capacity exceeds the maximum, please reduce the area or decrease module efficiency.";

		if (system_capacity < 0.05)
			throw "System capacity does not meet minimum, please increase the area or module efficiency.";

		const centroid = turf.centroid(polygonData);
		if (!centroid.geometry)
			throw "Could not calculate centroid of polygon.";

		const [lon, lat] = centroid.geometry.coordinates;

		// First update immediately calculatable values: area and nominal power

		return this.pvWattsApi.GetPvWattsData({ system_capacity, lat, lon });
	}

	private HandleSolarCalculation(solarCalculation: Promise<PvWatts.Response>): void {
		console.debug("HandleSolarCalculation");
		solarCalculation.then((response) => {
			if (response.errors)
				this.SetSolarCalculationState(SolarCalculationState.error, undefined, response.errors.join('\r\n"'));

			this.SetSolarCalculationState(SolarCalculationState.value, response.outputs);
		});
		
		solarCalculation.catch((reason) => {
			console.error(reason);
			this.SetSolarCalculationState(SolarCalculationState.error, undefined, reason instanceof Error ? reason.message : undefined);
		});
	}

	private SetSolarCalculationState(state: SolarCalculationState, values?: PvWatts.ResponseOutput, errorMessage?: string) {
		this.setState({ solarCalculationStateMessage: errorMessage });
		
		// Set menu styles and text
		if (state === SolarCalculationState.blank) {
			this.setState({ solarCalculationState: SolarCalculationState.blank });
		} else if (state === SolarCalculationState.loading) {
			this.setState({ solarCalculationState: SolarCalculationState.loading });
		} else if (state === SolarCalculationState.error) {
			this.setState({ solarCalculationState: SolarCalculationState.error });
		} else if (state === SolarCalculationState.value) {
			this.setState({ solarCalculationState: SolarCalculationState.value });

			// Set solar calulation values
			console.debug(values)
		}
	}
}

interface ISolarMapProps {
}

interface ISolarMapState {
	solarCalculationState: SolarCalculationState;
	solarCalculationStateMessage?: string;
}

export default SolarMap;
