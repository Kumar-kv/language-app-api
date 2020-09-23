var countries = ["Australia", "Brazil", "France", "India", "Mexico", "USA"];
var genders = ["Female", "Male", "Others"].reverse();
var uimg = "";
var regData = new Array();
var table;
var isEdit = false;
var selectedRow;
window.onload = function () {
    formOptions();
    formGenders();
    table = document.getElementById("utable");
    loadData();

}

function toggleById(id, ds) {
    document.getElementById(id + "container").style.display = ds;
}

function loadData() {
    let lsd = localStorage.getItem("reg_data");
    regData = lsd == null ? [] : JSON.parse(lsd);
    regData.length == 0 ? (toggleById('f', 'block'), toggleById('t', 'none')) : (toggleById('t', 'block'), toggleById('f', 'none'));
    let i = 0;
    for (let obj of regData) {
        i++
        addRow(obj, i);
    }
}


function formOptions() {
    let dd = document.getElementById("country");
    for (let c of countries) {
        let option = `<option value="${c}">${c}</option>`
        dd.insertAdjacentHTML("beforeend", option);
    }
}


function formGenders() {
    let gd = document.getElementById("genders");

    for (let g of genders) {
        let item = `<input type="radio" name="gender" id="${g}" value="${g}">
        <label class="il">${g}</label>`;
        gd.insertAdjacentHTML("afterend", item);
    }
}

function onToggle() {
    let f = document.getElementById("fcontainer");
    let t = document.getElementById("tcontainer");
    f.style.display = f.style.display == "block" ? "none" : "block";
    t.style.display = t.style.display == "block" ? "none" : "block";

}


function onSubmit(e) {
    let eles = e.target.elements;
    let obj = new Object();
    obj.gender = "";
    for (let i = 0; i < 10; i++) {
        let e = eles[i];
        if (e.type == "radio") {
            e.checked == true ? obj[e.name] = e.value : "";
        } else {
            obj[e.id] = e.value.trim();
        }
    }
    obj.img = uimg;

    console.log(obj);
    let vobj = {
        ac: "Area Code",
        country: "Country",
        dob: "DOB",
        email: "Email",
        fname: "First Name",
        img: "Image",
        lname: "Last Name",
        phone: "Phone Number",
        gender:"Gender"
    }
    let emsg = "Please Fill the Mandatory fields - ";
    let earray = [];
    for(let p in obj){
        if(obj[p]==""){
            earray.push(vobj[p]);
        }
    }
    if(earray.length>0){
        // console.log(emsg + earray.join(", "));
        document.getElementById("err_msg").innerHTML = emsg + earray.join(", ");
        return;
    }else{
        document.getElementById("err_msg").innerHTML = "";
        isEdit ? (regData[selectedRow - 1] = obj) : regData.push(obj);
        localStorage.setItem("reg_data", JSON.stringify(regData));
        addRow(obj, regData.length);
        onClear();
        toggleById('f', "none");
        toggleById('t', 'block');
    }

}

function addRow(obj, sno) {
    isEdit ? sno = selectedRow : "";
    let tRow = `<td>${sno}</td>
    <td>${obj.fname} ${obj.lname}</td>
    <td>${obj.email}</td>
    <td>${obj.ac}-${obj.phone}</td>
    <td>${obj.dob.split("-").reverse().join("/")}</td>
    <td>${obj.country}</td>
    <td>${obj.gender}</td>
    <td><img src="${obj.img}"></td>
    <td>
        <button class="btn btn-info" onclick="onEdit(${sno})">Edit</button>
        <button class="btn btn-danger" onclick="onDelete(${sno})">Delete</button>
    </td>`;
    isEdit ? table.deleteRow(selectedRow) : "";
    table.insertRow(sno).innerHTML = tRow;
}

function onUpload(e) {
    let img = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(img);

    reader.onload = function () {
        uimg = reader.result;
        document.getElementById("uimg").src = uimg;
    }

    // let url = URL.createObjectURL(img);
    // console.log(url);
    // document.getElementById("uimg").src = url;
}


function onClear() {
    document.getElementById("r_form").reset();
    uimg = "";
    document.getElementById("uimg").src = "";
    isEdit = false;
    selectedRow = null;
    let rbtn = document.getElementById("r_btn");
    rbtn.className = "btn btn-primary";
    rbtn.innerHTML = "Register";
}

function onEdit(sno) {
    isEdit = true;
    selectedRow = sno;
    let rbtn = document.getElementById("r_btn");
    rbtn.className = "btn btn-success";
    rbtn.innerHTML = "Update";
    let obj = regData[sno - 1];
    let eles = document.getElementById("r_form").elements;
    for (let i = 0; i < 7; i++) {
        let p = eles[i].id;
        document.getElementById(p).value = obj[p];
    }
    uimg = obj.img;
    document.getElementById("uimg").src = uimg;
    document.getElementById(obj.gender).checked = true;
    toggleById('t', "none");
    toggleById('f', 'block');
}

function onDelete(sno) {
    regData.splice(sno - 1, 1);
    regData.length == 0 ? (toggleById('f', 'block'), toggleById('t', 'none')) : null;
    localStorage.setItem("reg_data", JSON.stringify(regData));
    while (table.rows.length > sno) {
        table.deleteRow(sno);
    }
    for (let i = sno - 1; i < regData.length; i++) {
        addRow(regData[i], i + 1);
    }
}