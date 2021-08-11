function eval(array) {
    // Do not use eval!!!
    let operation = [
        { '*': (a, b) => +a * +b },
        { '/': (a, b) => +a / +b },
        { '+': (a, b) => +a + +b },
        { '-': (a, b) => +a - +b }
    ];
    let calc = [];
    let i = array.length;
    let currentOp, result;
    while (array.length != 1) {

        ind1 = array.indexOf("*");
        ind2 = array.indexOf("/");
        ind3 = array.indexOf("-");
        ind4 = array.indexOf("+");
        ind1 != -1 ? (ind2 != -1 ? (ind1 < ind2 ? ind = ind1 : ind = ind2) : ind = ind1) : ind2 != -1 ? ind = ind2 :
            (ind3 != -1 ? ind4 != -1 ? (ind3 < ind4 ? ind = ind3 : ind = ind4) : ind = ind3 : ind4 != -1 ? ind = ind4 : ind = -1);

        if (ind != -1) {
            calc.push(array[ind - 1]);
            calc.push(array[ind]);
            calc.push(array[ind + 1]);
            array.splice(ind + 1, 1);
            array.splice(ind, 1);
            if (calc[2] == 0 & calc[1] == "/") {
                return "Division by zero"
            }

            for (let i = 0; i < operation.length; i++) {
                if (operation[i][calc[1]]) {
                    currentOp = operation[i][calc[1]];
                    result = currentOp(calc[0], calc[2]);
                }
            }
        }
        array[ind - 1] = result;
        if (typeof (array[ind - 1]) == "string") return array[ind - 1];
        calc = [];

    }
    i--;
    if (i < -2) return "cicle";
    return result;
}   

function expressionCalculator(expr) {
    // write your solution here
    let colOpen = 0;
    let colClose = 0;

    let result;
    let arr = expr;

    if (typeof (expr) == "string") {
        let str = expr.replace(/\s/g, '');
        let arg1, arg2, ind;
        let pos = -1;
        arr = str.split('');
        let lengthArr = arr.length;
        for (let i = 0; i < arr.length; i++) {
            if (/[0-9]/.test(arr[i]) & (/[0-9]/.test(arr[i + 1]))) {
                if (i < arr.length - 1) {
                    arr[i] = (arr[i]) + (arr[i + 1]);
                    arr.splice(i + 1, 1);
                    i--;
                }
            } else {

                arr[i] == "(" ? colOpen++ : arr[i] == ")" ? colClose++ : "";
                arr[i] = arr[i];
            }
        }
    }

    if ((colOpen != 0 || colClose != 0) & colOpen != colClose) {
        throw new UserException("ExpressionError: Brackets must be paired");

    } else if (colOpen == colClose) {
        while (colOpen != 0) {
            let indOpen = arr.lastIndexOf("(");
            let indClose = arr.indexOf(")", arr.lastIndexOf("("));
            let newArr = arr.splice(indOpen + 1, indClose - indOpen);
            newArr.splice(newArr.length - 1);

            arr[indOpen] = eval(newArr);
            if (arr[indOpen] == "Division by zero") {
                throw new UserException("TypeError: Division by zero.")
            }
            newArr = [];
            colOpen--;
            colClose--;
        }
    }
    if (colOpen == 0) {
        result = eval(arr);
        if (result == "Division by zero") {
            throw new UserException("TypeError: Division by zero.");
        }
    }

    return +result.toFixed(4);   

}

function ExpressionError(property) {
    Error.call(this, property);
    this.name = "ExpressionError";
    this.property = property;
    this.message = "Brackets must be paired";
}
function UserException(message) {
    this.message = message;
    this.name = "UserException";
}
UserException.prototype.toString = function () {
    return this.name + ': "' + this.message + '"';

}
ExpressionError.prototype = Object.create(Error.prototype);

module.exports = {
    expressionCalculator
}