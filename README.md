# Bed-Stuy Signs

Machine learning project for classifying storefront signs in Bed-Stuy, Brooklyn as "Old-school" or "New-school" using Google's Teachable Machine.

## Project Overview

This project uses a TensorFlow/Keras model trained in Google's Teachable Machine to classify storefront images. The model processes thousands of images in batch and generates predictions with confidence scores.

## Files Structure

```
bed-stuy-signs/
├── scripts/
│   ├── batch_predict.py          # Main script for batch predictions
│   └── preprocess_images.py      # Image preprocessing utilities
├── data/
│   ├── predictions_closed_fixed.csv      # Predictions for Closed folder
│   ├── predictions_new_fixed.csv         # Predictions for New folder
│   ├── predictions_combined_fixed.csv    # Combined predictions
│   ├── predictions_*_fixed.json         # JSON format predictions
│   └── BKCB3export(Closed_operating_only) with predictions_updated.csv  # Main dataset with predictions
├── models/
│   └── labels.txt                # Model class labels
└── README.md
```

## Setup

### Requirements

```bash
pip install tensorflow pillow numpy
```

### Model

The model files (`keras_model.h5` and `labels.txt`) should be placed in a directory accessible to the scripts. The model was trained using Google's Teachable Machine and exported in Keras format.

## Usage

### Batch Predictions

Process a folder of images:

```bash
python3 scripts/batch_predict.py <model_directory> <image_directory> -o output.json -b 32
```

Example:
```bash
python3 scripts/batch_predict.py ~/Desktop/converted_keras "Photo files/Closed" -o predictions_closed.json -b 32
```

### Image Preprocessing

The preprocessing script handles:
- EXIF orientation correction (matches Teachable Machine behavior)
- Resizing to 224x224 using BILINEAR interpolation
- Normalization to [-1, 1] range
- RGB conversion

## Results

The project includes predictions for:
- **Closed folder**: 1,699 images
- **New folder**: 1,110 images
- **Total**: 2,809 images

Predictions include:
- Predicted class (Old-school or New-school)
- Confidence score
- Class probabilities
- Source folder information

## Key Features

- **Batch processing**: Efficiently processes thousands of images
- **EXIF handling**: Correctly handles image orientation metadata
- **Teachable Machine compatibility**: Preprocessing matches the web interface behavior
- **CSV/JSON export**: Results available in multiple formats
- **Data merging**: Predictions can be merged with existing datasets

## Notes

- The preprocessing uses BILINEAR resizing and EXIF orientation correction to match Teachable Machine's web interface
- Model files are excluded from the repository due to size (use Git LFS if needed)
- Photo directories are excluded from the repository

## License

[Add your license here]

