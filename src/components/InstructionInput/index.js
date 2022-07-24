import Form from "react-bootstrap/Form";

function InstructionInput({ parseInstructions, disabled }) {
  const handleFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;

      parseInstructions(text);
    };
    reader.readAsText(e.target.files[0]);
  };

  return <Form.Control type="file" onChange={handleFile} disabled={disabled} />;
}

export default InstructionInput;
