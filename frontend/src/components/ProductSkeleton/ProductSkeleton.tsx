import React from 'react';
import {
  Card,
  CardContent,
  Skeleton,
  Box,
} from '@mui/material';

const ProductSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
      }}
    >
      {/* Image Skeleton */}
      <Skeleton
        variant="rectangular"
        height={220}
        sx={{ borderRadius: '12px 12px 0 0' }}
      />
      
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Brand */}
        <Skeleton variant="text" width="40%" height={16} sx={{ mb: 0.5 }} />
        
        {/* Product Name */}
        <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
        
        {/* Description */}
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="85%" height={16} sx={{ mb: 1.5 }} />
        
        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Skeleton variant="rectangular" width={80} height={16} sx={{ mr: 1 }} />
          <Skeleton variant="text" width={40} height={16} />
        </Box>
        
        {/* Price and Stock */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Skeleton variant="text" width={60} height={24} />
            <Skeleton variant="text" width={40} height={14} />
          </Box>
          <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 1 }} />
        </Box>
        
        {/* Button */}
        <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 2 }} />
      </CardContent>
    </Card>
  );
};

export default ProductSkeleton;
