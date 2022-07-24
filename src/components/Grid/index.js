import Mower from "../Mower";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Grid({ lawnGrid, mowers, currentMower }) {
  return (
    <Row className="justify-content-center">
      {lawnGrid.map((eltX, indexX) => {
        return (
          <Col key={indexX} xs={1}>
            {eltX
              .slice()
              .reverse()
              .map((eltY, indexY) => {
                return (
                  <Row key={"" + indexX + indexY}>
                    <div
                      className="border"
                      style={{
                        height: "60px",
                        width: "18rem",
                        backgroundColor: `${
                          eltY === 0 ? "#1A6A06" : "#4EEC27"
                        }`,
                      }}
                    >
                      {mowers.map((mower, indexMower) =>
                        mower.position.x === indexX &&
                        mower.position.y ===
                          lawnGrid[0].length - (indexY + 1) ? (
                          <Mower
                            key={indexMower}
                            mowerNumber={indexMower + 1}
                            mower={mower}
                            isCurrentMower={indexMower === currentMower}
                          />
                        ) : null
                      )}
                    </div>
                  </Row>
                );
              })}
          </Col>
        );
      })}
    </Row>
  );
}

export default Grid;
