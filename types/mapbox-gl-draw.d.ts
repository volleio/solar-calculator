/// <reference types="mapbox-gl" />

declare namespace __MapboxDraw {
    interface Options {
        displayControlsDefault?: boolean,
        controls?: DrawControls,
        modes?: Mode,
        styles?: { [key: string]: any; }[],
    }

    interface DrawControls {
        polygon?: boolean,
        trash?: boolean
    }

    enum Mode {
        SIMPLE_SELECT,
        DIRECT_SELECT,
        DRAW_POINT,
        DRAW_POLYGON,
        DRAW_LINE_STRING,
    }
}

declare class MapboxDraw extends mapboxgl.Control {
    constructor(options?: __MapboxDraw.Options);

    getAll(): any;

    on(type: string, listener: Function): this;
    on(type: string, layer: string, listener: Function): this;
    
    /**
     * Remove an event
     * @param type Event name.
     * @param fn Function that should unsubscribe to the event emitted.
     */
    off(type: string, listener: (Event) => any): this;
    off(type: string, layer: string, listener: (Event) => any): this;

    static readonly modes: typeof __MapboxDraw.Mode;
}

declare module '@mapbox/mapbox-gl-draw' {
    export = MapboxDraw;
}