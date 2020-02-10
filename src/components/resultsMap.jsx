import React from 'react';
import { YMaps, Map, Placemark, FullscreenControl } from 'react-yandex-maps';

const ResultsMap = props => {
  const pins = props.results;
  if (!pins.length) {
    return <div>csv error/no data</div>;
  }
  //console.log(pins);
  return (
    <div className="yandexMap">
      {
        <YMaps>
          <Map
            height={window.innerHeight - 30}
            width={window.innerWidth}
            defaultState={{ center: [0, 0], zoom: 2 }}
          >
            {pins}
            <FullscreenControl />
          </Map>
        </YMaps>
      }
    </div>
  );
};

export default ResultsMap;
