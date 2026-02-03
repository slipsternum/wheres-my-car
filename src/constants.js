export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export const CAR_TYPES = ['suv', 'sedan', 'hatch', 'truck', 'sport'];

export const DEFAULT_CONFIG = {
    cars: [],
    floors: ['1', '2', '3'],
    sections: ['A', 'B'],
    gridColumns: 2,
    customIcons: {}
};
