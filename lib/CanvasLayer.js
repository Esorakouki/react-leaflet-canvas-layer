'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('react');
var L = _interopDefault(require('leaflet'));
var reactLeaflet = require('react-leaflet');
var PropTypes = _interopDefault(require('prop-types'));

var _class, _temp;

function safeRemoveLayer(leafletMap, el) {
  const { overlayPane } = leafletMap.getPanes();
  if (overlayPane && overlayPane.contains(el)) {
    overlayPane.removeChild(el);
  }
}

var CanvasLayer = reactLeaflet.withLeaflet((_temp = _class = class CanvasLayer extends reactLeaflet.MapLayer {
  createLeafletElement() {
    return null;
  }

  componentDidMount() {
    const canAnimate = this.props.leaflet.map.options.zoomAnimation && L.Browser.any3d;
    const zoomClass = `leaflet-zoom-${canAnimate ? 'animated' : 'hide'}`;
    const mapSize = this.props.leaflet.map.getSize();
    const transformProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);

    this._el = L.DomUtil.create('canvas', zoomClass);
    this._el.style[transformProp] = '50% 50%';
    this._el.width = mapSize.x;
    this._el.height = mapSize.y;

    const el = this._el;

    const _CanvasLayer = L.Layer.extend({
      onAdd: leafletMap => leafletMap.getPanes().overlayPane.appendChild(el),
      addTo: leafletMap => {
        leafletMap.addLayer(this);
        return this;
      },
      onRemove: leafletMap => safeRemoveLayer(leafletMap, el)
    });

    this.leafletElement = new _CanvasLayer();
    super.componentDidMount();
    this.reset();

    this.attachEvents();
  }

  componentWillUnmount() {
    safeRemoveLayer(this.props.leaflet.map, this._el);
  }

  componentDidUpdate() {
    this.props.leaflet.map.invalidateSize();
    this.reset();
  }

  shouldComponentUpdate() {
    return true;
  }

  attachEvents() {
    const leafletMap = this.props.leaflet.map;
    leafletMap.on('viewreset', () => this.reset());
    leafletMap.on('moveend', () => this.reset());
    if (leafletMap.options.zoomAnimation && L.Browser.any3d) {
      leafletMap.on('zoomanim', this._animateZoom, this);
    }
  }

  _animateZoom(e) {
    const scale = this.props.leaflet.map.getZoomScale(e.zoom);
    const offset = this.props.leaflet.map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this.props.leaflet.map._getMapPanePos());

    if (L.DomUtil.setTransform) {
      L.DomUtil.setTransform(this._el, offset, scale);
    } else {
      this._el.style[L.DomUtil.TRANSFORM] = `${L.DomUtil.getTranslateString(offset)} scale(${scale})`;
    }
  }

  reset() {
    const topLeft = this.props.leaflet.map.containerPointToLayerPoint([0, 0]);
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
  }

  redraw() {
    const size = this.props.leaflet.map.getSize();
    const bounds = this.props.leaflet.map.getBounds();
    const zoom = this.props.leaflet.map.getZoom();
    const center = this.props.leaflet.map.getCenter();
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

  render() {
    return null;
  }

}, _class.propTypes = {
  drawMethod: PropTypes.func
}, _temp));

module.exports = CanvasLayer;
