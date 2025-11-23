#!/usr/bin/env python3
"""
Image preprocessing script for Teachable Machine models.
Resizes images to 224x224 and normalizes pixel values to [-1, 1].
"""

import os
import numpy as np
from PIL import Image, ImageOps
from pathlib import Path
import argparse


def preprocess_image(image_path, target_size=(224, 224)):
    """
    Preprocess a single image for Teachable Machine model.
    
    Args:
        image_path: Path to the image file
        target_size: Target size (width, height), default (224, 224)
    
    Returns:
        Preprocessed image array with shape (1, 224, 224, 3) and values in [-1, 1]
    """
    # Load image
    img = Image.open(image_path)
    
    # Auto-rotate based on EXIF orientation (matches Teachable Machine behavior)
    try:
        img = ImageOps.exif_transpose(img)
    except:
        pass  # If EXIF data not available, continue
    
    # Convert to RGB if necessary (handles RGBA, grayscale, etc.)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Resize to target size using BILINEAR (matches Teachable Machine web interface)
    img = img.resize(target_size, Image.Resampling.BILINEAR)
    
    # Convert to numpy array
    img_array = np.array(img, dtype=np.float32)
    
    # Normalize to [-1, 1] range
    # Original range is [0, 255], so: (pixel / 127.5) - 1.0
    img_array = img_array / 127.5 - 1.0
    
    # Add batch dimension: (1, 224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


def preprocess_batch(image_paths, target_size=(224, 224), batch_size=None):
    """
    Preprocess multiple images for batch processing.
    
    Args:
        image_paths: List of paths to image files
        target_size: Target size (width, height), default (224, 224)
        batch_size: Optional batch size for processing
    
    Returns:
        Preprocessed image array with shape (num_images, 224, 224, 3) and values in [-1, 1]
    """
    processed_images = []
    
    for img_path in image_paths:
        try:
            img_array = preprocess_image(img_path, target_size)
            # Remove batch dimension for stacking
            processed_images.append(img_array[0])
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
            continue
    
    if not processed_images:
        raise ValueError("No images were successfully processed")
    
    # Stack all images into a single array
    batch_array = np.stack(processed_images, axis=0)
    
    return batch_array


def process_directory(input_dir, output_dir=None, target_size=(224, 224)):
    """
    Process all images in a directory.
    
    Args:
        input_dir: Directory containing input images
        output_dir: Optional directory to save preprocessed images (as .npy files)
        target_size: Target size (width, height), default (224, 224)
    
    Returns:
        List of preprocessed image arrays
    """
    input_path = Path(input_dir)
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.webp'}
    
    # Find all image files
    image_paths = [
        str(p) for p in input_path.iterdir()
        if p.suffix.lower() in image_extensions
    ]
    
    if not image_paths:
        print(f"No image files found in {input_dir}")
        return []
    
    print(f"Found {len(image_paths)} images to process...")
    
    # Process images
    processed_images = []
    for i, img_path in enumerate(image_paths):
        try:
            img_array = preprocess_image(img_path, target_size)
            processed_images.append((img_path, img_array))
            
            if (i + 1) % 100 == 0:
                print(f"Processed {i + 1}/{len(image_paths)} images...")
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
            continue
    
    print(f"Successfully processed {len(processed_images)} images")
    
    # Save preprocessed images if output directory specified
    if output_dir:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        for img_path, img_array in processed_images:
            # Save as .npy file
            original_name = Path(img_path).stem
            output_file = output_path / f"{original_name}_preprocessed.npy"
            np.save(output_file, img_array)
        
        print(f"Saved preprocessed images to {output_dir}")
    
    return [img_array for _, img_array in processed_images]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Preprocess images for Teachable Machine models"
    )
    parser.add_argument(
        "input",
        help="Input image file or directory containing images"
    )
    parser.add_argument(
        "-o", "--output",
        help="Output directory for preprocessed images (optional)"
    )
    parser.add_argument(
        "-s", "--size",
        type=int,
        nargs=2,
        default=[224, 224],
        metavar=("WIDTH", "HEIGHT"),
        help="Target image size (default: 224 224)"
    )
    
    args = parser.parse_args()
    
    input_path = Path(args.input)
    
    if input_path.is_file():
        # Process single image
        print(f"Processing single image: {input_path}")
        preprocessed = preprocess_image(str(input_path), tuple(args.size))
        print(f"Preprocessed image shape: {preprocessed.shape}")
        print(f"Pixel value range: [{preprocessed.min():.2f}, {preprocessed.max():.2f}]")
        
        if args.output:
            output_path = Path(args.output)
            output_path.mkdir(parents=True, exist_ok=True)
            output_file = output_path / f"{input_path.stem}_preprocessed.npy"
            np.save(output_file, preprocessed)
            print(f"Saved to: {output_file}")
    
    elif input_path.is_dir():
        # Process directory
        print(f"Processing directory: {input_path}")
        processed = process_directory(
            str(input_path),
            args.output,
            tuple(args.size)
        )
        print(f"Total images processed: {len(processed)}")
    
    else:
        print(f"Error: {input_path} is not a valid file or directory")
        exit(1)

