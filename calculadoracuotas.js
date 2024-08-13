document.getElementById('financiar-ford').addEventListener('click', function() {
    document.getElementById('monto').value = 1000000;  // Monto del Ford Ka
    document.getElementById('tasa').value = 1;         // Tasa de interés
    document.getElementById('plazo').value = 24;        // Plazo en meses
    document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' }); // Redirigir al simulador de cuotas
});

document.getElementById('financiar-fiat').addEventListener('click', function() {
    document.getElementById('monto').value = 5000000;  // Monto del Fiat Cronos
    document.getElementById('tasa').value = 2;        // Tasa de interés
    document.getElementById('plazo').value = 24;       // Plazo en meses
    document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' }); // Redirigir al simulador de cuotas
});

document.getElementById('financiar-ferrari').addEventListener('click', function() {
    document.getElementById('monto').value = 10000000;  // Monto del Ferrari Enzo
    document.getElementById('tasa').value = 4;         // Tasa de interés
    document.getElementById('plazo').value = 48;        // Plazo en meses
    document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' }); // Redirigir al simulador de cuotas
});

class Vehiculo {
    constructor(monto, tasa, plazo) {
        this.monto = monto;
        this.tasa = tasa;
        this.plazo = plazo;
    }
}

class Cuota {
    constructor(mes, cuota, interes, principal, montoRestante) {
        this.mes = mes;
        this.cuota = cuota;
        this.interes = interes;
        this.principal = principal;
        this.montoRestante = montoRestante;
    }
}

let tasaMensual;
let cuota;
let cuotas = [];

// Función para calcular las cuotas mensuales
function calcularCuotas() {
    const monto = parseFloat(document.getElementById('monto').value);
    const tasa = parseFloat(document.getElementById('tasa').value);
    const plazo = parseInt(document.getElementById('plazo').value);

    if (!validarInputs(monto, tasa, plazo)) {
        mostrarError("Por favor, ingrese valores válidos.");
        return;
    }

    tasaMensual = tasa / 100 / 12;
    cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1);

    document.getElementById('resultado').innerText = `Cuota mensual: ${cuota.toFixed(2)} Pesos.`;

    const vehiculo = new Vehiculo(monto, tasa, plazo);
    guardarVehiculo(vehiculo);
    console.log(vehiculo);
}

// Función para validar los inputs
function validarInputs(monto, tasa, plazo) {
    return !(isNaN(monto) || isNaN(tasa) || isNaN(plazo) || monto <= 0 || tasa <= 0 || plazo <= 0);
}

// Función para mostrar el plan de amortización
function mostrarAmortizacion() {
    const resultado = document.getElementById('resultado');
    resultado.innerText = ''; 

    let montoRestante = parseFloat(document.getElementById('monto').value);
    const plazo = parseInt(document.getElementById('plazo').value);
    let mes = 1;

    cuotas = []; // Resetear el array de cuotas

    while (montoRestante > 0 && mes <= plazo) {
        const interes = montoRestante * tasaMensual;
        const principal = cuota - interes;

        if (mes === plazo || montoRestante < principal) {
            montoRestante = 0;
        } else {
            montoRestante -= principal;
        }

        const cuotaObj = new Cuota(mes, cuota.toFixed(2), interes.toFixed(2), principal.toFixed(2), montoRestante.toFixed(2));
        cuotas.push(cuotaObj);

        resultado.innerText += `Mes ${mes}: Cuota: ${cuota.toFixed(2)}, Interés: ${interes.toFixed(2)}, Principal: ${principal.toFixed(2)}, Monto Restante: ${montoRestante.toFixed(2)}\n`;

        mes++;
    }

    guardarCuotas(cuotas);
    console.log(cuotas); // Mostrar las cuotas en la consola
}

// Función para mostrar errores
function mostrarError(mensaje) {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `<p id="error">${mensaje}</p>`;
}

// Funciones para guardar y cargar datos en el Storage
function guardarVehiculo(vehiculo) {
    localStorage.setItem('vehiculo', JSON.stringify(vehiculo));
}

function cargarVehiculo() {
    const vehiculo = JSON.parse(localStorage.getItem('vehiculo'));
    if (vehiculo) {
        document.getElementById('monto').value = vehiculo.monto;
        document.getElementById('tasa').value = vehiculo.tasa;
        document.getElementById('plazo').value = vehiculo.plazo;
    }
}

function guardarCuotas(cuotas) {
    localStorage.setItem('cuotas', JSON.stringify(cuotas));
}

function cargarCuotas() {
    return JSON.parse(localStorage.getItem('cuotas')) || [];
}

// Event Listeners
document.getElementById('calcular-btn').addEventListener('click', calcularCuotas);
document.getElementById('amortizacion-btn').addEventListener('click', mostrarAmortizacion);

document.addEventListener('DOMContentLoaded', cargarVehiculo);
