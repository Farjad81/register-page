const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'registrations.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// بارگذاری داده‌ها از فایل
function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    }
    return [];
}

// ذخیره داده‌ها به فایل
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// صفحه اصلی
app.get('/', (req, res) => {
    const registrations = loadData();
    res.render('index', { registrations });
});

// صفحه ثبت‌نام
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { name, email } = req.body;
    const registrations = loadData();
    registrations.push({ name, email });
    saveData(registrations);
    res.redirect('/');
});

// صفحه ویرایش
app.get('/edit/:index', (req, res) => {
    const index = req.params.index;
    const registrations = loadData();
    res.render('edit', { registration: registrations[index], index });
});

app.post('/edit/:index', (req, res) => {
    const index = req.params.index;
    const { name, email } = req.body;
    const registrations = loadData();
    registrations[index] = { name, email };
    saveData(registrations);
    res.redirect('/');
});

// حذف ثبت‌نام
app.get('/delete/:index', (req, res) => {
    const index = req.params.index;
    const registrations = loadData();
    registrations.splice(index, 1);
    saveData(registrations);
    res.redirect('/');
});

// اجرای سرور
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});