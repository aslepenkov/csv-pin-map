import React from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';

const ResultsMap = props => {
  const pins = props.results;
  if (!pins.length) {
    return <div>csv error/no data</div>;
  }

  return (
    <div>
      {
        <YMaps>
          <Map height={500} width={1600} defaultState={{ center: [0, 0], zoom: 2 }}>
            {pins}
          </Map>
        </YMaps>
      }
    </div>
  );
};

export default ResultsMap;
