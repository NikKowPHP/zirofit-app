import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

// Mock haptics
jest.mock('@/lib/haptics', () => ({
  triggerHaptic: jest.fn(),
}));

describe('<Button />', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button onPress={onPressMock}>Pressable</Button>);

    fireEvent.press(getByText('Pressable'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button onPress={onPressMock} disabled>Disabled</Button>);
    
    fireEvent.press(getByText('Disabled'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
      