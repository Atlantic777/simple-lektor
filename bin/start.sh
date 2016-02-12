sudo apt-get update
sudo apt-get install `cat dependencies.txt` -y
sudo pip install -r requirements.txt
python backend.py
