<script lang="ts">
	import { type FrameData } from '$lib/interfaces/frame-data.interface';
	import {
		FaceLandmarker,
		FilesetResolver,
		HandLandmarker,
		PoseLandmarker,
		type PoseLandmarkerResult,
		type FaceLandmarkerResult,
		type HandLandmarkerResult,
		type NormalizedLandmark
	} from '@mediapipe/tasks-vision';
	import { onDestroy, onMount } from 'svelte';
	let mode: 'video' | 'sceleton' | 'overlay' = $state('video');
	interface Props {
		frame: Partial<FrameData>;
		width: number;
		height: number;
		cb: (data: Partial<FrameData>[], name: string) => void;
	}
	let name: string = $state('');
	let { frame = $bindable(), width, height, cb }: Props = $props();
	let outputCanvas: HTMLCanvasElement;
	let canvasCtx: CanvasRenderingContext2D;
	let video: HTMLVideoElement;
	const fingerColors = [
		'#FF0000', // Большой палец (красный)
		'#00FF00', // Указательный (зеленый)
		'#0000FF', // Средний (синий)
		'#FFFF00', // Безымянный (желтый)
		'#FF00FF' // Мизинец (розовый)
	];
	let handLandmarker: HandLandmarker;
	let poseLandmarker: PoseLandmarker;
	let faceLandmarker: FaceLandmarker;

	let handRes: HandLandmarkerResult | undefined = undefined;
	let poseRes: PoseLandmarkerResult | undefined = undefined;
	let faceRes: FaceLandmarkerResult | undefined = undefined;

	let lastVideoTime = -1;

	let recordedFrames: Partial<FrameData>[] = [];
	let isRecording = $state(false);

	function startRecording() {
		recordedFrames = [];
		isRecording = true;
	}

	function stopRecording() {
		isRecording = false;
		// Можно сохранить recordedFrames в файл или отправить на сервер
		const cleanFrames = JSON.parse(JSON.stringify(recordedFrames));
		cb(cleanFrames, name);
		recordedFrames = [];
	}

	function render() {
		canvasCtx.save();
		canvasCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
		if (mode === 'overlay' || mode === 'video') {
			canvasCtx.drawImage(video, 0, 0, outputCanvas.width, outputCanvas.height);
		}
		if (mode === 'overlay' || mode === 'sceleton') {
			if (frame.pose && frame.pose) {
				// Draw pose landmarks
				drawPoseLandmarks(frame.pose);
			}

			// Draw face mesh
			if (frame.face && frame.face) {
				for (const face of frame.face) {
					drawFaceMesh(face);
				}
			}
			// Draw hand landmarks
			if (frame.hands && frame.hands) {
				for (const landmarks of frame.hands) {
					drawHandLandmarks(landmarks);
				}
			}
		}
		canvasCtx.restore();
	}

	function drawPoseLandmarks(landmarks: NormalizedLandmark[][]) {
		if (!landmarks || landmarks.length === 0) return;

		const landmarkList = landmarks[0];
		canvasCtx.fillStyle = '#FF0000';
		canvasCtx.strokeStyle = '#FF0000';
		canvasCtx.lineWidth = 2;

		// Draw connections
		if (landmarkList.length >= 33) {
			// Плечи и туловище
			drawConnection(landmarkList[11], landmarkList[12]); // Плечи
			drawConnection(landmarkList[11], landmarkList[23]); // Правая сторона туловища
			drawConnection(landmarkList[12], landmarkList[24]); // Левая сторона туловища
			drawConnection(landmarkList[23], landmarkList[24]); // Таз

			// Руки
			drawConnection(landmarkList[11], landmarkList[13]); // Правое плечо-локоть
			drawConnection(landmarkList[13], landmarkList[15]); // Правый локоть-запястье
			drawConnection(landmarkList[12], landmarkList[14]); // Левое плечо-локоть
			drawConnection(landmarkList[14], landmarkList[16]); // Левый локоть-запястье

			// Ноги
			drawConnection(landmarkList[23], landmarkList[25]); // Правое бедро-колено
			drawConnection(landmarkList[25], landmarkList[27]); // Правое колено-лодыжка
			drawConnection(landmarkList[24], landmarkList[26]); // Левое бедро-колено
			drawConnection(landmarkList[26], landmarkList[28]); // Левое колено-лодыжка
		}
	}

	function drawFaceMesh(faceLandmarks: NormalizedLandmark[]) {
		if (!faceLandmarks || faceLandmarks.length === 0) return;

		// 1. Отрисовка основной сетки лица (tesselation)
		canvasCtx.fillStyle = 'rgba(255, 192, 203, 0.2)'; // Полупрозрачный розовый
		canvasCtx.strokeStyle = 'rgba(255, 105, 180, 0.4)'; // Полупрозрачный розовый
		canvasCtx.lineWidth = 0.5;

		// MediaPipe Face Mesh содержит 468 точек с предопределенными соединениями
		// Для простоты будем рисовать все соединения между точками
		for (let i = 0; i < faceLandmarks.length; i++) {
			const point = faceLandmarks[i];
			if (point) {
				const x = point.x * outputCanvas.width;
				const y = point.y * outputCanvas.height;

				// Рисуем точку
				canvasCtx.beginPath();
				canvasCtx.arc(x, y, 1, 0, 1 * Math.PI);
				canvasCtx.fillStyle = '#00FF00';
				canvasCtx.fill();

				// Рисуем соединения с соседними точками (упрощенный вариант)
				if (i < faceLandmarks.length - 1) {
					const nextPoint = faceLandmarks[i + 1];
					if (nextPoint) {
						drawConnection(point, nextPoint);
					}
				}
			}
		}

		// 2. Отрисовка контура лица (более толстыми линиями)
		// canvasCtx.strokeStyle = "#FF1493";
		// canvasCtx.lineWidth = 2;
		// const faceOvalIndices = [
		//     10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365,
		//     379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93,
		//     234, 127, 162, 21, 54, 103, 67, 109,
		// ];
		// drawContour(faceLandmarks, faceOvalIndices);

		// 3. Губы - ВЕРХНЯЯ и НИЖНЯЯ части
		canvasCtx.strokeStyle = '#FFFFFF';
		canvasCtx.lineWidth = 2;

		// Верхняя губа (внешний контур)
		const upperLipOuter = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
		// Верхняя губа (внутренний контур)
		const upperLipInner = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308];

		// Нижняя губа (внешний контур)
		const lowerLipOuter = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
		// Нижняя губа (внутренний контур)
		const lowerLipInner = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308];

		drawContour(faceLandmarks, upperLipOuter);
		drawContour(faceLandmarks, upperLipInner);
		drawContour(faceLandmarks, lowerLipOuter);
		drawContour(faceLandmarks, lowerLipInner);

		// 4. Отрисовка глаз (выделяем белым)
		canvasCtx.strokeStyle = '#FFFFFF';
		canvasCtx.lineWidth = 2;
		const leftEye = [
			33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7, 33
		];
		const rightEye = [
			362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382, 362
		];
		drawContour(faceLandmarks, leftEye);
		drawContour(faceLandmarks, rightEye);

		// 5. Отрисовка бровей
		canvasCtx.strokeStyle = '#FFFFFF';
		canvasCtx.lineWidth = 2;
		const leftEyebrow = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46];
		const rightEyebrow = [300, 293, 334, 296, 336, 285, 295, 282, 283, 276];
		drawContour(faceLandmarks, leftEyebrow);
		drawContour(faceLandmarks, rightEyebrow);
	}

	function drawContour(landmarks: NormalizedLandmark[], indices: number[]) {
		canvasCtx.beginPath();
		for (let i = 0; i < indices.length; i++) {
			const point = landmarks[indices[i]];
			if (point) {
				const x = point.x * outputCanvas.width;
				const y = point.y * outputCanvas.height;
				if (i === 0) {
					canvasCtx.moveTo(x, y);
				} else {
					canvasCtx.lineTo(x, y);
				}
			}
		}
		canvasCtx.stroke();
	}

	function drawHandLandmarks(landmarks: NormalizedLandmark[]) {
		if (!landmarks || landmarks.length === 0) return;

		// Draw palm
		canvasCtx.fillStyle = '#FFFFFF';
		canvasCtx.strokeStyle = '#FFFFFF';
		canvasCtx.lineWidth = 2;

		// Ладонь (соединяем основные точки ладони)
		drawConnection(landmarks[0], landmarks[1]);
		drawConnection(landmarks[0], landmarks[5]);
		drawConnection(landmarks[0], landmarks[9]);
		drawConnection(landmarks[0], landmarks[13]);
		drawConnection(landmarks[0], landmarks[17]);
		drawConnection(landmarks[5], landmarks[9]);
		drawConnection(landmarks[9], landmarks[13]);
		drawConnection(landmarks[13], landmarks[17]);

		// Рисуем каждый палец своим цветом
		for (let finger = 0; finger < 5; finger++) {
			const startIdx = finger * 4 + 1;
			canvasCtx.strokeStyle = fingerColors[finger];
			canvasCtx.fillStyle = fingerColors[finger];

			// Соединяем суставы пальцев
			for (let i = startIdx; i < startIdx + 3; i++) {
				drawConnection(landmarks[i], landmarks[i + 1]);
			}

			// Соединяем палец с ладонью
			drawConnection(landmarks[startIdx], landmarks[0]);

			// Рисуем точки для каждого сустава
			for (let i = startIdx; i <= startIdx + 3; i++) {
				const x = landmarks[i].x * outputCanvas.width;
				const y = landmarks[i].y * outputCanvas.height;
				canvasCtx.beginPath();
				canvasCtx.arc(x, y, 3, 0, 2 * Math.PI);
				canvasCtx.fill();
			}
		}
	}

	function drawConnection(point1: NormalizedLandmark, point2: NormalizedLandmark) {
		const x1 = point1.x * outputCanvas.width;
		const y1 = point1.y * outputCanvas.height;
		const x2 = point2.x * outputCanvas.width;
		const y2 = point2.y * outputCanvas.height;

		canvasCtx.beginPath();
		canvasCtx.moveTo(x1, y1);
		canvasCtx.lineTo(x2, y2);
		canvasCtx.stroke();
	}
	onMount(async () => {
		canvasCtx = outputCanvas.getContext('2d')!;
		const vision = await FilesetResolver.forVisionTasks('/models');
		handLandmarker = await HandLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: '/models/hand_landmarker.task',
				delegate: 'GPU'
			},
			runningMode: 'VIDEO',
			numHands: 2,
			minHandDetectionConfidence: 0.5,
			minHandPresenceConfidence: 0.5,
			minTrackingConfidence: 0.5
		});

		poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: '/models/pose_detection.task',
				delegate: 'GPU'
			},
			runningMode: 'VIDEO',
			minPoseDetectionConfidence: 0.5,
			minPosePresenceConfidence: 0.5,
			minTrackingConfidence: 0.5
		});

		faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: '/models/face_model.task',
				delegate: 'GPU'
			},
			runningMode: 'VIDEO',
			outputFaceBlendshapes: true,
			numFaces: 1,
			minFaceDetectionConfidence: 0.5,
			minFacePresenceConfidence: 0.5,
			minTrackingConfidence: 0.5
		});

		// Get canvas context

		navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then(function (stream) {
				video.srcObject = stream;
				video.play();
				requestAnimationFrame(detectFrame);
			})
			.catch(function (err) {
				console.log('An error occurred: ' + err);
			});
	});

	onDestroy(() => {
		// Остановить видеопоток
		if (video && video.srcObject) {
			const stream = video.srcObject as MediaStream;
			const tracks = stream.getTracks();
			tracks.forEach((track) => track.stop());
			video.srcObject = null;
		}

		// Закрыть модели
		if (handLandmarker) {
			handLandmarker.close();
		}
		if (poseLandmarker) {
			poseLandmarker.close();
		}
		if (faceLandmarker) {
			faceLandmarker.close();
		}
	});

	async function detectFrame() {
		if (video.readyState < 2) {
			requestAnimationFrame(detectFrame);
			return;
		}
		const timestamp = video.currentTime * 1000;

		if (video.currentTime !== lastVideoTime) {
			lastVideoTime = video.currentTime;
			handRes = handLandmarker.detectForVideo(video, timestamp);
			poseRes = poseLandmarker.detectForVideo(video, timestamp);
			faceRes = faceLandmarker.detectForVideo(video, timestamp);
		}
		frame = {
			timestamp,
			face: faceRes?.faceLandmarks,
			hands: handRes?.landmarks,
			pose: poseRes?.landmarks
		};
		if (isRecording) {
			recordedFrames.push(frame);
		}

		requestAnimationFrame(detectFrame);
		render();
	}
</script>

<div class="video-box">
	<!-- svelte-ignore a11y_media_has_caption -->

	<div class="video-box__canvas">
		<canvas class="drawer__canvas" bind:this={outputCanvas} {width} {height}></canvas>
		<video style="display: none;" bind:this={video} {width} {height}>
			Video stream not available.
		</video>
		<div class="video-box__canvas-controls">
			<div>
				<button class="video-box__btn" onclick={() => (mode = 'video')}>Видео</button>
				<button class="video-box__btn" onclick={() => (mode = 'sceleton')}>Скелет</button>
				<button class="video-box__btn" onclick={() => (mode = 'overlay')}>Наложение</button>
			</div>
		</div>
	</div>
	<input
		class="video-box__input"
		type="text"
		bind:value={name}
		placeholder="Введите наименование жеста, чтобы начать запись"
	/>
	{#if name.length}
		{#if isRecording}
			<button class="video-box__btn btn_danger" onclick={stopRecording}>Стоп</button>
		{:else}
			<button class="video-box__btn btn_success" onclick={startRecording}>Старт</button>
		{/if}
	{/if}
</div>

<style>
	.video-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.video-box__canvas {
		position: relative;
		overflow: hidden;
		background: black;
		border-radius: 15px;
		border: 2px solid var(--color-primary);
	}

	.video-box__btn {
		border: none;
		background: var(--color-primary);
		color: white;
		padding: 10px;
		border-radius: 10px;
	}
	.video-box__canvas-controls {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px 30px;
		background: white;
	}
	.video-box__btn:hover {
		cursor: pointer;
	}

	.btn_danger {
		background: red;
	}
	.btn_success {
		background: green;
	}
	.video-box__input {
		border: 1px solid var(--color-primary);
		font-size: 18px;
		border-radius: 5px;
		padding: 5px;
		width: 100%;
	}
	.video-box__step {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 100px;
		gap: 10px;
	}
</style>
