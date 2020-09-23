var sno = 0;
var data = [];
var isEdit = false;
var selectedRow;
var sOrder="asc";
var activesBtn;
var sortbtns = [
    {
        name:"Name",
        prop:"name"
    },
    {
        name:"Phone",
        prop:"phone"
    },
    {
        name:"DOB",
        prop:"dob"
    },
    {
        name:"City",
        prop:"city"
    },
    {
        name:"Gender",
        prop:"gender"
    },
]
window.onload = function(){
    let lsd = localStorage.getItem("form_table_data");
    data = lsd==null?[]:JSON.parse(lsd);
    generateSortBtns();
    loopingArray();  
}

function generateSortBtns(){
    let bdiv = document.getElementById("sortBtns");
    for(let btn of sortbtns){
       let b= `<button class="btn btn-secondary" id="sb${btn.prop}" onclick="onSort('${btn.prop}')">${btn.name}</button>`;
       bdiv.insertAdjacentHTML("beforeend", b);
    }
}


function onSubmit() {
    isEdit ? onUpdate() : onSave();
}

function onUpdate() {
    data[selectedRow - 1] = formObj();
    localStorage.setItem("form_table_data", JSON.stringify(data));
    loopingArray();
    onClear();
}

function formObj() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let dob = document.getElementById("dob").value;
    let city = document.getElementById("city").value;
    let gender = document.querySelector("input[name='gender']:checked").value;
    let commodities = document.querySelectorAll("input[name='commodity']:checked");
    let selComs = [];
    let age = findAge(dob);
    for (let c of commodities) {
        selComs.push(c.value);
    }
    let car = selComs.indexOf("Car") == -1 ? "No" : "Yes";
    let bike = selComs.indexOf("Bike") == -1 ? "No" : "Yes";
    let mobile = selComs.indexOf("Mobile") == -1 ? "No" : "Yes";
    let laptop = selComs.indexOf("Laptop") == -1 ? "No" : "Yes";
    let obj = {
        name: name,
        phone: phone,
        dob: dob.split("-").reverse().join("/"),
        age: age,
        city: city,
        gender: gender,
        car: car,
        bike: bike,
        mobile: mobile,
        laptop: laptop
    }
    return obj;
}

function loopingArray() {
    let table = document.getElementById("dTable");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    sno = 0;
    for (let item of data) {
        sno++;
        let tRow = `<tr>
        <td>${sno}</td>
        <td>${item.name}</td>
        <td>${item.phone}</td>
        <td>${item.dob}</td>
        <td>${item.age}</td>
        <td>${item.city}</td>
        <td>${item.gender}</td>
        <td>${item.car}</td>
        <td>${item.bike}</td>
        <td>${item.mobile}</td>
        <td>${item.laptop}</td>
        <td>
            <button class="btn btn-primary" type="button" onclick="onEdit(${sno})" >Edit</button>
            <button class="btn btn-danger" type="button" onclick="onDelete(${sno})" >Delete</button>
        </td>
</tr>`;
        table.insertAdjacentHTML("beforeend", tRow);
    }
}

function onClear() {
    document.getElementById("frm").reset();
    isEdit = false;
    selectedRow = null;
    let btn = document.getElementById("sbtn");
    btn.innerHTML = "Submit";
    btn.className = "btn btn-primary";
}


function onSave() {
    let obj = formObj();
    sno++;
    data.push(obj);
    localStorage.setItem("form_table_data", JSON.stringify(data));
    let table = document.getElementById("dTable");
    let tRow = `<tr>
                <td>${sno}</td>
                <td>${obj.name}</td>
                <td>${obj.phone}</td>
                <td>${obj.dob}</td>
                <td>${obj.age}</td>
                <td>${obj.city}</td>
                <td>${obj.gender}</td>
                <td>${obj.car}</td>
                <td>${obj.bike}</td>
                <td>${obj.mobile}</td>
                <td>${obj.laptop}</td>
                <td>
                    <button class="btn btn-primary" type="button" onclick="onEdit(${sno})" >Edit</button>
                    <button class="btn btn-danger" type="button" onclick="onDelete(${sno})" >Delete</button>
                </td>
        </tr>`;
    table.insertAdjacentHTML("beforeend", tRow);
    document.getElementById("frm").reset();
}


function findAge(dob) {
    let tDay = new Date();
    let bDay = new Date(dob);
    let age = tDay.getFullYear() - bDay.getFullYear();
    let md = tDay.getMonth() - bDay.getMonth();
    let dd = tDay.getDate() - bDay.getDate();
    if (md < 0 || (md == 0 && dd < 0)) {
        age--;
    }
    return age;
}

function onEdit(sno) {
    isEdit = true;
    selectedRow = sno;
    let btn = document.getElementById("sbtn");
    btn.innerHTML = "Update";
    btn.className = "btn btn-success";
    let obj = data[sno - 1];
    document.getElementById("name").value = obj.name;
    document.getElementById("phone").value = obj.phone;
    document.getElementById("dob").value = obj.dob.split("/").reverse().join("-");
    document.getElementById("city").value = obj.city;
    document.getElementById(obj.gender).checked = true;

    for (let p in obj) {
        if (p == "car" || p == "bike" || p == "mobile" || p == "laptop") {
            document.getElementById(p).checked = obj[p] == "Yes" ? true : false;
        }
    }

}

function onDelete(sno) {
    data.splice(sno - 1, 1);
    localStorage.setItem("form_table_data", JSON.stringify(data));
    loopingArray();
}

function onSort(p){
    let icon =  sOrder=="asc"?` <i class="fa fa-long-arrow-up" aria-hidden="true"></i>`:` <i class="fa fa-long-arrow-down" aria-hidden="true"></i>`;
    activesBtn?(activesBtn.innerHTML = activesBtn.innerHTML.split(" ")[0]):"";
    activesBtn?activesBtn.className = "btn btn-secondary":"";
    activesBtn = document.getElementById("sb"+p); 
    activesBtn.className = "btn btn-info";
    activesBtn.innerHTML = activesBtn.innerHTML + icon;
    let n = sOrder=="asc"?1:-1;
    sOrder = sOrder=="asc"?"desc":"asc";

    if(p=="dob"){
        data.sort((a,b)=>{
            return n == 1? (dateToNum(a[p]) - dateToNum(b[p])): (dateToNum(b[p]) - dateToNum(a[p]))
        })
    }else{
        data.sort((a,b)=>{
            if(a[p]<b[p]){
                return (-1*n);
            }
            if(a[p]>b[p]){
                return (1*n);
            }
            return 0;
        });
    }
loopingArray();

}


function dateToNum(dob){
    let d = dob.split("/").reverse().join("-");
    let n = new Date(d).getTime();
    return n;
}