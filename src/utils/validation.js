/**
 * Validation utilities for item data
 */

const validateItem = (item) => {
  const errors = [];

  if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (item.name && item.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  if (item.description && typeof item.description !== 'string') {
    errors.push('Description must be a string');
  }

  if (item.description && item.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  if (item.price !== undefined) {
    if (typeof item.price !== 'number' || item.price < 0) {
      errors.push('Price must be a non-negative number');
    }
  }

  if (item.category && typeof item.category !== 'string') {
    errors.push('Category must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateUpdateItem = (item) => {
  const errors = [];
  const allowedFields = ['name', 'description', 'price', 'category'];

  const hasUpdates = Object.keys(item).some(key => allowedFields.includes(key));
  if (!hasUpdates) {
    errors.push('At least one valid field must be provided for update');
  }

  if (item.name !== undefined) {
    if (typeof item.name !== 'string' || item.name.trim().length === 0) {
      errors.push('Name must be a non-empty string');
    }
    if (item.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }
  }

  if (item.description !== undefined && typeof item.description !== 'string') {
    errors.push('Description must be a string');
  }

  if (item.description !== undefined && item.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  if (item.price !== undefined) {
    if (typeof item.price !== 'number' || item.price < 0) {
      errors.push('Price must be a non-negative number');
    }
  }

  if (item.category !== undefined && typeof item.category !== 'string') {
    errors.push('Category must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateItem,
  validateUpdateItem
};

