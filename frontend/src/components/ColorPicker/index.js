import { HexColorPicker } from "react-colorful";

const ColorPicker = ({ handleChangeColor, color, style }) => {
  return (
    <HexColorPicker
      className="rounded"
      color={color}
      onChange={handleChangeColor}
      style={{...style}}
    />
  );
};


export default ColorPicker