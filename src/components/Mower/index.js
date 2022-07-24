import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BsCart } from "react-icons/bs";
import {
  BiCaretLeft,
  BiCaretRight,
  BiCaretUp,
  BiCaretDown,
} from "react-icons/bi";

function Mower({ mowerNumber, mower, isCurrentMower }) {
  return (
    <div
      key={mowerNumber}
      style={{
        color: `${isCurrentMower ? "blue" : "black"}`,
      }}
    >
      <Row className="justify-content-md-center">
        <Col xs={6}>t{mowerNumber}</Col>
        <Col xs={6}>
          {mower.instructions.length !== 0 &&
            ((mower.orientation === "N" && <BiCaretUp size={25} />) ||
              (mower.orientation === "S" && <BiCaretDown size={25} />) ||
              (mower.orientation === "E" && <BiCaretRight size={25} />) ||
              (mower.orientation === "W" && <BiCaretLeft size={25} />))}
          {mower.instructions.length === 0 && <div>{mower.orientation}</div>}
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        {mower.instructions.length !== 0 && (
          <Col>
            <BsCart size={25} />
          </Col>
        )}

        {mower.instructions.length === 0 && (
          <Col>
            x: {mower.position.x} y: {mower.position.y}
          </Col>
        )}
      </Row>
    </div>
  );
}

export default Mower;
