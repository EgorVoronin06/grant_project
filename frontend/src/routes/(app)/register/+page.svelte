<script lang="ts">
	import { goto } from '$app/navigation';
	import { notification } from '$lib/stores/notifyStore';

	let formData = $state({
		email: '',
		password: '',
		confirmPassword: '',
		name: '',
		phone: '',
		birth_date: '',
		skill_level: 'beginner',
		agreeTerms: false
	});

	let isLoading = $state(false);
	let errors = $state<Record<string, string>>({});
	let showPassword = $state(false);

	const skillLevels = [
		{ value: 'beginner', label: 'Начинающий' },
		{ value: 'intermediate', label: 'Средний' },
		{ value: 'advanced', label: 'Продвинутый' }
	];

	function validateForm() {
		const newErrors: Record<string, string> = {};
		
		if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			newErrors.email = 'Введите корректный email';
		}
		
		if (formData.password.length < 8) {
			newErrors.password = 'Пароль должен быть не менее 8 символов';
		}
		
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Пароли не совпадают';
		}
		
		if (!formData.name.trim()) {
			newErrors.name = 'Введите ваше имя';
		}
		
		if (!formData.agreeTerms) {
			newErrors.agreeTerms = 'Необходимо согласие с условиями';
		}
		
		return newErrors;
	}

	async function handleSubmit() {
		const validationErrors = validateForm();
		
		if (Object.keys(validationErrors).length > 0) {
			errors = validationErrors;
			return;
		}
		
		isLoading = true;
		errors = {};
		
		try {
			const response = await fetch('http://localhost:3001/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
					name: formData.name,
					phone: formData.phone || null,
					birth_date: formData.birth_date || null,
					skill_level: formData.skill_level
				})
			});
			
			// Проверяем статус ответа перед парсингом JSON
			if (!response.ok) {
				// Пытаемся получить JSON с ошибкой
				let errorData;
				try {
					errorData = await response.json();
				} catch (e) {
					// Если не удалось распарсить JSON, используем статус
					throw new Error(`Ошибка сервера (${response.status}): ${response.statusText}`);
				}
				
				// Извлекаем сообщение об ошибке
				const errorMessage = errorData.error || errorData.message || errorData.errors?.[0]?.msg || `Ошибка ${response.status}`;
				errors.submit = errorMessage;
				notification.error(errorMessage);
				return;
			}
			
			const data = await response.json();
			
			if (data.success) {
				// Сохраняем токен и пользователя
				localStorage.setItem('auth_token', data.data.token);
				localStorage.setItem('user', JSON.stringify(data.data.user));
				
				notification.success('Регистрация успешна! Добро пожаловать!');
				goto('/lk/profile');
			} else {
				errors.submit = data.error || 'Ошибка регистрации';
				notification.error(errors.submit);
			}
		} catch (error) {
			// Обработка различных типов ошибок
			let errorMessage = 'Ошибка соединения с сервером';
			
			if (error instanceof TypeError && error.message.includes('fetch')) {
				errorMessage = 'Не удалось подключиться к серверу. Проверьте, что бэкенд запущен на http://localhost:3001';
			} else if (error instanceof Error) {
				errorMessage = error.message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			}
			
			errors.submit = errorMessage;
			notification.error(errorMessage);
			console.error('Registration error:', error);
		} finally {
			isLoading = false;
		}
	}

	function goToLogin() {
		goto('/login');
	}
</script>

<div class="register-page">
	<div class="register-container">
		<div class="register-header">
			<h1>Создать аккаунт</h1>
			<p>Присоединяйтесь к сообществу изучающих язык жестов</p>
		</div>

		<div class="register-form">
			<div class="form-grid">
				<!-- Основная информация -->
				<div class="form-section">
					<h3>Основная информация</h3>
					
					<div class="form-group">
						<label for="name">Полное имя *</label>
						<input
							type="text"
							id="name"
							bind:value={formData.name}
							class={errors.name ? 'error' : ''}
							placeholder="Иван Иванов"
							disabled={isLoading}
						/>
						{#if errors.name}
							<span class="error-message">{errors.name}</span>
						{/if}
					</div>

					<div class="form-group">
						<label for="email">Email *</label>
						<input
							type="email"
							id="email"
							bind:value={formData.email}
							class={errors.email ? 'error' : ''}
							placeholder="example@email.com"
							disabled={isLoading}
						/>
						{#if errors.email}
							<span class="error-message">{errors.email}</span>
						{/if}
					</div>

					<div class="form-group">
						<label for="phone">Телефон</label>
						<input
							type="tel"
							id="phone"
							bind:value={formData.phone}
							placeholder="+7 (999) 999-99-99"
							disabled={isLoading}
						/>
					</div>

					<div class="form-group">
						<label for="birth_date">Дата рождения</label>
						<input
							type="date"
							id="birth_date"
							bind:value={formData.birth_date}
							disabled={isLoading}
						/>
					</div>
				</div>

				<!-- Безопасность -->
				<div class="form-section">
					<h3>Безопасность</h3>
					
					<div class="form-group">
						<label for="password">Пароль *</label>
						<div class="password-input">
							<input
								type={showPassword ? 'text' : 'password'}
								id="password"
								bind:value={formData.password}
								class={errors.password ? 'error' : ''}
								placeholder="Не менее 8 символов"
								disabled={isLoading}
							/>
							<button
								type="button"
								class="toggle-password"
								on:click={() => showPassword = !showPassword}
							>
								{showPassword ? '👁️' : '👁️‍🗨️'}
							</button>
						</div>
						{#if errors.password}
							<span class="error-message">{errors.password}</span>
						{/if}
					</div>

					<div class="form-group">
						<label for="confirmPassword">Подтвердите пароль *</label>
						<input
							type={showPassword ? 'text' : 'password'}
							id="confirmPassword"
							bind:value={formData.confirmPassword}
							class={errors.confirmPassword ? 'error' : ''}
							placeholder="Повторите пароль"
							disabled={isLoading}
						/>
						{#if errors.confirmPassword}
							<span class="error-message">{errors.confirmPassword}</span>
						{/if}
					</div>

					<div class="form-group">
						<label for="skill_level">Уровень владения</label>
						<select id="skill_level" bind:value={formData.skill_level} disabled={isLoading}>
							{#each skillLevels as level}
								<option value={level.value}>{level.label}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>

			<!-- Соглашения -->
			<div class="agreements">
				<label class="checkbox">
					<input type="checkbox" bind:checked={formData.agreeTerms} disabled={isLoading} />
					<span class="checkmark"></span>
					<span class="label">
						Я соглашаюсь с 
						<a href="/terms" target="_blank">Условиями использования</a> и 
						<a href="/privacy" target="_blank">Политикой конфиденциальности</a>
					</span>
				</label>
				{#if errors.agreeTerms}
					<span class="error-message">{errors.agreeTerms}</span>
				{/if}
			</div>

			<!-- Кнопки -->
			<div class="form-actions">
				{#if errors.submit}
					<div class="submit-error">{errors.submit}</div>
				{/if}
				
				<button
					class="register-btn"
					on:click={handleSubmit}
					disabled={isLoading}
				>
					{isLoading ? 'Регистрация...' : 'Создать аккаунт'}
				</button>

				<div class="login-link">
					Уже есть аккаунт? 
					<button class="link-btn" on:click={goToLogin}>Войти</button>
				</div>
			</div>
		</div>

		<div class="register-benefits">
			<h3>Преимущества регистрации:</h3>
			<ul>
				<li>📊 Отслеживание прогресса обучения</li>
				<li>🏆 Достижения и награды</li>
				<li>🎮 Доступ к обучающим играм</li>
				<li>🤖 Индивидуальные рекомендации</li>
				<li>👥 Участие в сообществе</li>
			</ul>
		</div>
	</div>
</div>

<style>
	.register-page {
		min-height: 100vh;
		background: #f3f6ff;
		padding: 40px 20px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.register-container {
		background: white;
		border-radius: 32px;
		padding: 50px 40px;
		max-width: 1000px;
		width: 100%;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.register-container:hover {
		box-shadow: 0 12px 48px rgba(0, 119, 255, 0.15);
		transform: translateY(-4px);
	}

	.register-header {
		text-align: center;
		margin-bottom: 40px;
	}

	.register-header h1 {
		font-family: 'Inter', sans-serif;
		font-size: 36px;
		font-weight: 700;
		color: #333;
		margin-bottom: 10px;
	}

	.register-header p {
		font-family: 'Inter', sans-serif;
		font-size: 18px;
		color: #666;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		margin-bottom: 30px;
	}

	@media (max-width: 768px) {
		.form-grid {
			grid-template-columns: 1fr;
		}
	}

	.form-section {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-section h3 {
		font-family: 'Inter', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: #333;
		margin-bottom: 10px;
		padding-bottom: 10px;
		border-bottom: 2px solid #0077FF;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-group label {
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		font-weight: 500;
		color: #555;
	}

	.form-group input,
	.form-group select {
		padding: 16px 24px;
		border: 2px solid #b7b5b5;
		border-radius: 32px;
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		transition: all 0.3s ease;
		box-sizing: border-box;
	}

	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: #0077FF;
		box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.1);
	}

	.form-group input.error,
	.form-group select.error {
		border-color: #ff4444;
	}

	.error-message {
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		color: #ff4444;
		margin-top: 4px;
	}

	.password-input {
		position: relative;
	}

	.toggle-password {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		font-size: 20px;
		cursor: pointer;
		padding: 0;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.agreements {
		margin: 30px 0;
	}

	.checkbox {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		cursor: pointer;
	}

	.checkbox input {
		display: none;
	}

	.checkmark {
		width: 20px;
		height: 20px;
		border: 2px solid #0077FF;
		border-radius: 4px;
		flex-shrink: 0;
		position: relative;
		transition: all 0.3s ease;
	}

	.checkbox input:checked + .checkmark {
		background: #0077FF;
	}

	.checkbox input:checked + .checkmark::after {
		content: '✓';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 14px;
	}

	.checkbox .label {
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: #555;
		line-height: 1.4;
	}

	.checkbox a {
		color: #0077FF;
		text-decoration: none;
		font-weight: 500;
	}

	.checkbox a:hover {
		text-decoration: underline;
	}

	.form-actions {
		display: flex;
		flex-direction: column;
		gap: 20px;
		align-items: center;
	}

	.submit-error {
		background: #ffebee;
		color: #ff4444;
		padding: 12px 20px;
		border-radius: 8px;
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		width: 100%;
		text-align: center;
	}

	.register-btn {
		width: 100%;
		padding: 16px 32px;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: 32px;
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.register-btn:hover:not(:disabled) {
		background: #0056cc;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 119, 255, 0.3);
	}

	.register-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.login-link {
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: #666;
	}

	.link-btn {
		background: none;
		border: none;
		color: #0077FF;
		font-weight: 600;
		cursor: pointer;
		padding: 0;
		margin-left: 5px;
	}

	.link-btn:hover {
		text-decoration: underline;
	}

	.register-benefits {
		margin-top: 40px;
		padding-top: 30px;
		border-top: 1px solid #E0E0E0;
	}

	.register-benefits h3 {
		font-family: 'Inter', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: #333;
		margin-bottom: 15px;
	}

	.register-benefits ul {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 10px;
	}

	.register-benefits li {
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: #555;
		padding: 8px 0;
		display: flex;
		align-items: center;
		gap: 10px;
	}
</style>
