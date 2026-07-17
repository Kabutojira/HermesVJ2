import type { Vector3Tuple } from 'three';

export interface SceneEnvironmentRequest {
  background?: string;
  fog?: false | { color: string; near: number; far: number };
  sky?: boolean;
  stars?: boolean;
  ground?: false | { color?: string; metalness?: number; roughness?: number };
}

export type LightingPreset = 'dream' | 'natural' | 'studio' | 'none';

export interface SceneLightingRequest {
  preset?: LightingPreset;
  shadows?: boolean;
  keyColor?: string;
  keyIntensity?: number;
  keyPosition?: Vector3Tuple;
}

export interface SceneControlsRequest {
  target?: Vector3Tuple;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}

export interface ScenePostRequest {
  bloom?: false | { threshold?: number; strength?: number; radius?: number };
  depthOfField?: false | { focus?: number; aperture?: number; maxBlur?: number };
}

export interface SceneRenderingRequest {
  environment?: SceneEnvironmentRequest;
  lighting?: SceneLightingRequest;
  controls?: SceneControlsRequest;
  post?: false | ScenePostRequest;
}
