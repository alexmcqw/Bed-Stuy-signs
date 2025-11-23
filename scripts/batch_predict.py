#!/usr/bin/env python3
"""
Batch prediction script for Teachable Machine models.
Processes thousands of images using a downloaded Teachable Machine model.
"""

import os
import numpy as np
from pathlib import Path
from tensorflow.keras.models import load_model
from preprocess_images import preprocess_batch
import argparse
import json
import csv


def detect_model_format(model_dir):
    """
    Detect which format the model is in.
    
    Returns:
        'keras' if keras_model.h5 exists
        'tfjs' if model.json exists
        None if neither format is detected
    """
    model_dir = Path(model_dir)
    
    if (model_dir / "keras_model.h5").exists():
        return 'keras'
    elif (model_dir / "model.json").exists():
        return 'tfjs'
    else:
        return None


def extract_labels_from_metadata(metadata_path):
    """Extract class labels from metadata.json."""
    try:
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        # Try different possible locations for labels
        if 'labels' in metadata:
            return metadata['labels']
        if 'classNames' in metadata:
            return metadata['classNames']
        if 'tfjsVersion' in metadata and 'labels' in metadata:
            return metadata['labels']
        
        return None
    except Exception as e:
        print(f"Warning: Could not read metadata.json: {e}")
        return None


def load_teachable_machine_model(model_dir):
    """
    Load a Teachable Machine model.
    Supports both Keras format (keras_model.h5) and TensorFlow.js format (model.json).
    
    Args:
        model_dir: Directory containing model files
    
    Returns:
        model: Loaded Keras model
        labels: List of class labels
    """
    model_dir = Path(model_dir)
    format_type = detect_model_format(model_dir)
    
    if format_type == 'keras':
        # Load Keras format
        model_path = model_dir / "keras_model.h5"
        labels_path = model_dir / "labels.txt"
        
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        print(f"Loading Keras model from {model_path}...")
        try:
            # Try loading with safe_mode=False for compatibility
            model = load_model(str(model_path), compile=False, safe_mode=False)
        except Exception as e:
            # Handle compatibility issues with Keras 3.x
            print(f"Warning: Standard load failed, trying compatibility fix...")
            try:
                from tensorflow.keras.layers import DepthwiseConv2D
                
                # Create a wrapper class that filters out 'groups' parameter
                class CompatibleDepthwiseConv2D(DepthwiseConv2D):
                    @classmethod
                    def from_config(cls, config):
                        # Remove 'groups' if present (causes issues in some Keras versions)
                        if isinstance(config, dict):
                            config = dict(config)
                            config.pop('groups', None)
                        return super().from_config(config)
                
                # Try loading with custom objects
                custom_objects = {'DepthwiseConv2D': CompatibleDepthwiseConv2D}
                model = load_model(str(model_path), compile=False, custom_objects=custom_objects, safe_mode=False)
            except Exception as e2:
                # Last resort: try loading with safe_mode=False only
                print(f"Trying final fallback method...")
                model = load_model(str(model_path), compile=False, safe_mode=False)
        
        # Load labels
        if labels_path.exists():
            with open(labels_path, 'r') as f:
                labels = [line.strip() for line in f.readlines()]
        else:
            raise FileNotFoundError(f"Labels file not found: {labels_path}")
    
    elif format_type == 'tfjs':
        # TensorFlow.js format detected
        print("⚠ TensorFlow.js format detected (model.json, weights.bin)")
        print("  This format needs to be converted to Keras format first.")
        print("\n  To convert, run:")
        print(f"    python3 convert_model.py {model_dir}")
        print("\n  Or install tensorflowjs and convert manually:")
        print("    pip3 install tensorflowjs")
        print(f"    tensorflowjs_converter --input_format=tfjs_layers_model --output_format=keras {model_dir}/model.json {model_dir}/keras_model.h5")
        
        # Try to extract labels from metadata.json for helpful error message
        metadata_path = model_dir / "metadata.json"
        if metadata_path.exists():
            labels = extract_labels_from_metadata(metadata_path)
            if labels:
                print(f"\n  Found {len(labels)} classes in metadata.json: {', '.join(labels)}")
                print("  After conversion, labels will be saved to labels.txt")
        
        raise ValueError("TensorFlow.js format detected. Please convert to Keras format first using convert_model.py")
    
    else:
        raise FileNotFoundError(
            f"Could not detect model format in {model_dir}.\n"
            f"Expected either:\n"
            f"  - Keras format: keras_model.h5 and labels.txt\n"
            f"  - TensorFlow.js format: model.json, weights.bin, and metadata.json"
        )
    
    print(f"Model loaded successfully with {len(labels)} classes")
    print(f"Classes: {', '.join(labels)}")
    
    return model, labels


def predict_batch(model, image_paths, labels, batch_size=32):
    """
    Run predictions on a batch of images.
    
    Args:
        model: Loaded Keras model
        image_paths: List of paths to image files
        labels: List of class labels
        batch_size: Batch size for processing
    
    Returns:
        List of predictions, each containing (image_path, predicted_class, confidence, all_probabilities)
    """
    print(f"Processing {len(image_paths)} images...")
    
    # Preprocess all images
    print("Preprocessing images...")
    images = preprocess_batch(image_paths)
    
    # Run predictions in batches
    print("Running predictions...")
    predictions = model.predict(images, batch_size=batch_size, verbose=1)
    
    # Process results
    results = []
    for i, (img_path, pred) in enumerate(zip(image_paths, predictions)):
        # Get predicted class index
        predicted_idx = np.argmax(pred)
        confidence = float(pred[predicted_idx])
        predicted_class = labels[predicted_idx]
        
        # Get all probabilities
        all_probs = {labels[j]: float(prob) for j, prob in enumerate(pred)}
        
        results.append({
            'image_path': img_path,
            'predicted_class': predicted_class,
            'confidence': confidence,
            'all_probabilities': all_probs
        })
        
        if (i + 1) % 100 == 0:
            print(f"Processed {i + 1}/{len(image_paths)} images...")
    
    return results


def save_results(results, output_file, format='json'):
    """
    Save prediction results to a file.
    
    Args:
        results: List of prediction results
        output_file: Output file path
        format: 'json' or 'csv'
    """
    output_path = Path(output_file)
    
    if format == 'json':
        # Save as JSON
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"Results saved to {output_path} (JSON format)")
    
    elif format == 'csv':
        # Save as CSV
        with open(output_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Image Path', 'Predicted Class', 'Confidence'])
            for result in results:
                writer.writerow([
                    result['image_path'],
                    result['predicted_class'],
                    f"{result['confidence']:.4f}"
                ])
        print(f"Results saved to {output_path} (CSV format)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Run batch predictions on images using a Teachable Machine model"
    )
    parser.add_argument(
        "model_dir",
        help="Directory containing keras_model.h5 and labels.txt"
    )
    parser.add_argument(
        "image_dir",
        help="Directory containing images to process"
    )
    parser.add_argument(
        "-o", "--output",
        default="predictions.json",
        help="Output file for results (default: predictions.json)"
    )
    parser.add_argument(
        "-b", "--batch-size",
        type=int,
        default=32,
        help="Batch size for processing (default: 32)"
    )
    parser.add_argument(
        "-f", "--format",
        choices=['json', 'csv'],
        default='json',
        help="Output format: json or csv (default: json)"
    )
    
    args = parser.parse_args()
    
    # Load model
    model, labels = load_teachable_machine_model(args.model_dir)
    
    # Find all images
    image_dir = Path(args.image_dir)
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.webp'}
    image_paths = [
        str(p) for p in image_dir.iterdir()
        if p.suffix.lower() in image_extensions
    ]
    
    if not image_paths:
        print(f"No image files found in {args.image_dir}")
        exit(1)
    
    print(f"Found {len(image_paths)} images to process")
    
    # Run predictions
    results = predict_batch(model, image_paths, labels, args.batch_size)
    
    # Save results
    save_results(results, args.output, args.format)
    
    # Print summary
    print("\n" + "="*50)
    print("SUMMARY")
    print("="*50)
    print(f"Total images processed: {len(results)}")
    
    # Count predictions by class
    class_counts = {}
    for result in results:
        cls = result['predicted_class']
        class_counts[cls] = class_counts.get(cls, 0) + 1
    
    print("\nPredictions by class:")
    for cls, count in sorted(class_counts.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / len(results)) * 100
        print(f"  {cls}: {count} ({percentage:.1f}%)")

