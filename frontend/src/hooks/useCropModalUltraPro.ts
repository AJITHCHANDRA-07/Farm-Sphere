import { useState } from 'react';

interface Crop {
  id: number;
  crop_name: string;
  crop_type: string;
  district: string;
  section: string;
  duration_days: number;
  water_requirement: string;
  soil_type: string;
  yield_estimate: string;
  season: string;
  image_url?: string;
  demand_status?: string;
  climate_suitability?: string;
  risk_factors?: string;
  mitigation_strategies?: string;
}

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
