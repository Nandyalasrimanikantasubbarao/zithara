from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import clip
import torch
import pickle
import os

app = Flask(__name__)
CORS(app)

# Load model - updated to match the saved embedding dimensions
device = "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Load precomputed image embeddings
with open("image_embeddings.pkl", "rb") as f:
    image_embeddings = pickle.load(f)

# Rule-based chatbot logic
pattern_responses = {
    "help": "Sure! I can help you. You can ask me about our products, return policy, or even upload a jewelry image to find similar items.",
    "how are you": "I'm just a bot, but I'm always ready to help you find the perfect jewelry!",
    "bye": "Goodbye! Feel free to come back anytime if you need help.",
    "return policy": "Our return policy allows returns within 15 days of purchase with original packaging.",
    "find jewelry by image": "Please upload an image and I’ll try to find the most similar product we have!"
}

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message', '').lower().strip()
    reply = pattern_responses.get(message, "I'm not sure how to respond to that. Try asking for help or upload an image!")
    return jsonify({'reply': reply})

@app.route('/api/upload', methods=['POST'])
def upload():
    file = request.files['image']
    image = preprocess(Image.open(file)).unsqueeze(0).to(device)

    with torch.no_grad():
        query_embedding = model.encode_image(image).cpu().numpy()
        query_embedding = query_embedding / np.linalg.norm(query_embedding, axis=-1, keepdims=True) 


    embeddings = image_embeddings["embeddings"]
    routes = image_embeddings["routes"]         

    similarities = np.dot(embeddings, query_embedding.T).squeeze() 


    best_index = np.argmax(similarities)
    product_route = routes[best_index]

    return jsonify({'route': product_route, 'reply': 'Found a matching product! Click below to view it:'})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
