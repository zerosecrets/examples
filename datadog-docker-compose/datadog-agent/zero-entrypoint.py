import os
import sys
from zero_sdk import zero

if 'ZERO_TOKEN' not in os.environ:
    print('ZERO_TOKEN environment variable not set.')
    sys.exit(1)

secrets = zero(token=ZERO_TOKEN, pick=['datadog']).fetch()

if 'datadog' not in secrets:
    print('datadog secret not found.')
    sys.exit(1)

if 'API_KEY' not in secrets['datadog']:
    print('API_KEY field not found.')
    sys.exit(1)

api_key = secrets['datadog']['API_KEY']

if len(api_key) == 0:
    print('API_KEY field is empty.')
    sys.exit(1)

os.environ['DD_API_KEY'] = api_key
os.system('/bin/entrypoint.sh')
