import React from 'react';

export enum ModuleStep {
  Basics = 'basics',
  Height = 'height',
  Advanced = 'advanced'
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  component: React.FC<any>;
}

export interface TeacherMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ShapeData {
  id: number;
  type: 'parallelogram' | 'rectangle' | 'square' | 'trapezoid' | 'kite' | 'rhombus';
  x: number;
  y: number;
  rotation: number;
  color: string;
}