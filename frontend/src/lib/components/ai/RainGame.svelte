<script lang="ts">
	import Recognizer from './Recognizer.svelte';

	let gameStarted = $state(false);
	let gameOver = $state(false);

	let predict = $state('');
	let confidence = $state(0);

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

	interface FallingLetter {
		id: number;
		letter: string;
		y: number;
		speed: number;
		guessed: boolean;
		confidence?: number;
	}
	let counter = $state(0);
	let letters: FallingLetter[] = $state([]);
	let maxConcurrentLetters = $state(3);
	let spawnInterval = $state(2000); // Интервал появления новых букв (мс)
	let letterFallSpeed = $state(2); // px за кадр
	let gameDuration = $state(30); // секунд
	let timeLeft = $state(30);

	let spawnTimer: NodeJS.Timeout | null = null;
	let fallAnimation: number;
	let gameTimer: NodeJS.Timeout | null = null;
	let nextId = $state(0);

	function startGame() {
		gameStarted = true;
		gameOver = false;
		timeLeft = gameDuration;
		letters = [];
		nextId = 0;

		// Падение букв
		animateFall();

		// Появление новых букв
		spawnTimer = setInterval(spawnLetter, spawnInterval);

		// Таймер игры
		gameTimer = setInterval(() => {
			timeLeft--;
			if (timeLeft <= 0) {
				endGame();
			}
		}, 1000);
	}

	function spawnLetter() {
		if (letters.length >= maxConcurrentLetters) return;

		const randomIndex = Math.floor(Math.random() * allLetters.length);
		letters.push({
			id: nextId++,
			letter: allLetters[randomIndex],
			y: 0,
			speed: letterFallSpeed,
			guessed: false
		});
	}

	function animateFall() {
		fallAnimation = requestAnimationFrame(() => {
			for (let letter of letters) {
				letter.y += letter.speed;
			}

			// Удаляем буквы, которые вышли за экран
			letters = letters.filter((l) => l.y < window.innerHeight && !l.guessed);

			animateFall();
		});
	}

	$effect(() => {
		if (predict && gameStarted && confidence >= 60) {
			checkPrediction();
		}
	});

	function checkPrediction() {
		const match = letters.find((l) => l.letter === predict && !l.guessed);
		if (match) {
			counter++;
			match.guessed = true;
			match.confidence = confidence;
		}
	}

	function endGame() {
		gameStarted = false;
		gameOver = true;

		if (spawnTimer) {
			clearInterval(spawnTimer);
			spawnTimer = null;
		}
		if (gameTimer) {
			clearInterval(gameTimer);
			gameTimer = null;
		}
		cancelAnimationFrame(fallAnimation);
	}
</script>

<main class="falling-game-container">
	{#if !gameStarted && !gameOver}
		<div class="menu">
			<h1>Настройки игры</h1>
			<label
				>Скорость падения (px/кадр):
				<input type="number" bind:value={letterFallSpeed} min="1" />
			</label>
			<label
				>Интервал появления букв (мс):
				<input type="number" bind:value={spawnInterval} min="500" step="100" />
			</label>
			<label
				>Максимум одновременных букв:
				<input type="number" bind:value={maxConcurrentLetters} min="1" />
			</label>
			<label
				>Время игры (сек):
				<input type="number" bind:value={gameDuration} min="5" />
			</label>

			<button class="btn" onclick={startGame}>Начать</button>
		</div>
	{:else if gameStarted}
		<div class="falling-game">
			<div class="timer">Осталось времени: {timeLeft} сек</div>

			{#each letters as letter (letter.id)}
				<div class="falling-letter {letter.guessed ? 'guessed' : ''}" style="top: {letter.y}px;">
					{letter.letter}
					{#if letter.guessed}
						<div class="confidence">{letter.confidence}%</div>
					{/if}
				</div>
			{/each}

			<Recognizer bind:predict bind:confidence showPredict={true} />
		</div>
	{:else if gameOver}
		<div class="menu">
			<h1>Игра окончена!</h1>
			<!-- <p>Угадано букв: {letters.filter((l) => l.guessed).length}</p> -->
			<p>Поймано букв: {counter}</p>
			<button class="btn" onclick={() => (gameOver = false)}>Играть снова</button>
		</div>
	{/if}
</main>

<style>
	.falling-game-container {
		position: relative;
		overflow: hidden;
		height: 100vh;
		/* background: black; */
		/* color: white; */
	}

	.menu {
		text-align: center;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}

	.falling-game {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.timer {
		position: absolute;
		top: 1rem;
		left: 1rem;
		font-size: 1.5rem;
	}

	.falling-letter {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 2rem;
		background: gray;
		padding: 1rem;
		border-radius: 10px;
		transition: top 0.05s;
	}

	.falling-letter.guessed {
		background: green;
	}

	.confidence {
		font-size: 0.8rem;
		margin-top: 0.5rem;
	}

	.btn {
		margin-top: 2rem;
		padding: 0.8rem 2rem;
		font-size: 1.2rem;
		border: none;
		background: var(--color-primary);
		color: white;
		border-radius: 5px;
		cursor: pointer;
	}
	input {
		font-size: 14px;
		padding: 5px;
		border-radius: 5px;
		border: 1px solid var(--color-primary-transparent);
	}
</style>
