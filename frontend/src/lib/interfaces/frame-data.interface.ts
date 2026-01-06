import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface FrameData {
	timestamp: number;
	pose?: NormalizedLandmark[][];
	hands?: NormalizedLandmark[][];
	face?: NormalizedLandmark[][];
}
