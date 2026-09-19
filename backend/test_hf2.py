from huggingface_hub import InferenceClient
client = InferenceClient(api_key="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")
try:
  res = client.chat_completion(messages=[{"role": "user", "content": "hello"}], model="meta-llama/Llama-3.2-1B-Instruct")
  print(res)
except Exception as e:
  print(e)
