// Supabase aur Cloudinary configuration
const SUPABASE_URL = 'https://vkdaoktigzyhtdxvidqn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZGFva3RpZ3p5aHRkeHZpZHFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0Njc2MzEsImV4cCI6MjA2MjA0MzYzMX0.dq9mqg6nbPEl6pxZ40EnbBq4tzZ067CA7MCROOJ-1Ew';
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dcpq6y4zd/image/upload';
const CLOUDINARY_PRESET = 'journal_photos';

async function addJournal() {
    const text = document.getElementById('journal-text').value;
    if (!text) return alert('Please write something in the journal!');
    const response = await fetch(${SUPABASE_URL}/rest/v1/journals, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': Bearer ${SUPABASE_KEY}
        },
        body: JSON.stringify({ text })
    });
    if (response.ok) {
        alert('Journal saved successfully!');
        document.getElementById('journal-text').value = '';
        loadJournals();
    } else {
        alert('Error saving journal!');
    }
}

async function uploadPhoto() {
    const file = document.getElementById('photo-upload').files[0];
    const take = document.getElementById('photo-take').value;
    if (!file || !take) return alert('Please select a photo and write a take!');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    const cloudResponse = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
    });
    const cloudData = await cloudResponse.json();
    const photo_url = cloudData.secure_url;

    const response = await fetch(${SUPABASE_URL}/rest/v1/journals, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': Bearer ${SUPABASE_KEY}
        },
        body: JSON.stringify({ photo_url, take })
    });
    if (response.ok) {
        alert('Photo and take saved successfully!');
        document.getElementById('photo-upload').value = '';
        document.getElementById('photo-take').value = '';
        loadJournals();
    } else {
        alert('Error uploading photo!');
    }
}

async function loadJournals() {
    const response = await fetch(${SUPABASE_URL}/rest/v1/journals?select=*, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': Bearer ${SUPABASE_KEY}
        }
    });
    const journals = await response.json();
    const list = document.getElementById('journal-list');
    list.innerHTML = '';
    journals.forEach(j => {
        const li = document.createElement('li');
        if (j.text) {
            li.innerText = j.text;
        }
        if (j.photo_url) {
            const img = document.createElement('img');
            img.src = j.photo_url;
            img.style.maxWidth = '200px';
            li.appendChild(img);
            li.appendChild(document.createElement('br'));
            li.appendChild(document.createTextNode(j.take));
        }
        list.appendChild(li);
    });
}

// Load journals on page load
loadJournals();