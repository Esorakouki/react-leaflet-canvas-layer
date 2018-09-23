import React from 'react';
import { render } from 'react-dom';
import { Map, TileLayer } from 'react-leaflet';
import CanvasLayer from '../src/CanvasLayer';

class App extends React.Component {
  drawMethod(view) {
    const ctx = view.canvas.getContext('2d');
    ctx.clearRect(0, 0, view.canvas.width, view.canvas.height);
    ctx.fillStyle = 'rgba(255,116,0, 0.2)';
    var point = view.map.latLngToContainerPoint([-37, 175]);
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
