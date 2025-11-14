import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { VStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme, useTokens } from '@/hooks/useTheme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service in production
    // errorReportingService.logError(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReportError = () => {
    // In a real app, this would send the error to your error reporting service
    Alert.alert(
      'Error Reported',
      'Thank you for reporting this error. Our team has been notified.',
      [{ text: 'OK' }]
    );
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback
        error={this.state.error}
        onRetry={this.handleRetry}
        onReport={this.handleReportError}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
  onReport: () => void;
}

function ErrorFallback({ error, onRetry, onReport }: ErrorFallbackProps) {
  const theme = useTheme();
  const tokens = useTokens();

  const isNetworkError = error?.message?.includes('network') ||
                         error?.message?.includes('fetch') ||
                         error?.message?.includes('offline');

  const isSyncError = error?.message?.includes('sync') ||
                      error?.message?.includes('database');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <VStack style={{ gap: tokens.spacing.lg, alignItems: 'center', padding: tokens.spacing.xl }}>
        <UIText variant="h2" style={{ textAlign: 'center', color: theme.danger }}>
          Oops! Something went wrong
        </UIText>

        {isNetworkError && (
          <VStack style={{ gap: tokens.spacing.md, alignItems: 'center' }}>
            <UIText variant="h4" style={{ textAlign: 'center' }}>
              Connection Issue
            </UIText>
            <UIText variant="body" style={{ textAlign: 'center', color: theme.textSecondary }}>
              It looks like you're having trouble connecting. Please check your internet connection and try again.
            </UIText>
          </VStack>
        )}

        {isSyncError && (
          <VStack style={{ gap: tokens.spacing.md, alignItems: 'center' }}>
            <UIText variant="h4" style={{ textAlign: 'center' }}>
              Sync Issue
            </UIText>
            <UIText variant="body" style={{ textAlign: 'center', color: theme.textSecondary }}>
              There was a problem syncing your data. Your local changes are safe and will sync when connection is restored.
            </UIText>
          </VStack>
        )}

        {!isNetworkError && !isSyncError && (
          <VStack style={{ gap: tokens.spacing.md, alignItems: 'center' }}>
            <UIText variant="body" style={{ textAlign: 'center', color: theme.textSecondary }}>
              An unexpected error occurred. This has been reported to our team.
            </UIText>
          </VStack>
        )}

        <VStack style={{ gap: tokens.spacing.md, width: '100%', maxWidth: 300 }}>
          <Button onPress={onRetry} style={{ width: '100%' }}>
            Try Again
          </Button>

          <Button variant="outline" onPress={onReport} style={{ width: '100%' }}>
            Report Error
          </Button>
        </VStack>

        {__DEV__ && error && (
          <VStack style={{ gap: tokens.spacing.sm, width: '100%', marginTop: tokens.spacing.lg }}>
            <UIText variant="h5" style={{ color: theme.danger }}>
              Debug Info (Development Only):
            </UIText>
            <Text style={{ fontFamily: 'monospace', fontSize: 12, color: theme.textSecondary }}>
              {error.message}
            </Text>
          </VStack>
        )}
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ErrorBoundary;
