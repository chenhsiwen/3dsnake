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
    this.gridStep = 20;
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
          direction: 39,
        },
        {
          user: "2",
          path: [
            new THREE.Vector3(-1, -1, 0.5).multiplyScalar(this.sideLength), 
            new THREE.Vector3(-2, -1, 0.5).multiplyScalar(this.sideLength)
          ],
          direction: 37,
        }
      ],
    };

    this.move = this.move.bind(this);
    this._checkLeft = this._checkLeft.bind(this);
    this._checkRight = this._checkRight.bind(this);
    this._checkForward = this._checkForward.bind(this);
    this._checkBackward = this._checkBackward.bind(this);
    this._shouldUp = this._shouldUp.bind(this);
    this._shouldDown = this._shouldDown.bind(this);
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
  }

  _onKeyDown = (event) => {
    console.log(event.keyCode);
    let playerInfo = this.state.player;
    switch(event.keyCode) {
      case 37:
        if(this._checkLeft(playerInfo[0].path)) {
          playerInfo[0].direction = 37;
        }
        break;
      case 38:
        if(this._checkForward(playerInfo[0].path)) {
          playerInfo[0].direction = 38;
        }
        break;
      case 39:
        if(this._checkRight(playerInfo[0].path)) {
          playerInfo[0].direction = 39;
        }
        break;
      case 40:
        if(this._checkBackward(playerInfo[0].path)) {
          playerInfo[0].direction = 40;
        }
        break;
    }
    this.setState({ player: playerInfo });
  }
  
  move = () => {
    let playerInfo = this.state.player;
    let playerVertices = [
      playerInfo[0].path,
      playerInfo[1].path
    ];
    let next = new THREE.Vector3();
    const now = playerVertices[0][playerVertices[0].length - 1];
    if(this._shouldDown(playerVertices[0])) {
      next.set(now.x, now.y, now.z - this.sideLength);
    } else if(this._shouldUp(playerVertices[0])) {
      next.set(now.x, now.y, now.z + this.sideLength);
    } else {
      switch(this.state.player[0].direction){
        case 37:
          console.log('left');
          next.set(now.x - this.sideLength, now.y, now.z);
          break;
        case 38:
          console.log('forward');
          next.set(now.x, now.y + this.sideLength, now.z);
          break;
        case 39:
          console.log('right');
          next.set(now.x + this.sideLength, now.y, now.z);
          break;
        case 40:
          console.log('backward');
          next.set(now.x, now.y - this.sideLength, now.z);
          break;
      }
    }
    playerVertices[0].shift();
    playerVertices[0].push(next);

    playerInfo[0].path = playerVertices[0];
    this.setState({ 
      player: playerInfo 
    });
    console.log('I move');
  }

  _checkLeft = (path) => {
    const now = path[path.length - 1];
    const prev = path[path.length - 2];
    if(now.x - this.sideLength === prev.x && now.y === prev.y && now.z === prev.z) {
      return false;
    }
    return true;
  }

  _checkRight = (path) => {
    const now = path[path.length - 1];
    const prev = path[path.length - 2];
    if(now.x + this.sideLength === prev.x && now.y === prev.y && now.z === prev.z) {
      return false;
    }
    return true;
  }

  _checkForward = (path) => {
    const now = path[path.length - 1];
    const prev = path[path.length - 2];
    if(now.x === prev.x && now.y + this.sideLength === prev.y && now.z === prev.z) {
      return false;
    }
    return true;
  }

  _checkBackward = (path) => {
    const now = path[path.length - 1];
    const prev = path[path.length - 2];
    if(now.x === prev.x && now.y - this.sideLength === prev.y && now.z === prev.z) {
      return false;
    }
    return true;
  }

  _shouldUp = (path) => {
    const now = path[path.length - 1];
    for(let i = 1, l = path.length; i < l - 3; i++) {
      if(now.equals(path[i])) {
        return true;
      }
    }
    return false;
  }

  _shouldDown = (path) => {
    const now = path[path.length - 1];
    console.log('in should down', path);
    console.log(now.x, now.y, now.z);
    const down = new THREE.Vector3(now.x, now.y, now.z - this.sideLength);
    if(down.z < 0) {
      return false;
    }
    for(let i = 1, l = path.length; i < l - 1; i++) {
      if(down.equals(path[i])) {
        return false;
      }
    }
    return true;
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
              amount={this.sideLength}
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

