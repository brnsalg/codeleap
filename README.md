**backend**

source venv/bin/activate OR venv\Scripts\activate.bat

pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python manage.py runserver

**frontend**

cd codeleap/

npm install

npx expo start -c
