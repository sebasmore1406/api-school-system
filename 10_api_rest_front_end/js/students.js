const API_URL = 'http://localhost:3000/api';
const studentsTable = document.querySelector('#studentsData');
const student = {
    input: document.querySelector('#searchInput'),
    button: document.querySelector('#searchBtn')
}

// Implementamos un llamado a un endpoint POST
const createUser = async () => {
    // 1. Se arma el payload (los parámetros para crear el usuario)
    const payload = {
        userName: 'sebsincognito',
        email: 'sebs@incognito.com',
        password: 'DirectorHabas14',
        role: 'admin'
    };
    // 2. Hacemos el llamado al endpoint con el método POST
    {
        await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        });
    };
    // 3. Obtenemos la respuesta del servicio
    const data = await res.json();
    console.log(`Data from web service (WS): ${JSON.stringify(data,null,2)}`);
};


// Se consulta el servicio para obtener el listado de todos los estudiantes
const loadStudents = async (query = "") => {
    const res = await fetch(`${API_URL}/students/getAllStudents?q=${query}`);
    const students = await res.json();
    for (let index = 0; index < students.length; index++) {
        studentsTable.innerHTML += `<tr>
        <td>${students[index].studentID}</td>
        <td>${students[index].name}</td>
        <td>${students[index].age}</td>
        <td>${students[index].career}</td>
        <td>${students[index].semester}</td>
        <td>${students[index].average}</td>
        <td>${students[index].courses.join('<hr>')}</td>
        <td><button id="edit-student">Editar</button><button id="unenroll-student">Dar de baja</button></td>
        </tr>`
    };
};

loadStudents();

const loadStudentById = async () => {
    const query = student.input.value;
    console.log(query);
};

student.button.addEventListener('click', loadStudentById);