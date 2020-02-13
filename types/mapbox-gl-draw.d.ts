/// <reference types="mapbox-gl" />

declare namespace __MapboxDraw {
    interface Options {
        displayControlsDefault?: boolean,
        controls: {
            polygon?: boolean,
            trash?: boolean
        }
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
}

declare module '@mapbox/mapbox-gl-draw' {
    export = MapboxDraw;
}