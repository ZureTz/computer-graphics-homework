package main

import (
	"fmt"
	"math"

	"gonum.org/v1/gonum/mat"

	"3d_transform/utils"
)

func main() {
	// Define a point in 3D space
	var point mat.Vector
	fmt.Println("Enter the coordinates of the point to be rotated (x y z): ")
	var err error
	if point, err = utils.InputVector3D(); err != nil {
		fmt.Printf("Error reading point: %v\n", err)
		return
	}

	// Define the angle of rotation (in degrees)
	var theta float64
	fmt.Println("Enter the angle of rotation (in degrees): ")
	if _, err := fmt.Scanf("%f", &theta); err != nil {
		fmt.Printf("Error reading angle: %v\n", err)
		return
	}

	// Convert theta to radians
	theta = theta * math.Pi / 180.0

	// Define the line of rotation (from lineStart to lineEnd)
	var lineStart, lineEnd mat.Vector

	fmt.Println("Enter the coordinates of the line start point (x y z): ")
	if lineStart, err = utils.InputVector3D(); err != nil {
		fmt.Printf("Error reading line start point: %v\n", err)
		return
	}
	fmt.Println("Enter the coordinates of the line end point (x y z): ")
	if lineEnd, err = utils.InputVector3D(); err != nil {
		fmt.Printf("Error reading line end point: %v\n", err)
		return
	}

	// Rotate the point around the line
	rotatedPoint, err := utils.RotateOverALine(lineStart, lineEnd, point, theta)
	if err != nil {
		fmt.Printf("Error rotating point: %v\n", err)
		return
	}

	// Print the original and rotated points
	fmt.Printf("Original point: \n%v\n\n", mat.Formatted(point, mat.Prefix(""), mat.Excerpt(0)))
	fmt.Printf("Rotated point: \n%v\n\n", mat.Formatted(rotatedPoint, mat.Prefix(""), mat.Excerpt(0)))
}
