import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Stats from 'stats.js';

class SnakeApp extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.size = 40;
    this.scale = 20;
    this.cameraPosition = new THREE.Vector3(0, 0, 3000);
    this.gridPosition = new THREE.Vector3();
    this.gridRotate = new THREE.Euler(Math.PI/2, 0, 0);

    // the edge at gridScale * gridSize / -gridScale * gridSize
    // gridStep is the number of division of each axis
    this.gridSize = this.size;
    this.gridStep = 40;
    this.gridScale = new THREE.Vector3(20, 20, 20);

    this.sideLength = 2 * this.size * this.scale / this.gridStep;

    this.state = {
      player: [
        {
          user: "1",
          path: [
            new THREE.Vector3(0, 0, 0.5).multiplyScalar(this.sideLength), 
            new THREE.Vector3(1, 0, 0.5).multiplyScalar(this.sideLength)
          ],
          direction: "right",
        },
        {
          user: "2",
          path: [
            new THREE.Vector3(0, 0, 0.5).multiplyScalar(this.sideLength), 
            new THREE.Vector3(-1, 0, 0.5).multiplyScalar(this.sideLength)
          ],
          direction: "right",
        }
      ],
    };

    this.move = this.move.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown, false);

    this.timerID = setInterval(
        () => this.move(),
        1000
    );
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKeyDown, false);
    clearInterval(this.timerID);
    //delete this.stats;
  }

  _onKeyDown = (event) => {
    console.log(event.keyCode);
  }
  
  move = () => {
    let playerInfo = this.state.player;
    let playerVertices = [
      [
        playerInfo[0].path[0],
        playerInfo[0].path[1],
      ],
      [
        playerInfo[1].path[0],
        playerInfo[1].path[1],
      ]
    ];
    playerVertices[0][0].x = playerVertices[0][0].x + this.sideLength;
    playerVertices[0][1].x = playerVertices[0][1].x + this.sideLength;
    playerVertices[1][0].x = playerVertices[1][0].x + this.sideLength;
    playerVertices[1][1].x = playerVertices[0][1].x + this.sideLength;

    playerInfo[0].path[0] = playerVertices[0][0];
    playerInfo[0].path[1] = playerVertices[0][1];
    playerInfo[1].path[0] = playerVertices[1][0];
    playerInfo[1].path[1] = playerVertices[1][1];
    this.setState({ player: playerInfo });
    console.log('I move');
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    const userPath = this.state.player[0].path;
    let shape = [];
    for(let i = 0, l = this.state.player[0].path.length; i<l; i++) {
      let s = new THREE.Shape();
      s.moveTo(userPath[i].x, userPath[i].y);
      s.lineTo(userPath[i].x + this.sideLength, userPath[i].y);
      s.lineTo(userPath[i].x + this.sideLength, userPath[i].y + this.sideLength);
      s.lineTo(userPath[i].x, userPath[i].y + this.sideLength);
      shape.push(s);
    }

    return (<React3
      mainCamera="camera" // this points to the perspectiveCamera below
      width={width}
      height={height}
      ref="react3"
    >
      <scene>
        <perspectiveCamera
          name="camera"
          fov={25}
          aspect={width / height}
          near={0.1}
          far={5000}
          lookAt={this.gridPosition}
          position={this.cameraPosition}
        />
        <gridHelper 
          size={this.gridSize}
          step={this.gridStep}
          scale={this.gridScale}
          rotation={this.gridRotate}
          colorCenterLine={0xffffff}
        />
        <cameraHelper
          cameraName="camera"
        />
        <object3D>
          <mesh>
            <extrudeGeometry
              shapes={shape}
              steps={2}
              amount={20}
              bevelEnable={true}
              bevelThickness={20}
              bevelSize={10}
              bevelSegments={1}
              dynamic={true}
            />
            <meshNormalMaterial
            />
          </mesh>
        </object3D>

      </scene>
    </React3>);
  }
}

export default SnakeApp;

