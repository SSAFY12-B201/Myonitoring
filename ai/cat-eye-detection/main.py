import os

from inference_sdk import InferenceHTTPClient

# initialize the client
CLIENT = InferenceHTTPClient(
    api_url=os.environ.get('RF_API_URL'),
    api_key=os.environ.get('RF_API_KEY')
)

# infer on a local image
result = CLIENT.infer("../samples/1.jpg", model_id="cat-eye-2mdft-8k8ts/2")
print(result)