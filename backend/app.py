import os
from flask import Flask, request, jsonify, render_template, url_for, flash, redirect # render_template اضافه شد
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import sys
import traceback
from models import db, Persona, User
from forms import RegistrationForm, LoginForm
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import desc

load_dotenv()

# --- مسیرهای مطلق ---
basedir = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(basedir, 'instance')
if not os.path.exists(instance_path):
    os.makedirs(instance_path)
# --- ۱. مسیر پوشه‌های templates و static را دقیق مشخص می‌کنیم ---
template_folder_path = os.path.abspath(os.path.join(basedir, os.pardir, 'templates'))
static_folder_path = os.path.abspath(os.path.join(basedir, os.pardir)) # پوشه اصلی پروژه حاوی style.css و script.js

# --- ۲. Flask را با مسیرهای صحیح پیکربندی می‌کنیم ---
app = Flask(__name__,
            template_folder=template_folder_path,
            static_folder=static_folder_path,
            static_url_path='/static') # فایل‌های استاتیک در آدرس /static در دسترس خواهند بود

CORS(app)

# --- کلید مخفی و تنظیمات دیتابیس (بدون تغییر) ---
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-unsafe-key')
# ... (هشدار کلید مخفی) ...
db_path = os.path.join(instance_path, 'database.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# --- پیکربندی Flask-Login (بدون تغییر) ---
login_manager = LoginManager(app)
# ... (تنظیمات login_manager) ...
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- پیکربندی OpenAI (بدون تغییر) ---
openai_api_key = os.getenv("OPENAI_API_KEY")
# ... (ساخت client OpenAI با مدیریت خطا) ...
client = None # Initialize client to None
if openai_api_key:
    try:
        client = OpenAI(api_key=openai_api_key)
        print("OpenAI client initialized.", file=sys.stderr); sys.stderr.flush()
    except Exception as e:
        print(f"ERROR: Failed to initialize OpenAI client: {e}", file=sys.stderr); sys.stderr.flush()
else:
     print("ERROR: OPENAI_API_KEY not found.", file=sys.stderr); sys.stderr.flush()


# ============================================
# --- مسیرهای احراز هویت (بدون تغییر) ---
# ============================================
@app.route("/register", methods=['GET', 'POST'])
def register():
    # ... (کد register بدون تغییر) ...
    if current_user.is_authenticated: return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        try:
            hashed_password = generate_password_hash(form.password.data)
            user = User(username=form.username.data, email=form.email.data, password_hash=hashed_password)
            db.session.add(user); db.session.commit()
            flash('حساب شما با موفقیت ایجاد شد!', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback(); flash(f'خطا در ایجاد حساب.', 'danger')
            print(f"ERROR reg commit: {e}", file=sys.stderr); traceback.print_exc(file=sys.stderr); sys.stderr.flush()
    return render_template('register.html', title='Register', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    # ... (کد login بدون تغییر) ...
    if current_user.is_authenticated: return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            flash('ورود موفقیت‌آمیز بود!', 'success')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('ورود ناموفق. ایمیل یا رمز عبور اشتباه است.', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route("/logout")
def logout():
    # ... (کد logout بدون تغییر) ...
    logout_user(); flash('شما با موفقیت خارج شدید.', 'info')
    return redirect(url_for('login'))

# ============================================
# --- مسیرهای اصلی برنامه ---
# ============================================
@app.route("/")
@app.route("/home")
@login_required
def home():
     # --- ۳. هدایت به مسیر جدید ایجاد پرسونا ---
     return redirect(url_for('persona_creator_page'))

# مسیر جدید تاریخچه (بدون تغییر)
@app.route("/history")
@login_required
def history():
    all_personas = Persona.query.order_by(desc(Persona.created_at)).all()
    return render_template('history.html', title='History', personas=all_personas)

# --- ۴. مسیر نمایش صفحه ساخت پرسونا با استفاده از Template ---
@app.route("/create")
@login_required
def persona_creator_page():
    # حالا قالب جدید را رندر می‌کنیم
    return render_template('create_persona.html', title='Create Persona')


# مسیر API جنریت پرسونا (بدون تغییر اصلی)
@app.route("/generate-persona", methods=['POST'])
def generate_persona():
    # ... (کد جنریت و ذخیره بدون تغییر) ...
    # ... (همان کد قبلی) ...
    print("--- Request Received for /generate-persona ---", file=sys.stderr); sys.stderr.flush()
    data = request.get_json();
    if not data: return jsonify({"error": "Invalid JSON data"}), 400
    artist_name = data.get('name'); artist_style = data.get('style'); artist_inspirations = data.get('inspirations')
    print(f"Data received: Name={artist_name}, Style={artist_style}", file=sys.stderr); sys.stderr.flush()
    if not artist_name or not artist_style or not artist_inspirations:
         return jsonify({"error": "Missing required fields"}), 400
    generated_text = None
    if client is None: return jsonify({'error': 'AI service not configured.'}), 503
    prompt_messages = [
        {"role": "system", "content": "You are a professional brand strategist..."},
        {"role": "user", "content": f"Artist's Name: {artist_name}\nStyle/Genre: {artist_style}\nInspirations: {artist_inspirations}"}
    ]
    try:
        print("Attempting OpenAI API call...", file=sys.stderr); sys.stderr.flush()
        response = client.chat.completions.create(model="gpt-3.5-turbo", messages=prompt_messages, max_tokens=200)
        generated_text = response.choices[0].message.content.strip()
        print("--- OpenAI Call Successful ---", file=sys.stderr); sys.stderr.flush()
        try:
            new_persona = Persona(artist_name=artist_name, artist_style=artist_style, artist_inspirations=artist_inspirations, generated_text=generated_text)
            db.session.add(new_persona); db.session.commit()
            print("--- Persona Saved to Database ---", file=sys.stderr); sys.stderr.flush()
        except Exception as db_e:
            db.session.rollback()
            print(f"!!! ERROR Saving Persona to DB: {db_e} !!!", file=sys.stderr); traceback.print_exc(file=sys.stderr); sys.stderr.flush()
            generated_text += "\n\n(Warning: Could not save persona history)"
    except Exception as api_e:
        print(f"!!! ERROR During OpenAI Call: {api_e} !!!", file=sys.stderr); traceback.print_exc(file=sys.stderr); sys.stderr.flush()
        return jsonify({'error': f"Failed to generate persona via AI. Details: {api_e}"}), 502
    print("--- Sending Response ---", file=sys.stderr); sys.stderr.flush()
    if generated_text is None: return jsonify({'error': 'Unexpected backend error.'}), 500
    return jsonify({'persona_text': generated_text})


# مسیر تست (بدون تغییر)
@app.route("/test")
def test_route():
    # ... (کد تست بدون تغییر) ...
    print("--- /test Route Reached ---", file=sys.stderr); sys.stderr.flush()
    return "Test route is working!"


# بخش اصلی اجرا (بدون تغییر)
if __name__ == "__main__":
    with app.app_context():
        # ... (ساخت جداول) ...
        print("Ensuring database tables exist...", file=sys.stderr); sys.stderr.flush()
        try: db.create_all(); print("Database tables checked/created.", file=sys.stderr)
        except Exception as db_init_e: print(f"!!! ERROR during initial db.create_all(): {db_init_e} !!!", file=sys.stderr); traceback.print_exc(file=sys.stderr)
        sys.stderr.flush()
    print("Starting Flask server...", file=sys.stderr); sys.stderr.flush()
    app.run(debug=False)