<script lang="ts">
	import '$lib/assets/css/app.css';
	import { page } from '$app/state';
	import NcIconSvg from '$lib/components/general/NCIconSvg.svelte';

	let { children } = $props();

	const currentPath = $derived(page.url.pathname);

	let dynamicPath = $state('');

	$effect(() => {
		dynamicPath = page.url.pathname;
	});

	const menuItems = [
		{
			title: 'Курсы',
			url: '/lk/courses',
			icon: 'academic-cap'
		},
		{
			title: 'Мои уроки',
			url: '/lk/lessons',
			icon: 'books'
		},
		{
			title: 'Словарь',
			url: '/lk/dict',
			icon: 'dict'
		},
		{
			title: 'Тренажеры',
			url: '/lk/train',
			icon: 'dict'
		},
		{
			title: 'Тесты',
			url: '/lk/tests',
			icon: 'tests'
		},
		{
			title: 'Достижения',
			url: '/lk/achievements',
			icon: 'cup'
		}
	];
</script>

<div class="admin-layout">
	<aside class="admin-layout__sidebar">
		<div class="admin-layout__person">
			<img class="admin-layout__person-avatar" src="/images/avatar.jpg" alt="avatar" />
			<span>Кокорин Михаил</span>
		</div>
		<div class="admin-layout__sidebar-splitter">
			<nav class="admin-layout__menu">
				{#each menuItems as item (item.url)}
					<a class="admin-layout__menu-item" href={item.url}>
						<img src={`/icons/${item.icon}.svg`} alt="icon" />
						<span>{item.title}</span>
					</a>
				{/each}
			</nav>
			<nav class="admin-layout__menu">
				<a class="admin-layout__menu-item" href="/">
					<NcIconSvg iconId="exit" />
					<span>Выход</span>
				</a>
			</nav>
		</div>
	</aside>
	<div class="admin-layout__content">
		{@render children()}
	</div>
</div>

<style>
	:global(body) {
		padding: 0;
		margin: 0;
	}

	.admin-layout {
		height: 100vh;
		padding: 10px;
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 10px;
		background: #f3f6ff;
	}

	.admin-layout__sidebar {
		display: flex;
		flex-direction: column;
		border-radius: 10px;
		background: white;
		border: 1px solid var(--color-primary-transparent);
		overflow: hidden;
	}

	.admin-layout__sidebar-splitter {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
		justify-content: space-between;
	}

	.admin-layout__person {
		display: flex;
		gap: 20px;
		padding: 10px;
		align-items: center;
		background-color: var(--color-primary);
		color: white;
		border-bottom: 1px solid var(--color-primary-transparent);
	}

	.admin-layout__person-avatar {
		width: 70px;
		border-radius: 50%;
		border: 3px solid white;
	}

	.admin-layout__menu {
		display: flex;
		flex-direction: column;
	}

	.admin-layout__menu-item {
		padding: 20px;
		display: grid;
		grid-template-columns: 30px 1fr;
		gap: 20px;
		align-items: center;
		position: relative;
	}

	.admin-layout__menu-item:last-child::after {
		height: 0;
	}
	.admin-layout__menu-item::after {
		content: '';
		position: absolute;
		height: 1px;
		background: var(--color-primary-transparent);
		left: 15px;
		right: 15px;
		bottom: 0;
	}

	.admin-layout__menu-item_active {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		width: 5px;
		background: var(--color-primary-transparent);
	}
	.admin-layout__menu-item:hover {
		color: var(--color-primary);
	}
</style>
