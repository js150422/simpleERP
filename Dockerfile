FROM python:3.10.1
WORKDIR /app
ADD . /app
RUN pip3 install -r requirements.txt
CMD [ "python3", "-m" , "app", "run", "--host=0.0.0.0"]