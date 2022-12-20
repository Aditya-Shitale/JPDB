var jpdbBaseURL= 'http://api.login2explore.com:5577';
var jpdbIRL ='/api/irl';
var jpdbIML ='/api/iml';
var studDBName = 'students';
var studRelName = 'studrel';
var connToken ="90937859|-31949272066923720|90952056";

$("#rollNum").focus();

/* ********************RESET FORM****************************** */
function resetForm() {
    $("#rollNum").val("");
    $("#studName").val("");
    $("#date").val("");
    $("#class").val("");
    $("#enDate").val("");
    $("#address").val("");
    $("#empId").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#reset").prop("disabled",true);
    $("#rollNum").focus();
  }

/* ****************VALIDATION OF DATA ENTRY***********************  */
  function validation() {
   
   var rollnum = $("#rollNum").val();
   var studname = $("#studName").val();
   var dob = $("#date").val();
   var classn = $("#class").val();
   var endate = $("#enDate").val();
   var addr = $("#address").val();

    if(rollnum === ''){
        alert("Roll Number missing");
        $("#rollNum").focus();
        return '';
    }
    if(studname === ''){
        alert("Student Name missing");
        $("#studName").focus();
        return '';
    }
    if(dob === ''){
        alert("Date of Birth missing");
        $("#date").focus();
        return '';
    }
    if(classn === ''){
        alert("Class no. missing");
        $("#class").focus();
        return '';
    }
    if(endate === ''){
        alert("enrollment Date missing");
        $("#enDate").focus();
        return '';
    }
    if(addr === ''){
        alert("Student Address missing");
        $("#address").focus();
        return '';
    }

    var jsonStrObj ={
        rollNum: rollnum,
        name: studname,
        DOB: dob,
        classNum: classn,
        enrollmentDate: endate,
        address: addr
    };
    return JSON.stringify(jsonStrObj);
  }

  // getStudentId
  function getStudentIdAsJsonObj(){
    var studRoll = $('#rollNum').val();
    var jsonStr={
        rollNum: studRoll
    };
    return JSON.stringify(jsonStr);

  }
  //record num
   function SaveallRecords(jsonObj){
      var lvData = JSON.parse(jsonObj.data);
      localStorage.setItem('recno', lvData.rec_no)
   }

  // fill data
  function fillData(jsonObj){
        SaveallRecords(jsonObj);
        var record = JSON.parse(jsonObj.data).record;
        $('#studName').val(record.name);
        $('#date').val(record.DOB);
        $('#class').val(record.classNum);
        $('#enDate').val(record.enrollmentDate);
        $('#address').val(record.address);

  }

  // executeCommandAtGivenBaseUrl
  
  function executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, apiEndPointUrl) {
      var url = jpdbBaseURL + apiEndPointUrl;
      var jsonStrObj;
      $.post(url, putRequest, function (result) {
          jsonStrObj = JSON.parse(result);
        }).fail(function (result) {
            var dataJsonObj = result.responseText;
            jsonStrObj = JSON.parse(dataJsonObj);
        });
        return jsonStrObj;
    }
//*****************************createGETALLSyncRecordRequest******************** */
    function createGET_BY_KEYRequest(token, dbName, relName, jsonObj) {
        var req ="{\n"
        + "\"token\" : \""
        + token
        + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
        + "\"dbName\": \""
        + dbName
        + "\",\n"
        + "\"rel\" : \""
        + relName
        + "\",\n"
        + "\"jsonStr\":\n"
        + jsonObj
        + "\n"
        + "}";
        return req;
    }


    //*********GET STUDENT DATA**************** */

    function getStud(){
            var studRollJsonObj = getStudentIdAsJsonObj();
            var getRequest =createGET_BY_KEYRequest(connToken, studDBName, studRelName,studRollJsonObj);
            jQuery.ajaxSetup({async:false});
            var resJsonObj= executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL,jpdbIRL);
            jQuery.ajaxSetup({async: true});
            console.log(resJsonObj);
            if(resJsonObj.status === 400){
                $("#save").prop('disabled',false);
                $("#reset").prop('disabled',false);
                $("#rollNum").focus();
            } else if(resJsonObj.status === 200){
                $("#rollNum").prop('disabled',true);
                fillData(resJsonObj);
                $("#change").prop('disabled',false);
                $("#reset").prop('disabled',false);
                $("#rollNum").focus();
            }

    }


// ****************************createPUTRequest*********************
function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
            + "\"token\" : \""
            + connToken
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"PUT\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\": \n"
            + jsonObj
            + "\n"
            + "}";
    return putRequest;
}

/* ***************SAVE DATA************************* */
function saveData(){
    var jsonStrObj = validation();
    console.log(jsonStrObj);
    if(jsonStrObj===''){
        return '';
    }
    var putRequest= createPUTRequest(connToken, jsonStrObj, studDBName, studRelName );
    jQuery.ajaxSetup({async:false});
    var resJsonObj= executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#rollNum").focus();

}

//***************************createGETALLSyncRecordRequest************** */
function createGETALLSyncRecordRequest(token, dbName, relName,jsonObj, recno) {
   
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"UPDATE\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n"
            + "\"jsonStr\":{ \""
            + recno
            + "\":\n"
            + jsonObj
            + "\n"
            + "}}";
    return req;
}

/* ********************CHANGE DATA****************** */

 function changeData() {
     $('#change').prop('disabled',true);
     jsonChange =validation();
     var updateRequest = createGETALLSyncRecordRequest(connToken , studDBName, studRelName,jsonChange, localStorage.getItem('recno'))
     console.log(updateRequest)
     jQuery.ajaxSetup({async:false});
    var resJsonObj= executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#rollNum").focus();

 }