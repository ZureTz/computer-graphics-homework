import { useState } from "react";
import { formatColor } from "@/utils/color";

export default function ColorInput() {
  const [color, setColor] = useState("#0095ff");
  return (
    <>
      <input type="color" value={color} onChange={e => setColor(e.target.value)} />
      <p>The color is: {formatColor(color)}</p>
    </>
  );
}