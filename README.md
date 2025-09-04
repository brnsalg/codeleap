**backend**

_mac / linux_
source venv/bin/activate

_windows_
venv\Scripts\activate.bat


pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python manage.py runserver

**frontend**

cd codeleap/

npm install

npx expo start -c
