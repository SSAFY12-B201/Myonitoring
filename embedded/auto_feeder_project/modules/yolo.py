import os
import json
import shutil
from inference_sdk import InferenceHTTPClient
from PIL import Image

def process_images_in_folder(folder_path, model_id="cat-eye-2mdft-8k8ts/2", clear_folder=True):
    """
    Process JPG images in a specified folder using Roboflow inference API,
    save eye crops to the eye_image folder, and optionally clear the input folder.
    
    Args:
        folder_path (str): Path to the folder containing images
        model_id (str): Roboflow model ID to use for inference
        clear_folder (bool): Whether to empty the input folder after processing
    """
    # Initialize Roboflow client
    FB_SERVICE_ACCOUNT_JSON = "myonitoring-firebase-adminsdk-fbsvc-78c9791370.json"
    FB_STORAGE_BUCKET = "myonitoring.firebasestorage.app"
    
    RF_API_KEY = "FKj8oc2PRytsIEz82Raw"
    RF_API_URL = "https://detect.roboflow.com"
    
    client = InferenceHTTPClient(
        api_url=RF_API_URL,
        api_key=RF_API_KEY
    )
    
    # Get all files in the folder
    files = os.listdir(folder_path)
    
    # Filter for JPG files only
    jpg_extensions = ['.jpg', '.jpeg']
    jpg_files = [f for f in files if os.path.splitext(f)[1].lower() in jpg_extensions]
    
    print(f"Found {len(jpg_files)} JPG images to process in {folder_path}")
    
    # Create eye_image folder if it doesn't exist
    eye_image_folder = os.path.join(folder_path, "eye_image")
    if not os.path.exists(eye_image_folder):
        os.makedirs(eye_image_folder)
        print(f"Created output directory: {eye_image_folder}")
    
    # Process each image
    for image_file in jpg_files:
        image_path = os.path.join(folder_path, image_file)
        try:
            # Perform inference
            result = client.infer(image_path, model_id=model_id)
            
            # Create output filename (same name but .json extension)
            base_name = os.path.splitext(image_file)[0]
            
            # Extract and save eye crops if eyes are detected
            if result and "predictions" in result and len(result["predictions"]) > 0:
                crop_and_save_eyes(image_path, result, eye_image_folder, base_name)
            
        except Exception as e:
            print(f"Error processing {image_file}: {str(e)}")
    
    # Empty the input folder if requested
    if clear_folder:
        # Make sure we don't delete the eye_image folder
        files_to_remove = [f for f in os.listdir(folder_path) 
                          if f != "eye_image" and os.path.isfile(os.path.join(folder_path, f))]
        
        for file_name in files_to_remove:
            file_path = os.path.join(folder_path, file_name)
            try:
                os.remove(file_path)
                print(f"Removed file: {file_path}")
            except Exception as e:
                print(f"Error removing file {file_path}: {str(e)}")
                
        print(f"Input folder {folder_path} has been emptied of all files.")
    
    print("Processing complete!")

def crop_and_save_eyes(image_path, result, eye_image_folder, base_name):
    """
    Crop the left and right eye regions from the image based on detection results.
    
    Args:
        image_path (str): Path to the original image
        result (dict): Detection results from Roboflow
        eye_image_folder (str): Folder to save cropped images
        base_name (str): Base filename for saving crops
    """
    try:
        # Open the original image
        img = Image.open(image_path)
        
        # Get image dimensions
        img_width = result["image"]["width"]
        img_height = result["image"]["height"]
        
        # Sort predictions by x-coordinate (left to right)
        eye_detections = [p for p in result["predictions"] if p["class"] == "eye"]
        eye_detections.sort(key=lambda x: x["x"])
        
        # Save crops if we have detections
        if len(eye_detections) >= 2:
            # Left eye (first in sorted list)
            left_eye = eye_detections[0]
            x1_left = max(0, int(left_eye["x"] - left_eye["width"] / 2))
            y1_left = max(0, int(left_eye["y"] - left_eye["height"] / 2))
            x2_left = min(img_width, int(left_eye["x"] + left_eye["width"] / 2))
            y2_left = min(img_height, int(left_eye["y"] + left_eye["height"] / 2))
            
            # Add some margin (20% of width/height)
            margin_w = int(left_eye["width"] * 0.1)
            margin_h = int(left_eye["height"] * 0.1)
            x1_left = max(0, x1_left - margin_w)
            y1_left = max(0, y1_left - margin_h)
            x2_left = min(img_width, x2_left + margin_w)
            y2_left = min(img_height, y2_left + margin_h)
            
            left_crop = img.crop((x1_left, y1_left, x2_left, y2_left))
            left_crop_path = os.path.join(eye_image_folder, f"{base_name}_left_eye.jpg")
            left_crop.save(left_crop_path)
            
            # Right eye (second in sorted list)
            right_eye = eye_detections[1]
            x1_right = max(0, int(right_eye["x"] - right_eye["width"] / 2))
            y1_right = max(0, int(right_eye["y"] - right_eye["height"] / 2))
            x2_right = min(img_width, int(right_eye["x"] + right_eye["width"] / 2))
            y2_right = min(img_height, int(right_eye["y"] + right_eye["height"] / 2))
            
            # Add some margin (20% of width/height)
            margin_w = int(right_eye["width"] * 0.2)
            margin_h = int(right_eye["height"] * 0.2)
            x1_right = max(0, x1_right - margin_w)
            y1_right = max(0, y1_right - margin_h)
            x2_right = min(img_width, x2_right + margin_w)
            y2_right = min(img_height, y2_right + margin_h)
            
            right_crop = img.crop((x1_right, y1_right, x2_right, y2_right))
            right_crop_path = os.path.join(eye_image_folder, f"{base_name}_right_eye.jpg")
            right_crop.save(right_crop_path)
            
            print(f"  Saved eye crops: {base_name}_left_eye.jpg, {base_name}_right_eye.jpg")
        
        elif len(eye_detections) == 1:
            # If only one eye is detected
            eye = eye_detections[0]
            eye_side = "left" if eye["x"] < img_width/2 else "right"
            
            x1 = max(0, int(eye["x"] - eye["width"] / 2))
            y1 = max(0, int(eye["y"] - eye["height"] / 2))
            x2 = min(img_width, int(eye["x"] + eye["width"] / 2))
            y2 = min(img_height, int(eye["y"] + eye["height"] / 2))
            
            # Add some margin (20% of width/height)
            margin_w = int(eye["width"] * 0.2)
            margin_h = int(eye["height"] * 0.2)
            x1 = max(0, x1 - margin_w)
            y1 = max(0, y1 - margin_h)
            x2 = min(img_width, x2 + margin_w)
            y2 = min(img_height, y2 + margin_h)
            
            eye_crop = img.crop((x1, y1, x2, y2))
            eye_crop_path = os.path.join(eye_image_folder, f"{base_name}_{eye_side}_eye.jpg")
            eye_crop.save(eye_crop_path)
            
            print(f"  Saved eye crop: {base_name}_{eye_side}_eye.jpg")
        
        else:
            print(f"  No eye detections found in {base_name}")
            
    except Exception as e:
        print(f"  Error cropping eyes from {base_name}: {str(e)}")

# If this module is run directly
if __name__ == "__main__":
    # Process images in the samples folder and empty it afterward
    process_images_in_folder("data/images", clear_folder=True)