import requests
import os
from PIL import Image
from io import BytesIO
import torch
import clip
import pickle
import numpy as np

# Load the CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Fetch products from local API (ensure server is running at localhost:5000)
response = requests.get("http://localhost:5000/api/products")
products = response.json()["products"]

image_embeddings = {}

for product in products:
    try:
        image_url = product["image"]
        product_id = product["_id"]

        # Fetch and process image
        img_response = requests.get(image_url)
        image = Image.open(BytesIO(img_response.content)).convert("RGB")

        # Preprocess and encode
        image_input = preprocess(image).unsqueeze(0).to(device)
        with torch.no_grad():
            embedding = model.encode_image(image_input)
            embedding = embedding / embedding.norm(dim=-1, keepdim=True)
            image_embeddings[product_id] = embedding.cpu().numpy().squeeze()  # Remove singleton dimension

        print(f"✅ Processed: {product['name']}")

    except Exception as e:
        print(f"❌ Failed to process {product['name']} – {str(e)}")

# Save to pickle file
with open("image_embeddings.pkl", "wb") as f:
    pickle.dump({
        "embeddings": np.array([emb for emb in image_embeddings.values()]),  # Ensure (n, 512)
        "routes": [f"/product/{pid}" for pid in image_embeddings.keys()]     # routes
    }, f)

print("Done generating embeddings!")