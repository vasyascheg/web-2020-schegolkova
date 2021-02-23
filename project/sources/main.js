let table = document.getElementById('tb2'); //глобальная переменная (раздел где выводятся заведения)
let sel1 = document.getElementById('sel1'); //поля фильтров
let sel2 = document.getElementById('sel2');
let sel3 = document.getElementById('sel3');
let sel4 = document.getElementById('sel4');
let card1 = document.getElementById('card1'); //карточки с блюдами
let items = document.querySelector('#pagination'); //кнопки пагинатора

let cardsArr;
let currentRest;
let prices = [];
let restsAll; // массив всех заведений
let restsFiltered; // отфильтрованный массив заведений
let notesOnPage = 5; //кол-во записей

function getRestsAll() {  //загружаем список заведений 
    let obXhr = new XMLHttpRequest();  //создали XMLHttpRequest-объекта
    table.innerHTML = ''; //очистили таблицу заведений в html
    obXhr.open('GET', `http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1`); // настройка объекта
	
    obXhr.send(); //отправили запрос

    obXhr.onreadystatechange = function () { //эта функция вызовется по событию onreadystatechange у объекта obXhr  
        if (obXhr.readyState != 4) return; //проверяем св-ва объекта (если не = 4 то обрабатывать нечего)
        if (obXhr.status != 200) {
            alert('Сервер недоступен ' + obXhr.status + ' ' + obXhr.statusText);
            return;
        }

        if (obXhr.response) { //если ответ сервера существует, мы его обрабатываем
            //let table = document.getElementById('tb2');
            //let pagination = document.querySelector('#pagination');
            restsAll = JSON.parse(obXhr.response); //заполняем полный массив заведений 
            //показываем всегда данные из restFiltered
            restsFiltered = restsAll.sort((a, b) => (b.rate - a.rate)).slice(0,20); //из отсортированного 
                                                                                    //массива оставляем 20 записей

            let it = InitPagination(restsFiltered.length);// создаем кнопки пагинации (функция возвращает 1 кнопку)
            showPage(it); // нажатие первой кнопки (items-кнопки пагинатора) 
           
            initFilter('admArea',sel1); //заполняем список значений для поиска
            initFilter('district',sel2);
            initFilter('typeObject',sel3);
           // initFilter('socialPrivileges',sel4, {0: 'Нет', 1: 'Есть'});
            //let ca1;

            document.getElementById("butN").onclick = () => {    //обработчик нажатия на кнопку "Найти"

                let okrug = document.getElementById("sel1").value;
                let dist = document.getElementById("sel2").value;
                let type = document.getElementById("sel3").value;
                let soc = document.getElementById("sel4").value;

                //console.log(soc);
                
                restsFiltered = restsAll.filter((element) => { //применяем фильтр к массиву по выбранным значениям
                    if ((element.admArea == okrug) || (okrug == "не выбрано"))
                        if (dist == element.district || dist == "не выбрано")
                            if (type == element.typeObject || type == "не выбрано")
                                if ((element.socialPrivileges == soc) || (soc == "не выбрано")) {
                                    return element;
                                }

                }).sort((a, b) => (b.rate - a.rate)).slice(0,20); // ... и сортируем его по убыванию рейтинга 
                                                                  //и оставляем первые 20 элементов
                
                //console.log(restsFiltered);
            
                let it = InitPagination(restsFiltered.length); //обновление кнопок пагинации 
                showPage(it); //перевывод первой страницы
            }
        }
    }
}


document.addEventListener('DOMContentLoaded', getRestsAll()); //регистрируем обработчик события


function onClickIncrease(b){ //обработчик кнопки + в карточках меню b-сама кнопка 
    let v = b.parentElement.parentElement.querySelector('input'); //передается
    if (v.value <= 9)
        ++v.value;
    calcTotalSum();
}

function onClickDecrease(b){ //обработчик кнопки - в карточках меню
    let v = b.parentElement.parentElement.querySelector('input');
    if (v.value > 0) 
        --v.value;
    calcTotalSum();
}

function uniqueArr(arr) { //получает массив, возвращает новый массив без повторов и отсортированный
    let res = [];
  
    for (let str of arr) {
      if (!res.includes(str)) {
        res.push(str);
      }
    }
    res.sort();
    return res;
  };
  
function initFilter(fieldName, selId){  //fieldname-получаем поле в структуре данных из котоорого мы получаем выборку, 
                                        //selid-идентификатор селектора(выпдаающего списка)
    //initFilter('admArea',sel1); //заполняем список значений для поиска
    //initFilter('district',sel2);
    //initFilter('typeObject',sel3);
    let arr = uniqueArr( restsAll.map(rec => rec[fieldName])); //получаем колонку у которой имя fieldname

    for (let key in arr) {
     
      let select1 = document.createElement('option');//создали элемент option
      
      select1.innerHTML = `
      
      <select>
      <option value="${arr[key]}">${arr[key]}</option>
      </select>
      
      `
      selId.append(select1); //в селектор добавляем опцию
    }
}  

function InitPagination(total){ //функция для пагинации total-общее кол-во элементов для отображения
    let pagination = document.querySelector('#pagination');
    pagination.innerHTML = '';
    let items = []; //кнопки пагинатора
    let cnt = total;
    if (cnt > 20)
        cnt = 20;
    cnt = Math.ceil(cnt / notesOnPage); //ceil - округляет вверх 
    if (cnt == 0){
        return null;
    } 
    for (let i = 1; i <= cnt; i++) { //создаем кнопку для каждой страницы
        let but = document.createElement('button');
        but.innerHTML = i;
        pagination.appendChild(but);
        items.push(but);//сохранили в массиве
        but.addEventListener('click', function () { //в эту кнопку навешиваем обработчик событий по клику
            showPage(this); //сама кнопка
        }); 
    }
    return items[0]; //возвращаем 1 кнопку
}

function showPage(item) {//это начало функции заполнения страниц
    table.innerHTML = ''; //очистили старую таблицу
    if (item == null){
        return;
    }
    let active = document.querySelector('#pagination li.active') //активация нажатия на кнопки пагинатора
    if (active) {
        active.classList.remove('active');
    }
    item.classList.add('active'); //новая кнопка делается акивной
    let pageNum = +item.innerHTML; //числовой номер страницы (целочисленный)
    let start = (pageNum - 1) * notesOnPage; //определяем границы выборки
    let end = start + notesOnPage;
    let notes = restsFiltered.slice(start, end); //делаем выборку из массива для отображения записи текущей страницы
    //console.log(notes);
    let tab; 
    for (let note in notes) {
        tab = document.createElement('tr'); //строка таблицы

        tab.innerHTML = `
        
        <tr>
        <td>${notes[note].name}</td>
        <td>${notes[note].typeObject}</td>
        <td>${notes[note].address}</td>
        <td>&#9733 ${notes[note].rate}</td>
        <button class="buttab">выбрать</button>
        </tr>
        
        `
        table.append(tab); //добавляем к таблице после наполнения
    }

    let button_choose = document.getElementsByClassName('buttab');//вот тут начинается функция по клику на кнопку выбрать
    for (let element of button_choose) { //на каждую кнопку выбрать навешиваем обработчик
        element.onclick = () => { 

            //сохраняем количество блюд
            let countDishes = [];
            for (let i = 0; i < 10; i++){
                let e = document.getElementById('countDishes' + i);
                if (e == undefined)
                    countDishes.push(0);
                else
                    countDishes.push(e.value);
            }

            card1.innerHTML = '';
            let obXhr = new XMLHttpRequest();
            obXhr.open('GET', `sources/file.json`);

            obXhr.send();

            obXhr.onreadystatechange = function () { //
                if (obXhr.readyState != 4) return; //проверяем св-ва объекта (если не = 4 то обрабатывать нечего)
                if (obXhr.status != 200) {
                    alert('Сервер недоступен ' + obXhr.status + ' ' + obXhr.statusText);
                    return;
                }

                if (obXhr.response) { 
                    let card1 = document.getElementById('card1');
                    cardsArr = JSON.parse(obXhr.response); //получили массив карточек меню

                    //в них записываются данные из той строки где находится кнопка выбрать 
                    let name_pr = String(element.parentNode.firstElementChild.innerHTML);
                    let type_pr = String(element.parentNode.firstElementChild.nextElementSibling.innerHTML);
                    let address_pr = String(element.parentNode.firstElementChild.nextElementSibling.nextElementSibling.innerHTML);

                    let need_obj  // запись соответствующая кнопке

                    restsAll.forEach(element => { //перебор по трем параметрам
                        if ((element.name == name_pr) && (element.typeObject == type_pr) && (element.address == address_pr)) {
                            need_obj = element; 
                        }    
                    })
                    currentRest =  need_obj; //запись с текущим заведением
                    prices = [];
                    for (let i = 1; i <= 10; i++) { // заполняем массив цен по имени свойствам set_1...set_10
                        prices.push(need_obj['set_'+i]);   
                    }
                      
                    for (let i = 0; i < cardsArr.length; i++) {
                        //console.log(result1[i])
                        let ca1 = document.createElement('div');
                        
                        ca1.className = "cards col-md-4 text-center";
    
                        ca1.innerHTML= `
                        <div class="m-3" style="background-color:#ADD8E6; border:1px; border-style:solid; border-color:#A9A9A9;" >
                          <div class="card-body">
                            <div class="container " name="cardDish">
                              <img src="${cardsArr[i].image}" class="bd-placeholder-img card-img-top" width="100%" height="200">
                              <div><h5>${cardsArr[i].name} - ${prices[i]} &#x20bd </h5></div>

                              <div class="row" style = "height:70px;"><h6 style="color: black">${cardsArr[i].description}</h6></div>
                              <div class="btn-group">
                                <div class="input-group input-group-sm mb-3">
                                  <div class="input-group-prepend">
                                    <button type="button" class=" decrease btn btn-sm btn-outline-secondary" onclick="onClickDecrease(this)">-</button>
                                  </div>
                                    <input id="countDishes${i}" type="text" class="form-control" readonly aria-label="Small" aria-describedby="inputGroup-sizing-sm" size="2" style=" background: white; border: 1px solid #6b6a6a; " value="${countDishes[i]}">
                                    <div class="input-group-append">
                                    <button type="button" class=" increase btn btn-sm btn-outline-secondary" onclick="onClickIncrease(this)">+</button>
                                    </div>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        `
                        
                        card1.append(ca1);  //добавляем карточку
                    }
                    calcTotalSum();
                }
            }
        }
    }
}


function calcTotalSum(){
    let sum = 0;
    for ( let i=0; i < 10; i++){
        sum = sum + prices[i]* document.getElementById('countDishes' + i).value;
    }
    document.getElementById('total').innerText = sum;
}

//Функция для модального окна оформления заказа
function modalClick(){
    let pos = document.getElementById('modal_positions');
    let opt = document.getElementById('choosed');
    let opt1 = document.getElementById('opt1').checked;
    let opt2 = document.getElementById('opt2').checked;
    pos.innerHTML = '';
    opt.innerHTML = '';
    let sum = 0;
    let gift;
    if (opt1)
        gift = getRandomInt(10);
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }

    for ( let i=0; i < 10; i++){
        let cnt = +document.getElementById('countDishes' + i).value;
        let tot =  cnt * prices[i]; 
        if (opt2){
            cnt = cnt*2;
            tot = 1.6*tot;
        }
        if (opt1 && (i==gift))
            cnt = cnt + 1;
        if (cnt > 0){
            let pr = cnt + ' x ' + prices[i];  
            pos.innerHTML = pos.innerHTML +
            `<tr>  
            <td><h5>${cardsArr[i].name}</h5></td>
            <td>${pr} &#x20bd</td>
            <td align="right"><h5>${tot.toFixed(0)} &#x20bd</h5></td>
            </tr>`;
            sum = sum + tot; 
        }
        
    }
    if (opt1){
        opt.innerHTML = opt.innerHTML +
        `<tr>  
            <td><h5>Хочу подарок</h5></td>   
        </tr>`; 
    }
    if (opt2){
        opt.innerHTML = opt.innerHTML +
        `<tr>  
            <td><h5>В 2 раза больше</h5></td>   
        </tr>`; 
    }
    document.getElementById('modal_name').innerText = currentRest.name;
    document.getElementById('modal_admArea').innerText = currentRest.admArea;
    document.getElementById('modal_district').innerText = currentRest.district;
    document.getElementById('modal_address').innerText = currentRest.address;
    document.getElementById('modal_rate').innerText = currentRest.rate;

    document.getElementById('modal_total').innerText = sum.toFixed(0);

    $('#Order').modal('show');
}
