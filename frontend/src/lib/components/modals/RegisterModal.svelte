<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { authApi, AuthApi } from '../../plugins/api/modules/auth';
	import { notification } from '../../stores/notifyStore';
	import { ApiError } from '../../plugins/api';

	const dispatch = createEventDispatcher();

	let name = '';
	let email = '';
	let password = '';
	let phone = '';
	let loading = false;
	let authInstanceApi: AuthApi;

	import { onMount } from 'svelte';
	onMount(() => {
		authInstanceApi = new AuthApi(fetch);
	});

	async function handleRegister() {
		if (!name || !email || !password) {
			notification.error('Заполните все поля');
			return;
		}

		if (password.length < 6) {
			notification.error('Пароль должен быть не менее 6 символов');
			return;
		}

		loading = true;
		try {
			// Используем backend API для регистрации
			const response = await fetch('http://localhost:3001/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name,
					email,
					password,
					phone: phone || undefined
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Ошибка регистрации');
			}

			notification.success('Регистрация успешна! Теперь вы можете войти.');
			dispatch('close');
			dispatch('registered');
		} catch (error) {
			if (error instanceof ApiError) {
				notification.error(error.message);
			} else if (error instanceof Error) {
				notification.error(error.message);
			} else {
				notification.error('Ошибка регистрации');
			}
		} finally {
			loading = false;
		}
	}

	function handleClose() {
		dispatch('close');
	}
</script>

<div class="modal-overlay" on:click={handleClose} on:click|stopPropagation role="dialog" aria-modal="true">
	<div class="modal-content" on:click|stopPropagation>
		<button class="modal-close" on:click={handleClose} aria-label="Закрыть">×</button>
		
		<div class="modal-form">
			<div class="form-field">
				<label class="field-label">
					<span class="label-text">логин</span>
				</label>
				<input
					type="text"
					class="form-input"
					placeholder="ваш логин"
					bind:value={name}
					disabled={loading}
				/>
			</div>

			<div class="form-field">
				<label class="field-label">
					<span class="label-text">номер телефона</span>
				</label>
				<input
					type="tel"
					class="form-input"
					placeholder="+7"
					bind:value={phone}
					disabled={loading}
				/>
			</div>

			<div class="form-field">
				<label class="field-label">
					<span class="label-text">email</span>
				</label>
				<input
					type="email"
					class="form-input"
					placeholder="ваш email"
					bind:value={email}
					disabled={loading}
				/>
			</div>

			<div class="form-field">
				<label class="field-label">
					<span class="label-text">пароль</span>
				</label>
				<input
					type="password"
					class="form-input"
					placeholder="ваш пароль"
					bind:value={password}
					disabled={loading}
				/>
			</div>

			<button class="submit-button" on:click={handleRegister} disabled={loading}>
				{loading ? 'Регистрация...' : 'Зарегистрироваться'}
			</button>
		</div>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-content {
		position: relative;
		width: 548px;
		height: 386px;
		background: #ffffff;
		box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.0541139);
		border-radius: 57px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 19px 32px;
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			transform: translateY(50px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.modal-close {
		position: absolute;
		top: 20px;
		right: 20px;
		background: none;
		border: none;
		font-size: 32px;
		cursor: pointer;
		color: #b7b5b5;
		transition: color 0.2s;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-close:hover {
		color: #0077ff;
	}

	.modal-form {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 20px;
	}

	.form-field {
		position: relative;
		width: 100%;
	}

	.field-label {
		position: absolute;
		top: -10px;
		left: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 2px 8px;
		background: #ffffff;
		z-index: 1;
	}

	.label-text {
		width: auto;
		height: 15px;
		font-family: 'Inter', sans-serif;
		font-style: normal;
		font-weight: 600;
		font-size: 12px;
		line-height: 15px;
		letter-spacing: 0.005em;
		color: #b7b5b5;
	}

	.form-input {
		box-sizing: border-box;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 16px 24px;
		background: #ffffff;
		border: 2px solid #b7b5b5;
		border-radius: 32px;
		font-family: 'Inter', sans-serif;
		font-style: normal;
		font-weight: 500;
		font-size: 16px;
		line-height: 18px;
		text-align: left;
		letter-spacing: 0.007em;
		color: #000000;
		transition: all 0.3s ease;
	}

	.form-input:focus {
		outline: none;
		border-color: #0077ff;
		color: #000000;
		box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.1);
	}

	.form-input::placeholder {
		color: #b7b5b5;
		text-align: left;
	}

	.submit-button {
		position: relative;
		width: 100%;
		height: 56px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 16px 32px;
		gap: 10px;
		background: #0077ff;
		border-radius: 32px;
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
		font-family: 'Inter', sans-serif;
		font-style: normal;
		font-weight: 700;
		font-size: 16px;
		line-height: 18px;
		text-align: center;
		letter-spacing: 0.007em;
		color: #ffffff;
	}

	.submit-button:hover:not(:disabled) {
		background: #0056cc;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 119, 255, 0.3);
	}

	.submit-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.submit-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>

