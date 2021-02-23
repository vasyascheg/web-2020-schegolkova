//let table = document.getElementById('tb2'); //глобальная переменная (раздел где выводятся заведения)
let selName = document.getElementById('Name'); //поля фильтров
let selArea = document.getElementById('Area');
let selSeatFrom = document.getElementById('SeatFrom');
let selSeatTo = document.getElementById('SeatTo');
let selisNET= document.getElementById('isNET');
let selDistrict= document.getElementById('District');
let selDateFrom = document.getElementById('DateFrom');
let selDateTo = document.getElementById('DateTo');
let selSocial = document.getElementById('Social');
let selType = document.getElementById('Type');
//let card1 = document.getElementById('card1'); //карточки с блюдами
let items = document.querySelector('#pagination'); //кнопки пагинатора

let restsAll; // массив всех заведений
let restsFiltered; // отфильтрованный массив заведений
let notesOnPage = 5; //кол-во записей

function getRestsAll() {  //загружаем список заведений 
    let obXhr = new XMLHttpRequest();  //создали XMLHttpRequest-объекта
    //table.innerHTML = ''; //очистили таблицу заведений в html
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


            restsFiltered = restsAll.slice(0, restsAll.length);

            initShowPage();
            //showPage(0); // нажатие первой кнопки (items-кнопки пагинатора) 
           
            initFilter('admArea',selArea); //заполняем список значений для поиска
            initFilter('district',selDistrict);
            initFilter('typeObject',selType);
           // initFilter('socialPrivileges',sel4, {0: 'Нет', 1: 'Есть'});
            //let ca1;

            document.getElementById("btnFind").onclick = () => {    //обработчик нажатия на кнопку "Найти"

            


            function myDate(d) {   //получаем дату из строки с обнуленным временем
                var res = new Date(d);
                res.setHours(0,0,0,0);
                return res;    
            }

           // alert('[' + selDateFrom.value + ']' + myDate('Mon, 06 Jul 2020 12:43:00 GMT'));
             
                //console.log(soc);
                
                restsFiltered = restsAll.filter((element) => { //применяем фильтр к массиву по выбранным значениям
                    //alert(typeof(element.created_at));
                if ((element.name == selName.value) || (selName.value == ""))    
                    if ((element.admArea == selArea.value) || (selArea.value == ""))
                        if (element.seatsCount >= selSeatFrom.valueAsNumber || selSeatFrom.value == "")
                        if (element.seatsCount <= selSeatTo.valueAsNumber || selSeatTo.value == "")

                        if (myDate(element.created_at) >= myDate(selDateFrom.valueAsDate) || selDateFrom.value == "")
                        if (myDate(element.created_at) <= myDate(selDateTo.valueAsDate) || selDateTo.value == "")

                            if (element.district == selDistrict.value || selDistrict.value == "")
                                if (element.typeObject == selType.value || selType.value == "")
                                    if ((element.socialPrivileges == selSocial.value) || (selSocial.value == "")) 
                                    {
                                    return element;
                                     }

                });
                //alert(restsFiltered.length);
                //.sort((a, b) => (b.rate - a.rate)).slice(0,20); // ... и сортируем его по убыванию рейтинга 
                                                                  //и оставляем первые 20 элементов
                
                //console.log(restsFiltered);
            
                //let it = InitPagination(restsFiltered.length); //обновление кнопок пагинации 
                showPage(0); //перевывод первой страницы
            }
            document.getElementById("btnFind").onclick(); //!!!!!!!!!!
        }
    }
}


document.addEventListener('DOMContentLoaded', getRestsAll()); //регистрируем обработчик события


function onClickIncrease(b){ //обработчик кнопки + в карточках меню b-сама кнопка 
    let v = b.parentElement.parentElement.querySelector('input'); //передается
    if (v.value <= 9)
        ++v.value;
}

function onClickDecrease(b){ //обработчик кнопки - в карточках меню
    let v = b.parentElement.parentElement.querySelector('input');
    if (v.value > 0) 
        --v.value;
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


    return null;



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


function initShowPage(){
    
    $('#table').bootstrapTable({
        data: restsFiltered,
        cache: false,
        formatLoadingMessage: function() {
            return ' ';},
        formatRecordsPerPage: function () {
                return ''
              }
             
    });
    
    return;
}

function showPage(item) {//это начало функции заполнения страниц


//alert('aaaaaaaaaaaaaaaa ' + restsFiltered.length);



    //$table.bootstrapTable('load', randomData())
    $('#table').bootstrapTable('load', restsFiltered);

return;





    $('#table').bootstrapTable({
        data: restsFiltered,
        cache: false,
        formatLoadingMessage: function() {
            return ' ';},
        formatRecordsPerPage: function () {
                return ''
              }
             
    });
    $('#table').bootstrapTable('refresh');
    return;





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
                    let result1 = JSON.parse(obXhr.response); //получили массив карточек меню

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
                    
                    let prices = [];
                    for (let i = 1; i <= 10; i++) { // заполняем массив цен по имени свойствам set_1...set_10
                        prices.push(need_obj['set_'+i]);   
                        }
                      
                    for (let i = 0; i < result1.length; i++) {
                        //console.log(result1[i])
                        let ca1 = document.createElement('div');
                        
                        ca1.className = "cards col-md-4 text-center";
    
                        ca1.innerHTML= `
                        <div class="m-3" style="background-color:#ADD8E6; border:1px; border-style:solid; border-color:#A9A9A9;" >
                          <div class="card-body">
                            <div class="container " name="cardDish">
                              <img src="${result1[i].image}" class="bd-placeholder-img card-img-top" width="100%" height="200">
                              <div><h5>${result1[i].name} - ${prices[i]} &#x20bd </h5></div>

                              <div class="row" style = "height:70px;"><h6 style="color: black">${result1[i].description}</h6></div>
                              <div class="btn-group">
                                <div class="input-group input-group-sm mb-3">
                                  <div class="input-group-prepend">
                                    <button type="button" class=" decrease btn btn-sm btn-outline-secondary" onclick="onClickDecrease(this)">-</button>
                                  </div>
                                    <input type="text" class="form-control" readonly aria-label="Small" aria-describedby="inputGroup-sizing-sm" size="2" style=" background: white; border: 1px solid #6b6a6a; " value="0">
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
                }
            }
        }
    }
}


function idFormatter(value) {
    //return '<i class="glyphicon glyphicon-star"></i> ' + value;
    //return '<button type="button" class="btn"><span class="glyphicon glyphicon-star"></span></button>';
    return '<button type="button" onclick="viewClick('+value +')"  class="btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/></svg></button>' +
    '<button type="button" onclick="editClick('+value +')" class="btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"> <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/> </svg></button>' +
    '<button type="button" onclick="deleteClick('+value +')" class="btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg></button>';
}


function viewClick(el) 
{


    function myFormat(arr){
        if (arr.length > 2){
            return ['Нет', 'Да' ]  [rec[ arr[1] ]];  
        }
        return rec[ arr[1] ];
    }



    var dic = [['Наименование','name'],
                ['Является сетевым','isNetObject', 'bool'],
                ['Название управляющей компании','operatingCompany'],
                ['Вид объекта','typeObject'],
                ['Административный округ','admArea'],
                ['Район','district'],
                ['Адрес','address'],
                ['Число посадочных мест','seatsCount'],
                ['Показатель социальных льгот','socialPrivileges', 'bool'],
                ['Контактный телефон','publicPhone']
                //['Географические координаты','isNetObject']
            ];
    //alert(el);
    for (let i in restsFiltered) {
        var rec = restsFiltered[i];
        var t = document.getElementById('exampleModalLabel');
        var tbl = document.getElementById('dataTable');
        tbl.innerHTML = '';

        if (rec.id == Number(el)){
            //alert(t.innerHTML);
            t.innerHTML = rec.name;
            for (j in dic){
                tbl.innerHTML = tbl.innerHTML + '<tr><td>' + dic[j][0] +  '</td> <td>' + myFormat( dic[j] ) + '</td> </tr>';
            }
            $('#exampleModal').modal('show');
            break;
        }    
    }
}



function editClick(el) 
{
    var rec;
    for (let i in restsFiltered) {
        rec = restsFiltered[i]; 
        if (rec.id == Number(el))
            break;
    }
    initFilter('typeObject',typeObject);
    initFilter('admArea',admArea);
    initFilter('district',district);

    document.getElementById('name').value = rec.name;
    document.getElementById('isNetObject0').checked = (rec.isNetObject == 0);  
    document.getElementById('isNetObject1').checked = (rec.isNetObject == 1);//radio button!!!!!!!
    document.getElementById('operatingCompany').value = rec.operatingCompany;
    document.getElementById('typeObject').value = rec.typeObject;
    document.getElementById('admArea').value = rec.admArea;
    document.getElementById('district').value = rec.district;
    document.getElementById('address').value = rec.address;
    document.getElementById('seatsCount').value = rec.seatsCount;
    document.getElementById('socialPrivileges0').checked = (rec.socialPrivileges == 0);
    document.getElementById('socialPrivileges1').checked = (rec.socialPrivileges == 1);
    document.getElementById('publicPhone').value = rec.publicPhone;

    document.getElementById('buttonSave').onclick = function(){saveRecord(el);};
    $('#editModal').modal('show');
    //alert(el);
}

function deleteClick(el) 
{
    for (let i in restsFiltered) {
        var rec = restsFiltered[i];
        
        if (rec.id == Number(el)){ 
            document.getElementById('deleteRest').innerText = ' Вы уверены, что хотите удалить данные предприятия ' + rec.name + '?';
            document.getElementById('deleteButton').onclick = function(){deleteRecordById(el);}
            $('#deleteModal').modal('show');
        }
    }
    //alert(el);
}


function deleteRecordById(id){
    let obXhr = new XMLHttpRequest();  //создали XMLHttpRequest-объекта
    //table.innerHTML = ''; //очистили таблицу заведений в html
    obXhr.open('DELETE', `http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1/`+ id +`?api_key=75883a89-3c5f-442c-a11e-e49ddda5ccd2`); // настройка объекта
    
    
    
    obXhr.onreadystatechange = function () { //эта функция вызовется по событию onreadystatechange у объекта obXhr  
        if (obXhr.readyState != 4) return; //проверяем св-ва объекта (если не = 4 то обрабатывать нечего)
        if (obXhr.status != 200) {
            alert('Сервер недоступен ' + obXhr.status + ' ' + obXhr.statusText);
            return;
        }

        if (obXhr.response) { 
            var res = JSON.parse(obXhr.response);
            if (res.hasOwnProperty("error")){
                myAlert('Ошибка!', res.error);
                //alert(res.error);
            }
            else{
                //alert('AAAAAAAAAAAA');
                getRestsAll();
                //document.getElementById("btnFind").onclick();
            }
            
            //alert(obXhr.response);
            //restsAll = JSON.parse(obXhr.response);
        }
    }
    //obXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    obXhr.send();
}




function myAlert(title, text){
    document.getElementById('alertModalTitle').innerText = title;
    document.getElementById('alertModalText').innerText = text;
    $('#alertModal').modal('show');
}





function addRest(){
    document.getElementById('Title').innerText = 'Создание новой записи';
    document.getElementById('buttonSave').onclick = function(){saveRecord(-1);};
    $('#editModal').modal('show'); 
}

function saveRecord(id) { //функция для добавления и для редактирования записей
    
    var params = new Object();
    params.name = document.getElementById('name').value;
    params.isNetObject = document.getElementById('isNetObject1').checked ? 1:0;   //radio button!!!!!!!
    params.operatingCompany = document.getElementById('operatingCompany').value;
    params.typeObject = document.getElementById('typeObject').value;
    params.admArea = document.getElementById('admArea').value;
    params.district = document.getElementById('district').value;
    params.address = document.getElementById('address').value;
    params.seatsCount = document.getElementById('seatsCount').value;
    params.socialPrivileges = document.getElementById('socialPrivileges1').checked ? 1:0; //
    params.publicPhone = document.getElementById('publicPhone').value;
    //params.myparam2 = myval2;

    // Turn the data object into an array of URL-encoded key/value pairs.
    let urlEncodedData = "", urlEncodedDataPairs = [], name;
    for( name in params ) {
        urlEncodedDataPairs.push(encodeURIComponent(name)+'='+encodeURIComponent(params[name]));
    }
    urlEncodedData = urlEncodedDataPairs.join('&');




    //alert('DDDDDDDDDDD');
    let obXhr = new XMLHttpRequest();  //создали XMLHttpRequest-объекта
    //table.innerHTML = ''; //очистили таблицу заведений в html
    if ( id < 0) //добавление новой записи
        obXhr.open('POST', `http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1?api_key=75883a89-3c5f-442c-a11e-e49ddda5ccd2`); 
    else //изменение существующей записи по ключу
        obXhr.open('PUT', `http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1/`+ id +`?api_key=75883a89-3c5f-442c-a11e-e49ddda5ccd2`);

    
    
    obXhr.onreadystatechange = function () { //эта функция вызовется по событию onreadystatechange у объекта obXhr  
        if (obXhr.readyState != 4) return; //проверяем св-ва объекта (если не = 4 то обрабатывать нечего)
        if (obXhr.status != 200) {
            alert('Сервер недоступен ' + obXhr.status + ' ' + obXhr.statusText);
            return;
        }

        if (obXhr.response) { 
            var res = JSON.parse(obXhr.response);
            if (res.hasOwnProperty("error")){
                myAlert('Ошибка!', res.error);
                //alert(res.error);
            }
            else{
                //alert('AAAAAAAAAAAA');
                getRestsAll();
                //document.getElementById("btnFind").onclick();
            }
        }
    }
    obXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    obXhr.send(urlEncodedData);
   // http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
}
