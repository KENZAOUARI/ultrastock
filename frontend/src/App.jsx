import { useState } from 'react';

import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true); // Toggle entre Login et Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = isLogin
      ? { email, password } // Pour la connexion
      : { username, email, password }; // Pour l'inscription
    const url = isLogin 
      ? 'http://localhost:5000/auth/login' 
      : 'http://localhost:5000/auth/register'; // Assurez-vous que le port et l'URL sont corrects

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || 'Succès !');
        // Optionnel : Rediriger l'utilisateur après une connexion ou inscription réussie
        window.location.href = '/dashboard'; // Exemple de redirection
      } else {
        setMessage(result.message || 'Erreur lors de la connexion/inscription.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur de communication avec le serveur.');
    }
  };

  return (
    <div className="container">
      <h1>{isLogin ? 'Se Connecter' : 'Créer un Compte'}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Connexion' : 'Inscription'}</button>
      </form>
      <p>{message}</p>
      <p onClick={() => setIsLogin(!isLogin)} className="toggle">
        {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
      </p>
    </div>
  );
}

export default App;

