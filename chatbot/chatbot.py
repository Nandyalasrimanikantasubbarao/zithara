# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from PIL import Image
# import numpy as np
# import clip
# import torch
# import pickle

# app = Flask(__name__)
# CORS(app)

# # Load model
# device = "cpu"
# model, preprocess = clip.load("RN50", device=device)


# # Load precomputed image embeddings
# with open("image_embeddings.pkl", "rb") as f:
#     image_embeddings = pickle.load(f)

# # Rule-based chatbot logic
# pattern_responses = {
#     "help": "Sure! I can help you. You can ask me about our products, return policy, or even upload a jewelry image to find similar items.",
#     "how are you": "I'm just a bot, but I'm always ready to help you find the perfect jewelry!",
#     "bye": "Goodbye! Feel free to come back anytime if you need help.",
#     "return policy": "Our return policy allows returns within 15 days of purchase with original packaging.",
#     "find jewelry by image": "Please upload an image and I’ll try to find the most similar product we have!"
# }

# @app.route('/api/chat', methods=['POST'])
# def chat():
#     data = request.get_json()
#     message = data.get('message', '').lower().strip()

#     reply = pattern_responses.get(message, "I'm not sure how to respond to that. Try asking for help or upload an image!")

#     return jsonify({'reply': reply})

# @app.route('/api/upload', methods=['POST'])
# def upload():
#     file = request.files['image']
#     image = preprocess(Image.open(file)).unsqueeze(0).to(device)

#     with torch.no_grad():
#         query_embedding = model.encode_image(image).cpu().numpy()

#     similarities = {
#         pid: np.dot(query_embedding, emb.T)[0][0]
#         for pid, emb in image_embeddings.items()
#     }

#     best_match = max(similarities, key=similarities.get)
#     product_route = f"/product/{best_match}"

#     return jsonify({'route': product_route, 'reply': 'Found a matching product! Click below to view it:'})

# if __name__ == "__main__":
#     app.run(port=5001)

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import pickle
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Load precomputed embeddings
with open("image_embeddings.pkl", "rb") as f:
    data = pickle.load(f)
    image_embeddings = data["embeddings"]  # shape: (n, 512)
    routes = data["routes"]                # list of routes (e.g., "/product/123")

pattern_responses = {
    "help": "Sure! I can help you. Ask about products, return policy, or upload jewelry image!",
    "return policy": "You can return items within 15 days with original packaging.",
    "bye": "Goodbye! Feel free to come back anytime!",
}

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "").lower().strip()
    reply = pattern_responses.get(message, "Try asking for help or upload an image!")
    return jsonify({"reply": reply})

@app.route("/api/upload", methods=["POST"])
def upload():
    from clip import load 
    import torch

    file = request.files["image"]
    image = Image.open(file).convert("RGB")

    device = "cpu"
    model, preprocess = load("ViT-B/32", device=device)

    image_input = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        image_features = model.encode_image(image_input).cpu().numpy()

    similarity = cosine_similarity(image_features, image_embeddings)
    best_match_idx = np.argmax(similarity)
    best_route = routes[best_match_idx]

    return jsonify({"reply": "Found a matching product!", "route": best_route})

import pickle
import numpy as np

with open("image_embeddings.pkl", "rb") as f:
    data = pickle.load(f)
    image_embeddings = data["embeddings"]
    routes = data["routes"]
    print(f"image_embeddings shape: {image_embeddings.shape}")

# with open("uploaded_embedding.pkl", "rb") as f:
#     uploaded_embedding = pickle.load(f)
#     print(f"uploaded_embedding shape: {uploaded_embedding.shape}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
