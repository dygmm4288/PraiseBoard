export const KeyboardController = {
  dismiss: jest.fn(),
  isVisible: jest.fn(() => false),
  state: jest.fn(() => ({ height: 0 })),
};

export const useKeyboardState = <T,>(selector: (state: {
  isVisible: boolean;
  height: number;
}) => T) => selector({ isVisible: false, height: 0 });
