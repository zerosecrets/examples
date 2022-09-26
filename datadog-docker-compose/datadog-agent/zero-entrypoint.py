import os
import sys
import requests
import json

if 'ZERO_TOKEN' not in os.environ:
    print('ZERO_TOKEN environment variable not set.')
    sys.exit(1)

query = """query {{ 
  secrets(zeroToken: \"{}\", pick: [\"datadog\"]) {{
    name 
    fields {{
      name
      value
    }}
  }}
}}""".format(os.environ['ZERO_TOKEN'])

r = requests.post(
    'https://core.tryzero.com/v1/graphql', 
    data=json.dumps({ 'query': query }), 
    headers={ 'Content-Type': 'application/json' }
)

# The response looks like this: {'data': {'secrets': [{'name': 'datadog', 'fields': [{'name': 'API_KEY', 'value': '...'}]}]}}
secrets = r.json()['data']['secrets']

if len(secrets) == 0:
    print('No secrets were returned.')
    sys.exit(1)

fields = secrets[0]['fields']
api_key = None

for field in fields:
    if field['name'] == 'API_KEY':
        api_key = field['value']
        break

if api_key is None:
    print('Could not find the API_KEY field.')
    sys.exit(1)


print('Successfully retrieved the Datadog API key from Zero.')

os.environ['DD_API_KEY'] = api_key
os.system('/bin/entrypoint.sh')