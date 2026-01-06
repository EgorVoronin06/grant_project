<script lang="ts">
	import Recognizer from './Recognizer.svelte';

	let gameStarted = $state(false);
	let gameOver = $state(false);
	let lettersToGuess: { letter: string; guessed: boolean; confidence?: number }[] = $state([]);
	let predict = $state('');
	let confidence = $state(0);
	let totalGuessed = $state(0);
	let averageConfidence = $state(0);

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

	let totalLetters = 5;

	function startGame() {
		gameStarted = true;
		gameOver = false;
		lettersToGuess = [];

		for (let i = 0; i < totalLetters; i++) {
			const randomIndex = Math.floor(Math.random() * allLetters.length);
			lettersToGuess.push({ letter: allLetters[randomIndex], guessed: false });
		}

		totalGuessed = 0;
		averageConfidence = 0;
	}

	// Отслеживаем предсказания
	$effect(() => {
		if (gameStarted && predict) {
			checkPrediction();
		}
	});
	function checkPrediction() {
		// Только следующая неотгаданная буква проверяется
		const nextLetterObj = lettersToGuess.find((letter) => !letter.guessed);
		if (!nextLetterObj) return;

		if (nextLetterObj.letter === predict) {
			nextLetterObj.guessed = true;
			nextLetterObj.confidence = confidence;
			totalGuessed++;

			const sumConfidence = lettersToGuess
				.filter((l) => l.guessed && l.confidence !== undefined)
				.reduce((sum, l) => sum + (l.confidence ?? 0), 0);
			averageConfidence = +(sumConfidence / totalGuessed).toFixed(2);

			if (totalGuessed === totalLetters) {
				endGame();
			}
		}
	}

	function endGame() {
		gameOver = true;
		gameStarted = false;
	}
</script>

<main class="game-container">
	{#if !gameStarted && !gameOver}
		<div class="menu">
			<h1>Настройки сложности</h1>
			<label>
				Количество букв:
				<input type="number" bind:value={totalLetters} min="1" />
			</label>
			<button onclick={startGame}>Начать</button>
		</div>
	{:else if gameStarted}
		<div class="game">
			<div class="letters">
				{#each lettersToGuess as letterObj, idx (idx)}
					<div class="letter {letterObj.guessed ? 'guessed' : ''}">
						{letterObj.letter}
						{#if letterObj.guessed}
							<div class="confidence">{letterObj.confidence}%</div>
						{/if}
					</div>
				{/each}
			</div>

			<p class="hint">Показывайте буквы по порядку!</p>
			<Recognizer bind:predict bind:confidence showPredict={true} />
		</div>
	{:else if gameOver}
		<div class="menu">
			<h1>Поздравляем!</h1>
			<p>Вы угадали все буквы.</p>
			<p>Средняя уверенность нейросети: <span class="highlight">{averageConfidence}%</span></p>
			<button
				onclick={() => {
					gameOver = false;
				}}>Играть снова</button
			>
		</div>
	{/if}
</main>

<style>
	/* Базовая верстка */

	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.menu,
	.game {
		text-align: center;
	}

	input {
		padding: 5px;
		border-radius: 5px;
		border: 1px solid var(--color-primary-transparent);
		font-size: 1rem;
	}

	button {
		padding: 0.7rem 1.5rem;
		font-size: 1.1rem;
		border: none;
		border-radius: 5px;
		background-color: var(--color-primary);
		color: white;
		cursor: pointer;
		margin-top: 1rem;
		transition: background-color 0.3s;
	}

	/* button:hover {
		background-color: #218838;
	} */

	.letters {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.letter {
		width: 60px;
		height: 60px;
		background-color: gray;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		font-size: 1.5rem;
		position: relative;
		transition: background-color 0.3s;
	}

	.letter.guessed {
		background-color: green;
	}

	.confidence {
		position: absolute;
		bottom: -18px;
		font-size: 14px;
		color: var(--color-primary);
	}

	.hint {
		font-size: 1.2rem;
		margin-bottom: 2rem;
		color: #ccc;
	}

	.highlight {
		color: var(--color-primary);
		font-weight: bold;
		font-size: 1.2rem;
	}
</style>
