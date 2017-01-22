import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Stats from 'stats.js';

class SnakeApp extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.size = 40;
    this.scale = 20;
    this.cameraPosition = new THREE.Vector3(0, 600, 200);
    this.gridPosition = new THREE.Vector3();

    // the edge at gridScale * gridSize / -gridScale * gridSize
    // gridStep is the number of division of each axis
    this.gridSize = this.size;
    this.gridStep = 40;
    this.gridScale = new THREE.Vector3(20, 20, 10);

    this.sideLength = 2 * this.size * this.scale / this.gridStep;

    this.state = {
      player: [
        {
          user: "1",
          path: [
            new THREE.LineCurve3(
                new THREE.Vector3(0, 0.5, 0.5).multiplyScalar(this.sideLength), 
                new THREE.Vector3(1, 0.5, 0.5).multiplyScalar(this.sideLength)),
            new THREE.LineCurve3(
                new THREE.Vector3(1, 0.5, 0.5).multiplyScalar(this.sideLength), 
                new THREE.Vector3(2, 0.5, 0.5).multiplyScalar(this.sideLength))
            //new THREE.Vector3(0, 0.5, 0.5).multiplyScalar(this.sideLength), 
            //new THREE.Vector3(1, 0.5, 0.5).multiplyScalar(this.sideLength)
          ],
          direction: "right",
        },
        {
          user: "2",
          path: [
            new THREE.LineCurve3(
                new THREE.Vector3(0, -0.5, 0.5).multiplyScalar(this.sideLength), 
                new THREE.Vector3(-1, -0.5, 0.5).multiplyScalar(this.sideLength))
            //new THREE.Vector3(0, -0.5, 0.5).multiplyScalar(this.sideLength), 
            //new THREE.Vector3(-1, -0.5, 0.5).multiplyScalar(this.sideLength)
          ],
          direction: "right",
        }
      ],
    };

    this.player1Curve = (sc) => {
      this.sc = (sc === undefined)? 1: sc;
    };
    this.player1Curve.prototype = Object.create( THREE.Curve.prototype );
    this.player1Curve.prototype.getPoint = (t) => {
      const len = this.state.player[0].path.length;
      let i = Math.floor(t * (len + 1));
      i = (i >= len)? len - 1: i;
      const path = this.state.player[0].path;
      //console.log(i, len, i, len);
      return new THREE.Vector3(path[i].x, path[i].y, path[i].z);
    }

    this.renderSnakeTube = this.renderSnakeTube.bind(this);
    //this.renderSnakeBox = this.renderSnakeBox.bind(this);
    this.move = this.move.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown, false);

    this.timerID = setInterval(
        () => this.move(),
        1000
    );
    //this.stats = new Stats();

    //this.stats.domElement.style.position = 'absolute';
    //this.stats.domElement.style.top = '0px';

    //this.refs.container.appendChild(this.stats.domElement);
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
        playerInfo[0].path[0].getPoint(0),
        playerInfo[0].path[0].getPoint(1),
      ],
      [
        playerInfo[1].path[0].getPoint(0),
        playerInfo[1].path[0].getPoint(1),
      ]
    ];
    //let playerVertices = [
      //[
        //playerInfo[0].path[0],
        //playerInfo[0].path[1],
      //],
      //[
        //playerInfo[1].path[0],
        //playerInfo[1].path[1],
      //]
    //];
    playerVertices[0][0].x = playerVertices[0][0].x + this.sideLength;
    playerVertices[0][1].x = playerVertices[0][1].x + this.sideLength;
    playerVertices[1][0].x = playerVertices[1][0].x + this.sideLength;
    playerVertices[1][1].x = playerVertices[0][1].x + this.sideLength;

    //playerInfo[0].path[0] = playerVertices[0][0];
    //playerInfo[0].path[1] = playerVertices[0][1];
    //playerInfo[1].path[0] = playerVertices[1][0];
    //playerInfo[1].path[1] = playerVertices[1][1];
    playerInfo[0].path[0] = new THREE.LineCurve3(playerVertices[0][0], playerVertices[0][1]);
    playerInfo[1].path[0] = new THREE.LineCurve3(playerVertices[1][0], playerVertices[1][1]);
    this.setState({ player: playerInfo });
    console.log('I move');
  }

  renderSnakeTube() {
    const userPath = this.state.player[0].path;
    const snake = userPath.map((tubePath) => {
      <mesh>
        <tubeGeometry
          path={tubePath}
          radius={this.sideLength/2}
          closed={true}
        />
        <meshBasicMaterial
          color={0x00ff00}
        />
      </mesh>
    });
    console.log(userPath[0].getPoint(0).x);
    return snake;
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    const userPath = this.state.player[0].path[0];
    console.log('I am render', userPath.getPoint(0).x, userPath.getPoint(1).x);
    //const curvePath = new this.player1Curve(40);
    //console.log('I am render', curvePath.getPoint(0).x, curvePath.getPoint(1).x);

    return (<React3
      mainCamera="camera" // this points to the perspectiveCamera below
      width={width}
      height={height}
      ref="react3"
    >
      <scene>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}
          lookAt={this.gridPosition}
          position={this.cameraPosition}
        />
        <gridHelper 
          size={this.gridSize}
          step={this.gridStep}
          scale={this.gridScale}
          colorCenterLine={0xffffff}
        />
        <cameraHelper
          cameraName="camera"
        />
        <object3D>
          <mesh>
            <tubeGeometry
              path={userPath}
              radius={this.sideLength/2}
              closed={true}
              dynamic={true}
            />
            <meshBasicMaterial
              color={0x00ff00}
            />
          </mesh>
        </object3D>

      </scene>
    </React3>);
  }
}

export default SnakeApp;

