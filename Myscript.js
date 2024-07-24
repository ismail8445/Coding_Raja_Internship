document.addEventListener('DOMContentLoaded', (event) => {
    autoSaveResume();
    loadDraft();
    validateForm();
    enableDragAndDrop();
    setupDarkMode();
});

function autoSaveResume() {
    const form = document.getElementById('resumeForm');
    form.addEventListener('input', () => {
        const formData = new FormData(form);
        const formEntries = Object.fromEntries(formData);
        localStorage.setItem('resumeDraft', JSON.stringify(formEntries));
    });
}

function loadDraft() {
    const draft = localStorage.getItem('resumeDraft');
    if (draft) {
        const formEntries = JSON.parse(draft);
        for (const [key, value] of Object.entries(formEntries)) {
            if (document.getElementById(key)) {
                document.getElementById(key).value = value;
            }
        }
    }
}

function addEducation() {
    const educationSection = document.getElementById('educationSection');
    const newEntry = document.createElement('div');
    newEntry.classList.add('education-entry', 'mt-2');
    newEntry.innerHTML = `<textarea class="form-control trix-editor" rows="3" placeholder="Your Education" required></textarea>`;
    educationSection.appendChild(newEntry);
}

function addExperience() {
    const experienceSection = document.getElementById('experienceSection');
    const newEntry = document.createElement('div');
    newEntry.classList.add('experience-entry', 'mt-2');
    newEntry.innerHTML = `<textarea class="form-control trix-editor" rows="3" placeholder="Your Experience" required></textarea>`;
    experienceSection.appendChild(newEntry);
}

function previewResume() {
    const template = document.getElementById('templateSelect').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const educationEntries = Array.from(document.querySelectorAll('.education-entry textarea')).map(e => e.value).join('<br>');
    const experienceEntries = Array.from(document.querySelectorAll('.experience-entry textarea')).map(e => e.value).join('<br>');
    const skills = document.getElementById('skills').value;

    let previewHtml = '';

    if (template === 'template1') {
        previewHtml = `
            <h1>${name}</h1>
            <p>${email}</p>
            <p>${phone}</p>
            <h3>Education</h3>
            <p>${educationEntries}</p>
            <h3>Experience</h3>
            <p>${experienceEntries}</p>
            <h3>Skills</h3>
            <p>${skills}</p>
        `;
    } else if (template === 'template2') {
        previewHtml = `
            <h1>${name}</h1>
            <h3>Contact Information</h3>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <h3>Education</h3>
            <p>${educationEntries}</p>
            <h3>Experience</h3>
            <p>${experienceEntries}</p>
            <h3>Skills</h3>
            <p>${skills}</p>
        `;
    }

    document.getElementById('previewContainer').innerHTML = previewHtml;
    document.getElementById('resumePreview').style.display = 'block';
}

async function downloadResume(format) {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const educationEntries = Array.from(document.querySelectorAll('.education-entry textarea')).map(e => e.value).join('\n');
    const experienceEntries = Array.from(document.querySelectorAll('.experience-entry textarea')).map(e => e.value).join('\n');
    const skills = document.getElementById('skills').value;

    const content = `
        Name: ${name}\n
        Email: ${email}\n
        Phone: ${phone}\n
        Education: ${educationEntries}\n
        Experience: ${experienceEntries}\n
        Skills: ${skills}
    `;

    if (format === 'pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(content, 10, 10);
        doc.save(`${name}_resume.pdf`);
    } else if (format === 'word') {
        const doc = new docx.Document();
        doc.addSection({
            properties: {},
            children: [
                new docx.Paragraph({ text: `Name: ${name}` }),
                new docx.Paragraph({ text: `Email: ${email}` }),
                new docx.Paragraph({ text: `Phone: ${phone}` }),
                new docx.Paragraph({ text: `Education: ${educationEntries}` }),
                new docx.Paragraph({ text: `Experience: ${experienceEntries}` }),
                new docx.Paragraph({ text: `Skills: ${skills}` }),
            ],
        });
        docx.Packer.toBlob(doc).then(blob => {
            saveAs(blob, `${name}_resume.docx`);
        });
    }
}

function validateForm() {
    const form = document.getElementById('resumeForm');
    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    });
}

function setupDarkMode() {
    const body = document.body;
    const darkModeToggle = document.querySelector('.btn-secondary');
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });

    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
    }
}

function enableDragAndDrop() {
    const educationSection = document.getElementById('educationSection');
    const experienceSection = document.getElementById('experienceSection');

    dragula([educationSection, experienceSection]);
}
