package utils

import (
	"fmt"

	"gonum.org/v1/gonum/mat"
)

func InputVector3D() (mat.Vector, error) {
	var x, y, z float64
	_, err := fmt.Scanf("%f %f %f", &x, &y, &z)
	if err != nil {
		return nil, err
	}
	return mat.NewVecDense(3, []float64{x, y, z}), nil
}
