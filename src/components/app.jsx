import React, { Component } from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import CSVReader from 'react-csv-reader';
import _ from 'lodash';
import ResultsMap from './resultsMap';
import { trackPromise } from 'react-promise-tracker';

class App extends Component {
  state = {
    file: {},
    longtitudeColumnName: 'gps__longitude',
    latitudeColumnName: 'gps__latitude',
    pins: []
  };

  render() {
    const { pins } = this.state;
    return (
      <div>
        <input
          type="text"
          placeholder="latitudeColumnName"
          id="gps__latitude"
          onChange={this.onChangeInputY} //north-south
        />
        <input
          type="text"
          id="gps__longitude"
          placeholder="longtitudeColumnName"
          onChange={this.onChangeInputX} // west-east
        />
        <CSVReader onFileLoaded={data => this.handleData(data)} />
        <ResultsMap results={pins} />
      </div>
    );
  }
  loadItems = (latName, longName) => {
    console.log('loadItems');
    console.log('longtitudeColumnName ' + this.state.longtitudeColumnName);
    console.log('latitudeColumnName ' + this.state.latitudeColumnName);
    const csvData = this.state.file;
    if (csvData[0] === undefined) return;

    const lonIndex = csvData[0].findIndex(i => i === longName);
    const latIndex = csvData[0].findIndex(i => i === latName);
    console.log('lon index:' + lonIndex);
    console.log('lat index:' + latIndex);
    return csvData.slice(1).reduce((result, current, i, arr) => {
      let lat = current[latIndex];
      let lon = current[lonIndex];

      if (lat !== undefined && lon !== undefined) result.push([lat, lon]);
      return result;
    }, []);
  };

  flat = (input, depth = 1, stack = []) => {
    for (let item of input) {
      if (item instanceof Array && depth > 0) {
        this.flat(item, depth - 1, stack);
      } else {
        stack.push(item);
      }
    }
    return stack;
  };

  handleData = (csvData, latName, longName) => {
    //start loading
    const prom = new Promise((resolve, reject) => {
      let pins = [];
      this.setState({
        file: csvData
      });
      let items = this.loadItems(latName, longName);

      items.map((e, i) => {
        pins.push(<Placemark key={i} geometry={[e[0], e[1]]} />);
      });
      //setTimeout(() => resolve(items), 3000);
      resolve(pins);
    }).then(
      result => {
        this.setState({
          pins: result
        });
      },
      error => {
        console.log('err: ' + error);
      }
    );

    trackPromise(prom);
  };

  onChangeInputX = event => {
    const columnName = event.currentTarget.value;
    this.setState({ longtitudeColumnName: columnName });
    this.handleData(this.state.file, this.state.latitudeColumnName, columnName);
  };
  onChangeInputY = event => {
    const columnName = event.currentTarget.value;
    this.setState({ latitudeColumnName: columnName });
    this.handleData(this.state.file, columnName, this.state.longtitudeColumnName);
  };
}

export default App;
