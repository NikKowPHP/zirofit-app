import React from 'react';
import { Modal as RNModal, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme, useTokens } from '@/hooks/useTheme';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  visible: boolean;
}

export function Modal({ children, onClose, title, visible }: ModalProps) {
  const theme = useTheme();
  const tokens = useTokens();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose}>
        <View
          style={[styles.modalContent, { backgroundColor: theme.background }]}
          onStartShouldSetResponder={() => true} // Prevent closing when tapping content
        >
          {title && <Text style={[styles.title, { color: theme.text }]}>{title}</Text>}
          <ScrollView style={styles.scrollView}>
            {children}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
});
      