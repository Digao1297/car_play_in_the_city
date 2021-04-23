export default function keydown(e) {
  switch (keysActions[e.code]) {
    case "acceleration":
      soundCarRun.setVolume(0.1);
      if (!soundCarRun.isPlaying) {
        soundCarRun.play();
        soundCarStop.pause();
      }
      break;
    case "braking":
      soundCarStop.setVolume(0.3);
      if (!soundCarStop.isPlaying) {
        soundCarStop.play();
        soundCarRun.pause();
      }
      break;
  }

  if (keysActions[e.code]) {
    actions[keysActions[e.code]] = true;
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}
