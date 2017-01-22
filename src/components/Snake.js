import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

class Snake extends React.Component {
  constructor(props, context) {
    super(props, context);

    //this.cameraPosition = new THREE.Vector3(-400, 100, 500);
    //this.gridPosition = new THREE.Vector3();

    // the edge at gridScale * gridSize / -gridScale * gridSize
    // gridStep is the number of division of each axis
    //this.gridScale = new THREE.Vector3(10, 10, 10);

    //// construct the position vector here, because if we use 'new' within render,
    //// React will think that things have changed when they have not.

    //this.state = {
      //cubeRotation: new THREE.Euler(),
    //};

    //this._onAnimate = () => {
      //// we will get this callback every frame

      //// pretend cubeRotation is immutable.
      //// this helps with updates and pure rendering.
      //// React will be sure that the rotation has now updated.
      //this.setState({
        //cubeRotation: new THREE.Euler(
          //this.state.cubeRotation.x + 0.1,
          //this.state.cubeRotation.y + 0.1,
          //0
        //),
      //});
    //};
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height
    // or you can use:
    // width = window.innerWidth
    // height = window.innerHeight

    return (<React3
      mainCamera="camera" // this points to the perspectiveCamera below
      width={width}
      height={height}

    >
      <scene>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}

          position={this.cameraPosition}
        />
        <gridHelper 
          size={40}
          step={2}
          scale={this.gridScale}
        />
      </scene>
    </React3>);
  }
}

export default Snake;

