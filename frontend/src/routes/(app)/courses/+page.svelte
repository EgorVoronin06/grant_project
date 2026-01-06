<script lang="ts">
	import { onMount } from 'svelte';
	import CourseCard from '$lib/components/courses/CourseCard.svelte';

	let courses = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const response = await fetch('http://localhost:3001/api/courses');
			const data = await response.json();
			courses = data.courses || [];
		} catch (error) {
			console.error('Error fetching courses:', error);
		} finally {
			loading = false;
		}
	});
</script>

<div class="courses-page">
	<div class="container">
		<h1 class="page-title">Курсы</h1>
		{#if loading}
			<div class="loading">Загрузка курсов...</div>
		{:else if courses.length === 0}
			<div class="empty-state">
				<p>Курсы пока не добавлены</p>
			</div>
		{:else}
			<div class="courses-grid">
				{#each courses as course}
					<CourseCard course={course} />
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.courses-page {
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

	.courses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 30px;
		margin-top: 30px;
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

