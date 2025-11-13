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

// 实现：绕一条直线旋转 3D 点，角度为 theta（弧度）
func RotateOverALine(lineStart mat.Vector, lineEnd mat.Vector, point mat.Vector, theta float64) (mat.Vector, error) {
	// 检查 lineStart、lineEnd 与 point 是否都是 3 维向量
	if lineStart.Len() != 3 || lineEnd.Len() != 3 || point.Len() != 3 {
		panic("lineStart、lineEnd 和 point 必须都是 3 维向量")
	}

	// 1. 将直线平移到原点
	translation := TranslationMatrix(-lineStart.AtVec(0), -lineStart.AtVec(1), -lineStart.AtVec(2))
	fmt.Printf("平移矩阵：\n%v\n\n", mat.Formatted(translation, mat.Prefix(""), mat.Excerpt(0)))

	// 2. 将直线旋转到 xOz 平面

	// 先计算直线在 xOy 平面上的投影与 x 轴的夹角
	// tan(r1) = (y1 - y0) / (x1 - x0)
	r1Angle := math.Atan2(
		lineEnd.AtVec(1)-lineStart.AtVec(1),
		lineEnd.AtVec(0)-lineStart.AtVec(0),
	)

	// 然后围绕 z 轴旋转相应角度
	rotateToXOZ := RotateAroundZ(-r1Angle)
	fmt.Printf("旋转到 XoZ 平面 矩阵：\n%v\n\n", mat.Formatted(rotateToXOZ, mat.Prefix(""), mat.Excerpt(0)))

	// 3. 将直线旋转到与 z 轴重合

	// 先计算直线与 z 轴的夹角
	// tan(r2) = sqrt((x1 - x0)^2 + (y1 - y0)^2) / (z1 - z0)
	r2Angle := math.Atan2(
		math.Sqrt(math.Pow(lineEnd.AtVec(0)-lineStart.AtVec(0), 2)+math.Pow(lineEnd.AtVec(1)-lineStart.AtVec(1), 2)),
		lineEnd.AtVec(2)-lineStart.AtVec(2),
	)

	// 然后围绕 y 轴旋转相应角度
	rotateToZ := RotateAroundY(r2Angle)
	fmt.Printf("旋转到 Z 轴 矩阵：\n%v\n\n", mat.Formatted(rotateToZ, mat.Prefix(""), mat.Excerpt(0)))

	// 将以上变换组合为 preRotation
	// preRotation = rotateToZ * rotateToXOZ * translation
	preRotation := mat.NewDense(4, 4, nil)
	preRotation.Mul(rotateToXOZ, translation)
	preRotation.Mul(rotateToZ, preRotation)

	// 计算 preRotation 的逆矩阵 postRotation
	postRotation := mat.NewDense(4, 4, nil)
	if err := postRotation.Inverse(preRotation); err != nil {
		return nil, err
	}

	fmt.Printf("预旋转矩阵：\n%v\n\n", mat.Formatted(preRotation, mat.Prefix(""), mat.Excerpt(0)))
	fmt.Printf("预旋转矩阵的逆：\n%v\n\n", mat.Formatted(postRotation, mat.Prefix(""), mat.Excerpt(0)))

	// 4. 围绕 z 轴旋转点 theta 弧度
	rotateAroundZ := RotateAroundZ(theta)
	fmt.Printf("绕 Z 轴旋转 矩阵：\n%v\n\n", mat.Formatted(rotateAroundZ, mat.Prefix(""), mat.Excerpt(0)))

	// 将所有变换合并为一个矩阵
	// transformation = postRotation * rotateAroundZ * preRotation
	transformation := mat.NewDense(4, 4, nil)
	transformation.Mul(rotateAroundZ, preRotation)
	transformation.Mul(postRotation, transformation)
	fmt.Printf("组合变换矩阵：\n%v\n\n", mat.Formatted(transformation, mat.Prefix(""), mat.Excerpt(0)))

	// 将变换应用到点上
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

	// 返回变换后的点
	return resultVec, nil
}
