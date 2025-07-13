/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    not,
    allPass,
    anyPass,
    lt,
    gt,
    equals,
    compose,
    prop,
    pipe,
    filter,
    length,
    countBy,
    identity,
    values,
} from 'ramda';

const getTriangle = prop('triangle');
const getCircle = prop('circle');
const getStar = prop('star');
const getSquare = prop('square');
const isWhite = equals('white');
const isRed = equals('red');
const isGreen = equals('green');
const isOrange = equals('orange');
const isBlue = equals('blue');

const getShapeColors = (arg) => [
    getTriangle(arg),
    getCircle(arg),
    getStar(arg),
    getSquare(arg)
];

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (arg) => {
    const isTriangeWhite = compose(isWhite, getTriangle);
    const isCicleWhite = compose(isWhite, getCircle);
    const isStarRed = compose(isRed, getStar);
    const isSquareGreen = compose(isGreen, getSquare);

    return allPass(
        [isTriangeWhite,
        isCicleWhite,
        isStarRed,
        isSquareGreen]
    )(arg);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(
    getShapeColors,
    filter(isGreen),
    length,
    lt(1)
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = pipe(
    getShapeColors,
    countBy(identity),
    ({ red = 0, blue = 0 }) => equals(red, blue)
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    compose(isBlue, getCircle),
    compose(isRed, getStar),
    compose(isOrange, getSquare)
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = () => pipe(
    getShapeColors,
    countBy(identity),
    values,
    anyPass([gt(3), equals(3)])
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    compose(isGreen, getTriangle),
    pipe(getShapeColors, filter(isGreen), length, equals(2)),
    pipe(getShapeColors, filter(isRed), length, equals(1))
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (arg) => {
    const isTriangeOrange = compose(isOrange, getTriangle);
    const isCicleOrange = compose(isOrange, getCircle);
    const isStarOrange = compose(isOrange, getStar);
    const isSquareOrange = compose(isOrange, getSquare);

    return allPass([
        isTriangeOrange,
        isCicleOrange,
        isStarOrange,
        isSquareOrange
    ])(arg)
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (arg) => {
    const isStarNotRed = compose(not, isRed, getStar);
    const isStarNotWhite = compose(not, isWhite, getStar);

    console.log(isStarNotRed(arg), isStarNotWhite(arg))

    return allPass([
        isStarNotRed,
        isStarNotWhite
    ])(arg)
}

// 9. Все фигуры зеленые.
export const validateFieldN9 = (arg) => {
    const isTriangeGreen = compose(isGreen, getTriangle);
    const isCicleGreen = compose(isGreen, getCircle);
    const isStarGreen = compose(isGreen, getStar);
    const isSquareGreen = compose(isGreen, getSquare);

    return allPass([
        isTriangeGreen,
        isCicleGreen,
        isStarGreen,
        isSquareGreen
    ])(arg)
}

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (arg) => {
    const isTriangeGreen = compose(isGreen, getTriangle);
    const isSquareGreen = compose(isGreen, getSquare);
    const isTriangeBlue = compose(isBlue, getTriangle);
    const isSquareBlue = compose(isBlue, getSquare);
    const isTriangeRed = compose(isRed, getTriangle);
    const isSquareRed = compose(isRed, getSquare);
    const isTriangeOrange = compose(isOrange, getTriangle);
    const isSquareOrange = compose(isOrange, getSquare);
    const isBothGreen = allPass([isTriangeGreen, isSquareGreen])
    const isBothBlue = allPass([isTriangeBlue, isSquareBlue])
    const isBothRed = allPass([isTriangeRed, isSquareRed])
    const isBothOrange = allPass([isTriangeOrange, isSquareOrange])

    return anyPass([
        isBothGreen,
        isBothRed,
        isBothOrange,
        isBothBlue
    ])(arg)
}
