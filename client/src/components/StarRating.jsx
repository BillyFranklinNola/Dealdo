import React from 'react'
import { Rating } from 'react-simple-star-rating'

function StarRating({handleRating}) {
  return (
    <Rating onClick={(rate) => handleRating(rate)}
      transition={true}
      fillColorArray={[
        "#f14f45",
        "#f16c45",
        "#f18845",
        "#f1b345",
        "#f1d045"
        ]}
      />
  )
}

export default StarRating





