<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let activeTab = $state('trainers'); // 'trainers', 'dictionary', 'achievements'
	
	// Данные для словаря
	let signs = $state<any[]>([]);
	let loading = $state(true);
	let searchQuery = $state('');
	let timeoutId: number | undefined;

	// Данные для roadmap
	let userProgress = $state<any>(null);
	let roadmapItems = $state<any[]>([]);

	async function fetchSigns() {
		loading = true;
		try {
			const url = searchQuery
				? `http://localhost:3001/api/dictionary/search/${encodeURIComponent(searchQuery)}`
				: 'http://localhost:3001/api/dictionary?limit=50';
			const response = await fetch(url);
			const data = await response.json();
			signs = data.signs || [];
		} catch (error) {
			console.error('Error fetching dictionary:', error);
		} finally {
			loading = false;
		}
	}

	async function fetchUserProgress() {
		try {
			const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
			if (!token) return;

			const response = await fetch('http://localhost:3001/api/profile/progress', {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const data = await response.json();
			if (data.success) {
				userProgress = data.data;
				generateRoadmap();
			}
		} catch (error) {
			console.error('Error fetching progress:', error);
		}
	}

	function generateRoadmap() {
		// Генерируем roadmap на основе прогресса пользователя
		// Это примерная структура, можно адаптировать под реальные данные
		roadmapItems = [
			{ id: 1, type: 'course', title: 'Курс 1', status: 'completed', icon: 'book', url: '/lk/courses', position: { top: '10%', left: '15%' } },
			{ id: 2, type: 'achievement', title: 'Первое достижение', status: 'completed', icon: 'star', position: { top: '20%', left: '60%' } },
			{ id: 3, type: 'lesson', title: 'Урок 1', status: 'completed', icon: 'video', url: '/lk/lessons/1', position: { top: '30%', left: '25%' } },
			{ id: 4, type: 'trainer', title: 'Тренажер 1', status: 'in_progress', icon: 'play', url: '/lk/train/sprint', position: { top: '40%', left: '70%' } },
			{ id: 5, type: 'course', title: 'Курс 2', status: 'locked', icon: 'book', url: '/lk/courses', position: { top: '50%', left: '20%' } },
			{ id: 6, type: 'achievement', title: 'Второе достижение', status: 'locked', icon: 'star', position: { top: '60%', left: '65%' } },
			{ id: 7, type: 'lesson', title: 'Урок 2', status: 'locked', icon: 'video', url: '/lk/lessons/2', position: { top: '70%', left: '30%' } },
			{ id: 8, type: 'trainer', title: 'Тренажер 2', status: 'locked', icon: 'play', url: '/lk/train/rain', position: { top: '80%', left: '75%' } },
		];
	}

	onMount(() => {
		fetchSigns();
		fetchUserProgress();
	});

	$effect(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		if (searchQuery !== undefined && activeTab === 'dictionary') {
			timeoutId = setTimeout(() => {
				fetchSigns();
			}, 300);
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});

	function handleRoadmapClick(item: any) {
		if (item.status === 'locked') return;
		if (item.url) {
			goto(item.url);
		}
	}

	function getIconPath(icon: string) {
		const iconMap: Record<string, string> = {
			book: '/icons/books.svg',
			video: '/icons/interactive.svg',
			play: '/icons/play.svg',
			star: '/icons/cup.svg'
		};
		return iconMap[icon] || '/icons/books.svg';
	}
</script>

<div class="train-page">
	<div class="train-page__bar">
		<h1>Тренажеры</h1>
	</div>

	<!-- Вкладки -->
	<div class="tabs-container">
		<button
			class="tab {activeTab === 'trainers' ? 'active' : ''}"
			on:click={() => activeTab = 'trainers'}
		>
			Тренажеры
		</button>
		<button
			class="tab {activeTab === 'dictionary' ? 'active' : ''}"
			on:click={() => activeTab = 'dictionary'}
		>
			Словарь
		</button>
		<button
			class="tab {activeTab === 'achievements' ? 'active' : ''}"
			on:click={() => activeTab = 'achievements'}
		>
			Достижения
		</button>
	</div>

	<!-- Контент вкладок -->
	<div class="train-page__content">
		{#if activeTab === 'trainers'}
			<div class="trainers-grid">
				<div class="train-page__card">
					<h3 class="train-page__card-title">Спринт</h3>
					<img class="train-page__card-img" src="/images/dactil.jpg" alt="dactil" />
					<a href="/lk/train/sprint" class="train-page__card-btn">Начать</a>
				</div>
				<div class="train-page__card">
					<h3 class="train-page__card-title">Спринт со временем</h3>
					<img class="train-page__card-img" src="/images/dactil.jpg" alt="dactil" />
					<a href="/lk/train/sprint-time" class="train-page__card-btn">Начать</a>
				</div>
				<div class="train-page__card">
					<h3 class="train-page__card-title">Дождь</h3>
					<img class="train-page__card-img" src="/images/dactil.jpg" alt="dactil" />
					<a href="/lk/train/rain" class="train-page__card-btn">Начать</a>
				</div>
			</div>

		{:else if activeTab === 'dictionary'}
			<div class="dictionary-content">
				<div class="search-container">
					<input
						type="text"
						class="search-input"
						placeholder="Поиск жестов..."
						bind:value={searchQuery}
					/>
				</div>

				{#if loading}
					<div class="loading">Загрузка словаря...</div>
				{:else if signs.length === 0}
					<div class="empty-state">
						<p>Жесты не найдены</p>
					</div>
				{:else}
					<div class="signs-grid">
						{#each signs as sign}
							<div class="sign-card">
								<h3 class="sign-word">{sign.word}</h3>
								{#if sign.description}
									<p class="sign-description">{sign.description}</p>
								{/if}
								{#if sign.video_url}
									<div class="sign-video">
										<video src={sign.video_url} controls></video>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>

		{:else if activeTab === 'achievements'}
			<div class="achievements-content">
				<div class="roadmap-container">
					<!-- Профиль пользователя слева -->
					<div class="user-profile-section">
						<div class="user-avatar">
							<img src="/images/avatar.jpg" alt="avatar" />
						</div>
						<div class="user-info">
							<h3 class="user-name">Иван Иваныч</h3>
							<p class="user-date">25.09.2025</p>
						</div>
						<div class="user-rating">
							<div class="stars">
								{#each Array(5) as _, i}
									<span class="star {i < 3 ? 'filled' : ''}">★</span>
								{/each}
							</div>
						</div>
					</div>

					<!-- Roadmap справа -->
					<div class="roadmap-section">
						<div class="roadmap-path">
							<svg class="roadmap-line" viewBox="0 0 1000 2000" preserveAspectRatio="none">
								<path
									d="M 100 100 Q 200 300, 300 400 T 500 600 T 700 800 T 900 1000 T 700 1200 T 500 1400 T 300 1600 T 500 1800"
									fill="none"
									stroke="#0077FF"
									stroke-width="4"
									stroke-dasharray="10,5"
								/>
							</svg>
						</div>

						<div class="roadmap-items">
							{#each roadmapItems as item}
								<button
									class="roadmap-item {item.status}"
									style="top: {item.position.top}; left: {item.position.left};"
									on:click={() => handleRoadmapClick(item)}
									disabled={item.status === 'locked'}
								>
									{#if item.type === 'achievement'}
										<div class="item-icon achievement-icon">
											<svg width="40" height="40" viewBox="0 0 40 40">
												<path
													d="M20 0 L24.5 13.5 L38 15 L27 24.5 L30 38 L20 30 L10 38 L13 24.5 L2 15 L15.5 13.5 Z"
													fill={item.status === 'completed' ? '#FFD700' : '#D9D9D9'}
												/>
											</svg>
										</div>
									{:else}
										<div class="item-icon {item.type}-icon">
											<img src={getIconPath(item.icon)} alt={item.type} />
										</div>
									{/if}
									{#if item.status === 'completed'}
										<div class="checkmark">✓</div>
									{/if}
									<div class="item-tooltip">{item.title}</div>
								</button>
							{/each}
						</div>
					</div>

					<!-- 3D персонаж внизу слева -->
					<div class="character-section">
						<div class="character-3d">
							<!-- Здесь можно добавить 3D модель или изображение -->
							<div class="character-placeholder">
								<span>👤</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.train-page {
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
	}

	.train-page__bar {
		background: white;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px;
		border: 1px solid var(--color-primary-transparent);
	}

	.tabs-container {
		display: flex;
		gap: 10px;
		background: white;
		border-radius: 10px;
		padding: 10px;
		border: 1px solid var(--color-primary-transparent);
	}

	.tab {
		flex: 1;
		padding: 12px 24px;
		background: var(--color-grey);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		color: var(--color-dark);
		transition: all 0.3s ease;
	}

	.tab:hover {
		background: var(--color-primary-transparent);
	}

	.tab.active {
		background: var(--color-primary);
		color: white;
	}

	.train-page__content {
		background-color: white;
		border: 1px solid var(--color-primary-transparent);
		padding: 20px;
		border-radius: 10px;
		flex-grow: 1;
		overflow-y: auto;
	}

	.trainers-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 30px;
	}

	.train-page__card {
		border: 1px solid var(--color-primary-transparent);
		height: fit-content;
		overflow: hidden;
		border-radius: 15px;
		position: relative;
	}

	.train-page__card-img {
		width: 100%;
	}

	.train-page__card-btn {
		display: block;
		text-align: center;
		width: 100%;
		border: none;
		padding: 10px;
		background: var(--color-primary);
		color: white;
		text-decoration: none;
	}

	.train-page__card-title {
		position: absolute;
		top: 0;
		left: 50%;
		background: green;
		padding: 5px;
		border-radius: 0 0 5px 5px;
		font-weight: 600;
		color: white;
		transform: translateX(-50%);
		text-align: center;
	}

	/* Словарь */
	.dictionary-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.search-container {
		margin-bottom: 20px;
	}

	.search-input {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		display: block;
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

	.signs-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 24px;
		margin-top: 20px;
	}

	.sign-card {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 16px;
		padding: 24px;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.sign-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 119, 255, 0.15);
		border-color: var(--color-primary);
	}

	.sign-word {
		font-size: 24px;
		font-weight: 600;
		margin-bottom: 12px;
		color: var(--color-dark);
	}

	.sign-description {
		font-size: 14px;
		color: #666;
		margin-bottom: 16px;
		line-height: 1.5;
	}

	.sign-video {
		margin-top: 16px;
		border-radius: 8px;
		overflow: hidden;
	}

	.sign-video video {
		width: 100%;
		height: auto;
	}

	.loading,
	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: var(--color-dark);
		font-size: 18px;
	}

	.empty-state {
		opacity: 0.6;
	}

	/* Достижения и Roadmap */
	.achievements-content {
		height: 100%;
		position: relative;
	}

	.roadmap-container {
		display: grid;
		grid-template-columns: 300px 1fr;
		grid-template-rows: 1fr auto;
		gap: 20px;
		height: 100%;
		min-height: 600px;
		position: relative;
	}

	.user-profile-section {
		background: white;
		border-radius: 15px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 15px;
		border: 1px solid var(--color-primary-transparent);
		height: fit-content;
	}

	.user-avatar img {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		object-fit: cover;
		border: 3px solid var(--color-primary);
	}

	.user-info {
		text-align: center;
	}

	.user-name {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 5px;
	}

	.user-date {
		font-size: 14px;
		color: #666;
	}

	.user-rating {
		margin-top: 10px;
	}

	.stars {
		display: flex;
		gap: 5px;
	}

	.star {
		font-size: 20px;
		color: #D9D9D9;
	}

	.star.filled {
		color: var(--color-primary);
	}

	.roadmap-section {
		position: relative;
		background: white;
		border-radius: 15px;
		padding: 20px;
		border: 1px solid var(--color-primary-transparent);
		overflow: hidden;
		min-height: 800px;
	}

	.roadmap-path {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.roadmap-line {
		width: 100%;
		height: 100%;
	}

	.roadmap-items {
		position: relative;
		width: 100%;
		height: 100%;
		z-index: 2;
	}

	.roadmap-item {
		position: absolute;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		border: 3px solid;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		transform: translate(-50%, -50%);
	}

	.roadmap-item.completed {
		border-color: var(--color-primary);
		background: var(--color-primary);
	}

	.roadmap-item.in_progress {
		border-color: #FFA500;
		background: #FFA500;
	}

	.roadmap-item.locked {
		border-color: #D9D9D9;
		background: #D9D9D9;
		cursor: not-allowed;
		opacity: 0.5;
	}

	.roadmap-item:hover:not(:disabled) {
		transform: translate(-50%, -50%) scale(1.2);
		box-shadow: 0 4px 12px rgba(0, 119, 255, 0.3);
	}

	.item-icon {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.item-icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.achievement-icon svg {
		width: 100%;
		height: 100%;
	}

	.checkmark {
		position: absolute;
		top: -5px;
		right: -5px;
		width: 20px;
		height: 20px;
		background: #4CAF50;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 12px;
		font-weight: bold;
	}

	.item-tooltip {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 5px 10px;
		border-radius: 5px;
		font-size: 12px;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
		margin-bottom: 5px;
	}

	.roadmap-item:hover .item-tooltip {
		opacity: 1;
	}

	.character-section {
		grid-column: 1;
		grid-row: 2;
		position: relative;
	}

	.character-3d {
		width: 200px;
		height: 200px;
		position: relative;
	}

	.character-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 100px;
		background: white;
		border-radius: 15px;
		border: 1px solid var(--color-primary-transparent);
	}

	@media (max-width: 1200px) {
		.roadmap-container {
			grid-template-columns: 1fr;
		}

		.trainers-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.trainers-grid {
			grid-template-columns: 1fr;
		}

		.signs-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
