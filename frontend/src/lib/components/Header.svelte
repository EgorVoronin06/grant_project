<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	import { onMount } from 'svelte';
	
	let user = $state<any>(null);
	
	onMount(() => {
		const userStr = localStorage.getItem('user');
		if (userStr) {
			try {
				user = JSON.parse(userStr);
			} catch (e) {
				console.error('Error parsing user:', e);
			}
		}
	});

	const menuItems = $derived([
		{
			title: 'Главная',
			url: '/'
		},
		{
			title: 'Курсы',
			url: '/lk/courses'
		},
		{
			title: 'Алфавит',
			url: '/alphabet'
		},
		{
			title: 'Словарь',
			url: '/dictionary'
		},
		{
			title: user ? 'Профиль' : 'Войти',
			url: user ? '/lk/profile' : '/login'
		}
	]);

	let open = false;

	const currentPath = $derived($page.url.pathname);

	function isActive(url: string) {
		if (url === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(url);
	}

	function handleClick(item: { title: string; url: string }, event: MouseEvent) {
		if (item.title === 'Войти') {
			event.preventDefault();
			dispatch('auth');
		}
		open = false;
	}
</script>

<header class="header">
	<div class="container header__wrapper">
		<a class="header__logo" href="/">
			<img src="/icons/logo.svg" alt="logo" />
		</a>
		<nav class="navbar" class:navbar_active={open}>
			{#each menuItems as item}
				<a
					class="navbar__item"
					class:navbar__item--active={isActive(item.url)}
					on:click={(e) => handleClick(item, e)}
					href={item.url}
				>
					{item.title}
				</a>
			{/each}
		</nav>
		<button
			class="navbar__burger"
			on:click={() => (open = !open)}
			class:navbar__burger_active={open}
			aria-label="Открыть меню"
		>
			<span class="navbar__burger-middle"></span>
		</button>
	</div>
</header>

<style lang="postcss">
	.header {
		position: sticky;
		top: 0;
		z-index: 100;
		padding: 10px;
		background-color: var(--color-white);
		box-shadow: 0 5px 10px 0 #0000001c;
		transition: all 0.3s ease;
	}

	.header__wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		margin: 0 auto;
	}

	.header__logo {
		display: flex;
		align-items: center;
		height: 50px;
	}

	.header__logo img {
		height: 100%;
		width: auto;
		object-fit: contain;
	}

	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		max-width: 870px;
		flex: 1;
	}

	.navbar__item {
		width: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5px 20px;
		border-radius: 10px;
		background: var(--color-grey);
		color: var(--color-dark);
		text-decoration: none;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.navbar__item::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: var(--color-primary);
		transition: left 0.3s ease;
		z-index: -1;
	}

	.navbar__item:hover {
		color: var(--color-white);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 119, 255, 0.2);
	}

	.navbar__item:hover::before {
		left: 0;
	}

	.navbar__item--active {
		background: var(--color-primary);
		color: var(--color-white);
	}

	.navbar__item--active::before {
		left: 0;
	}

	.navbar__burger {
		display: none;
	}

	@media (max-width: 768px) {
		.navbar {
			position: fixed;
			top: 70px;
			left: 0;
			right: 0;
			background: var(--color-white);
			flex-direction: column;
			padding: 20px;
			transform: translateX(-100%);
			transition: transform 0.3s ease;
			box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
		}

		.navbar_active {
			transform: translateX(0);
		}

		.navbar__burger {
			display: block;
		}
	}
</style>
