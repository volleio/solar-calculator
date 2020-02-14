/**
 * All of the required paramters for making API requests, as well as recommended optional parameters.
 */
export interface RequestParameters {
    /** The output response format. */
    format: "json" | "xml";

    /** The developer API key. */
    api_key: string | null; // nullable because the API key is set server-side

    /** 
     * Nameplate capacity (kW).
     * Range: 0.05 to 500000
     */
    system_capacity: number;

    /** Module type. */
    module_type: ModuleType;

    /** 
     * System losses (percent).
     * Range: -5.0 to 99.0
     */
    losses: number;

    /** Array type. */
    array_type: ArrayType;

    /** 
     * Tilt angle (degrees).
     * Range: 0.0 to 90.0
     */
    tilt: number;

    /** 
     * Azimuth angle (degrees). 
     * Min: 0.0
     * Max: < 360.0
     */
    azimuth: number;
    
    /** 
     * The latitude for the location to use.
     * Range: -90.0 to 90.0
     */
    lat: number;

    /** 
     * The longitude  for the location to use.
     * Range: -180.0 to 180.0
     */
    lon: number;

    /**
     * Default: 100
     * Must be an integer.
     * The search radius to use when searching for the closest climate data station (miles). 
     * Pass in radius=0 to use the closest station regardless of the distance.
     */
    radius?: number;

    /** 
     * Granularity of the output response. 
     * Default: monthly
     */
    timeframe?: "monthly" | "hourly";

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

export enum ModuleType {
    standard = 0,
    premium = 1,
    thin_film = 2
}

export enum ArrayType {
    fixed_open_rack = 0,
    fixed_roof_mounted = 1,
    one_axis = 2,
    one_axis_backtracking = 3,
    two_axis = 4,
}

export interface Response {
    /** The input parameters received in the request. */
    inputs: RequestParameters;

    /** Any error messages resulting from the request. */
    errors: string[];

    /** Any warnings messages resulting from the request. */
    warnings: string[];

    /** The current version of the web service. */
    version: string;

    /** Information about the SSC library. */
    ssc_info: Object;

    /** Information about the climate data used in the simulation. */
    station_info: ResponseStationInfo;

    /** The data outputs from the simulation. */
    outputs: ResponseOutput;
}

export interface ResponseStationInfo {
    /** Latitude of the climate station. */
    lat: number;	

    /** Longitude of the climate station. */
    lon: number;	

    /** Elevation of the climate station. (meters) */
    elev: number;	

    /** Timezone offset from GMT. */
    tz: number;	

    /** ID of the climate station. */
    location: string;	

    /** City where climate station is located. */
    city: string;	

    /** State where climate station is located. */
    state: string;	

    /** Solar resource filename. */
    solar_resource_file: string;	

    /** Distance between the input location and the climate station. (meters) */
    distance: number;
}

export interface ResponseOutput {
    /**
     * Monthly plane of array irradiance values. (kWh/m2) 
     * The array of values represents the value for each month, 
     * with the first element being for January and the last element being for December.
     */
    poa_monthly: number[];

    /**
     * Monthly DC array output. (kWhdc) 
     * The array of values represents the value for each month, 
     * with the first element being for January and the last element being for December.
     */
    dc_monthly: number[];

    /**
     * Monthly AC system output. (kWhac) 
     * The array of values represents the value for each month, 
     * with the first element being for January and the last element being for December.
     */
    ac_monthly: number[];

    /**
     * Annual AC system output. (kWhac)
     */
    ac_annual: number;

    /**
     * Monthly solar radiation values. (kWh/m2/day) 
     * The array of values represents the value for each month, 
     * with the first element being for January and the last element being for December.
     */
    solrad_monthly: number[];

    /**
     * Annual solar radiation values. (kWh/m2/day)
     */
    solrad_annual: number;

    /**
     * The ratio of the system's predicted electrical output in the first year of operation to the nameplate output, 
     * which is equivalent to the quantity of energy the system would generate if it operated at its nameplate capacity 
     * for every hour of the year. (AC-to-DC)
     */
    capacity_factor: number;

    /**
     * Hourly AC system output (only when timeframe=hourly). (Wac)
     */
    ac: number[];

    /**
     * Hourly plane of array irradiance (only when timeframe=hourly). (W/m2)
     */
    poa: number[];

    /**
     * Hourly beam normal irradiance (only when timeframe=hourly). (W/m2)
     */
    dn: number[];

    /**
     * Hourly DC array output (only when timeframe=hourly). (Wdc)
     */
    dc: number[];

    /**
     * Hourly diffuse irradiance (only when timeframe=hourly). (W/m2)
     */
    df: number[];

    /**
     * Hourly ambient temperature (only when timeframe=hourly). (C)
     */
    tamb: number[];

    /**
     * Hourly module temperature (only when timeframe=hourly) (C)
     */
    tcell: number[];

    /**
     * Hourly windspeed (only when timeframe=hourly). (m/s)
     */
    wspd: number[];
}
