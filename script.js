document.getElementById('float-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const input = parseFloat(document.getElementById('float-input').value);
    if (isNaN(input)) {
        document.getElementById('result').textContent = "Please enter a valid float.";
        return;
    }
    const preciseFloat = preciseIEEE754Float(input);
    document.getElementById('result').textContent = `Full float: ${preciseFloat}`;
});

document.getElementById('skin-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const desiredFloat = parseFloat(document.getElementById('desired-float').value);
    const floatCap = parseFloat(document.getElementById('float-cap').value);
    if (isNaN(desiredFloat) || isNaN(floatCap)) {
        document.getElementById('skinResult').textContent = "Please enter valid floats for desired float and float cap.";
        return;
    }
    const floatInputs = [];
    for (let i = 1; i <= 9; i++) {
        const float = parseFloat(document.getElementById('float-' + i).value);
        if (isNaN(float)) {
            document.getElementById('skinResult').textContent = `Please enter a valid float for Float ${i}.`;
            return;
        }
        floatInputs.push(float);
    }

    const neededAverage = desiredFloat / floatCap;
    const sumOfFloats = floatInputs.reduce((acc, val) => acc + val, 0);
    const lastFloatNeeded = (neededAverage * 10) - sumOfFloats;

    document.getElementById('skinResult').textContent = `Needed Average Float: ${neededAverage}, Last Float Needed: ${lastFloatNeeded}`;
});

document.getElementById('scout-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const floatInputs = [];
    for (let i = 1; i <= 10; i++) {
        const float = parseFloat(document.getElementById('scout-float-' + i).value);
        if (isNaN(float)) {
            document.getElementById('float-calc-result').textContent = `Please enter a valid float for Float ${i}.`;
            return;
        }
        floatInputs.push(float);
    }

    const sumOfFloats = floatInputs.reduce((acc, val) => acc + val, 0);
    const averageFloat = sumOfFloats / 10;
    const cappedFloat = averageFloat * 0.03;

    const closestIEEE754Value = preciseIEEE754Float(cappedFloat);
    const closestLowCap = preciseIEEE754Float(cappedFloat - 0.0000000000000004);
    const closestHighCap = preciseIEEE754Float(cappedFloat + 0.0000000000000004);

    document.getElementById('float-calc-result').innerHTML = `
    Full float sum: ${sumOfFloats}<br>
    Average float: ${averageFloat}<br>
    Capped float: ${cappedFloat}<br>
    Closest IEEE754 value: ${closestIEEE754Value}<br>
    Low cap: ${closestLowCap}<br>
    High cap: ${closestHighCap}
    `;
});

function preciseIEEE754Float(float) {
    let buffer = new ArrayBuffer(8); // 64 bits
    let float64Array = new Float64Array(buffer);
    let uint32Array = new Uint32Array(buffer);
    
    float64Array[0] = float;
    let binary = '';
    
    binary += uint32Array[1].toString(2).padStart(32, '0');
    binary += uint32Array[0].toString(2).padStart(32, '0');
    
    let sign = binary[0] === '1' ? -1 : 1;
    let exponent = parseInt(binary.substring(1, 12), 2) - 1023;
    let mantissa = 1; // Implicit leading 1 for normalized numbers
    
    for (let i = 12; i < 64; i++) {
        mantissa += parseInt(binary[i]) * Math.pow(2, -(i - 11));
    }

    let preciseValue = sign * mantissa * Math.pow(2, exponent);
    return preciseValue;
}
