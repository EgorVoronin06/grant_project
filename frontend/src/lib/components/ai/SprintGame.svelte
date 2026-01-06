<script lang="ts">
	import Recognizer from './Recognizer.svelte';

	let gameStarted = $state(false);
	let gameOver = $state(false);
	let lettersToGuess: { letter: string; guessed: boolean; confidence?: number }[] = $state([]);
	let predict = $state('');
	let confidence = $state(0);
	let totalGuessed = $state(0);
	let averageConfidence = $state(0);

	// Новые переменные
	let totalLetters = $state(5);
	let timePerLetter = $state(5); // Время на 1 букву (секунд)
	let currentLetterIndex = $state(0);
	let remainingTime = $state(0);
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	const allLetters = [
		'Ё',
		'А',
		'Б',
		'В',
		'Г',
		'Д',
		'Е',
		'Ж',
		'З',
		'И',
		'Й',
		'К',
		'Л',
		'М',
		'Н',
		'О',
		'П',
		'Р',
		'С',
		'Т',
		'У',
		'Ф',
		'Х',
		'Ц',
		'Ч',
		'Ш',
		'Щ',
		'Ъ',
		'Ы',
		'Ь',
		'Э',
		'Ю',
		'Я'
	];

	function startGame() {
		gameStarted = true;
		gameOver = false;
		lettersToGuess = [];

		for (let i = 0; i < totalLetters; i++) {
			const randomIndex = Math.floor(Math.random() * allLetters.length);
			lettersToGuess.push({ letter: allLetters[randomIndex], guessed: false });
		}

		currentLetterIndex = 0;
		totalGuessed = 0;
		averageConfidence = 0;

		startLetterTimer();
	}

	function startLetterTimer() {
		remainingTime = timePerLetter;
		if (timerInterval) clearInterval(timerInterval);
		timerInterval = setInterval(() => {
			remainingTime--;
			if (remainingTime <= 0) {
				moveToNextLetter();
			}
		}, 1000);
	}

	function moveToNextLetter() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}

		currentLetterIndex++;
		if (currentLetterIndex >= lettersToGuess.length) {
			endGame();
		} else {
			startLetterTimer();
		}
	}

	function endGame() {
		gameOver = true;
		gameStarted = false;
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	$effect(() => {
		if (gameStarted && predict) {
			checkPrediction();
		}
	});

	function checkPrediction() {
		const currentLetterObj = lettersToGuess[currentLetterIndex];
		if (!currentLetterObj) return;

		if (currentLetterObj.letter === predict) {
			currentLetterObj.guessed = true;
			currentLetterObj.confidence = confidence;
			totalGuessed++;

			const sumConfidence = lettersToGuess
				.filter((l) => l.guessed && l.confidence !== undefined)
				.reduce((sum, l) => sum + (l.confidence ?? 0), 0);

			averageConfidence = +(sumConfidence / totalGuessed).toFixed(2);

			moveToNextLetter();
		}
	}
</script>

<main class="game-container">
	{#if !gameStarted && !gameOver}
		<div class="menu">
			<h1>Настройки</h1>
			<label>
				Количество букв:
				<input type="number" bind:value={totalLetters} min="1" />
			</label>
			<label>
				Время на одну букву (секунды):
				<input type="number" bind:value={timePerLetter} min="1" />
			</label>
			<button onclick={startGame}>Начать игру</button>
		</div>
	{:else if gameStarted}
		<div class="game">
			<div class="timer">Оставшееся время на букву: {remainingTime} сек</div>
			<div class="current-letter">
				{#if lettersToGuess[currentLetterIndex]}
					<div class="letter">
						{lettersToGuess[currentLetterIndex].letter}
					</div>
				{/if}
			</div>
			<div>Угадано букв: {totalGuessed}</div>

			<p class="hint">Показывайте текущую букву!</p>

			<Recognizer bind:predict bind:confidence showPredict={true} />
		</div>
	{:else if gameOver}
		<div class="menu">
			<h1>Игра окончена!</h1>
			<p>Угадано букв: <b>{totalGuessed} / {totalLetters}</b></p>
			<p>Средняя уверенность нейросети: <span class="highlight">{averageConfidence}%</span></p>
			<button
				onclick={() => {
					gameOver = false;
				}}
			>
				Играть снова
			</button>
		</div>
	{/if}
</main>

<style>
	/* Стиль под ночь */
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		/* min-height: 100vh; */
	}

	.menu,
	.game {
		text-align: center;
	}

	input {
		margin: 0.5rem;
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid gray;
		border-radius: 5px;
		border: 1px solid var(--color-primary-transparent);
	}

	button {
		margin-top: 1rem;
		padding: 0.7rem 1.5rem;
		font-size: 1.1rem;
		border: none;
		border-radius: 5px;
		background-color: #28a745;
		color: white;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #218838;
	}

	.timer {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: var(--color-primary);
	}

	.current-letter {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.letter {
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		font-size: 2rem;
		background: var(--color-primary);
		color: white;
	}

	.hint {
		font-size: 1.2rem;
		margin-bottom: 2rem;
		color: green;
	}

	.highlight {
		color: #00ccff;
		font-weight: bold;
		font-size: 1.2rem;
	}
</style>
