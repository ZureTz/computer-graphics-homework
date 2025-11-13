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
	// 提示用户输入要旋转的点的坐标
	fmt.Println("请输入要旋转的点坐标（x y z）：")
	var err error
	if point, err = utils.InputVector3D(); err != nil {
		fmt.Printf("读取点坐标时出错：%v\n", err)
		return
	}

	// Define the angle of rotation (in degrees)
	var theta float64
	// 提示输入旋转角度（角度制）
	fmt.Println("请输入旋转角度（度）：")
	if _, err := fmt.Scanf("%f", &theta); err != nil {
		fmt.Printf("读取角度时出错：%v\n", err)
		return
	}

	// Convert theta to radians
	theta = theta * math.Pi / 180.0

	// Define the line of rotation (from lineStart to lineEnd)
	var lineStart, lineEnd mat.Vector

	// 提示输入直线起点坐标
	fmt.Println("请输入直线起点坐标（x y z）：")
	if lineStart, err = utils.InputVector3D(); err != nil {
		fmt.Printf("读取直线起点坐标时出错：%v\n", err)
		return
	}
	// 提示输入直线终点坐标
	fmt.Println("请输入直线终点坐标（x y z）：")
	if lineEnd, err = utils.InputVector3D(); err != nil {
		fmt.Printf("读取直线终点坐标时出错：%v\n", err)
		return
	}

	// Rotate the point around the line
	rotatedPoint, err := utils.RotateOverALine(lineStart, lineEnd, point, theta)
	if err != nil {
		fmt.Printf("Error rotating point: %v\n", err)
		return
	}

	// 打印原始点与旋转后的点
	fmt.Printf("原始点：\n%v\n\n", mat.Formatted(point, mat.Prefix(""), mat.Excerpt(0)))
	fmt.Printf("旋转后点：\n%v\n\n", mat.Formatted(rotatedPoint, mat.Prefix(""), mat.Excerpt(0)))
}
