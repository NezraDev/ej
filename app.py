from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message



app = Flask(__name__)
app.secret_key = 'your_secret_key'

# 🔧 Flask-Mail Configuration
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME='ejdelosreyes36@gmail.com',
    MAIL_PASSWORD='kqzc ujro etsz ohei',  # Gmail app password
    MAIL_DEFAULT_SENDER='ejdelosreyes36@gmail.com'
)

mail = Mail(app)

@app.route('/')
def index():
    projects = [
        {"title": "Portfolio Website", "desc": "This personal website built using Flask, HTML, and CSS."}
    ]
    return render_template('index.html', projects=projects)


@app.route('/submit', methods=['POST'])
def submit():
    """AJAX contact form submission endpoint"""
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    message = request.form.get('message', '').strip()

    # Validate inputs
    if not name or not email or not message:
        return jsonify({
            "status": "error",
            "message": "⚠️ Please fill out all fields before submitting."
        }), 400

    # Save message locally
    with open('messages.txt', 'a', encoding='utf-8') as f:
        f.write(f"Name: {name}\nEmail: {email}\nMessage: {message}\n{'-'*40}\n")

    # Try sending the email
    try:
        msg = Message(
            subject=f"New message from {name}",
            sender=email,
            recipients=[app.config['MAIL_USERNAME']],
            body=f"""
You received a new message from your portfolio contact form:
-----------------------------------------------------
Name: {name}
Email: {email}
Message: {message}
"""
        )
        mail.send(msg)
        return jsonify({
            "status": "success",
            "message": "✅ Your message was sent successfully!"
        }), 200

    except Exception as e:
        print("❌ Email send failed:", e)
        return jsonify({
            "status": "error",
            "message": "⚠️ Message saved but failed to send email."
        }), 500


if __name__ == '__main__':
    app.run(debug=True)
