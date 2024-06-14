const form = document.getElementById("form")
        form.addEventListener('submit', (e) =>{
            e.preventDefault()

            const login = document.getElementById('login').value
            const pass = document.getElementById('pass').value
            const btn = document.getElementById('btn')

            
            axios.post('/login', {
                login,
                pass
            })
            .then(response => {
                if (response.status === 200) {
                    window.location.replace('./pedido.html');
                } else {
                    alert('Usuário ou senha incorretos.');
                }
            })
            .catch(error => {
                console.error('Erro ao fazer login:', error);
                alert('Erro ao fazer login. Por favor, tente novamente mais tarde.');
            });
        })