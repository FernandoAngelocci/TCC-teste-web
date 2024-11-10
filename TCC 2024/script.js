// Referência ao Firebase já configurada no HTML
let timePerQuestion = 20;
let currentQuestionIndex = 0;
let score = 0;
let timer;

const questions = [
    {
        question: "Qual é a capital do Brasil?",
        options: ["São Paulo", "Brasília", "Rio de Janeiro", "Salvador"],
        answer: 1
    },
    {
        question: "Quantos estados tem o Brasil?",
        options: ["25", "26", "27", "24"],
        answer: 2
    },
    // Adicione mais perguntas conforme necessário
];

document.getElementById('iniciarJogo').addEventListener('click', function() {
    const nome = document.getElementById('nome').value;
    const serie = document.getElementById('serie').value;

    if (nome === "") {
        alert("Por favor, insira seu nome.");
        return;
    }

    // Salvar dados do jogador no Firebase
    const jogadorRef = firebase.database().ref('jogadores').push();
    jogadorRef.set({
        nome: nome,
        serie: serie,
        pontuacao: 0 // Inicializa a pontuação do jogador
    }).then(() => {
        console.log('Jogador salvo com sucesso!');
        startGame();
    }).catch((error) => {
        console.error('Erro ao salvar jogador:', error);
    });
});

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('gameArea').style.display = 'block'; // Mostra a área do jogo
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const questionElement = document.getElementById('question');
        const optionsElement = document.getElementById('options');
        const currentQuestion = questions[currentQuestionIndex];

        questionElement.textContent = currentQuestion.question;
        optionsElement.innerHTML = "";

        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.onclick = () => selectOption(index);
            optionsElement.appendChild(button);
        });

        startTimer();
    } else {
        endGame();
    }
}

function selectOption(selectedIndex) {
    clearInterval(timer);
    const correctIndex = questions[currentQuestionIndex].answer;

    if (selectedIndex === correctIndex) {
        score += timePerQuestion; // Adiciona pontuação pelo tempo restante
    }

    currentQuestionIndex++;
    showQuestion();
}

function startTimer() {
    let timeLeft = timePerQuestion;
    const timerElement = document.getElementById('timer');
    
    timerElement.textContent = `Tempo: ${timeLeft}`;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Tempo: ${timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            selectOption(-1); // Considera como uma resposta errada
        }
    }, 1000);
}

function endGame() {
    alert(`Fim do jogo! Sua pontuação é: ${score}`);
    // Aqui você pode salvar a pontuação no Firebase ou redirecionar
}
