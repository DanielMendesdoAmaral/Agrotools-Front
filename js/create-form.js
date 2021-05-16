let title_input = document.getElementById("form-title-input-cf");
let author_name_input = document.getElementById("author-name-input-cf")

let question_input = document.getElementById("question-cf")
let btn_add_question = document.getElementById("basic-addon1")

let save_form = document.getElementById("save-cf")
let close_modal = document.getElementById("close-cf")

let questions = [];

close_modal.onclick = () => {
    questions = [];
    $("#questions-cf").html(null)
    title_input.value = "";
    author_name_input.value = "";
    question_input.value = "";
}

btn_add_question.onclick = () => {
    questions.push(question_input.value);
    question_input.value = "";
    $("#questions-cf").html(`
        ${
            questions.map((q, index) => {
                return `
                    <p class="label">${index+1}- ${q}</p>
                `
            })
        }
    `)
}

save_form.onclick = async () => {
    let body = {
        formTitle: title_input.value,
        authorName: author_name_input.value,
        questions: questions
    }

    let response = await fetch(`${url_api}/form/create`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        } 
    })
    let result = await response.json()

    if(result.sucesso){
        toastr.success(result.mensagem)
        listar();
        questions = [];
        $("#questions-cf").html(null)
        title_input.value = "";
        author_name_input.value = "";
        question_input.value = "";
        $("#create-a-form-modal").modal("hide")
    }
    else {
        let erros = result.dados?.map(d => d.message);
        toastr.error(result.mensagem /*+ " Erros: " + erros*/)
    }  
}