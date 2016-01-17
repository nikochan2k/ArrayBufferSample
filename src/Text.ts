import Particle from "./Particle";

abstract class Text extends Particle<string> {
    _byteLength: number;
}

export default Text;
