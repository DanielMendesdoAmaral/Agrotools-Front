let section_forms = document.getElementById("forms");

const listar = async () => {
    $("#loading").html(`
        <div style="width: 50px; display: block; margin: auto">
            <div class="spinner-border text-primary" style="width: 50px; height: 50px" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `)

    const response = await fetch(`${url_api}/form/list`)
    const data = await response.json();

    $("#loading").html(null)

    if(data.dados.length < 1){
        $("#loading").html(`<p class="text-center paragraph">Nenhum formulário por aqui...</p>`)
    }

    $("#forms").html(`
        ${
            data.dados.map(f => {
                return `
                    <article>
                        <h1 class="form-title text-black text-bold text-center">
                            ${f.formTitle}
                        </h1>
                        <hr>
                        <p class="form-information">Autor: ${f.authorName}</p>
                        <p class="form-information">Criado em: ${f.createdAt}</p>
                        <p class="form-information">Número de questões: ${f.questionsNumber}</p>
                        ${
                            f.answered? `<br>` : `<p class="form-information not-answered">Sem respostas</p>`
                        }
                        <button class="answer text-bold" value="${f.formId}">Responder</button>
                        <button class="see-answers text-bold" value="${f.formId}">Ver respostas</button>
                    </article>
                `;
            })
        }
    `)

    atribute_answer(document.getElementsByClassName("answer"));
    atribute_see_answers(document.getElementsByClassName("see-answers"))
}

const atribute_answer = (html_collection) => {
    let buttons = html_collection;

    for(let i = 0; i < buttons.length; i++){
        buttons[i].onclick = async (event) => {
            event.preventDefault();

            const response = await fetch(`${url_api}/form/get-questions/${event.target.value}`);
            const data = await response.json();

            if(!data.sucesso) {
                toastr.error(data.mensagem)
            }
            else {
                $("#answer-a-form-modal").modal("show")
                $("#answer-a-modal-title").html(`
                    ${data.dados.formTitle}
                `)
                $("#answer-a-modal-body").html(`
                    <div class="mb-3">
                        <label for="author-name-input-af" class="label">Nome do autor</label>
                        <input type="text" class="form-control" id="author-name-input-af">
                    </div>
                    <p class="text-center text-bold paragraph">Perguntas</p>
                    ${
                        data.dados.questions.map((q, index) => {
                            return `
                                <div class="mb-3">
                                    <label for="${q.questionId}" class="label">${index+1}- ${q.text}</label>
                                    <input type="text" class="form-control c ${data.dados.formId}" id="${q.questionId}">
                                </div>
                            `
                        })
                    }
                `)
            }
        }
    }
}

const atribute_see_answers = (html_collection) => {
    let buttons = html_collection;

    for(let i = 0; i < buttons.length; i++){
        buttons[i].onclick = async (event) => {
            event.preventDefault();

            const response = await fetch(`${url_api}/form/get-questions-and-answers/${event.target.value}`);
            const data = await response.json();

            if(!data.sucesso) 
                toastr.error(data.mensagem)
            else {
                $("#see-answers-a-form-modal").modal("show")
                $("#see-answers-a-form-modal-title").html(`
                    ${data.dados.formTitle}
                `)
                $("#see-answers-a-form-modal-body").html(`
                    ${
                        data.dados.questionsAndAnswers.map(qa => {
                            return `
                                <p class="paragraph text-bold text-black" style="margin-top: 20px;">${qa.questionText}</p>
                                ${
                                    qa.answers.map(a => {
                                        return `
                                        <div class="list-group">
                                            <a class="list-group-item list-group-item-action" aria-current="true">
                                                <div class="d-flex w-100 justify-content-between">
                                                    <h2 class="label">${a.answerText}</h5>
                                                    <small>${a.answeredAt}</small>
                                                </div>
                                                <p class="label">Autor: ${a.authorName}</p>
                                                <p class="link" style="cursor: pointer;" onclick="open_waze_modal(${a.latitude}, ${a.longitude})">Ver localização no momento da resposta</p>
                                            </a>
                                        </div>
                                        `
                                    })
                                }
                            `
                        })
                    }
                `)
            }
        }
    }
}

const open_waze_modal = (latitude, longitude) => {
    $("#waze-modal").modal("show")
    $("#waze-modal-title").html(`
        Lat: ${latitude} - Lon: ${longitude}
    `)
    $("#waze-modal-body").html(`
        <iframe src="https://embed.waze.com/iframe?zoom=13&lat=${latitude}&lon=${longitude}&pin=1" width="100%" height="500px"></iframe>
    `)
}

window.onload = listar;
