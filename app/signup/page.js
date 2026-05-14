'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// signup page - contains form for users to create an account
// redirects from login page, redirects to login page after submission
// can only be viewed by guest

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    college: '',
    degreeProgram: '',
    yearLevel: '',
    password: '',
    confirmPassword: '',
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSignup(e) {
    e.preventDefault();

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // VALIDATION
      if (!formData.email.endsWith('@up.edu.ph')) {
        throw new Error('Only UP email addresses are allowed.');
      }

      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters.');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      // SIGN UP
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      const user = data.user;

      if (!user) throw new Error("No user returned");

      // INSERT PROFILE USING FORM DATA
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          college: formData.college,
          degree_program: formData.degreeProgram,
          year_level: formData.yearLevel,
        });

      if (profileError) throw profileError;

      setSuccessMsg('Account created successfully!');

      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err) {
      setErrorMsg(err.message);
    }

    setLoading(false);
  }

  async function handleGoogleSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    }
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

        <h1 style={styles.title}>SIGN UP</h1>
      </header>

      {/* Main Sign Up Page */}
      <main style={styles.card}>
        {/* Tabs */}
        <div style={styles.tabContainer}>
          <button style={{ ...styles.tab, ...styles.activeTab }}>
            SIGN UP
          </button>
        </div>

        {/* Top Button */}
        <button style={styles.secondaryBtn} onClick={handleGoogleSignup}>
          SIGN UP VIA UP MAIL
        </button>

        <div style={styles.divider}>OR SIGN UP MANUALLY</div>

        {/* Form Fields */}
        <form style={styles.form} onSubmit={handleSignup}>
          {/* 2-Column Row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={styles.label}>First Name</label>

              <input
                type="text"
                name="firstName"
                placeholder="e.g Juan"
                style={styles.input}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={styles.label}>Last Name</label>

              <input
                type="text"
                name="lastName"
                placeholder="e.g Dela Cruz"
                style={styles.input}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label style={styles.label}>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="e.g jdelacruz@up.edu.ph"
            style={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>College</label>

          <input
            type="text"
            name="college"
            placeholder="e.g College of Arts and Science"
            style={styles.input}
            value={formData.college}
            onChange={handleChange}
            required
          />

          {/* Degree & Year */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={styles.label}>Degree Program</label>

              <input
                type="text"
                name="degreeProgram"
                placeholder="e.g BS Computer Science"
                style={styles.input}
                value={formData.degreeProgram}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={styles.label}>Year Level</label>

              <input
                type="text"
                name="yearLevel"
                placeholder="e.g 2nd Year"
                style={styles.input}
                value={formData.yearLevel}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label style={styles.label}>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Min. 8 characters"
            style={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Repeat Password"
            style={styles.input}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {errorMsg && (
            <p style={{ color: 'red', marginBottom: '10px' }}>
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p style={{ color: 'green', marginBottom: '10px' }}>
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            style={styles.loginBtn}
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p
          style={{
            ...styles.footerText,
            marginTop: '20px',
            marginBottom: '10px',
          }}
        >
          You'll receive a verification email before you can log in.
        </p>

        <a
          href="/login"
          style={styles.link}
        >
          Already have an account? Log in →
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
    fontFamily: 'sans-serif',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#b8e0a4',
    borderBottom: '1px solid #7cb342',
  },

  backButton: {
    border: '1px solid #7cb342',
    color: '#7cb342',
    background: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    margin: 0,
    fontSize: '1.5rem',
    color: '#004d40',
    fontWeight: 'bold',
  },

  card: {
    maxWidth: '500px',
    margin: '100px auto',
    padding: '2rem',
    backgroundColor: '#e8f5e9',
    border: '1px solid #7cb342',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },

  tabContainer: {
    display: 'flex',
    marginBottom: '1.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden',
  },

  tab: {
    flex: 1,
    padding: '10px',
    border: 'none',
    background: '#ffffff',
    color: '#004d40',
    cursor: 'pointer',
  },

  activeTab: {
    background: '#004d40',
    color: '#ffffff',
    fontWeight: 'bold',
  },

  form: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  },

  label: {
    marginBottom: '5px',
    marginTop: '10px',
    color: '#004d40',
  },

  input: {
    padding: '10px',
    border: '1px solid #7cb342',
    color: '#004d40',
    borderRadius: '4px',
    marginBottom: '10px',
    background: '#ffffff',
  },

  loginBtn: {
    padding: '12px',
    border: '1px solid #7cb342',
    color: '#004d40',
    background: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },

  divider: {
    margin: '20px 0',
    color: '#004d40',
    fontWeight: 'bold',
  },

  secondaryBtn: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #7cb342',
    color: '#004d40',
    background: '#eee',
    cursor: 'pointer',
  },

  footerText: {
    fontSize: '0.8rem',
    color: '#004d40',
    fontStyle: 'italic',
  },

  link: {
    fontSize: '0.9rem',
    color: '#004d40',
    textDecoration: 'underline',
  },
};