import * as PvWatts from './PvWatts';

/**
 * Tool for making API requests to PVWatts V6
 * API documentation online at https://developer.nrel.gov/docs/solar/pvwatts/v6/#request-parameters
 */

export default class PvWattsApi {
    private apiOptions: PvWattsApiOptions;
    private apiAdvancedOptions: PvWattsApiAdvancedOptions;

    constructor(options: PvWattsApiOptions, advancedOptions: PvWattsApiAdvancedOptions) {
        this.apiOptions = options;
        this.apiAdvancedOptions = advancedOptions;
    }

    public async GetPvWattsData(requestOptions: PvWattsRequestOptions): Promise<PvWatts.Response> {
        // Set up request parameters with default values
        const requestParameters: PvWatts.RequestParameters = {
            format: "json",
            api_key: null,
            system_capacity: 4,
            module_type: PvWatts.ModuleType.standard,
            losses: 14.08,
            array_type: PvWatts.ArrayType.fixed_open_rack,
            tilt: 20,
            azimuth: 180,
            lat: 42.3816019,
            lon: -71.0783428,
            radius: 0,
            timeframe: "monthly",
            dc_ac_ratio: 1.2,
            gcr: 0.4,
            inv_eff: 96,
        };

        // Overwrite requestParameter default values with options from class & request
        Object.assign(requestParameters, this.apiOptions);
        Object.assign(requestParameters, this.apiAdvancedOptions);
        Object.assign(requestParameters, requestOptions);

        const pvWattsResponse: PvWatts.Response = await (await fetch('api/PvWatts', {
			method: 'POST',
			headers: {
			    'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestParameters),
        })).json();
        
        return pvWattsResponse;
    }
}

/** Subset of PvWattsRequestParameters that is set once at startup */
interface PvWattsApiOptions {
    /** 
     * Nameplate capacity (kW).
     * Range: 0.05 to 500000
     */
    system_capacity?: number;

    /** Module type. */
    module_type?: PvWatts.ModuleType;

    /** 
     * System losses (percent).
     * Range: -5.0 to 99.0
     */
    losses?: number;

    /** Array type. */
    array_type?: PvWatts.ArrayType;

    /** 
     * Tilt angle (degrees).
     * Range: 0.0 to 90.0
     */
    tilt?: number;

    /** 
     * Azimuth angle (degrees). 
     * Min: 0.0
     * Max: < 360.0
     */
    azimuth?: number;
}

interface PvWattsApiAdvancedOptions {
    /**
     * DC to AC ratio.
     * Default: 1.2
     * Range: must be positive
     */
    dc_ac_ratio?: number;

    /**
     * Ground coverage ratio.
     * Default: 0.4
     * Range: 0.0 - 3.0
     */
    gcr?: number;

    /**
     * Inverter efficiency at rated power.
     * Default: 96
     * Range: 90.0 - 99.5
     */
    inv_eff?: number;
}

/** Subset of PvWattsRequestParameters that is set by the caller each request */
interface PvWattsRequestOptions {
    /** 
     * The latitude for the location to use.
     * Range: -90.0 to 90.0
     */
    lat?: number;

    /** 
     * The longitude  for the location to use.
     * Range: -180.0 to 180.0
     */
    lon?: number;
}