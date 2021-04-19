export default function keydown(e) {
    if (keysActions[e.code]) {
        actions[keysActions[e.code]] = true;
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}