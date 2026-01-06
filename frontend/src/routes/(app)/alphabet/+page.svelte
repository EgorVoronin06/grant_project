<script lang="ts">
	import { onMount } from 'svelte';

	// Русский алфавит
	const alphabet = [
		'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М',
		'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ',
		'Ы', 'Ь', 'Э', 'Ю', 'Я'
	];

	let currentIndex = $state(0);
	let searchQuery = $state('');
	let filteredAlphabet = $derived(
		searchQuery
			? alphabet.filter((letter) =>
					letter.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: alphabet
	);

	// Обновляем индекс при фильтрации
	$effect(() => {
		if (filteredAlphabet.length > 0 && currentIndex >= filteredAlphabet.length) {
			currentIndex = 0;
		}
	});

	const currentLetter = $derived(
		filteredAlphabet[currentIndex] || alphabet[0]
	);

	let videoElement: HTMLVideoElement;
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);

	function nextLetter() {
		if (currentIndex < filteredAlphabet.length - 1) {
			currentIndex++;
		} else {
			currentIndex = 0;
		}
		resetVideo();
	}

	function prevLetter() {
		if (currentIndex > 0) {
			currentIndex--;
		} else {
			currentIndex = filteredAlphabet.length - 1;
		}
		resetVideo();
	}

	function goToLetter(letter: string) {
		const index = filteredAlphabet.indexOf(letter);
		if (index !== -1) {
			currentIndex = index;
			resetVideo();
		}
	}

	function resetVideo() {
		if (videoElement) {
			videoElement.currentTime = 0;
			isPlaying = false;
			videoElement.pause();
		}
	}

	function togglePlay() {
		if (videoElement) {
			if (isPlaying) {
				videoElement.pause();
			} else {
				videoElement.play();
			}
			isPlaying = !isPlaying;
		}
	}

	function handleSearch() {
		if (searchQuery && filteredAlphabet.length > 0) {
			currentIndex = 0;
			resetVideo();
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	}

	function handleTimeUpdate() {
		if (videoElement) {
			currentTime = videoElement.currentTime;
		}
	}

	function handleLoadedMetadata() {
		if (videoElement) {
			duration = videoElement.duration;
		}
	}

	function handleSeek(event: Event) {
		const target = event.target as HTMLInputElement;
		if (videoElement) {
			videoElement.currentTime = parseFloat(target.value);
		}
	}

	function handleSearchKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}

	onMount(() => {
		// Здесь можно загрузить данные об алфавите с сервера
	});
</script>

<div class="alphabet-page">
	<div class="container">
		<h1 class="page-title">Алфавит русского жестового языка</h1>

		<div class="alphabet-content">
			<!-- Левая часть: Видеоплеер -->
			<div class="video-section">
				<div class="video-player">
					<div class="video-container">
						<!-- Placeholder для 3D аватара или видео -->
						<div class="avatar-placeholder">
							<div class="avatar-wrapper">
								<img
									src="/images/avatar_1.png"
									alt="3D Avatar"
									class="avatar-image"
								/>
								{#if !isPlaying}
									<button class="play-button" on:click={togglePlay}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="80"
											height="80"
											viewBox="0 0 24 24"
											fill="white"
										>
											<path
												d="M8 5v14l11-7z"
											/>
										</svg>
									</button>
								{/if}
							</div>
						</div>
						<!-- Видео элемент (скрыт, используется для управления) -->
						<video
							bind:this={videoElement}
							class="hidden-video"
							on:timeupdate={handleTimeUpdate}
							on:loadedmetadata={handleLoadedMetadata}
							on:play={() => (isPlaying = true)}
							on:pause={() => (isPlaying = false)}
							on:ended={() => (isPlaying = false)}
						>
							<source src="/images/a-video.mp4" type="video/mp4" />
							Ваш браузер не поддерживает видео.
						</video>
					</div>

					<!-- Контролы видео -->
					<div class="video-controls">
						<button class="control-btn" on:click={prevLetter} title="Предыдущая буква">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
								/>
							</svg>
						</button>
						<button class="control-btn play-pause-btn" on:click={togglePlay}>
							{#if isPlaying}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M8 5v14l11-7z" />
								</svg>
							{/if}
						</button>
						<button class="control-btn" on:click={nextLetter} title="Следующая буква">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
								/>
							</svg>
						</button>
						<div class="time-display">
							<span>{formatTime(currentTime)}</span>
							<input
								type="range"
								min="0"
								max={duration || 100}
								value={currentTime}
								on:input={handleSeek}
								class="progress-bar"
							/>
							<span>{formatTime(duration)}</span>
						</div>
						<button class="control-btn volume-btn" title="Громкость">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
								/>
							</svg>
						</button>
						<button class="control-btn fullscreen-btn" title="Полный экран">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
								/>
							</svg>
						</button>
					</div>

					<!-- Текущая буква -->
					<div class="current-letter-display">
						<span class="letter-large">{currentLetter}</span>
					</div>
				</div>
			</div>

			<!-- Правая часть: Поиск и навигация -->
			<div class="navigation-section">
				<!-- Поиск -->
				<div class="search-container">
					<input
						type="text"
						class="search-input"
						placeholder="Введите букву"
						bind:value={searchQuery}
						on:keydown={handleSearchKeydown}
					/>
					<button class="search-button" on:click={handleSearch}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
							/>
						</svg>
						<span>Искать</span>
					</button>
				</div>

				<!-- Навигация по буквам -->
				<div class="letters-navigation">
					<button class="nav-arrow nav-arrow-left" on:click={prevLetter}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
							/>
						</svg>
					</button>

					<div class="letters-list">
						{#each filteredAlphabet.slice(
							Math.max(0, currentIndex - 2),
							Math.min(filteredAlphabet.length, currentIndex + 3)
						) as letter, index}
							{@const actualIndex = Math.max(0, currentIndex - 2) + index}
							<button
								class="letter-item"
								class:letter-item--active={actualIndex === currentIndex}
								on:click={() => {
									currentIndex = actualIndex;
									resetVideo();
								}}
							>
								<span class="letter-text">{letter}</span>
							</button>
						{/each}
					</div>

					<button class="nav-arrow nav-arrow-right" on:click={nextLetter}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
							/>
						</svg>
					</button>
				</div>

				<!-- Индикаторы пагинации -->
				<div class="pagination">
					{#each filteredAlphabet as _, index}
						<button
							class="pagination-dot"
							class:pagination-dot--active={index === currentIndex}
							on:click={() => {
								currentIndex = index;
								resetVideo();
							}}
							aria-label="Буква {filteredAlphabet[index]}"
						></button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.alphabet-page {
		padding: 40px 0;
		min-height: 70vh;
		animation: fadeIn 0.5s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.page-title {
		font-size: 48px;
		font-weight: 700;
		margin-bottom: 40px;
		color: var(--color-dark);
		text-align: center;
	}

	.alphabet-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		margin-top: 30px;
	}

	/* Видео секция */
	.video-section {
		display: flex;
		flex-direction: column;
	}

	.video-player {
		background: white;
		border-radius: 20px;
		padding: 30px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	}

	.video-container {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		background: #f5f5f5;
		border-radius: 16px;
		overflow: hidden;
		margin-bottom: 20px;
	}

	.avatar-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
	}

	.avatar-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.avatar-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.play-button {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: rgba(0, 119, 255, 0.9);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		z-index: 10;
	}

	.play-button:hover {
		background: rgba(0, 119, 255, 1);
		transform: translate(-50%, -50%) scale(1.1);
	}

	.hidden-video {
		display: none;
	}

	.video-controls {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		background: var(--color-grey);
		border-radius: 12px;
		flex-wrap: wrap;
	}

	.control-btn {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 8px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-dark);
		transition: all 0.3s ease;
	}

	.control-btn:hover {
		background: rgba(0, 119, 255, 0.1);
		color: var(--color-primary);
	}

	.play-pause-btn {
		background: var(--color-primary);
		color: white;
		padding: 10px;
	}

	.play-pause-btn:hover {
		background: #0056cc;
		color: white;
	}

	.time-display {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 1;
		min-width: 200px;
		font-size: 14px;
		color: var(--color-dark);
	}

	.progress-bar {
		flex: 1;
		height: 6px;
		border-radius: 3px;
		background: #ddd;
		outline: none;
		cursor: pointer;
	}

	.progress-bar::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--color-primary);
		cursor: pointer;
	}

	.current-letter-display {
		margin-top: 20px;
		text-align: center;
	}

	.letter-large {
		font-size: 120px;
		font-weight: 700;
		color: var(--color-primary);
		line-height: 1;
	}

	/* Навигационная секция */
	.navigation-section {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.search-container {
		display: flex;
		gap: 12px;
	}

	.search-input {
		flex: 1;
		padding: 16px 24px;
		border: 2px solid #b7b5b5;
		border-radius: 32px;
		font-size: 16px;
		transition: all 0.3s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.1);
	}

	.search-button {
		padding: 16px 32px;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: 32px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: all 0.3s ease;
	}

	.search-button:hover {
		background: #0056cc;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 119, 255, 0.3);
	}

	.letters-navigation {
		display: flex;
		align-items: center;
		gap: 20px;
		justify-content: center;
	}

	.nav-arrow {
		background: var(--color-primary);
		color: white;
		border: none;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.nav-arrow:hover {
		background: #0056cc;
		transform: scale(1.1);
	}

	.letters-list {
		display: flex;
		gap: 12px;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
	}

	.letter-item {
		width: 60px;
		height: 60px;
		border: 2px solid #b7b5b5;
		border-radius: 12px;
		background: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		font-size: 24px;
		font-weight: 600;
		color: var(--color-dark);
	}

	.letter-item:hover {
		border-color: var(--color-primary);
		transform: translateY(-4px);
		box-shadow: 0 4px 12px rgba(0, 119, 255, 0.2);
	}

	.letter-item--active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	.pagination {
		display: flex;
		justify-content: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.pagination-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		background: #ddd;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.pagination-dot:hover {
		background: var(--color-primary);
		transform: scale(1.2);
	}

	.pagination-dot--active {
		background: var(--color-primary);
		width: 16px;
		height: 16px;
	}

	/* Адаптивность */
	@media (max-width: 1024px) {
		.alphabet-content {
			grid-template-columns: 1fr;
		}

		.letter-large {
			font-size: 80px;
		}
	}

	@media (max-width: 768px) {
		.page-title {
			font-size: 32px;
		}

		.video-controls {
			flex-wrap: wrap;
		}

		.time-display {
			min-width: 100%;
			order: 1;
		}

		.letter-large {
			font-size: 60px;
		}

		.letter-item {
			width: 50px;
			height: 50px;
			font-size: 20px;
		}

		.nav-arrow {
			width: 40px;
			height: 40px;
		}
	}
</style>

