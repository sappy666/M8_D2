document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cardbody = document.getElementById('cardbody');

    fetch('/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    })
        .then(response => {
            if (!response.ok) {
                showAlert('Credenciales inválidas. Inténtalo de nuevo.', 'danger');
                throw new Error('Credenciales inválidas');

            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('agentName', data.name);
                sessionStorage.setItem('agentEmail', data.email);
                cardbody.innerHTML = `<h1 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">Autenticación exitosa  ${data.email}</h1> 
                <button class="btn btn-primary btn-lg mb-5"  id="restrictedLink" href = "/restricted" > Go to restricted area</button > 
                <br>
                <div id="alertPlaceholder"></div>`
            }
        })
        .catch(error => {
            console.error('Error:', error);


        });
});



document.addEventListener('click', function (event) {
    if (event.target.id === 'restrictedLink') {
        event.preventDefault(); // Previene la navegación por defecto
        const token = sessionStorage.getItem('token');

        if (token) {
            fetch('/restricted', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        showAlert('Token Expirado. Vuelva a loguear.', 'danger');
                        setTimeout(() => {

                            window.location.href = '/index.html';
                        }, 3000);
                        throw new Error('Acceso denegado');
                    }
                    return response.text();
                })
                .then(data => {
                    window.location.href = '/dashboard.html';
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            console.error('No se encontró el token en el sessionStorage');
            window.location.href = '/404.html';
        }
    }
});



function showAlert(message, type) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');


    alertPlaceholder.innerHTML = "";

    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);


    setTimeout(() => {

        if (alertPlaceholder.contains(wrapper)) {
            alertPlaceholder.removeChild(wrapper);
        }
    }, 2000);
}


