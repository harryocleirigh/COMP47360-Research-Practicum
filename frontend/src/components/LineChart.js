import React, {useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import {
    Chart as ChartJS,
  } from "chart.js";
import { useMapContext } from './MapContext';
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
    annotationPlugin
  );

function LineChart ({map})  {

      const {neighbourhoods, eventID, eventComparisonData} = useMapContext();
      
      useEffect(() => {
        console.log('logging comparison data inside the line chart component', eventComparisonData)
      }, [eventComparisonData])

      const zones = neighbourhoods.features;
      
      // Extract the 'zone' property from each object in the `features` array
      const zoneOptions = zones.map((event) => event.properties.zone);
      const zoneKeys = zones.map((event) => event.properties.location_id);
    
      const [selectedZone, setSelectedZone] = useState('4');
      const [prevSelectedZone, setPrevSelectedZone] = useState('4');
      const [selectedZoneName, setSelectedZoneName] = useState('Alphabet City');
      const [dataValues, setDataValues] = useState([]);
      const [labels, setLabels] = useState([]);

      map.current.setPaintProperty(selectedZone + '-line', 'line-width', 4);

      const dropDownOptions = zoneOptions.map((zone, index) => (
        <option key={index} value={zone} data-zone-id={zoneKeys[index]}>
          {zone}
        </option>
      ));

      const times = [[9,12], [19,22], [11,17], [12,17], [18,23], [13,16], [11,13], [20,22]];

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Busyness Score',
            data: dataValues,
            fill: {
                target: 'origin', // Fill area below the line and above y=0
                above: 'rgba(255, 0, 0, 0.4)', // Red color above y=0
                below: 'rgba(0, 255, 0, 0.4)', // Green color below y=0
              },
            borderColor: 'rgb(255, 255, 255, 0.7)',
            tension: 0.1,
          }
        ]
};
      const options = {
        responsive: true,
        maintainAspectRatio: false, 
        aspectRatio: 4,
        plugins: {
          annotation: {
            annotations: {
              startLine: {
                type: 'line', // Use 'line' for line annotation
                mode: 'vertical', // 'vertical' to create a vertical line
                scaleID: 'x', // Use 'x' scale for x-axis
                value: times[eventID - 1][0], // Value where the line will be drawn (start time)
                borderColor: 'rgba(255, 99, 132, 0.9)', // Color of the line
                borderWidth: 2, // Width of the line
                label: {
                  content: 'Start', // Label text for the line
                  display: true, // Show the label
                  position: 'start',
                  backgroundColor: 'rgba(255, 99, 132)'
                },
              },
              endLine: {
                type: 'line', // Use 'line' for line annotation
                mode: 'vertical', // 'vertical' to create a vertical line
                scaleID: 'x', // Use 'x' scale for x-axis
                value: times[eventID - 1][1], // Value where the line will be drawn (end time)
                borderColor: 'rgba(255, 99, 132, 0.9)', // Color of the line
                borderWidth: 2, // Width of the line
                label: {
                  content: 'End', // Label text for the line
                  display: true, // Show the label
                  position: 'start',
                  backgroundColor: 'rgba(255, 99, 132)'
                }
            },
              line1: {
                type: 'line', // Use 'line' for line annotation
                mode: 'horizontal', // 'horizontal' to create a horizontal line
                scaleID: 'y', // Use 'y' scale for y-axis
                value: 0, // Value where the line will be drawn (y=0)
                borderColor: 'rgba(0, 0, 0, 0.7)', // Color of the line
                borderWidth: 2, // Width of the line
              },
            }
          }
        },
        // scales: {
        //     x: {
        //       title: {
        //         display: true,
        //         text: 'Time', // Your x-axis title here
        //       },
        //     }
        // },
        
      };

      useEffect(() => {
        
        // Update the chart data whenever the selectedZone state changes
        const updatedDataValues = [];
        const updatedLabels = [];
        
        for (let key in eventComparisonData) {

          const currentBusynessValue = eventComparisonData[key][selectedZone];
          const currentTimeValue = key;
        
          updatedDataValues.push(currentBusynessValue);
          updatedLabels.push(currentTimeValue);
        }

        setDataValues(updatedDataValues);
        setLabels(updatedLabels);

        if (prevSelectedZone !== selectedZone && map.current) {
            map.current.setPaintProperty(prevSelectedZone + '-line', 'line-width', 0); // Set to the default line width
            setPrevSelectedZone(selectedZone); // Update the previously selected zone
          }
        }, [selectedZone, eventComparisonData, map, prevSelectedZone]);

      return (
        <div>
            
          <select className='floating-nav-dropdown'
            value={selectedZoneName}
            onChange={(e) => {
                
                setSelectedZone(e.target.options[e.target.selectedIndex].dataset.zoneId);
                setSelectedZoneName(e.target.value);
            }}
          >
            {dropDownOptions}
          </select>
    
          <div className='line-chart-container'>
            <Line  options={options} data={chartData}/>
          </div>
        </div>
      );
    };

    
    export default LineChart;
    
