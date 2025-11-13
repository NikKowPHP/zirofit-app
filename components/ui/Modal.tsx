import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { Dialog } from 'tamagui';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  visible: boolean;
}

export function Modal({ children, onClose, title, visible }: ModalProps) {

  return (
    <Dialog modal open={visible} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
})
      