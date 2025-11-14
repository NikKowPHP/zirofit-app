import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '@/lib/supabase';

const ASSET_QUEUE_KEY = 'asset_upload_queue';

export interface QueuedAsset {
  id: string;
  fileUri: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadPath: string;
  metadata?: Record<string, any>;
  createdAt: number;
  retryCount: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

class AssetUploadQueue {
  private static instance: AssetUploadQueue;
  private queue: QueuedAsset[] = [];
  private isProcessing = false;
  private listeners: ((queue: QueuedAsset[]) => void)[] = [];

  static getInstance(): AssetUploadQueue {
    if (!AssetUploadQueue.instance) {
      AssetUploadQueue.instance = new AssetUploadQueue();
    }
    return AssetUploadQueue.instance;
  }

  private constructor() {
    this.loadQueue();
    this.setupNetworkListener();
  }

  // Add asset to upload queue
  async addAsset(asset: Omit<QueuedAsset, 'id' | 'createdAt' | 'retryCount' | 'status'>): Promise<string> {
    const queuedAsset: QueuedAsset = {
      ...asset,
      id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      retryCount: 0,
      status: 'pending',
    };

    this.queue.push(queuedAsset);
    await this.saveQueue();

    // Notify listeners
    this.notifyListeners();

    // Try to upload immediately if connected
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected) {
      this.processQueue();
    }

    return queuedAsset.id;
  }

  // Get current queue
  getQueue(): QueuedAsset[] {
    return [...this.queue];
  }

  // Get asset by ID
  getAsset(id: string): QueuedAsset | undefined {
    return this.queue.find(asset => asset.id === id);
  }

  // Remove completed asset from queue
  async removeAsset(id: string): Promise<void> {
    this.queue = this.queue.filter(asset => asset.id !== id);
    await this.saveQueue();
    this.notifyListeners();
  }

  // Retry failed uploads
  async retryAsset(id: string): Promise<void> {
    const asset = this.queue.find(a => a.id === id);
    if (asset && asset.status === 'failed') {
      asset.status = 'pending';
      asset.retryCount = 0;
      asset.error = undefined;
      await this.saveQueue();
      this.notifyListeners();
      this.processQueue();
    }
  }

  // Subscribe to queue changes
  subscribe(listener: (queue: QueuedAsset[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(ASSET_QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load asset queue:', error);
      this.queue = [];
    }
  }

  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(ASSET_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save asset queue:', error);
    }
  }

  private setupNetworkListener(): void {
    NetInfo.addEventListener(state => {
      if (state.isConnected && !this.isProcessing) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const pendingAssets = this.queue.filter(asset => asset.status === 'pending');

      for (const asset of pendingAssets) {
        if (asset.retryCount >= 3) {
          asset.status = 'failed';
          asset.error = 'Max retry attempts exceeded';
          continue;
        }

        asset.status = 'uploading';
        asset.retryCount++;
        this.notifyListeners();

        try {
          await this.uploadAsset(asset);
          asset.status = 'completed';
          // Keep completed assets for a short time before removing
          setTimeout(() => this.removeAsset(asset.id), 5000);
        } catch (error) {
          asset.status = 'failed';
          asset.error = error instanceof Error ? error.message : 'Upload failed';
        }

        await this.saveQueue();
        this.notifyListeners();
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async uploadAsset(asset: QueuedAsset): Promise<void> {
    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', {
      uri: asset.fileUri,
      name: asset.fileName,
      type: asset.mimeType,
    } as any);

    // Add metadata if provided
    if (asset.metadata) {
      Object.entries(asset.metadata).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
    }

    const { data, error } = await supabase.storage
      .from('assets')
      .upload(asset.uploadPath, formData, {
        contentType: asset.mimeType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Upload successful, no need to return data
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getQueue()));
  }

  // Cleanup old completed assets
  async cleanup(): Promise<void> {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const oldCompleted = this.queue.filter(
      asset => asset.status === 'completed' && asset.createdAt < oneHourAgo
    );

    for (const asset of oldCompleted) {
      await this.removeAsset(asset.id);
    }
  }
}

export const assetQueue = AssetUploadQueue.getInstance();
