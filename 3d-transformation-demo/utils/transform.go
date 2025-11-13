package utils

import (
	"fmt"
	"math"

	"gonum.org/v1/gonum/mat"
)

func TranslationMatrix(dx, dy, dz float64) *mat.Dense {
	return mat.NewDense(4, 4, []float64{
		1, 0, 0, dx,
		0, 1, 0, dy,
		0, 0, 1, dz,
		0, 0, 0, 1,
	})
}

func RotateAroundX(theta float64) *mat.Dense {
	return mat.NewDense(4, 4, []float64{
		1, 0, 0, 0,
		0, math.Cos(theta), -math.Sin(theta), 0,
		0, math.Sin(theta), math.Cos(theta), 0,
		0, 0, 0, 1,
	})
}

func RotateAroundY(theta float64) *mat.Dense {
	return mat.NewDense(4, 4, []float64{
		math.Cos(theta), 0, -math.Sin(theta), 0,
		0, 1, 0, 0,
		math.Sin(theta), 0, math.Cos(theta), 0,
		0, 0, 0, 1,
	})
}

func RotateAroundZ(theta float64) *mat.Dense {
	return mat.NewDense(4, 4, []float64{
		math.Cos(theta), -math.Sin(theta), 0, 0,
		math.Sin(theta), math.Cos(theta), 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	})
}

// Implementation for rotating a 3D point over a line for theta degrees
func RotateOverALine(lineStart mat.Vector, lineEnd mat.Vector, point mat.Vector, theta float64) (mat.Vector, error) {
	// Check that lineStart, lineEnd, and point are all 3D vectors
	if lineStart.Len() != 3 || lineEnd.Len() != 3 || point.Len() != 3 {
		panic("lineStart, lineEnd, and point must all be 3D vectors")
	}

	// 1. Move the line to the origin
	translation := TranslationMatrix(-lineStart.AtVec(0), -lineStart.AtVec(1), -lineStart.AtVec(2))
	fmt.Printf("Translation Matrix:\n%v\n\n", mat.Formatted(translation, mat.Prefix(""), mat.Excerpt(0)))

	// 2. Rotate the line to the xOz plane

	// First, calculate the angle between the projection of the line on the xOy plane and the x axis
	// tan(r1) = (y1 - y0) / (x1 - x0)
	r1Angle := math.Atan2(
		lineEnd.AtVec(1)-lineStart.AtVec(1),
		lineEnd.AtVec(0)-lineStart.AtVec(0),
	)

	// Then, create the rotation matrix around the z axis
	rotateToXOZ := RotateAroundZ(-r1Angle)
	fmt.Printf("Rotation to XoZ Matrix:\n%v\n\n", mat.Formatted(rotateToXOZ, mat.Prefix(""), mat.Excerpt(0)))

	// 3. Rotate the line to the z axis

	// First, calculate the angle between the line and the z axis
	// tan(r2) = sqrt((x1 - x0)^2 + (y1 - y0)^2) / (z1 - z0)
	r2Angle := math.Atan2(
		math.Sqrt(math.Pow(lineEnd.AtVec(0)-lineStart.AtVec(0), 2)+math.Pow(lineEnd.AtVec(1)-lineStart.AtVec(1), 2)),
		lineEnd.AtVec(2)-lineStart.AtVec(2),
	)

	// Then, create the rotation matrix around the y axis
	rotateToZ := RotateAroundY(r2Angle)
	fmt.Printf("Rotation to Z Matrix:\n%v\n\n", mat.Formatted(rotateToZ, mat.Prefix(""), mat.Excerpt(0)))

	// Combine the above transformations to the matrix preRotation
	// preRotation = rotateToZ * rotateToXOZ * translation
	preRotation := mat.NewDense(4, 4, nil)
	preRotation.Mul(rotateToXOZ, translation)
	preRotation.Mul(rotateToZ, preRotation)

	// Inverse the preRotation matrix to get the postRotation matrix
	postRotation := mat.NewDense(4, 4, nil)
	if err := postRotation.Inverse(preRotation); err != nil {
		return nil, err
	}

	fmt.Printf("Pre-Rotation Matrix:\n%v\n\n", mat.Formatted(preRotation, mat.Prefix(""), mat.Excerpt(0)))
	fmt.Printf("Post-Rotation Matrix:\n%v\n\n", mat.Formatted(postRotation, mat.Prefix(""), mat.Excerpt(0)))

	// 4. Rotate the point around the z axis for theta degrees
	rotateAroundZ := RotateAroundZ(theta)
	fmt.Printf("Rotation Around Z Matrix:\n%v\n\n", mat.Formatted(rotateAroundZ, mat.Prefix(""), mat.Excerpt(0)))

	// Combine all the transformations to a single matrix
	// transformation = postRotation * rotateAroundZ * preRotation
	transformation := mat.NewDense(4, 4, nil)
	transformation.Mul(rotateAroundZ, preRotation)
	transformation.Mul(postRotation, transformation)
	fmt.Printf("Combined Transformation Matrix:\n%v\n\n", mat.Formatted(transformation, mat.Prefix(""), mat.Excerpt(0)))

	// Apply the transformation to the point
	pointHomogeneous := mat.NewDense(4, 1, []float64{
		point.AtVec(0),
		point.AtVec(1),
		point.AtVec(2),
		1,
	})

	var result mat.Dense
	result.Mul(transformation, pointHomogeneous)

	resultVec := mat.NewVecDense(3, []float64{
		result.At(0, 0),
		result.At(1, 0),
		result.At(2, 0),
	}) 

	// Return the transformed point
	return resultVec, nil
}
