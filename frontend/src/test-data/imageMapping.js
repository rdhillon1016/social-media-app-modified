import imageOne from "./test-images/forest-1400475.jpg";
import imageTwo from "./test-images/gerbera-series-1-1486599.jpg";
import imageThree from "./test-images/three-bees-on-sunflower-1337029.jpg";

export function getImages(num) {
  switch (num) {
    case 1:
      return [imageOne];
    case 2:
      return [imageTwo];
    case 3:
      return [imageThree];
    case 4:
      return [imageOne, imageTwo];
    case 5:
      return [imageOne, imageThree];
    case 6:
      return [imageTwo, imageThree];
    case 7:
      return [imageOne, imageTwo, imageThree];
    default:
      return [];
  }
}

export function getImageNum(arr) {
  if (
    arr.includes(imageOne) &&
    arr.includes(imageTwo) &&
    arr.includes(imageThree)
  ) {
    return 7;
  } else if (arr.includes(imageOne) && arr.includes(imageTwo)) {
    return 4;
  } else if (arr.includes(imageOne) && arr.includes(imageThree)) {
    return 5;
  } else if (arr.includes(imageTwo) && arr.includes(imageThree)) {
    return 6;
  } else if (arr.includes(imageOne)) {
    return 1;
  } else if (arr.includes(imageTwo)) {
    return 2;
  } else if (arr.includes(imageThree)) {
    return 3;
  } else {
    return 0;
  }
}
