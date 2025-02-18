const exerciseID = "exercise_modulo_1"; // Mude para cada módulo (ex: "exercise_modulo_1", "exercise_modulo_3")

const correctAnswers = { 
    q1: "a", 
    q2: "a", 
    q3: "b", 
    q4: "b",
    q5: "a",
    q6: "b",
    q7: "a"
};

// Carregar respostas e estado de envio do Local Storage
function loadPreviousState() {
    const savedAnswers = JSON.parse(localStorage.getItem(`${exerciseID}_savedAnswers`)) || {};
    const submitted = localStorage.getItem(`${exerciseID}_submitted`) === "true";

    for (let question in savedAnswers) {
        let input = document.querySelector(`input[name="${question}"][value="${savedAnswers[question]}"]`);
        if (input) {
            input.checked = true;
        }
    }

    if (submitted) {
        markAnswers();
        showResults();
    }
}

// Salvar respostas no Local Storage
function saveAnswers(formData) {
    let answers = {};
    for (let [question, answer] of formData.entries()) {
        answers[question] = answer;
    }
    localStorage.setItem(`${exerciseID}_savedAnswers`, JSON.stringify(answers));
    localStorage.setItem(`${exerciseID}_submitted`, "true");
}

// Marcar questões corretas e erradas
function markAnswers() {
    const savedAnswers = JSON.parse(localStorage.getItem(`${exerciseID}_savedAnswers`)) || {};

    document.querySelectorAll('.question').forEach(q => {
        q.classList.remove("correct-answer", "incorrect-answer");
    });

    for (let question in savedAnswers) {
        let answer = savedAnswers[question];
        let questionDiv = document.querySelector(`[name="${question}"]`).closest('.question');

        if (correctAnswers[question] === answer) {
            questionDiv.classList.add("correct-answer");
        } else {
            questionDiv.classList.add("incorrect-answer");
        }
    }
}

// Exibir resultado e salvar respostas
document.getElementById("exercicioForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let allAnswered = true;
    document.querySelectorAll("input[type='radio']").forEach(input => {
        let name = input.getAttribute("name");
        if (!document.querySelector(`input[name="${name}"]:checked`)) {
            allAnswered = false;
        }
    });

    if (!allAnswered) {
        showCustomAlert();
        return;
    }

    let score = 0;
    const formData = new FormData(event.target);
    let totalQuestions = Object.keys(correctAnswers).length;
    let resultHtml = "<h2>Resultado:</h2>";

    saveAnswers(formData); // Salvar respostas no Local Storage

    for (let [question, answer] of formData.entries()) {
        let questionDiv = document.querySelector(`[name="${question}"]`).closest('.question');

        if (correctAnswers[question] === answer) {
            score++;
            questionDiv.classList.add("correct-answer");
            resultHtml += `<p class='correct'>Pergunta ${question.slice(-1)}: Correta</p>`;
        } else {
            questionDiv.classList.add("incorrect-answer");
            resultHtml += `<p class='incorrect'>Pergunta ${question.slice(-1)}: Errada. Resposta correta: ${correctAnswers[question]}</p>`;
        }
    }

    let percentage = (score / totalQuestions) * 100;
    let message = percentage >= 60 ? 
        "<p class='pass-message'>🎉 Parabéns, você passou!</p>" : 
        "<p class='fail-message'>❌ Infelizmente, você não atingiu a pontuação necessária.</p>";

    resultHtml += `<h3 class='result-score'>Sua nota: ${percentage.toFixed(1)}%</h3>${message}`;

    document.getElementById("resultado").innerHTML = resultHtml;
    markAnswers();
});

// Exibir resultado corretamente após a atualização da página
function showResults() {
    const savedAnswers = JSON.parse(localStorage.getItem(`${exerciseID}_savedAnswers`)) || {};
    let score = 0;
    let totalQuestions = Object.keys(correctAnswers).length;
    let resultHtml = "<h2>Resultado:</h2>";

    for (let question in savedAnswers) {
        let answer = savedAnswers[question];
        let questionDiv = document.querySelector(`[name="${question}"]`).closest('.question');

        if (correctAnswers[question] === answer) {
            score++;
            questionDiv.classList.add("correct-answer");
            resultHtml += `<p class='correct'>Pergunta ${question.slice(-1)}: Correta</p>`;
        } else {
            questionDiv.classList.add("incorrect-answer");
            resultHtml += `<p class='incorrect'>Pergunta ${question.slice(-1)}: Errada. Resposta correta: ${correctAnswers[question]}</p>`;
        }
    }

    let percentage = (score / totalQuestions) * 100;
    let message = percentage >= 60 ?
        "<p class='pass-message'>🎉 Parabéns, você passou!</p>" :
        "<p class='fail-message'>❌ Infelizmente, você não atingiu a pontuação necessária.</p>";

    resultHtml += `<h3 class='result-score'>Sua nota: ${percentage.toFixed(1)}%</h3>${message}`;
    document.getElementById("resultado").innerHTML = resultHtml;
}

// Adicionar botão para reiniciar tarefa
document.getElementById("resetButton").addEventListener("click", function() {
    localStorage.removeItem(`${exerciseID}_savedAnswers`);
    localStorage.removeItem(`${exerciseID}_submitted`);
    document.getElementById("exercicioForm").reset();
    document.getElementById("resultado").innerHTML = "";
    document.querySelectorAll('.question').forEach(q => {
        q.classList.remove("correct-answer", "incorrect-answer");
    });

    // Ocultar alerta se estiver visível
    closeCustomAlert();
});

// Exibir alerta customizado
function showCustomAlert() {
    document.getElementById("customAlert").style.display = "block";
}

// Fechar alerta customizado
function closeCustomAlert() {
    document.getElementById("customAlert").style.display = "none";
}

// Carregar respostas e estado de envio ao carregar a página
window.onload = function() {
    loadPreviousState();
};
