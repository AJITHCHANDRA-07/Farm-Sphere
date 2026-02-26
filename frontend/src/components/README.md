# Interactive Crop Exploration System

## Overview
This system provides a comprehensive interactive crop exploration experience with sliding transitions, detailed crop modals, and ROI calculators.

## Components

### 1. CropInsightsSection.tsx
Main interactive component with sliding panels and animations.

### 2. CropDetailModal.tsx
Detailed modal with cultivation guides and ROI calculator.

### 3. ROICalculator.tsx
ROI calculator component for detailed financial analysis.

### 4. useCropModal.ts
Custom hook for managing modal state.

## Features

- **Interactive Panels**: Three distinct panels with sliding transitions
- **Detailed Crop Data**: Comprehensive crop information with cultivation guides
- **ROI Calculator**: Financial analysis tool for crop profitability
- **Responsive Design**: Mobile-friendly interface
- **Smooth Animations**: CSS transitions and animations

## Usage

```tsx
import { CropInsightsSection } from '@/components/CropInsightsSection';
```

## Data Structure

All crop data is stored in `src/data/cropData.ts` with comprehensive information including:
- Cultivation steps
- Seasonal information
- Pest management
- Harvest timeline
- Market prices
- Investment costs
- Expected yields

## Integration

The system integrates seamlessly with the existing codebase and provides a complete interactive experience.
