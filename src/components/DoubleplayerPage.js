import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Stats from 'stats.js';

class DoubleplyerPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.size = 400;
    this.scale = 20;

    this.cameraPosition = new THREE.Vector3(0, 0, 3000);
    // the edge at gridScale * gridSize / -gridScale * gridSize
    // gridStep is the number of division of each axis
    this.gridSize = this.size;
    this.gridStep = this.size / 2;
    this.gridScale = new THREE.Vector3(20, 20, 20);

    this.sideLength = 2 * this.size * this.scale / this.gridStep;
    
    this.gridPosition = [
      new THREE.Vector3(0, 0, 0), 
      new THREE.Vector3(0, 0, this.sideLength), 
      new THREE.Vector3(0, 0, 2 * this.sideLength)];
    this.gridRotate = new THREE.Euler(Math.PI/2, 0, 0);

    this.boundary = [
      new THREE.LineCurve3(
          new THREE.Vector3(-100 * this.sideLength, -100 * this.sideLength, 0),
          new THREE.Vector3(100 * this.sideLength, -100 * this.sideLength, 0)),
      new THREE.LineCurve3(
          new THREE.Vector3(100 * this.sideLength, -100 * this.sideLength, 0),
          new THREE.Vector3(100 * this.sideLength, 100 * this.sideLength, 0)),
      new THREE.LineCurve3(
          new THREE.Vector3(100 * this.sideLength, 100 * this.sideLength, 0),
          new THREE.Vector3(-100 * this.sideLength, 100 * this.sideLength, 0)),
      new THREE.LineCurve3(
          new THREE.Vector3(-100 * this.sideLength, 100 * this.sideLength, 0),
          new THREE.Vector3(-100 * this.sideLength, -100 * this.sideLength, 0)),
    ];

    let foods = [];
    foods.push(new THREE.Vector3(0, 1, 0.5).multiplyScalar(this.sideLength));
    for(let i = 0; i < 100; i++) {
      let tx = (Math.random() - 0.5) * this.gridStep;
      let ty = (Math.random() - 0.5) * this.gridStep;
      let tz = 0.5;
      let l = foods.length;
      let newFood = new THREE.Vector3(tx, ty, tz).multiplyScalar(this.sideLength);
      let exist = false;
      for(let j = 0; j < l; j++) {
        if(newFood.equals(foods[j])) {
          exist = true;
          break;
        }
      }
      if(exist) {
        i -= 1;
        continue;
      }
      foods.push(newFood);
    }
    

    this.state = {
      player: [
        {
          user: this.props.user.uid,
          path: [
            new THREE.Vector3(0, 0, 0.5).multiplyScalar(this.sideLength), 
            new THREE.Vector3(1, 0, 0.5).multiplyScalar(this.sideLength),
            new THREE.Vector3(2, 0, 0.5).multiplyScalar(this.sideLength),
            new THREE.Vector3(3, 0, 0.5).multiplyScalar(this.sideLength),
            new THREE.Vector3(4, 0, 0.5).multiplyScalar(this.sideLength),
            new THREE.Vector3(5, 0, 0.5).multiplyScalar(this.sideLength), 
            new THREE.Vector3(6, 0, 0.5).multiplyScalar(this.sideLength),
            new THREE.Vector3(7, 0, 0.5).multiplyScalar(this.sideLength),
            new THREE.Vector3(8, 0, 0.5).multiplyScalar(this.sideLength),
            new THREE.Vector3(9, 0, 0.5).multiplyScalar(this.sideLength),
          ],
          direction: 39,
          view: "",  // detect, front, gaze
        },
        {
          user2: {},
          path: [],
          direction: 0,
          view: "",  // detect, front, gaze
        }
      ],
      food: foods,
      
    };

    this.move = this.move.bind(this);
    this._checkLeft = this._checkLeft.bind(this);
    this._checkRight = this._checkRight.bind(this);
    this._checkForward = this._checkForward.bind(this);
    this._checkBackward = this._checkBackward.bind(this);
    this._shouldUp = this._shouldUp.bind(this);
    this._shouldDown = this._shouldDown.bind(this);
    this.renderFood = this.renderFood.bind(this);
    this.renderSnake = this.renderSnake.bind(this);

    this.socket = io();
    this.socket.emit('newuser', this.props.user.uid); 


  }

  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown, false);

    this.timerID = setInterval(
        () => this.move(),
        500
    );

  }

  componentWillUnmount() {
    this.socket.emit('disconnect', this.props.user.uid); 
    console.log('leave');
    document.removeEventListener('keydown', this._onKeyDown, false);
    clearInterval(this.timerID);
  }

  _onKeyDown = (event) => {
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
      case 68:
        playerInfo[0].view = 'detect';
        break;
      case 70:
        playerInfo[0].view = 'front';
        break;
      case 71:
        playerInfo[0].view = 'gaze';
        break;
      case 83:
        playerInfo[0].view = '';
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
    } else if(this._shouldUp(playerVertices[0], playerInfo[0].direction)) {
      next.set(now.x, now.y, now.z + this.sideLength);
    } else {
      switch(this.state.player[0].direction){
        case 37:
          //console.log('left');
          next.set(now.x - this.sideLength, now.y, now.z);
          break;
        case 38:
          //console.log('forward');
          next.set(now.x, now.y + this.sideLength, now.z);
          break;
        case 39:
          //console.log('right');
          next.set(now.x + this.sideLength, now.y, now.z);
          break;
        case 40:
          //console.log('backward');
          next.set(now.x, now.y - this.sideLength, now.z);
          break;
      }
    }
    let foods = this.state.food;
    let exist = false;
    let indexOfNext = -1;
    for(let i = 0, l = foods.length; i < l; i++) {
      if(next.equals(foods[i])) {
        exist = true;
        indexOfNext = i;
        break;
      }
    }
    if(!exist) {
      playerVertices[0].shift();
    } else {
      console.log('ate');
      let tx = (Math.random() - 0.5) * this.gridStep;
      let ty = (Math.random() - 0.5) * this.gridStep;
      let tz = 0.5;
      let newFood = new THREE.Vector3(tx, ty, tz).multiplyScalar(this.sideLength);
      while(exist) {
        tx = (Math.random() - 0.5) * this.gridStep;
        ty = (Math.random() - 0.5) * this.gridStep;
        newFood = new THREE.Vector3(tx, ty, tz).multiplyScalar(this.sideLength);
        exist = false;
        for(let i = 0, l = foods.length; i < l; i++) {
          if(newFood.equals(foods[i])) {
            exist = true;
            break;
          }
        }
      }
      foods.splice(indexOfNext);
      foods.push(newFood);
    }
    playerVertices[0].push(next);

    playerInfo[0].path = playerVertices[0];
    this.setState({ 
      food: foods,
    });
    this.socket.emit('game', this.state.player[0]); 
    let that = this;
    this.socket.on('enemy', function(data) {
      let playerInfo = that.state.player;
      playerInfo[1] = data;
      that.setState({ player: playerInfo });
    });
    this.socket.on('mysnake', function(data) {
      let playerInfo = that.state.player;
      playerInfo[0] = data;
      that.setState({ player: playerInfo });
    });
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

  _shouldUp = (path, direction) => {
    const now = path[path.length - 1];
    let next = new THREE.Vector3();
    switch(direction) {
      case 37:
        next.set(now.x - this.sideLength, now.y, now.z);
        break;
      case 38:
        next.set(now.x, now.y + this.sideLength, now.z);
        break;
      case 39:
        next.set(now.x + this.sideLength, now.y, now.z);
        break;
      case 40:
        next.set(now.x, now.y - this.sideLength, now.z);
        break;
    }
    for(let i = 1, l = path.length; i < l - 3; i++) {
      if(next.equals(path[i])) {
        return true;
      }
    }
    return false;
  }

  _shouldDown = (path) => {
    const now = path[path.length - 1];
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

  renderFood = () => {
    let foodshape = [];
    for(let item of this.state.food) {
      let s = new THREE.Shape();
      s.moveTo(item.x, item.y);
      s.lineTo(item.x + this.sideLength, item.y);
      s.lineTo(item.x + this.sideLength, item.y + this.sideLength);
      s.lineTo(item.x, item.y + this.sideLength);
      foodshape.push(s);
    }

    const foods = (
        <mesh
          position={this.gridPosition[0]}
        >
          <extrudeGeometry
            shapes={foodshape}
            steps={2}
            amount={this.sideLength}
            bevelEnable={true}
            bevelThickness={20}
            bevelSize={10}
            bevelSegments={1}
            dynamic={true}
          />
          <meshBasicMaterial
            color={0x00ff00}
            wireframe
          />
        </mesh>
    );
    return (
      <group>
        {foods}
      </group>
    );
  }

  renderSnake = (path) => {
    let shape = [[], [], [], [], [], []];
    for(let i = 0, l = path.length; i<l; i++) {
      let s = new THREE.Shape();
      s.moveTo(path[i].x, path[i].y);
      s.lineTo(path[i].x + this.sideLength, path[i].y);
      s.lineTo(path[i].x + this.sideLength, path[i].y + this.sideLength);
      s.lineTo(path[i].x, path[i].y + this.sideLength);
      let j = 0;
      while(path[i].z - (j + 1) * this.sideLength > 0) {
        j += 1;
      }
      if(j > shape.length - 1) {
        continue;
      }
      shape[j].push(s);
    }

    const snake = shape.map((layer, index) => {
      return (
        <mesh
          position={this.gridPosition[index]}
        >
          <extrudeGeometry
            shapes={layer}
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
    )});

    return (
      <group>
        {snake}
      </group>
    );
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    const userPath = this.state.player[0].path;
    const otherPath = this.state.player[1].path;

    let lookAt = this.gridPosition[0]; 
    let cameraPosition = this.cameraPosition;
    let cameraRotate = new THREE.Euler();
    if(this.state.player[0].view === '') {
      lookAt = this.gridPosition[0]; 
    } else if(this.state.player[0].view === 'detect') {
      cameraPosition = new THREE.Vector3(0, 0, 3000);
      cameraPosition.add(userPath[userPath.length-1]);
      lookAt = userPath[userPath.length-1];
    } else if(this.state.player[0].view === 'gaze') {
      cameraRotate = this.gridRotate;
      cameraPosition = new THREE.Vector3(0, 0, this.sideLength);
      cameraPosition.add(userPath[userPath.length-1]);
      lookAt = this.state.player[1].path[this.state.player[1].path.length-1];
    } else if(this.state.player[0].view === 'front') {
      cameraRotate = this.gridRotate;
      cameraPosition = new THREE.Vector3(0, 0, this.sideLength);
      cameraPosition.add(userPath[userPath.length-1]);
      lookAt = new THREE.Vector3();
      switch(this.state.player[0].direction) {
        case 37:
          cameraPosition.add(new THREE.Vector3(2 * this.sideLength, 0, 0));
          lookAt.addVectors(cameraPosition, new THREE.Vector3(-this.sideLength, 0, 0));
          break;
        case 38:
          cameraPosition.add(new THREE.Vector3(0, -2 * this.sideLength, 0));
          lookAt.addVectors(cameraPosition, new THREE.Vector3(0, this.sideLength, 0));
          break;
        case 39:
          cameraPosition.add(new THREE.Vector3(-2 * this.sideLength, 0, 0));
          lookAt.addVectors(cameraPosition, new THREE.Vector3(this.sideLength, 0, 0));
          break;
        case 40:
          cameraPosition.add(new THREE.Vector3(0, 2 * this.sideLength, 0));
          lookAt.addVectors(cameraPosition, new THREE.Vector3(0, -this.sideLength, 0));
          break;
      }
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
          fov={30}
          aspect={width / height}
          near={0.1}
          far={10000}
          lookAt={lookAt}
          position={cameraPosition}
          rotation={cameraRotate}
        />
        <gridHelper 
          size={this.gridSize}
          step={this.gridStep}
          scale={this.gridScale}
          rotation={this.gridRotate}
          colorCenterLine={0xffffff}
          colorGrid={0x444444}
        />
        <cameraHelper
          cameraName="camera"
        />
        <object3D>
          {this.renderFood()}
          {this.renderSnake(userPath)}
          {this.renderSnake(otherPath)}
        </object3D>
        <object3D>
          <mesh>
            <tubeGeometry
              path={this.boundary[0]}
              radius={this.sideLength/2}
            />
            <meshBasicMaterial
              color={0xff0000}
              wireframe
            />
          </mesh>
          <mesh>
            <tubeGeometry
              path={this.boundary[1]}
              radius={this.sideLength/2}
            />
            <meshBasicMaterial
              color={0xff0000}
              wireframe
            />
          </mesh>
          <mesh>
            <tubeGeometry
              path={this.boundary[2]}
              radius={this.sideLength/2}
            />
            <meshBasicMaterial
              color={0xff0000}
              wireframe
            />
          </mesh>
          <mesh>
            <tubeGeometry
              path={this.boundary[3]}
              radius={this.sideLength/2}
            />
            <meshBasicMaterial
              color={0xff0000}
              wireframe
            />
          </mesh>
        </object3D>

      </scene>
    </React3>);
  }
}

export default DoubleplyerPage;

