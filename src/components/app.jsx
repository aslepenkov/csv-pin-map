import React, { Component } from 'react';
import { YMaps, Map, Placemark, FullscreenControl } from 'react-yandex-maps';
import CSVReader from 'react-csv-reader';
import ResultsMap from './resultsMap';
import _ from 'lodash';
import { trackPromise } from 'react-promise-tracker';
import Draggable from 'react-draggable';
import {
  Form,
  Container,
  Row,
  Col,
  Button,
  Nav,
  Navbar,
  NavDropdown,
  FormControl
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/app.css';

class App extends Component {
  state = {
    file: {},
    longtitudeColumnName: 'gps_longitude',
    latitudeColumnName: 'gps_latitude',
    pins: []
  };

  render() {
    const { pins } = this.state;
    return (
      <div className="content">
        <div className="nav">
          <Navbar className="bg-light justify-content-between">
            <Navbar.Brand href="#">CSV-PIN-MAP</Navbar.Brand>
            <Nav className="mr-auto">
              <Form inline>
                <FormControl
                  type="text"
                  className="input"
                  placeholder="Latitude Column name"
                  id="gps_latitude"
                  onChange={this.onChangeInputY} //north-south
                />

                <FormControl
                  type="text"
                  className="input"
                  placeholder="Longtitude Column name"
                  id="gps_longitude"
                  onChange={this.onChangeInputX} //south-north
                />
              </Form>
            </Nav>
            <Form inline>
              <Button variant="outline-secondary">
                <CSVReader onFileLoaded={data => this.handleData(data)} />
              </Button>
            </Form>
          </Navbar>
        </div>
        <div className="mapOverlay"></div>
        <ResultsMap results={pins} />
      </div>
    );
  }
  loadItems = (latName, longName) => {
    const csvData = this.state.file;
    if (csvData[0] === undefined) return;
    latName = latName ?? this.state.latitudeColumnName;
    longName = longName ?? this.state.longtitudeColumnName;
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
      if (items)
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
