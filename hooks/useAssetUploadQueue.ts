import { useState, useEffect } from 'react';
import { assetQueue, QueuedAsset } from '@/lib/services/assetUploadQueue';

export function useAssetUploadQueue() {
  const [queue, setQueue] = useState<QueuedAsset[]>([]);

  useEffect(() => {
    // Get initial queue
    setQueue(assetQueue.getQueue());

    // Subscribe to changes
    const unsubscribe = assetQueue.subscribe((newQueue) => {
      setQueue(newQueue);
    });

    return unsubscribe;
  }, []);

  const addAsset = async (asset: Omit<QueuedAsset, 'id' | 'createdAt' | 'retryCount' | 'status'>) => {
    return await assetQueue.addAsset(asset);
  };

  const retryAsset = async (id: string) => {
    await assetQueue.retryAsset(id);
  };

  const removeAsset = async (id: string) => {
    await assetQueue.removeAsset(id);
  };

  const getAsset = (id: string) => {
    return assetQueue.getAsset(id);
  };

  return {
    queue,
    addAsset,
    retryAsset,
    removeAsset,
    getAsset,
  };
}
