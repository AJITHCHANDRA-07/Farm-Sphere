import { useState } from 'react';
import { Crop } from '@/data/cropData';

export const useCropModal = () => {
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (crop: Crop) => {
    setSelectedCrop(crop);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCrop(null);
  };

  return {
    selectedCrop,
    isModalOpen,
    openModal,
    closeModal,
  };
};
