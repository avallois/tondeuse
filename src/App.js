import { useEffect, useState } from "react";
import InstructionInput from "./components/InstructionInput";
import Grid from "./components/Grid";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const orientations = new Proxy(
  [
    { orientation: "N", forward: [0, 1] },
    { orientation: "E", forward: [1, 0] },
    { orientation: "S", forward: [0, -1] },
    { orientation: "W", forward: [-1, 0] },
  ],
  {
    get(target, prop) {
      if (!isNaN(prop)) {
        prop = parseInt(prop, 10);
        if (prop === -1) {
          prop = 3;
        } else if (prop === 4) {
          prop = 0;
        }
      }
      return target[prop];
    },
  }
);

function App() {
  const [lawnGrid, setLawnGrid] = useState(null);
  const [mowers, setMowers] = useState(null); //{instructions: "LFFRL", position: {x: 0,y: 0,}, orientation: "N"}
  const [currentMower, setCurrentMower] = useState(0);
  const [runNextInstruction, setRunNextInstruction] = useState(false);
  const [finish, setFinish] = useState(null);

  useEffect(() => {
    if (runNextInstruction) {
      setTimeout(() => executeNextInstruction(), 350);
    }
  });

  function executeRotate(
    instruction,
    orientation,
    mowers,
    mower,
    currentMower
  ) {
    let newMowers;
    const orientationIndex = orientations
      .map((e) => e.orientation)
      .indexOf(orientation);

    const newOrientation =
      orientations[
        instruction === "R" ? orientationIndex + 1 : orientationIndex - 1
      ].orientation;

    newMowers = [...mowers];
    newMowers[currentMower] = {
      ...mower,
      instructions: mower.instructions.substring(1),
      orientation: newOrientation,
    };
    return newMowers;
  }

  function executeForward(
    instruction,
    orientation,
    mowers,
    mower,
    currentMower
  ) {
    let newMowers;
    const coordinatesForward = orientations.find(
      (e) => e.orientation === orientation
    ).forward;

    const newX = coordinatesForward[0] + mower.position.x;
    const newY = coordinatesForward[1] + mower.position.y;

    let newPosition = { ...mower.position };
    if (
      newX < lawnGrid.length &&
      newY < lawnGrid[0].length &&
      newX >= 0 &&
      newY >= 0
    ) {
      newPosition = {
        x: newX,
        y: newY,
      };
    }
    newMowers = [...mowers];
    newMowers[currentMower] = {
      ...mower,
      instructions: mower.instructions.substring(1),
      position: newPosition,
    };
    return newMowers;
  }

  function executeNextInstruction() {
    if (currentMower === mowers.length) {
      setRunNextInstruction(false);
      setFinish(true);
      return;
    }

    const mower = mowers[currentMower];

    const instruction = mower.instructions[0];
    const orientation = mower.orientation;

    let newLawnGrid = lawnGrid.map((arr) => arr.slice());
    if (lawnGrid[mower.position.x][mower.position.y] !== 1) {
      newLawnGrid[mower.position.x][mower.position.y] = 1;
      setLawnGrid(newLawnGrid);
    }

    let newMowers;
    if (instruction === "R" || instruction === "L") {
      //Execute rotate
      newMowers = executeRotate(
        instruction,
        orientation,
        mowers,
        mower,
        currentMower
      );
    } else if (instruction === "F") {
      //Execute forward
      newMowers = executeForward(
        instruction,
        orientation,
        mowers,
        mower,
        currentMower
      );
    }
    if (!newMowers[currentMower].instructions.length) {
      setCurrentMower(currentMower + 1);
    }
    setMowers(newMowers);

    if (
      lawnGrid[newMowers[currentMower].position.x][
        newMowers[currentMower].position.y
      ] !== 1
    ) {
      newLawnGrid = newLawnGrid.map((arr) => arr.slice());
      newLawnGrid[newMowers[currentMower].position.x][
        newMowers[currentMower].position.y
      ] = 1;
      setLawnGrid(newLawnGrid);
    }
  }

  function parseInstructions(fileText) {
    //TODO: handle instructions errors
    const linesArray = fileText.split("\n");
    const gridInstructions = linesArray[0];
    const mowersInstructions = linesArray.slice(1);

    //set lawn grid
    const x = parseInt(gridInstructions[0]);
    const y = parseInt(gridInstructions[1]);
    const newLawnGrid = Array(x + 1).fill(Array(y + 1).fill(0));
    setLawnGrid(newLawnGrid);

    //set mowers
    const newMowers = [];
    for (let i = 0; i < mowersInstructions.length; i += 2) {
      newMowers.push({
        instructions: mowersInstructions[i + 1],
        position: {
          x: parseInt(mowersInstructions[i][0]),
          y: parseInt(mowersInstructions[i][1]),
        },
        orientation: mowersInstructions[i][3],
      });
    }
    setMowers(newMowers);
  }

  return (
    <Container>
      <Row className="text-center m-5">
        <Col>
          <InstructionInput
            parseInstructions={parseInstructions}
            disabled={lawnGrid}
          />
        </Col>
        <Col>
          <Button
            onClick={() => window.location.reload(false)}
            disabled={!finish}
          >
            New Try
          </Button>
        </Col>
        <Col>
          <Button
            onClick={() => setRunNextInstruction(true)}
            disabled={!(lawnGrid && mowers) || runNextInstruction || finish}
          >
            Execute Instructions
          </Button>
        </Col>
      </Row>
      <Row className="text-center">
        {lawnGrid && (
          <Grid
            lawnGrid={lawnGrid}
            mowers={mowers}
            currentMower={currentMower}
          />
        )}
        {!lawnGrid && <p>Please Upload Instructions</p>}
      </Row>
      {finish && <p>FINISH</p>}
    </Container>
  );
}

export default App;
