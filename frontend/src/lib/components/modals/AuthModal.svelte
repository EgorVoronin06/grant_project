<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { authApi, AuthApi } from '../../plugins/api/modules/auth';
	import Button from '../form/Button.svelte';
	import NcCodeInput from '../form/NCCodeInput.svelte';
	import UserModal from './UserModal.svelte';
	import { notification } from '../../stores/notifyStore';
	import { ApiError } from '../../plugins/api';
	import { env } from '$env/dynamic/public';
	import { goto } from '$app/navigation';

	const dispatch = createEventDispatcher();

	let dto = {
		email: '',
		password: ''
	};
	let loading = false;
	let authInstanceApi: AuthApi;

	onMount(() => {
		authInstanceApi = new AuthApi(fetch);
	});

	async function handleLogin() {
		if (!dto.email || !dto.password) {
			notification.error('Заполните все поля');
			return;
		}

		loading = true;
		try {
			const response = await fetch('http://localhost:3001/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: dto.email,
					password: dto.password
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Ошибка входа');
			}

			if (data.token) {
				localStorage.setItem('authToken', data.token);
			}

			notification.success('Вход выполнен успешно!');
			dispatch('close');
			goto('/lk/courses');
		} catch (error) {
			if (error instanceof ApiError) {
				notification.error(error.message);
			} else if (error instanceof Error) {
				notification.error(error.message);
			} else {
				notification.error('Ошибка входа');
			}
		} finally {
			loading = false;
		}
	}

	function handleRegister() {
		dispatch('close');
		dispatch('register');
	}
</script>

<UserModal close={() => dispatch('close')} class="w-[580px] px-[80px] py-[50px]">
	<h2 class="mb-4">Вход в личный кабинет</h2>
	
	<div class="form-group">
		<label class="form-label">Email</label>
		<input
			type="email"
			class="form-input"
			placeholder="ваш email"
			bind:value={dto.email}
			disabled={loading}
		/>
	</div>

	<div class="form-group">
		<label class="form-label">Пароль</label>
		<input
			type="password"
			class="form-input"
			placeholder="ваш пароль"
			bind:value={dto.password}
			disabled={loading}
		/>
	</div>

	<Button primary full on:click={handleLogin} disabled={loading}>
		{loading ? 'Вход...' : 'Войти'}
	</Button>

	<div class="register-link">
		<p>Нет аккаунта? <a href="#" on:click|preventDefault={handleRegister}>Зарегистрироваться</a></p>
	</div>
</UserModal>

<style>
	.VkIdWebSdk__button_reset {
		border: none;
		margin: 0;
		padding: 0;
		width: auto;
		overflow: visible;
		background: transparent;
		color: inherit;
		font: inherit;
		line-height: normal;
		-webkit-font-smoothing: inherit;
		-moz-osx-font-smoothing: inherit;
		-webkit-appearance: none;
	}

	.VkIdWebSdk__button {
		background: #0077ff;
		cursor: pointer;
		transition: all 0.1s ease-out;
	}

	.VkIdWebSdk__button:hover {
		opacity: 0.8;
	}

	.VkIdWebSdk__button:active {
		opacity: 0.7;
		transform: scale(0.97);
	}

	.VkIdWebSdk__button {
		border-radius: 8px;
		/* width: 100%; */
		width: 207px;
		min-height: 40px;
	}

	.VkIdWebSdk__button_container {
		display: flex;
		align-items: center;
		padding: 8px 10px;
	}

	.VkIdWebSdk__button_icon + .VkIdWebSdk__button_text {
		margin-left: -28px;
	}

	.VkIdWebSdk__button_text {
		display: flex;
		font-family: -apple-system, system-ui, 'Helvetica Neue', Roboto, sans-serif;
		flex: 1;
		justify-content: center;
		color: #ffffff;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-label {
		display: block;
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-dark);
	}

	.form-input {
		width: 100%;
		padding: 16px 24px;
		border: 2px solid #b7b5b5;
		border-radius: 32px;
		font-size: 16px;
		transition: all 0.3s ease;
		box-sizing: border-box;
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.1);
	}

	.register-link {
		margin-top: 20px;
		text-align: center;
		font-size: 14px;
		color: var(--color-dark);
	}

	.register-link a {
		color: var(--color-primary);
		text-decoration: none;
		font-weight: 600;
		transition: color 0.3s ease;
	}

	.register-link a:hover {
		color: #0056cc;
		text-decoration: underline;
	}
</style>
