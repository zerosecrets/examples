FROM gcr.io/datadoghq/agent:latest

RUN python -m pip install zero-sdk

COPY . .

CMD ["zero-entrypoint.py"]
ENTRYPOINT ["python"]
