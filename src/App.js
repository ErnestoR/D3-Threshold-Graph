import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Graph from './Graph';

const data = [
  {
    "name": "device A",
    "values": [
      {
        "id": "14d105b2-d569-4503-8535-1370de4343b8",
        "date": "1/2/2017",
        "health": 54
      },
      {
        "id": "865fb1c1-953d-45d2-82b8-7c1f09d68ac7",
        "date": "2/2/2017",
        "health": 10
      },
      {
        "id": "350c0ba0-be0b-43f4-8951-c74372954f80",
        "date": "3/2/2017",
        "health": 60
      },
      {
        "id": "48401fa9-6582-4556-8bbc-8384775ae87c",
        "date": "4/2/2017",
        "health": 96
      },
      {
        "id": "c2153015-eb83-4f77-97f8-6e1cfdfbf4f4",
        "date": "5/2/2017",
        "health": 68
      },
      {
        "id": "9c879d00-75de-40ba-af0c-1be25cbd884a",
        "date": "6/2/2017",
        "health": 20
      },
      {
        "id": "16f3fcd5-cbe3-4a9a-b1d1-7bf2cb3513c3",
        "date": "7/2/2017",
        "health": 9
      }
    ]
  },
  {
    "name": "device B",
    "values": [
      {
        "id": "d24551cf-80d5-440d-ab80-94bc637405be",
        "date": "1/2/2017",
        "health": 98
      },
      {
        "id": "d48a4bea-bbcd-49a7-b41a-af6587458a6a",
        "date": "2/2/2017",
        "health": 47
      },
      {
        "id": "4f39a28d-b115-4191-9730-f4e3f8da5d1d",
        "date": "3/2/2017",
        "health": 70
      },
      {
        "id": "19346c28-9e32-492a-bb7d-2d52c02d1805",
        "date": "4/2/2017",
        "health": 67
      },
      {
        "id": "f2bdf307-ac32-4c8e-89e5-30ceeaafc8ba",
        "date": "5/2/2017",
        "health": 84
      },
      {
        "id": "9a6e5049-8774-4d45-baa2-7b3a9ca550a8",
        "date": "6/2/2017",
        "health": 62
      },
      {
        "id": "ef9544b8-6865-4763-ba61-fc1b78f24c8c",
        "date": "7/2/2017",
        "health": 53
      }
    ]
  },
  {
    "name": "device C",
    "values": [
      {
        "id": "06d4f5ac-56d5-401d-8651-88fbe56ff6b1",
        "date": "1/2/2017",
        "health": 42
      },
      {
        "id": "faabd1cc-ffc9-495f-9d6a-8485eaa059a3",
        "date": "2/2/2017",
        "health": 48
      },
      {
        "id": "5c31003a-0216-4506-ad25-ddba1f57fbcd",
        "date": "3/2/2017",
        "health": 17
      },
      {
        "id": "c55deddc-0f02-4421-b6cd-2c751482ccf2",
        "date": "4/2/2017",
        "health": 81
      },
      {
        "id": "08f66f38-eb39-4e30-a9a9-3845f7267ec3",
        "date": "5/2/2017",
        "health": 82
      },
      {
        "id": "1194d3f6-d634-4253-a0cd-a03c63aeb584",
        "date": "6/2/2017",
        "health": 8
      },
      {
        "id": "13fd671f-76ec-43b5-a5ca-a06e49bf6e69",
        "date": "7/2/2017",
        "health": 76
      }
    ]
  }
]


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Threshold Graph</h1>
        </header>
        <Graph data={data}/>
      </div>
    );
  }
}

export default App;
