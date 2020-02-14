/// <reference types="mapbox-gl" />

declare namespace __MapboxDraw {
    interface Options {
        displayControlsDefault?: boolean,
        controls?: DrawControls,
        defaultMode?: string,
        styles?: { [key: string]: any; }[],
    }

    interface DrawControls {
        polygon?: boolean,
        trash?: boolean
    }
}

declare class MapboxDraw extends mapboxgl.Control {
    constructor(options?: __MapboxDraw.Options);

    getAll(): any;
    changeMode(mode: string): void;

    on(type: string, listener: Function): this;
    on(type: string, layer: string, listener: Function): this;
    
    /**
     * Remove an event
     * @param type Event name.
     * @param fn Function that should unsubscribe to the event emitted.
     */
    off(type: string, listener: (Event) => any): this;
    off(type: string, layer: string, listener: (Event) => any): this;

    static modes: any = {
        SIMPLE_SELECT: 'simple_select',
        DIRECT_SELECT: 'direct_select',
        DRAW_POINT: 'draw_point',
        DRAW_POLYGON: 'draw_polygon',
        DRAW_LINE_STRING: 'draw_line_string',
    };
}

declare module '@mapbox/mapbox-gl-draw' {
    export = MapboxDraw;
}