// @flow

function percentageToServingSize(percentage: number): string {
  let serving = "0";

  if(percentage <= 10) {
    return "0"
  }
  if (percentage >= 11 && percentage <= 30) {
    return "1/4";
  }
  if (percentage >= 31 && percentage <= 40) {
    return "1/3";
  }
  if (percentage >= 41 && percentage <= 60) {
    return "1/2";
  }
  if (percentage >= 61 && percentage <= 70) {
    return "2/3";
  }
  if (percentage >= 71 && percentage <= 85) {
    return "3/4";
  }
  if (percentage >= 86 && percentage <= 110) {
    return "1";
  }
  if (percentage >= 111 && percentage <= 130) {
    return "1 1/4";
  }
  if (percentage >= 131 && percentage <= 140) {
    return "1 1/3";
  }
  if (percentage >= 141 && percentage <= 160) {
    return "1 1/2";
  }
  if (percentage >= 161 && percentage <= 170) {
    return "1 2/3";
  }
  if (percentage >= 171 && percentage <= 185) {
    return "1 3/4";
  }
  if (percentage >= 186 && percentage <= 210) {
    return "2";
  }
  if (percentage >= 211 && percentage <= 230) {
    return "2 1/4";
  }
  if (percentage >= 231 && percentage <= 240) {
    return "2 1/3";
  }
  if (percentage >= 241 && percentage <= 260) {
    return "2 1/2";
  }
  if (percentage >= 261 && percentage <= 270) {
    return "2 2/3";
  }
  if (percentage >= 271 && percentage <= 285) {
    return "2 3/4";
  }
  if (percentage >= 286 && percentage <= 310) {
    return "3";
  }
  if (percentage >= 311 && percentage <= 330) {
    return "3 1/4";
  }
  if (percentage >= 331 && percentage <= 340) {
    return "3 1/3";
  }
  if (percentage >= 341 && percentage <= 360) {
    return "3 1/2";
  }
  if (percentage >= 361 && percentage <= 370) {
    return "3 2/3";
  }
  if (percentage >= 371 && percentage <= 385) {
    return "3 3/4";
  }
  if (percentage >= 386 && percentage <= 410) {
    return "4";
  }
  if (percentage >= 411 && percentage <= 430) {
    return "4 1/4";
  }
  if (percentage >= 431 && percentage <= 440) {
    return "4 1/3";
  }
  if (percentage >= 441 && percentage <= 460) {
    return "4 1/2";
  }
  if (percentage >= 461 && percentage <= 470) {
    return "4 2/3";
  }
  if (percentage >= 471 && percentage <= 485) {
    return "4 3/4";
  }
  if (percentage >= 486) {
    return "5";
  }
}

export { percentageToServingSize };
