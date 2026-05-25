// login page - can log in or continue as guest
// redirects from main page, can redirect to main page or sign up page
// can be viewed by guest or user

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // redirect after successful login
    router.push('/');
  }

  function continueAsGuest() {
    router.push('/');
  }

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <header style={styles.header}>
        <button
          style={styles.backButton}
          onClick={() => router.push('/')}
        >
          &lt; BACK TO MAP
        </button>

        <h1 style={styles.title}>LOGIN</h1>
      </header>

      {/* Main Login Page */}
      <main style={styles.card}>
        {/* Tabs */}
        <div style={styles.tabContainer}>
          <button style={{ ...styles.tab, ...styles.activeTab }}>
            LOG IN
          </button>
        </div>

        {/* Form Fields */}
        <form style={styles.form} onSubmit={handleLogin}>
          <label style={styles.label}>Email Address</label>

          <input
            type="email"
            placeholder="e.g juandelacruz@up.edu.ph"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={styles.label}>Password</label>

          <input
            type="password"
            placeholder="••••••••••••"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={styles.row}>
            <label>
              <input type="checkbox" /> Remember Me
            </label>

            <a href="/forgot-password" style={styles.link}>
              Forgot password?
            </a>
          </div>

          {errorMsg && (
            <p style={styles.errorText}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            style={styles.loginBtn}
            disabled={loading}
          >
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </form>

        <div style={styles.divider}>OR</div>

        {/* Secondary Buttons */}
        <button
          style={styles.secondaryBtn}
          onClick={continueAsGuest}
        >
          CONTINUE AS GUEST
        </button>

        <p style={styles.footerText}>
          Guest can view & search but cannot rate, review, or add spots.
        </p>

        <a
          href="/signup"
          style={styles.link}
        >
          No account? Sign up →
        </a>
      </main>
    </div>
  );
}

/* CSS Part */
const styles = {
  container: {
    backgroundImage: `url('/map-background.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100vw',
    fontFamily: 'sans-serif'
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#b8e0a4',
    borderBottom: '1px solid #7cb342'
  },

  backButton: {
    border: '1px solid #7cb342',
    color: '#7cb342',
    background: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px'
  },

  title: {
    flex: 1,
    textAlign: 'center',
    margin: 0,
    fontSize: '1.5rem',
    color: '#004d40',
    fontWeight: 'bold'
  },

  card: {
    maxWidth: '500px',
    margin: '100px auto',
    padding: '2rem',
    backgroundColor: '#e8f5e9',
    border: '1px solid #7cb342',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },

  tabContainer: {
    display: 'flex',
    marginBottom: '1.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden'
  },

  tab: {
    flex: 1,
    padding: '10px',
    border: 'none',
    background: '#ffffff',
    color: '#004d40',
    cursor: 'pointer'
  },

  activeTab: {
    background: '#004d40',
    color: '#ffffff',
    fontWeight: 'bold'
  },

  form: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column'
  },

  label: {
    marginBottom: '5px',
    marginTop: '10px',
    color: '#004d40'
  },

  input: {
    padding: '10px',
    border: '1px solid #7cb342',
    color: '#004d40',
    borderRadius: '4px',
    marginBottom: '10px',
    background: '#ffffff'
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    color: '#004d40'
  },

  loginBtn: {
    padding: '12px',
    border: '1px solid #7cb342',
    color: '#004d40',
    background: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  },

  divider: {
    margin: '20px 0',
    color: '#004d40',
    fontWeight: 'bold'
  },

  secondaryBtn: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #7cb342',
    color: '#004d40',
    background: '#eee',
    cursor: 'pointer'
  },

  footerText: {
    fontSize: '0.8rem',
    color: '#004d40',
    fontStyle: 'italic'
  },

  link: {
    fontSize: '0.9rem',
    color: '#004d40',
    textDecoration: 'underline'
  },

  errorText: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '0.9rem'
  }
};