interface IDimensionsInput {
  width: number
  height: number
  maxWidth: number
  maxHeight: number
}

interface IDimensionsOutput {
  width: number
  height: number
}

export default ({ width, height, maxWidth, maxHeight }: IDimensionsInput): IDimensionsOutput => {
  
  function dimensionsByScale(scale) {
    return { width: width * scale, height: height * scale }
  }

  let scale: number, dimensions: IDimensionsOutput

  if (width < maxWidth ) {
    scale = maxWidth / width
  } else {
    scale = maxHeight / height
  }

  dimensions = dimensionsByScale(scale)
  if (dimensions.width > maxWidth) {
    scale = maxWidth / width
    dimensions = dimensionsByScale(scale)
  } else if (dimensions.height > maxHeight) {
    scale = maxHeight / height
    dimensions = dimensionsByScale(scale)
  }
  
  return dimensions
}