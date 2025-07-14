/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import { 
    length, 
    and, 
    gt, 
    lt, 
    pipe, 
    andThen, 
    prop, 
    tap, 
    assoc, 
    cond, 
    always, 
    T
} from 'ramda';

const api = new Api();

const getValue = prop('value');
const updateValue = assoc('value');


const validateString = (value) => {
    const valueLength = length(value);
    const isValidLength = and(gt(valueLength, 2), lt(valueLength, 10));
    const isValidNumber = /^[0-9]+\.?[0-9]*$/.test(value);
    const isPositive = gt(parseFloat(value), 0);
    
    return and(and(isValidLength, isValidNumber), isPositive);
};


const step1_logInitial = (context) => {
    pipe(
        getValue,
        tap(context.writeLog)
    )(context);
    return context;
};


const step2_validate = (context) => cond([
    [pipe(getValue, validateString), always(context)],
    [T, () => {
        context.handleError('ValidationError');
        throw new Error('ValidationError');
    }]
])(context);


const step3_roundNumber = (context) => {
    const roundedValue = pipe(
        getValue,
        parseFloat,
        Math.round,
        tap(context.writeLog)
    )(context);
    return updateValue(roundedValue, context);
};


const step4_convertToBinary = (context) => {
    return api.get('https://api.tech/numbers/base')({
        from: 10,
        to: 2,
        number: getValue(context)
    })
    .then(response => {
        const binaryString = response.result;
        context.writeLog(binaryString);
        return updateValue(binaryString, context);
    });
};


const step5_countLength = (context) => {
    const lengthValue = pipe(
        getValue,
        length,
        tap(context.writeLog)
    )(context);
    return updateValue(lengthValue, context);
};


const step6_square = (context) => {
    const squaredValue = pipe(
        getValue,
        (x) => x * x,
        tap(context.writeLog)
    )(context);
    return updateValue(squaredValue, context);
};


const step7_modulo = (context) => {
    const remainderValue = pipe(
        getValue,
        (x) => x % 3,
        tap(context.writeLog)
    )(context);
    return updateValue(remainderValue, context);
};


const step8_getAnimal = (context) => {
    return api.get(`https://animals.tech/${getValue(context)}`)({})
        .then(response => {
            const animal = response.result;
            return updateValue(animal, context);
        });
};


const step9_handleSuccess = (context) => {
    context.handleSuccess(getValue(context));
    return context;
};


const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const context = { value, writeLog, handleSuccess, handleError };
    
    const asyncPipe = pipe(
        step1_logInitial,
        step2_validate,
        step3_roundNumber,
        step4_convertToBinary,
        andThen(step5_countLength),
        andThen(step6_square),
        andThen(step7_modulo),
        andThen(step8_getAnimal),
        andThen(step9_handleSuccess)
    );
    
    Promise.resolve(context)
        .then(asyncPipe)
        .catch(error => {
            if (error.message !== 'ValidationError') {
                handleError(error);
            }
        });
};

export default processSequence;
