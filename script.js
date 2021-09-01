const calculatorContent = document.querySelector('.calculator');
const calculatorTotal = document.querySelector('.calculator__price__total');
const clearButton = document.querySelector('#clear');
const calculateButton = document.querySelector('#calculate');
const pdfButton = document.querySelector('#pdf');

let total = 0;
const symbol = '\u20BD';


const createCalculatorResult = (sum) => {
    const displayTotal = String(sum.toFixed(2)).replace('.', ',');
    calculatorTotal.textContent = `${displayTotal} ${symbol}`;
}

const calculate = () => {
    total = 0;
    calculatorContent.querySelectorAll('input[name="capacity"]').forEach(item => total += item.value * item.dataset.price);
    createCalculatorResult(total);
}

const enterValue = (e) => {
    if (e.target.matches('input')) {
        const inputsContainer = e.target.closest('.calculator__item__line__inputs');
        const inputTotal = inputsContainer.querySelector('input[name="total"]');
        if (!e.target.value) {
            inputTotal.value = '0,00';
        } else if (!Number(e.target.value)) {
            e.target.value = e.target.value.replace(/[^\d]/g, '')
        } else {
            inputTotal.value = ((e.target.value * e.target.dataset.price).toFixed(2)).replace('.', ',');
        }
    }
}

const clear = () => {
    document.querySelectorAll('input[name="capacity"]').forEach(item => item.value = '');
    document.querySelectorAll('input[name="total"]').forEach(item => item.value = '0,00');
    createCalculatorResult(0);
}

const clearItem = (e) => {
    if (e.target.classList.contains('calculator__item__line__button')) {
        const inputsContainer = e.target.parentElement;
        inputsContainer.querySelector('input[name="total"]').value = '0,00';
        inputsContainer.querySelector('input[name="capacity"]').value = '';
    }
}

const createData = () => {
    let data = [];
    const total = calculatorTotal.textContent;
    const block = document.querySelectorAll('.calculator__item__line');
    block.forEach(item => {
        if (item.querySelector('input[name="capacity"]').value) {
            data.push({
                title: item.querySelector('.calculator__item__line__title').textContent,
                capacity: item.querySelector('input[name="capacity"]').value,
                workTotal: `${item.querySelector('input[name="total"]').value} ${symbol}`,
            });
        }
    });
    return { total, data };
}

const generatePDF = () => {
        calculate();
        const data = createData();
        const element = document.createElement('div');
        element.innerHTML = `
            <h1>Подготовка коммерческого предложения</h1>
            <br>
            ${data.data.map(item => `
                <div><b>Наименование:</b> ${item.title}</div>
                <div><b>Объём:</b> ${item.capacity}</div>
                <div><b>Сумма, ${symbol}:</b> ${item.workTotal}</div>
                <br>
            `).join('')}
            <div>Итог:<b> ${data.total}</b></div>
        </div>
        `;
    const opt = {
        margin: 20,
        filename: 'calculate.pdf',
    };
    html2pdf().set(opt).from(element).save();
}

document.addEventListener('DOMContentLoaded', () => {
    calculateButton.addEventListener('click', calculate);
    calculatorContent.addEventListener('input', enterValue);
    clearButton.addEventListener('click', clear);
    calculatorContent.addEventListener('click', clearItem);
    pdfButton.addEventListener('click', generatePDF);
    document.addEventListener('keypress', (e) => {
        if (e.code === 'Enter') {
            calculate();
        }
    });
});