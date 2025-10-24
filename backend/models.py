from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import UserMixin # <<< ۱. وارد کردن UserMixin
from werkzeug.security import generate_password_hash, check_password_hash # <<< ۲. وارد کردن ابزارهای هش

# این بخش بدون تغییر است
db = SQLAlchemy()

# <<< ۳. تعریف مدل (نقشه) جدول User >>>
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    # این تابع به ما کمک می‌کند که رمز عبور را به صورت امن ذخیره کنیم
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # این تابع به ما کمک می‌کند که در زمان ورود کاربر، رمز وارد شده را با رمز ذخیره شده مقایسه کنیم
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'


# جدول Persona بدون تغییر باقی می‌ماند
class Persona(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    artist_name = db.Column(db.String(100), nullable=False)
    artist_style = db.Column(db.String(200), nullable=True)
    artist_inspirations = db.Column(db.Text, nullable=True)
    generated_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Persona {self.id}: {self.artist_name}>'