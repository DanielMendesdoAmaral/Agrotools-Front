let button_answer_a_form = document.getElementById("save-af");
let button_close_answer_a_form = document.getElementById("close-af")

button_close_answer_a_form.onclick = () => {
    document.getElementById("author-name-input-af").value = "";
}

getLocation();

button_answer_a_form.onclick = async () => {
    let input_author_name_af = document.getElementById("author-name-input-af");
    let inputs = document.querySelectorAll("#answer-a-form-modal .c")
    let answers = [];
    let formId;

    for (let i = 0; i < inputs.length; i++) {
        formId = inputs[i].getAttribute("class").split(" ")[2];

        if (inputs[i].value == "") {
            toastr.error("É obrigatório responder à todas as perguntas!")
            return;
        }
        else {
            
            let obj = {
                text: inputs[i].value,
                questionId: inputs[i].id,
                authorId: "",
                latitude: Number(window.localStorage.getItem("latitude")),
                longitude: Number(window.localStorage.getItem("longitude"))
            }
            answers.push(obj);
        }
    }

    let body = {
        formId: formId,
        authorName: input_author_name_af.value,
        answers: answers
    }

    const response = await fetch(`${url_api}/form/answer`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        } 
    })
    const data = await response.json();

    if(data.sucesso) {
        toastr.success(data.mensagem)
        input_author_name_af.value = "";
        $("#answer-a-form-modal").modal("hide")
        listar()
    }
    else {
        toastr.error(data.mensagem);
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        window.localStorage.setItem("latitude", 0)
        window.localStorage.setItem("longitude", 0)
    }
}

function showPosition(position) {
    window.localStorage.setItem("latitude", position.coords.latitude)
    window.localStorage.setItem("longitude", position.coords.longitude)
}