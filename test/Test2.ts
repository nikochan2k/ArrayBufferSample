import Float from "../src/Float";

const float = new Float();
float.setValue(1234567890);
float.setBuffer(float._u8.buffer);
console.log(float._value);
