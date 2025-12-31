// Enum for training levels
export enum TrainingLevel {
	Beginner = 'beginner',
	Intermediate = 'intermediate',
	Advanced = 'advanced',
	Professional = 'professional',
}

// Mapping for type-safe access
export const levelConfigs: Record<TrainingLevel, LevelConfig> = {
	[TrainingLevel.Beginner]: beginnerConfig,
	[TrainingLevel.Intermediate]: intermediateConfig,
	[TrainingLevel.Advanced]: advancedConfig,
	[TrainingLevel.Professional]: professionalConfig,
};
// Professional level configuration
export const professionalConfig: LevelConfig = {
	evalBar: false,
	arrows: false,
	explanations: false,
	undo: false,
	engineDepth: 22,
};
// Advanced level configuration
export const advancedConfig: LevelConfig = {
	evalBar: true,
	arrows: false,
	explanations: false,
	undo: false,
	engineDepth: 14,
};
// Intermediate level configuration
export const intermediateConfig: LevelConfig = {
	evalBar: true,
	arrows: true,
	explanations: true,
	undo: false,
	engineDepth: 8,
};
// TypeScript type for level configuration
export type LevelConfig = {
	evalBar: boolean;
	arrows: boolean;
	explanations: boolean;
	undo: boolean;
	engineDepth: number;
};

// Beginner level configuration
export const beginnerConfig: LevelConfig = {
	evalBar: true,
	arrows: true,
	explanations: true,
	undo: true,
	engineDepth: 4,
};
