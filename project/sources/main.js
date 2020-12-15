let table = document.getElementById('tb2');
let sel1 = document.getElementById('sel1');
let sel2 = document.getElementById('sel2');
let sel3 = document.getElementById('sel3');
let sel4 = document.getElementById('sel4');
let card1 = document.getElementById('card1');
let items = document.querySelector('#pagination');

let restsAll;
let restsFiltered;
let notesOnPage = 5;

function getRestsAll() {  //загружаем список заведений
    let obXhr = new XMLHttpRequest();
    table.innerHTML = '';
    obXhr.open('GET', `http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1`);
	
    obXhr.send();

    obXhr.onreadystatechange = function () { //асинхронный вызов
        if (obXhr.readyState != 4) return;
        if (obXhr.status != 200) {
            alert('Сервер недоступен ' + obXhr.status + ' ' + obXhr.statusText);
            return;
        }

        if (obXhr.response) {
            //let notesOnPage = 5;
            let table = document.getElementById('tb2');
            let pagination = document.querySelector('#pagination');
            restsAll = JSON.parse(obXhr.response);
            let tab;
            let i = 0;
           /*
            let items = [];

            for (let i = 1; i <= 4; i++) {
                let but = document.createElement('button');
                but.innerHTML = i;
                pagination.appendChild(but);
                items.push(but);

                but.addEventListener('click', function () { 
                    showPage(this);
                }); 
            }

            */

            restsFiltered = restsAll.slice();
            restsFiltered.sort(function (a, b) {
                return b.rate - a.rate
            });
            
            let it = InitPagination(restsFiltered.length);
            console.log(it);
            showPage(it); //эмуляция нажатия первой кнопки (items-кнопки пагинатора)
           /* for (let item of items) { 
                item.addEventListener('click', function () { 
                    showPage(this);
                }); 
            } */

           /*
            function showPage(item) {//это начало функции заполнения страниц
                let active = document.querySelector('#pagination li.active') //активация нажатия на кнопки пагинатора
                if (active) {
                    active.classList.remove('active');
                }
                item.classList.add('active');
                let pageNum = +item.innerHTML;
                let start = (pageNum - 1) * notesOnPage;
                let end = start + notesOnPage;
                let notes = restsFiltered.slice(start, end);
                console.log(notes);
                table.innerHTML = '';
                let tab;
                for (let note in notes) {
                    tab = document.createElement('tr');

                    tab.innerHTML = `
					
					<tr>
					<td>${notes[note].name}</td>
					<td>${notes[note].typeObject}</td>
					<td>${notes[note].address}</td>
					<td>&#9733 ${notes[note].rate}</td>
					<button class="buttab">выбрать</button>
					</tr>
					
					`
                    table.append(tab);
                }

                let button_choose = document.getElementsByClassName('buttab');//вот тут начинается функция по клику на кнопку выбрать
                for (let element of button_choose) {
                    element.onclick = () => {

                        card1.innerHTML = '';
                        let obXhr = new XMLHttpRequest();
                        obXhr.open('GET', `sources/fail.json`);

                        obXhr.send();

                        obXhr.onreadystatechange = function () {
                            if (obXhr.readyState != 4) return;
                            if (obXhr.status != 200) {
                                alert('Сервер недоступен ' + obXhr.status + ' ' + obXhr.statusText);
                                return;
                            }

                            if (obXhr.response) {
                                console.log('CLICK')
                                let card1 = document.getElementById('card1');
                                let result1 = JSON.parse(obXhr.response);
                                let ca1;
                                

                                // 		for (let i=0; i<element.parentNode.childNodes.length; i++){
                                let name_pr = String(element.parentNode.firstElementChild.innerHTML);
                                // 		}
                                let type_pr = String(element.parentNode.firstElementChild.nextElementSibling.innerHTML);

                                let address_pr = String(element.parentNode.firstElementChild.nextElementSibling.nextElementSibling.innerHTML);


                                console.log(name_pr);
                                console.log(type_pr);
                                console.log(address_pr);


                                let need_obj

                                restsAll.forEach(element => {
                                    if ((element.name == name_pr) && (element.typeObject == type_pr) && (element.address == address_pr)) {
                                        need_obj = element;
                                    }
                                })
                                
                               

                                
                                let prices = [];
                                for (let i = 1; i <= 10; i++) {
                                    prices.push(need_obj['set_'+i]);   
                                    }
                                  


                                for (let i = 0; i < result1.length; i++) {
                                    console.log(result1[i])
                                    ca1 = document.createElement('div');
                                    
                                    ca1.className = "cards col-md-4 text-center";
                                   // ca1.innerHTML = `<p>`+ i +`</p>`;
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
                                    document.getElementById('card1').append(ca1);

                                }
                            }
                        }
                    }
                }//тут заканчивается цикл перебора всех кнопок выбрать
            }
            */

            //конец функции показа страниц
           
            

            initFilter('admArea',sel1);
            initFilter('district',sel2);
            initFilter('typeObject',sel3);
           // initFilter('socialPrivileges',sel4, {0: 'Нет', 1: 'Есть'});


            
            //let result1 = JSON.parse(obXhr.response);
            let ca1;


            //начало филтрации
            document.getElementById("butN").onclick = () => {


               // table.innerHTML = '';
                //document.querySelector('#pagination').innerHTML = '';


                let okrug = document.getElementById("sel1").value;
                let dist = document.getElementById("sel2").value;
                let type = document.getElementById("sel3").value;
                let soc = document.getElementById("sel4").value;

                console.log(soc);
                //console.log(restsAll);
                
                restsFiltered = restsAll.filter((element) => {
                    if ((element.admArea == okrug) || (okrug == "не выбрано"))
                        if (dist == element.district || dist == "не выбрано")
                            if (type == element.typeObject || type == "не выбрано")
                                if ((element.socialPrivileges == soc) || (soc == "не выбрано")) {
                              //  if ((element.socialPrivileges == 1) || (element.socialPrivileges == 0) || (soc == "не выбрано")) {
                                    return element;
                                }

                }).sort((a, b) => (b.rate - a.rate)).slice();
                
                console.log(restsFiltered);
                
               
                //конец фильтрации массива по нашим параметрам + отсортировано по убыванию рейтинга
                //console.log(arr_print);
                let it = InitPagination(restsFiltered.length);
                showPage(it);
                /*
                let notesOnPage = 5;
                let countOfItems = Math.ceil(arr_print.length / notesOnPage);
                let tab;
                let i = 0;
                let items = [];

                for (let i = 1; i <= countOfItems; i++) {
                    let but = document.createElement('button');
                    but.innerHTML = i;
                    pagination.appendChild(but);
                    items.push(but);
                }

                restsAll.sort(function (a, b) {
                    return b.rate - a.rate
                });
              
                showPage(items[0]);
                for (let item of items) {
                    item.addEventListener('click', function () {
                        showPage(this);
                    });
                }

                */

            }
        }


    }


}


  document.addEventListener('DOMContentLoaded', getRestsAll());


function onClickIncrease(b){
    let v = b.parentElement.parentElement.querySelector('input');
    if (v.value <= 9)
        ++v.value;
}

function onClickDecrease(b){
    let v = b.parentElement.parentElement.querySelector('input');
    if (v.value > 0) 
        --v.value;
}

function uniqueArr(arr) {
    let res = [];
  
    for (let str of arr) {
      if (!res.includes(str)) {
        res.push(str);
      }
    }
    res.sort();
    return res;
  };
  
function initFilter(fieldName, selId, dict=null){  
    let arr = uniqueArr( restsAll.map(rec => rec[fieldName]));
             
    console.log(arr);
    for (let key in arr) {
      console.log(arr[key]);

      let select1 = document.createElement('option');
      let s = arr[key];
        if (dict != null){
            s = dict[s];
        }
      select1.innerHTML = `
      
      <select>
      <option value="${arr[key]}">${s}</option>
      </select>
      
      `
      selId.append(select1);
    }
}  

function InitPagination(total){
    let pagination = document.querySelector('#pagination');
    pagination.innerHTML = '';
    let items = [];
    let cnt = total;
    if (cnt > 20)
        cnt = 20;
    cnt = Math.ceil(cnt / 5);
    for (let i = 1; i <= cnt; i++) {
        let but = document.createElement('button');
        but.innerHTML = i;
        pagination.appendChild(but);
        items.push(but);
        but.addEventListener('click', function () { 
            showPage(this);
        }); 
    }
    return items[0];
}

function showPage(item) {//это начало функции заполнения страниц
    let active = document.querySelector('#pagination li.active') //активация нажатия на кнопки пагинатора
    if (active) {
        active.classList.remove('active');
    }
    item.classList.add('active');
    let pageNum = +item.innerHTML;
    let start = (pageNum - 1) * notesOnPage;
    let end = start + notesOnPage;
    let notes = restsFiltered.slice(start, end);
    console.log(notes);
    table.innerHTML = '';
    let tab;
    for (let note in notes) {
        tab = document.createElement('tr');

        tab.innerHTML = `
        
        <tr>
        <td>${notes[note].name}</td>
        <td>${notes[note].typeObject}</td>
        <td>${notes[note].address}</td>
        <td>&#9733 ${notes[note].rate}</td>
        <button class="buttab">выбрать</button>
        </tr>
        
        `
        table.append(tab);
    }

    let button_choose = document.getElementsByClassName('buttab');//вот тут начинается функция по клику на кнопку выбрать
    for (let element of button_choose) {
        element.onclick = () => {

            card1.innerHTML = '';
            let obXhr = new XMLHttpRequest();
            obXhr.open('GET', `sources/fail.json`);

            obXhr.send();

            obXhr.onreadystatechange = function () {
                if (obXhr.readyState != 4) return;
                if (obXhr.status != 200) {
                    alert('Сервер недоступен ' + obXhr.status + ' ' + obXhr.statusText);
                    return;
                }

                if (obXhr.response) {
                    console.log('CLICK')
                    let card1 = document.getElementById('card1');
                    let result1 = JSON.parse(obXhr.response);
                    let ca1;
                    

                    // 		for (let i=0; i<element.parentNode.childNodes.length; i++){
                    let name_pr = String(element.parentNode.firstElementChild.innerHTML);
                    // 		}
                    let type_pr = String(element.parentNode.firstElementChild.nextElementSibling.innerHTML);

                    let address_pr = String(element.parentNode.firstElementChild.nextElementSibling.nextElementSibling.innerHTML);


                    console.log(name_pr);
                    console.log(type_pr);
                    console.log(address_pr);


                    let need_obj

                    restsAll.forEach(element => {
                        if ((element.name == name_pr) && (element.typeObject == type_pr) && (element.address == address_pr)) {
                            need_obj = element;
                        }
                    })
                    
                   

                    
                    let prices = [];
                    for (let i = 1; i <= 10; i++) {
                        prices.push(need_obj['set_'+i]);   
                        }
                      


                    for (let i = 0; i < result1.length; i++) {
                        console.log(result1[i])
                        ca1 = document.createElement('div');
                        
                        ca1.className = "cards col-md-4 text-center";
                       // ca1.innerHTML = `<p>`+ i +`</p>`;
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
                        document.getElementById('card1').append(ca1);

                    }
                }
            }
        }
    }//тут заканчивается цикл перебора всех кнопок выбрать
}
