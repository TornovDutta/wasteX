import urllib.request, urllib.error, json
data = json.dumps({'model': 'meta-llama/Meta-Llama-3-8B-Instruct', 'messages': [{'role': 'user', 'content': 'hello'}]}).encode()
req = urllib.request.Request('https://router.huggingface.co/hf-inference/v1/chat/completions', data=data, headers={'Authorization': 'Bearer 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', 'Content-Type': 'application/json'}, method='POST')
try:
  res = urllib.request.urlopen(req)
  print(res.read())
except urllib.error.HTTPError as e:
  print(e.read())
