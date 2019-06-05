import React from 'react';
import L from 'leaflet';
import { MapLayer, withLeaflet } from 'react-leaflet';
import PropTypes from 'prop-types';

export type LngLat = {
  lng: number;
  lat: number;
}

export type Point = {
  x: number;
  y: number;
}

export type Bounds = {
  contains: (latLng: LngLat) => boolean;
}

export type Pane = {
  appendChild: (element: Object) => void;
}

export type Panes = {
  overlayPane: Pane;
}

export type Map = {
  layerPointToLatLng: (lngLat: Point) => LngLat;
  latLngToLayerPoint: (lngLat: LngLat) => Point;
  on: (event: string, handler: () => void) => void;
  getBounds: () => Bounds;
  getPanes: () => Panes;
  invalidateSize: () => void;
  options: Object;
}

export type LeafletZoomEvent = {
  zoom: number;
  center: Object;
}


function safeRemoveLayer(leafletMap: Map, el): void {
  const { overlayPane } = leafletMap.getPanes();
  if (overlayPane && overlayPane.contains(el)) {
    overlayPane.removeChild(el);
  }
}

export default withLeaflet(class CanvasLayer extends MapLayer {

  static propTypes = {
    drawMethod: PropTypes.func,
  };
  createLeafletElement() {
    return null;
  }

  componentDidMount(): void {
    const canAnimate = this.props.leaflet.map.options.zoomAnimation && L.Browser.any3d;
    const zoomClass = `leaflet-zoom-${canAnimate ? 'animated' : 'hide'}`;
    const mapSize = this.props.leaflet.map.getSize();

    this._el = L.DomUtil.create('canvas', zoomClass);
    this._el.width = mapSize.x;
    this._el.height = mapSize.y;

    const el = this._el;

    const _CanvasLayer = L.Layer.extend({
      onAdd: (leafletMap) => leafletMap.getPanes().overlayPane.appendChild(el),
      addTo: (leafletMap) => {
        leafletMap.addLayer(this);
        return this;
      },
      onRemove: (leafletMap) => safeRemoveLayer(leafletMap, el)
    });

    this.leafletElement = new _CanvasLayer();
    super.componentDidMount();
    this.reset();

    this.attachEvents();
  }


  componentWillUnmount(): void {
    safeRemoveLayer(this.props.leaflet.map, this._el);
  }

  componentDidUpdate(): void {
    this.props.leaflet.map.invalidateSize();
    this.reset();
  }

  shouldComponentUpdate(): boolean {
    return true;
  }

  attachEvents(): void {
    const leafletMap: Map = this.props.leaflet.map;
    leafletMap.on('viewreset', () => this.reset());
    leafletMap.on('moveend', () => this.reset());
    if (leafletMap.options.zoomAnimation && L.Browser.any3d) {
      leafletMap.on('zoom', this._onZoom, this);
      leafletMap.on('zoomanim', this._onAnimZoom, this);
    }
  }

  _onAnimZoom(ev) {
    this._updateTransform(ev.center, ev.zoom);
  }

  _onZoom() {
    const map = this.props.leaflet.map;
    this._updateTransform(map.getCenter(), map.getZoom());
  }

  _updateTransform(center: LngLat, zoom: number) {
    const map = this.props.leaflet.map;

    const scale = map.getZoomScale(zoom, this._zoom),
      position = L.DomUtil.getPosition(this._el),
      viewHalf = map.getSize().multiplyBy(0.5),
      currentCenterPoint = map.project(this._center, zoom),
      destCenterPoint = map.project(center, zoom),
      centerOffset = destCenterPoint.subtract(currentCenterPoint);

    const topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

    L.DomUtil.setTransform(this._el, topLeftOffset, scale);
  }

  reset(): void {
    const map = this.props.leaflet.map;
    const topLeft = map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._el, topLeft);

    const size = this.props.leaflet.map.getSize();

    if (this._el.width !== size.x) {
      this._el.width = size.x;
    }
    if (this._el.height !== size.y) {
      this._el.height = size.y;
    }

    if (this._el && !this._frame && !this.props.leaflet.map._animating) {
      this._frame = L.Util.requestAnimFrame(this.redraw, this);
    }

    this.redraw();

    this._center = map.getCenter();
    this._zoom = map.getZoom();
  }

  redraw(): void {
    const size = this.props.leaflet.map.getSize();
    const bounds = this.props.leaflet.map.getBounds();
    const zoom = this.props.leaflet.map.getZoom();
    const center =this.props.leaflet.map.getCenter();
    const corner = this.props.leaflet.map.containerPointToLatLng(this.props.leaflet.map.getSize());
    const data = this.props.data;
    this.props.drawMethod && this.props.drawMethod({
      map: this.props.leaflet.map,
      canvas: this._el,
      bounds,
      size,
      zoom,
      center,
      corner,
      data
    });

    this._frame = null;
  }


  render(): React.Element {
    return null;
  }

});
