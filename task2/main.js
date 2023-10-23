"use stric"

const form = document.querySelector(".form__body");
const arrival = form.querySelector(".form__arrival");
const reset = form.querySelector(".button__reset");
const btnClose = form.querySelector(".btn-close");

// переменные для сохранения локалСторадж
let formData ={};
let LS = localStorage;

form.addEventListener("submit", function(e){
    e.preventDefault();

    let err = formValidate(form);

    if(err === 0){
        alert("Форма отправлена!");
    } else {
        alert("Заполните оставшиеся поля корректно!");
    }
});


form.addEventListener("input", function(e){
    formData[e.target.name] = e.target.value;
    LS.setItem("formData", JSON.stringify(formData));

    formValidate(form);
})

// Сохранение данных в input после обновления
if(LS.getItem("formData")){
    formData = JSON.parse(LS.getItem("formData"));
    
    for(let key in formData) {
        form.elements[key].value = formData[key];
    }
}

// Отчистка данных из LS кнопкой "Отмена"
reset.addEventListener("click", function(){
    LS.removeItem("formData");
    for(let key in formData) {
        formData[key] = null;
    }
});

// Убрать функциональность кнопки закрытия (крестик)
btnClose.addEventListener("click", function(e){
    e.preventDefault()
});

// Валидация формы
function formValidate(form){
    let error = 0;
    const formReq = document.querySelectorAll("._req");

    for(let i = 0; i < formReq.length; i++){
        const input = formReq[i];
        formRemoveError(input);

        
        if(input.classList.contains("_stateNum")){
            if(stateNumTest(input)) {
                formAddError(input);
                error++;
            }
        } else if(input.classList.contains("_arrival")) {
            if(arrivalTest(input)) {
                formAddError(input);
                error++;
            }
        } else if(input.classList.contains("_fullName")) {
            if(fullNameTest(input)) {
                formAddError(input);
                error++;
            }
        } else if(input.classList.contains("_series")) {
            if(passportSeriesTest(input) ) {
                formAddError(input);
                error++;
            }
        } else if(input.classList.contains("_number")) {
            if(passportNumberTest(input) ) {
                formAddError(input);
                error++;
            }
        } else if(input.value === ""){
            formAddError(input);
            error++;
        }
    }
    return error;
}

function formAddError(input) {
    input.classList.add("_error");
}

function formRemoveError(input) {
    input.classList.remove("_error");
}

// Установка дате минимального значения
// и проверка, что дата прибытия не оккажется прошедшим днём
function arrivalTest(input) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate()
    const minDate = `${year}-${month+1}-${day}`;
    input.setAttribute("min", minDate);
    return !(formData.arrival >= input.getAttribute("min"));
}

// Проверка гос-номера (регистр не имеет значение)
function stateNumTest(input) {
    return !/^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}(\d{2}(?<!00)|[1-9]\d{2})$/i.test(input.value);
}

// Проверка ФИО (с учётом, что у человека может не быть отчества)
// Регистр не имеет значения
function fullNameTest(input) {
    return !/^[а-яё]{2,}\s[а-яё]{2,}((\s[а-яё]{2,})?)$/i.test(input.value);
}

// Проверка серии паспорта
function passportSeriesTest(input) {
    return !(/\d{4}/.test(input.value) && input.value.length === 4);
}

// Проверка номера паспорта
function passportNumberTest(input) {
    return !(/\d{6}/.test(input.value) && input.value.length === 6)
}