# react-leaflet-canvas-layer
a canvas layer for react-leaflet.

## install
```
yarn add react-leaflet-canvas-layer # yarn 
npm install react-leaflet-canvas-layer # npm 
```

## Usage
```
import React from 'react';
import { render } from 'react-dom';
import { Map, TileLayer } from 'react-leaflet';
import CanvasLayer from 'react-leaflet-canvas-layer';

class App extends React.Component {
  drawMethod(info) {
    const ctx = info.canvas.getContext('2d');
    ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);
    ctx.fillStyle = 'rgba(255,116,0, 0.2)';
    var point = info.map.latLngToContainerPoint([-37, 175]);
    ctx.beginPath();
    ctx.arc(point.x, point.y, 200, 0, Math.PI * 2.0, true, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  render() {
    return (
      <div>
        <Map center={[-37, 175]} zoom={13}>
          <CanvasLayer
            drawMethod={this.drawMethod}
          />
          <TileLayer
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png"
          />
        </Map>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));

```

## API

`CanvasLayer` component props:

- `data`: a custom dataset
- `drawMethod`: *required* a custom render function  e.g. `(view) => { /*draw something*/}`
    view contains parameters :map, canvas, bounds, size, zoom, center, corner, data.
## License
MIT.
