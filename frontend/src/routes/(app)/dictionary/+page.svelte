<script lang="ts">
	import { onMount } from 'svelte';

	let signs = $state<any[]>([]);
	let loading = $state(true);
	let searchQuery = $state('');
	let timeoutId: number | undefined;

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

	onMount(() => {
		fetchSigns();
	});

	// Используем $effect вместо реактивного блока для таймера
	$effect(() => {
		// Очищаем предыдущий таймер
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		// Если это не первая загрузка (onMount), устанавливаем таймер
		if (searchQuery !== undefined) {
			timeoutId = setTimeout(() => {
				fetchSigns();
			}, 300);
		}

		// Функция очистки
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});
</script>

<div class="dictionary-page">
	<div class="container">
		<h1 class="page-title">Словарь жестов</h1>
		
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
</div>

<style>
	.dictionary-page {
		padding: 40px 0;
		min-height: 60vh;
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

	.search-container {
		margin-bottom: 40px;
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
		margin-top: 30px;
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
</style>

